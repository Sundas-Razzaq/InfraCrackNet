# InfraCrackNet: asli models ko website se jorna

## Design (ek nazar mein)
```
Frontend --> Express backend (Vercel) --> ML service (Hugging Face Space, Python)
                 |                          Model 1 presence -> Model 2 type -> Model 3 outline+severity
                 +--> MongoDB (CrackDetection, AIAnalysis)     (image Cloudinary URL se download hoti hai)
```
- Vercel par torch nahi chalta, isliye 3 models ek alag Python service mein hain.
- Backend `AI_MODE=real` hone par asli service call karta hai, warna mock chalta rehta hai (rollback aasan).
- Model 1 gate: `P(cracked) < 0.2` ho to Model 2 aur 3 skip (kam waqt). Ye ENV `GATE_MIN_CRACK_PROB` se badal sakte hain.

## Step A: ML service chalayen
### A1. Local test (pehle laptop par)
1. `ml_service/ml_models/` mein Drive se `predict.py`, `predict_type.py`, `predict_severity.py` copy karein.
2. `ml_service/models/` mein ye 4 files rakhein: `crack_presence_best.pt`, `road_crack_type_best.pt`, `crack_segmentation_best.pt`, `severity_thresholds.json`.
3. Terminal (ml_service folder mein):
```
python -m venv .venv && .venv\Scripts\activate
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt
set ML_API_KEY=test123
uvicorn app:app --port 7860
```
4. Browser: http://localhost:7860/health  -> `models_present` mein sab `true` hon.
5. Test (Cloudinary ki kisi image ka URL daal kar):
```
curl -X POST http://localhost:7860/analyze -H "x-api-key: test123" -H "Content-Type: application/json" -d "{\"image_url\":\"https://res.cloudinary.com/<cloud>/image/upload/<...>.jpg\"}"
```
**Is response mein `timing_ms` dekhein: ye aap ka asli inference time hai (report ke liye).**

### A2. Hugging Face Space par (free CPU)
1. huggingface.co > New Space > SDK: **Docker** > Blank > visibility **Public** (ya Private) > Create.
2. Space ko git se clone karein, `ml_service/` ki saari files (Dockerfile, README.md, app.py, requirements.txt, ml_models/, models/) us mein copy karein, phir `git add . && git commit -m "ml service" && git push`.
   - Agar `.pt` files par "file too large" ka error aaye to pehle `git lfs install && git lfs track "*.pt"` chalayein.
3. Space > Settings > **Variables and secrets** > New secret: `ML_API_KEY` = ek lambi random value (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
4. Build khatam hone ke baad: `https://<user>-<space>.hf.space/health` kholein.
5. Dhyan dein: free Space aam taur par kuch der inactive rehne par so jata hai, pehli request dair se aati hai. `mlClient.js` is liye 3 baar try karta hai.

## Step B: Backend (Infra-Backend)
1. `mlClient.js` aur `realAnalysisService.js` ko `src/services/` mein copy karein.
2. `src/controllers/analysisController.js`:
```js
// upar imports mein, startMockAnalysis wale block ke saath:
const { startRealAnalysis } = require("../services/realAnalysisService");
const { AI_MODE } = require("../utils/aiMode");
```
aur `setImmediate(() => { startMockAnalysis(analysis._id); });` ko is se badlein:
```js
const runAnalysis = AI_MODE === "real" ? startRealAnalysis : startMockAnalysis;
setImmediate(() => {
    runAnalysis(analysis._id);
});
```
3. `src/models/crackDetection.js` mein `width`, `length` ko optional (null) karein (abhi mm naapne ka step nahi):
```js
width:  { type: Number, default: null, min: 0 },
length: { type: Number, default: null, min: 0 },
area:   { type: Number, default: null, min: 0 },
```
4. `.env` (aur Vercel > Settings > Environment Variables) mein:
```
AI_MODE=real
ML_SERVICE_URL=https://<user>-<space>.hf.space
ML_API_KEY=<wahi secret>
```
5. **Vercel ka ek khatra (zaroor dekhein):** `setImmediate` wala kaam response bhejne ke baad Vercel (serverless) par beech mein ruk/kat sakta hai. Mock sirf ~8 second ka tha, asli analysis mein har image ke kuch second lagenge. Do cheezein karein:
   - Apne plan ki function maximum duration check karein (Vercel dashboard).
   - Background kaam ko `waitUntil` mein lapetein: `npm i @vercel/functions`, phir `const { waitUntil } = require("@vercel/functions");` aur `setImmediate(...)` ki jagah `waitUntil(runAnalysis(analysis._id));`.
   Agar phir bhi analysis beech mein ruk jaye (status "Processing" par atak jaye) to batayein, hum kaam ko tukdon mein baantne wala tareeqa lagayenge. Ye maine apne tor par test nahi kiya.

## Step C: Frontend (width/length ab null ho sakti hain)
`components/analysis/CrackTable.jsx`:
```jsx
<td className="num">{crack.width != null ? `${crack.width} mm` : "N/A"}</td>
<td className="num">{crack.length != null ? `${crack.length} mm` : "N/A"}</td>
<td className="num">{crack.area != null ? `${crack.area} cm²` : "N/A"}</td>
```
`components/analysis/SummaryCards.jsx` (cards ki value):
```jsx
const hasWidth = cracks.some((c) => c.width != null);
const hasArea  = cracks.some((c) => c.area != null);
...
value: hasWidth ? `${maximumCrackWidth.toFixed(2)} mm` : "N/A",
...
value: hasArea ? `${totalAffectedArea.toFixed(2)} cm²` : "N/A",
```
Aur wahan "Simulated" label sirf tab dikhayein jab `aiMode === "simulated"` (admin API ye field pehle se bhejti hai).

## Test checklist
- [ ] `/health` mein teeno models `true`
- [ ] Backend: ek inspection ki 2 se 3 images upload karein > Start Analysis > progress barhta hai > "Completed"
- [ ] CrackTable mein types (Longitudinal/Transverse/Alligator/Pothole), confidence, severity, width/length "N/A"
- [ ] Ek saaf sadak ki image par koi detection nahi banti
- [ ] ML service band kar ke analysis chalayein: status "Failed", admin ko notification (error path)
- [ ] Admin panel par `aiMode: "real"`, simulated disclaimer gayab

## Jo report mein limitations likhni hain
- Severity image-level hai (Model 3 ke predicted mask ke `area ÷ image area` se), har detection ko usi image ki severity milti hai. Ye `Low / Medium / High` hai; "Critical" abhi koi model nahi deta.
- Width/length (mm) aur area (cm²) abhi measure nahi hote (alag measurement step chahiye). UI mein "N/A".
- Model 3 "cracked region" ka outline deta hai (dataset ke masks patch jaise hain), hairline crack ka nahi.
- Models road images ke liye hain; asphalt sadak ke ilawa surfaces par nateeja bharosemand nahi.
