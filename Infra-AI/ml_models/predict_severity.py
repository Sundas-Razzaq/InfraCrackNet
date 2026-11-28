"""Model 3 - Crack Outline + Width/Length + Severity (per-instance)"""
import json
import numpy as np
import cv2
from ultralytics import YOLO

MIN_CONF = 0.25
_cache = {}
PIXEL_TO_MM = 0.28          # assumed scale for FYP demo

def _model(weights):
    if weights not in _cache:
        _cache[weights] = YOLO(weights)
    return _cache[weights]

def instance_metrics(mask):
    from skimage.morphology import skeletonize
    H, W = mask.shape
    m8 = mask.astype(np.uint8)
    area_px = int(m8.sum())
    if area_px == 0:
        return {"area_px": 0, "length_px": 0.0, "width_px": 0.0,
                "area_mm2": 0.0, "length_mm": 0.0, "width_mm": 0.0}

    dist = cv2.distanceTransform(m8, cv2.DIST_L2, 3)
    width_px = float(2 * dist.max())
    skel = skeletonize(mask)
    length_px = float(skel.sum())

    return {
        "area_px": area_px,
        "length_px": round(length_px, 1),
        "width_px": round(width_px, 2),
        "area_mm2": round(area_px * (PIXEL_TO_MM ** 2), 2),
        "length_mm": round(length_px * PIXEL_TO_MM, 2),
        "width_mm": round(width_px * PIXEL_TO_MM, 2),
    }

def severity_from_width(width_px, img_w, t_low=0.0035, t_high=0.009):
    rel = width_px / max(img_w, 1)
    if rel < t_low:
        return "Low"
    if rel < t_high:
        return "Medium"
    return "High"

def predict(image, weights_path="models/crack_segmentation_best.pt",
            thresholds_path="models/severity_thresholds.json",
            device="cpu", conf=MIN_CONF, imgsz=640):
    r = _model(weights_path).predict(
        image, conf=conf, imgsz=imgsz, device=device, verbose=False
    )[0]

    H, W = r.orig_shape
    detections = []

    if r.masks is None or len(r.masks) == 0:
        return {"has_crack": False, "detections": [], "image_size": [W, H],
                "notes": ["No crack outline found"]}

    confs = r.boxes.conf.cpu().numpy() if r.boxes is not None else []
    boxes = r.boxes.xyxy.cpu().numpy() if r.boxes is not None else []

    for i, xy in enumerate(r.masks.xy):
        if len(xy) < 3:
            continue
        pts = np.round(xy).astype(np.int32)
        inst_mask = np.zeros((H, W), np.uint8)
        cv2.fillPoly(inst_mask, [pts], 1)
        inst_mask = inst_mask.astype(bool)

        met = instance_metrics(inst_mask)
        if met["area_px"] < 30:
            continue

        if i < len(boxes):
            x1, y1, x2, y2 = boxes[i]
            box = {"x": int(round(x1)), "y": int(round(y1)),
                   "width": int(round(x2-x1)), "height": int(round(y2-y1))}
        else:
            xs, ys = pts[:,0], pts[:,1]
            box = {"x": int(xs.min()), "y": int(ys.min()),
                   "width": int(xs.max()-xs.min()), "height": int(ys.max()-ys.min())}

        conf_i = float(confs[i]) if i < len(confs) else 0.5
        sev = severity_from_width(met["width_px"], W)

        detections.append({
            "confidence": round(conf_i * 100, 2),
            "severity": sev,
            "width_mm": met["width_mm"],
            "length_mm": met["length_mm"],
            "area_mm2": met["area_mm2"],
            "width_px": met["width_px"],
            "length_px": met["length_px"],
            "area_px": met["area_px"],
            "box": box,
            "polygons": [pts.tolist()],
        })

    detections.sort(key=lambda d: -d["confidence"])
    return {
        "has_crack": len(detections) > 0,
        "detections": detections,
        "image_size": [W, H],
        "scale_used": f"{PIXEL_TO_MM} mm/pixel (assumed)",
        "notes": []
    }

if __name__ == "__main__":
    import sys, json
    out = predict(sys.argv[1])
    for d in out["detections"]:
        d["polygons"] = f"{len(d['polygons'])} poly"
    print(json.dumps(out, indent=2))
