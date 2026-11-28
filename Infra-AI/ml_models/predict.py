"""Model 1 - Crack Presence inference (CPU ok)."""
import torch, torch.nn as nn
from torchvision import models, transforms as T
from PIL import Image

CRACK_THRESHOLD = 0.40   # Safety-first threshold to catch faint cracks
_cache = {}

def load_model(weights_path="models/crack_presence_best.pt", device="cpu"):
    key = (weights_path, device)
    if key in _cache:
        return _cache[key]
    ckpt = torch.load(weights_path, map_location=device, weights_only=False)
    m = models.efficientnet_b0(weights=None)
    m.classifier[1] = nn.Linear(m.classifier[1].in_features, 2)
    m.load_state_dict(ckpt["state_dict"])
    m.eval().to(device)
    tf = T.Compose([
        T.Resize((ckpt["img_size"], ckpt["img_size"])),
        T.ToTensor(),
        T.Normalize(ckpt["mean"], ckpt["std"])
    ])
    _cache[key] = (m, tf, ckpt["class_names"])
    return _cache[key]

@torch.no_grad()
def predict(image, weights_path="models/crack_presence_best.pt", device="cpu", threshold=CRACK_THRESHOLD):
    """image: file path or PIL.Image. Returns {"is_cracked", "label", "confidence", "probabilities"}"""
    m, tf, names = load_model(weights_path, device)
    if not isinstance(image, Image.Image):
        image = Image.open(image)
    x = tf(image.convert("RGB")).unsqueeze(0).to(device)
    p = torch.softmax(m(x), 1)[0].cpu()
    
    crack_prob = float(p[1])
    uncracked_prob = float(p[0])
    is_cracked = crack_prob >= threshold
    label = names[1] if is_cracked else names[0]
    conf = crack_prob if is_cracked else uncracked_prob

    return {
        "is_cracked": is_cracked,
        "label": label,
        "confidence": round(conf, 4),
        "probabilities": {
            names[0]: round(uncracked_prob, 4),
            names[1]: round(crack_prob, 4)
        }
    }

if __name__ == "__main__":
    import sys, json
    print(json.dumps(predict(sys.argv[1]), indent=2))
