"""Model 2 - Road Crack Type inference (YOLOv8m, CPU/GPU)."""
from ultralytics import YOLO

MIN_CONF = 0.25
NMS_IOU = 0.45
_cache = {}

def load_model(weights_path="models/road_crack_type_best.pt"):
    if weights_path not in _cache:
        _cache[weights_path] = YOLO(weights_path)
    return _cache[weights_path]

def predict(image, weights_path="models/road_crack_type_best.pt", device="cpu",
            conf=MIN_CONF, iou=NMS_IOU, imgsz=700):
    """image: path / PIL.Image / numpy. Returns detections sorted by confidence."""
    model = load_model(weights_path)
    r = model.predict(image, conf=conf, iou=iou, imgsz=imgsz, device=device, verbose=False)[0]
    dets = [{
        "label": r.names[int(b.cls)],
        "confidence": round(float(b.conf), 4),
        "box_xyxy": [round(float(v), 1) for v in b.xyxy[0].tolist()]
    } for b in r.boxes]
    dets.sort(key=lambda d: -d["confidence"])
    for idx, d in enumerate(dets, start=1):
        d["damage_id"] = idx
    return {
        "count": len(dets),
        "top_label": dets[0]["label"] if dets else None,
        "top_confidence": dets[0]["confidence"] if dets else None,
        "detections": dets
    }

if __name__ == "__main__":
    import sys, json
    print(json.dumps(predict(sys.argv[1]), indent=2))
