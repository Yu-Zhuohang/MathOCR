import sys

def download_model():
    print("[download-model] Starting pix2tex model download...")
    print("[download-model] This will download ~500MB of model weights")
    print("[download-model] Weights are cached at ~/.cache/pix2tex/")
    sys.stdout.flush()

    from pix2tex.cli import LatexOCR
    print("[download-model] Loading model (downloads weights if needed)...")
    sys.stdout.flush()

    model = LatexOCR()
    print("[download-model] Running warm-up inference...")
    sys.stdout.flush()

    from PIL import Image
    blank = Image.new("L", (64, 64), 255)
    model(blank)

    print("[download-model] Model ready! Weights cached.")

if __name__ == "__main__":
    download_model()
