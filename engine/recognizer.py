import io
import base64
import re
import numpy as np
import os as _os
from PIL import Image
from pix2tex.cli import LatexOCR


class FormulaRecognizer:
    def __init__(self):
        self.model = None

    def load(self):
        self.model = LatexOCR()
        self._warm_up()

    def _warm_up(self):
        d = _os.path.dirname(_os.path.abspath(__file__))
        p = _os.path.join(d, 'warmup_test.png')
        if _os.path.exists(p):
            img = Image.open(p).convert('RGB')
            self.model(img)

    def recognize(self, image_base64: str) -> dict:
        image_data = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        gray = image.convert('L')
        arr = np.array(gray, dtype=np.uint8)
        if arr.mean() < 127:
            arr = 255 - arr
        # Trim whitespace borders — prevents model from hallucinating delimiters
        content = arr < 200
        rows = np.any(content, axis=1)
        cols = np.any(content, axis=0)
        if rows.any() and cols.any():
            ys = np.where(rows)[0]; xs = np.where(cols)[0]
            y1, y2 = max(0, ys[0]-10), min(arr.shape[0], ys[-1]+10)
            x1, x2 = max(0, xs[0]-10), min(arr.shape[1], xs[-1]+10)
            arr = arr[y1:y2, x1:x2]
        cleaned = Image.fromarray(arr).convert('RGB')
        # Low temperature for greedy decoding — reduces hallucination
        self.model.args['temperature'] = 0.01
        latex = self.model(cleaned)
        latex = self._clean_result(latex)
        return {'latex': latex}

    @staticmethod
    def _clean_result(latex):
        import re
        latex = latex.strip()
        latex = re.sub(r'(\\;|\s+)+$', '', latex)
        latex = re.sub(r'\\nonumber\s*$', '', latex)
        latex = re.sub(r'\\(tag|label)\{[^}]*\}\s*$', '', latex)
        latex = re.sub(r'\\(big(cup|cap|vee|wedge|sqcup|sqcap|odot|otimes|oplus|uplus|triangledown|triangleup))\s*$', '', latex)
        latex = re.sub(r'\\limits\s*$', '', latex)
        latex = re.sub(r'\\[\,:\;!]\s*$', '', latex)
        latex = latex.strip()
        return latex

    def shutdown(self):
        self.model = None
