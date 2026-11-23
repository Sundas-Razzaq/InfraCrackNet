"""Model 1 - Crack Presence inference (CPU ok)."""
import torch, torch.nn as nn
from torchvision import models, transforms as T
from PIL import Image

_cache = {}

def load_model(weights_path="models/crack_presence_best.pt", device="cpu"):
    key = (weights_path, device)
    if key in _cache:
        return _cache[key]
    ckpt = torch.load(weights_path, map_location=device)
    m = models.efficientnet_b0(weights=None)
    m.classifier[1] = nn.Linear(m.classifier[1].in_features, 2)
    m.load_state_dict(ckpt["state_dict"])
    m.eval().to(device)
    tf = T.Compose([T.Resize((ckpt["img_size"], ckpt["img_size"])), T.ToTensor(),
                    T.Normalize(ckpt["mean"], ckpt["std"])])
    _cache[key] = (m, tf, ckpt["class_names"])
    return _cache[key]

@torch.no_grad()
def predict(image, weights_path="models/crack_presence_best.pt", device="cpu"):
    """image: file path or PIL.Image. Returns {"label", "confidence", "probabilities"}"""
    m, tf, names = load_model(weights_path, device)
    if not isinstance(image, Image.Image):
        image = Image.open(image)
    x = tf(image.convert("RGB")).unsqueeze(0).to(device)
    p = torch.softmax(m(x), 1)[0].cpu()
    i = int(p.argmax())
    return {"label": names[i], "confidence": round(float(p[i]), 4),
            "probabilities": {n: round(float(v), 4) for n, v in zip(names, p)}}

if __name__ == "__main__":
    import sys, json
    print(json.dumps(predict(sys.argv[1]), indent=2))
