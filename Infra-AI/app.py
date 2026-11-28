"""InfraCrackNet ML service.

POST /analyze {"image_url": "https://res.cloudinary.com/..."}  (header: x-api-key)
Runs: Model 1 (crack presence) -> if cracked: Model 2 (road crack type) + Model 3 (per-crack outline, width, length & severity).
"""
import io
import os
import threading
import time
from contextlib import asynccontextmanager
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
GATE_MIN_CRACK_PROB = float(os.environ.get("GATE_MIN_CRACK_PROB", "0.25"))
MAX_BYTES = 15 * 1024 * 1024
MAX_POLY_POINTS = 300

W1 = os.path.join(MODELS_DIR, "crack_presence_best.pt")
W2 = os.path.join(MODELS_DIR, "road_crack_type_best.pt")
W3 = os.path.join(MODELS_DIR, "crack_segmentation_best.pt")
TH = os.path.join(MODELS_DIR, "severity_thresholds.json")

CLASS_MAP = {
    "Longitudinal Crack": "Longitudinal",
    "Transverse Crack": "Transverse",
    "Alligator Crack": "Alligator",
    "Pothole": "Pothole",
}

_lock = threading.Lock()


def warmup():
    """Load all 3 models into memory on startup so first request is fast."""
    try:
        with _lock:
            p1, p2, p3 = _models()
            blank = Image.new("RGB", (640, 480), (128, 128, 128))
            p1.predict(blank, W1, "cpu")
            p2.predict(blank, W2, "cpu")
            p3.predict(blank, W3, TH, "cpu")
        print("Warmup done: all 3 models loaded.")
    except Exception as e:
        print("Warmup skipped:", e)


@asynccontextmanager
async def lifespan(_app):
    threading.Thread(target=warmup, daemon=True).start()
    yield


app = FastAPI(title="InfraCrackNet ML service", lifespan=lifespan)


class AnalyzeRequest(BaseModel):
    image_url: str


def _models():
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


def _box_iou(boxA, boxB):
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    inter = max(0.0, xB - xA) * max(0.0, yB - yA)
    if inter <= 0:
        return 0.0
    areaA = max(0.0, boxA[2] - boxA[0]) * max(0.0, boxA[3] - boxA[1])
    areaB = max(0.0, boxB[2] - boxB[0]) * max(0.0, boxB[3] - boxB[1])
    return inter / max(areaA + areaB - inter, 1e-6)


def _match_crack_type(seg_box, seg_poly, r2_dets):
    """Find best matching Model 2 class label for a Model 3 crack instance."""
    best_label = None
    best_score = 0.0

    pts = np.array(seg_poly, float)
    cx, cy = float(pts[:, 0].mean()), float(pts[:, 1].mean())

    for d in r2_dets:
        b2 = d["box_xyxy"]
        iou = _box_iou(seg_box, b2)
        inside = (b2[0] <= cx <= b2[2]) and (b2[1] <= cy <= b2[3])
        score = iou + (0.25 if inside else 0.0)
        if score > best_score and (iou > 0.05 or inside):
            best_score = score
            best_label = d["label"]

    return CLASS_MAP.get(best_label, "Other") if best_label else "Other"


