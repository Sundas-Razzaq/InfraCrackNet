"""Model 3 - crack outline + severity (YOLOv8s-seg + mask rules, CPU ok)."""
import json
import numpy as np, cv2
from ultralytics import YOLO

MIN_CONF = 0.25
_cache = {}

def _model(weights):
    if weights not in _cache:
        _cache[weights] = YOLO(weights)
    return _cache[weights]

def mask_metrics(mask):
    from skimage.morphology import skeletonize
    H, W = mask.shape
    m8 = mask.astype(np.uint8)
    out = {"area_ratio": float(m8.mean()), "length_ratio": 0.0, "max_width_ratio": 0.0}
    if m8.sum() == 0:
        return out
    out["max_width_ratio"] = float(2 * cv2.distanceTransform(m8, cv2.DIST_L2, 3).max() / W)
    out["length_ratio"] = float(skeletonize(mask).sum() / max(H, W))
    return out

def severity_level(area_ratio, t):
    return "Low" if area_ratio < t[0] else ("Medium" if area_ratio < t[1] else "High")

def predict(image, weights_path="models/crack_segmentation_best.pt",
            thresholds_path="models/severity_thresholds.json", device="cpu",
            conf=MIN_CONF, imgsz=640):
    """image: path / PIL / numpy. Returns outline polygons, mask metrics, severity, confidence."""
    t = json.load(open(thresholds_path))["area_ratio_thresholds"]
    r = _model(weights_path).predict(image, conf=conf, imgsz=imgsz, device=device, verbose=False)[0]
    H, W = r.orig_shape
    mask = np.zeros((H, W), np.uint8)
    polys = []
    if r.masks is not None:
        for xy in r.masks.xy:
            if len(xy) < 3:
                continue
            pts = np.round(xy).astype(np.int32)
            cv2.fillPoly(mask, [pts], 1)
            polys.append(pts.tolist())
    confs = [float(c) for c in r.boxes.conf] if (r.boxes is not None and len(r.boxes)) else []
    if not polys:
        return {"has_crack": False, "severity": None, "confidence": None, "instances": 0,
                "metrics": mask_metrics(mask.astype(bool)), "polygons": [], "image_size": [W, H]}
    met = mask_metrics(mask.astype(bool))
    return {"has_crack": True, "severity": severity_level(met["area_ratio"], t),
            "confidence": round(float(np.mean(confs)), 4), "instances": len(polys),
            "metrics": {k: round(v, 6) for k, v in met.items()}, "polygons": polys, "image_size": [W, H]}

if __name__ == "__main__":
    import sys
    out = predict(sys.argv[1]); out["polygons"] = f"{len(out['polygons'])} polygons"
    print(json.dumps(out, indent=2))
