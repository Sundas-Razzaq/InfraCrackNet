"""InfraCrackNet ML service.

POST /analyze {"image_url": "https://res.cloudinary.com/..."}  (header: x-api-key)
Runs: Model 1 (crack presence) -> if cracked: Model 2 (road crack type) + Model 3 (outline + severity).
"""
import io
import os
import threading
import time
from urllib.parse import urlparse

import cv2
import numpy as np
import requests
from fastapi import FastAPI, Header, HTTPException
from PIL import Image
from pydantic import BaseModel

API_KEY = os.environ.get("ML_API_KEY", "")
MODELS_DIR = os.environ.get("MODELS_DIR", "models")
ALLOWED_HOSTS = [h.strip() for h in os.environ.get("ALLOWED_IMAGE_HOSTS", "res.cloudinary.com").split(",") if h.strip()]
GATE_MIN_CRACK_PROB = float(os.environ.get("GATE_MIN_CRACK_PROB", "0.2"))   # Model 1 gate: isse kam P(cracked) par baqi models skip
MAX_BYTES = 15 * 1024 * 1024
MAX_POLY_POINTS = 300

W1 = os.path.join(MODELS_DIR, "crack_presence_best.pt")
W2 = os.path.join(MODELS_DIR, "road_crack_type_best.pt")
W3 = os.path.join(MODELS_DIR, "crack_segmentation_best.pt")
TH = os.path.join(MODELS_DIR, "severity_thresholds.json")

CLASS_MAP = {  # Model 2 label -> backend crackClass enum
    "Longitudinal Crack": "Longitudinal",
    "Transverse Crack": "Transverse",
    "Alligator Crack": "Alligator",
    "Pothole": "Pothole",
}

app = FastAPI(title="InfraCrackNet ML service")
_lock = threading.Lock()   # CPU par ek waqt mein ek hi image


class AnalyzeRequest(BaseModel):
    image_url: str


def _models():
    """Lazy import: tests inject fakes via sys.modules."""
    from ml_models import predict as p1, predict_type as p2, predict_severity as p3
    return p1, p2, p3


def fetch_image(url: str) -> Image.Image:
    u = urlparse(url)
    if u.scheme != "https" or u.hostname not in ALLOWED_HOSTS:
        raise HTTPException(400, "image_url host is not allowed.")
    try:
        r = requests.get(url, timeout=20, stream=True, allow_redirects=False)
    except requests.RequestException as e:
        raise HTTPException(502, f"Could not download image: {e}")
    if r.status_code != 200:
        raise HTTPException(502, f"Image download failed with status {r.status_code}.")
    buf, size = io.BytesIO(), 0
    for chunk in r.iter_content(65536):
        size += len(chunk)
        if size > MAX_BYTES:
            raise HTTPException(413, "Image is too large.")
        buf.write(chunk)
    try:
        return Image.open(io.BytesIO(buf.getvalue())).convert("RGB")
    except Exception:
        raise HTTPException(400, "File is not a valid image.")


def _shrink(poly):
    pts = np.array(poly, np.int32).reshape(-1, 1, 2)
    pts = cv2.approxPolyDP(pts, 1.5, True).reshape(-1, 2)
    if len(pts) > MAX_POLY_POINTS:
        pts = pts[np.linspace(0, len(pts) - 1, MAX_POLY_POINTS).astype(int)]
    return pts.tolist()


def _centroid(poly):
    a = np.array(poly, float)
    return float(a[:, 0].mean()), float(a[:, 1].mean())


def run_pipeline(img: Image.Image) -> dict:
    t0 = time.time()
    p1, p2, p3 = _models()
    W, H = img.size

    r1 = p1.predict(img, W1, "cpu")
    p_crack = float(r1["probabilities"].get("Cracked", 0.0))
    out = {
        "image_size": [W, H],
        "presence": {"label": r1["label"], "confidence": r1["confidence"], "p_cracked": round(p_crack, 4)},
        "severity": None, "severity_confidence": None, "severity_metrics": None,
        "detections": [], "models_run": ["crack_presence"], "notes": [],
    }
    if p_crack < GATE_MIN_CRACK_PROB:
        out["notes"].append(f"Model 1 found no crack (P(cracked)={p_crack:.2f}); Models 2 and 3 skipped.")
        out["timing_ms"] = int((time.time() - t0) * 1000)
        return out

    r2 = p2.predict(img, W2, "cpu")
    r3 = p3.predict(img, W3, TH, "cpu")
    out["models_run"] += ["road_crack_type", "crack_segmentation"]
    out["severity"] = r3["severity"]
    out["severity_confidence"] = None if r3["confidence"] is None else round(r3["confidence"] * 100, 2)
    out["severity_metrics"] = r3["metrics"]
    polys = [_shrink(p) for p in r3["polygons"] if len(p) >= 3]
    sev = r3["severity"] or "Low"
    if r3["severity"] is None:
        out["notes"].append("Model 3 found no outline; severity defaulted to Low.")

    for d in r2["detections"]:
        x1, y1, x2, y2 = d["box_xyxy"]
        mine = []
        for poly in polys:
            cx, cy = _centroid(poly)
            if x1 <= cx <= x2 and y1 <= cy <= y2:
                mine.append(poly)
        out["detections"].append({
            "crack_class": CLASS_MAP.get(d["label"], "Other"),
            "confidence": round(d["confidence"] * 100, 2),
            "box": {"x": int(round(x1)), "y": int(round(y1)),
                    "width": int(round(x2 - x1)), "height": int(round(y2 - y1))},
            "severity": sev,
            "polygons": mine,
        })

    if not out["detections"] and polys:   # Model 3 ne outline diya, Model 2 ne type nahi
        allpts = np.vstack([np.array(p) for p in polys])
        x1, y1 = allpts.min(0); x2, y2 = allpts.max(0)
        out["detections"].append({
            "crack_class": "Other",
            "confidence": out["severity_confidence"] or 0,
            "box": {"x": int(x1), "y": int(y1), "width": int(x2 - x1), "height": int(y2 - y1)},
            "severity": sev, "polygons": polys,
        })
        out["notes"].append("Crack outline found by Model 3 but no type from Model 2; reported as 'Other'.")

    out["timing_ms"] = int((time.time() - t0) * 1000)
    return out


@app.get("/health")
def health():
    return {"status": "ok", "models_present": {os.path.basename(p): os.path.exists(p) for p in (W1, W2, W3, TH)}}


@app.post("/analyze")
def analyze(req: AnalyzeRequest, x_api_key: str = Header(default="")):
    if not API_KEY or x_api_key != API_KEY:
        raise HTTPException(401, "Invalid API key.")
    img = fetch_image(req.image_url)
    with _lock:
        return run_pipeline(img)