def run_pipeline(img: Image.Image) -> dict:
    t0 = time.time()
    p1, p2, p3 = _models()
    W, H = img.size

    # Step 1: Model 1 (Crack Presence Gate)
    r1 = p1.predict(img, W1, "cpu")
    p_crack = float(r1["probabilities"].get("Cracked", 0.0))
    out = {
        "image_size": [W, H],
        "presence": {
            "label": r1["label"],
            "confidence": r1["confidence"],
            "p_cracked": round(p_crack, 4),
        },
        "crack_count": 0,
        "severity": None,
        "severity_confidence": None,
        "severity_metrics": None,
        "detections": [],
        "models_run": ["crack_presence"],
        "notes": [],
    }

    if p_crack < GATE_MIN_CRACK_PROB:
        out["notes"].append(f"Model 1 found no crack (P(cracked)={p_crack:.2f}); Models 2 and 3 skipped.")
        out["timing_ms"] = int((time.time() - t0) * 1000)
        return out

    # Step 2: Run Model 2 (Crack Type) & Model 3 (Per-Crack Outline, Width, Length & Severity)
    r2 = p2.predict(img, W2, "cpu", conf=0.15)
    r3 = p3.predict(img, W3, TH, "cpu", conf=0.15)
    out["models_run"] += ["road_crack_type", "crack_segmentation"]

    seg_cracks = r3.get("cracks", [])
    det_types = r2.get("detections", [])

    # Primary source: Per-crack instances from Model 3 (each has exact width, length, severity, outline)
    for c in seg_cracks:
        poly = _shrink(c["polygon"])
        if len(poly) < 3:
            continue
        x1, y1, x2, y2 = c["box_xyxy"]
        matched_class = _match_crack_type(c["box_xyxy"], poly, det_types)

        out["detections"].append({
            "crack_id": len(out["detections"]) + 1,
            "crack_class": matched_class,
            "confidence": round(c["confidence"] * 100, 2),
            "severity": c["severity"],
            "length_px": c["length_px"],
            "max_width_px": c["max_width_px"],
            "mean_width_px": c["mean_width_px"],
            "area_px": c["area_px"],
            "area_ratio": c["area_ratio"],
            "length_ratio": c["length_ratio"],
            "max_width_ratio": c["max_width_ratio"],
            "box": {
                "x": int(round(x1)),
                "y": int(round(y1)),
                "width": int(round(x2 - x1)),
                "height": int(round(y2 - y1)),
            },
            "polygons": [poly],
        })

    # Fallback: If Model 3 found no outline, surface Model 2 boxes so detections aren't lost
       # Fallback: Model 3 found no mask -> extract real crack contour inside each Model 2 box using OpenCV
    if not out["detections"] and det_types:
        import json as _json
        from skimage.morphology import skeletonize as _skel
        cfg_th = _json.load(open(TH))
        gray_full = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2GRAY)

        for d in det_types:
            x1, y1, x2, y2 = [int(round(v)) for v in d["box_xyxy"]]
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(W, x2), min(H, y2)
            w_box, h_box = max(1, x2 - x1), max(1, y2 - y1)

            roi = gray_full[y1:y2, x1:x2]
            blur = cv2.GaussianBlur(roi, (5, 5), 0)
            # Dark crack pixels inside the bounding box
            _, binary = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
            binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))

            inst_mask = np.zeros((H, W), np.uint8)
            inst_mask[y1:y2, x1:x2] = (binary > 0).astype(np.uint8)

            area_px = int(inst_mask.sum())
            if area_px < 15:
                inst_mask[y1:y2, x1:x2] = 1
                area_px = w_box * h_box

            area_ratio = area_px / (W * H)
            max_w = float(2.0 * cv2.distanceTransform(inst_mask, cv2.DIST_L2, 5).max())
            length_px = float(_skel(inst_mask.astype(bool)).sum())
            if length_px < 1.0:
                length_px = float(max(w_box, h_box))

            # Compute real Low / Medium / High using calibrated thresholds
            ta = cfg_th["area_ratio_thresholds"]
            tw = cfg_th["width_ratio_thresholds"]
            tl = cfg_th["length_ratio_thresholds"]
            s_a = 0 if area_ratio < ta[0] else (1 if area_ratio < ta[1] else 2)
            s_w = 0 if (max_w / W) < tw[0] else (1 if (max_w / W) < tw[1] else 2)
            s_l = 0 if (length_px / max(W, H)) < tl[0] else (1 if (length_px / max(W, H)) < tl[1] else 2)
            score = 0.4 * s_a + 0.35 * s_w + 0.25 * s_l
            sev = "Low" if score < 0.75 else ("Medium" if score < 1.45 else "High")

            cs, _ = cv2.findContours(inst_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            polys = [_shrink(c.reshape(-1, 2).tolist()) for c in cs if len(c) >= 3]

            out["detections"].append({
                "crack_id": len(out["detections"]) + 1,
                "crack_class": CLASS_MAP.get(d["label"], "Other"),
                "confidence": round(d["confidence"] * 100, 2),
                "severity": sev,
                "length_px": round(length_px, 2),
                "max_width_px": round(max_w, 2),
                "mean_width_px": round(area_px / max(length_px, 1.0), 2),
                "area_px": area_px,
                "area_ratio": round(area_ratio, 6),
                "length_ratio": round(length_px / max(W, H), 6),
                "max_width_ratio": round(max_w / W, 6),
                "box": {"x": x1, "y": y1, "width": w_box, "height": h_box},
                "polygons": polys,
            })
        out["notes"].append("Model 3 missed pixel mask; extracted crack contours and severity inside Model 2 boxes.")


    # Populate image-level summary fields for backward compatibility
    out["crack_count"] = len(out["detections"])
    if out["detections"]:
        sev_rank = {"Low": 1, "Medium": 2, "High": 3}
        out["detections"].sort(key=lambda item: (-sev_rank[item["severity"]], -item["confidence"]))
        for idx, item in enumerate(out["detections"], start=1):
            item["crack_id"] = idx

        out["severity"] = out["detections"][0]["severity"]
        out["severity_confidence"] = round(float(np.mean([d["confidence"] for d in out["detections"]])), 2)
        out["severity_metrics"] = {
            "total_area_px": sum(d["area_px"] for d in out["detections"]),
            "total_area_ratio": round(sum(d["area_ratio"] for d in out["detections"]), 6),
            "max_length_px": max(d["length_px"] for d in out["detections"]),
            "max_width_px": max(d["max_width_px"] for d in out["detections"]),
        }

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
