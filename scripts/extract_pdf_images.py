"""Extract embedded photos from the midia kit PDF into public/images/raw."""
import sys
from pathlib import Path

import fitz

PDF_PATH = next(Path(r"C:\Users\mgalv\Downloads").glob("M*dia-kit-Isa.pdf"))
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "raw"
OUT_DIR.mkdir(parents=True, exist_ok=True)

doc = fitz.open(PDF_PATH)
seen_xrefs = set()
count = 0
for page_index in range(len(doc)):
    for img in doc.get_page_images(page_index, full=True):
        xref = img[0]
        if xref in seen_xrefs:
            continue
        seen_xrefs.add(xref)
        pix = fitz.Pixmap(doc, xref)
        if pix.n - pix.alpha > 3:  # CMYK etc -> RGB
            pix = fitz.Pixmap(fitz.csRGB, pix)
        # skip tiny decorative images
        if pix.width < 220 or pix.height < 220:
            continue
        count += 1
        out = OUT_DIR / f"p{page_index + 1:02d}_img{count:02d}_{pix.width}x{pix.height}.png"
        pix.save(out)
        print(f"saved {out.name}")
print(f"total: {count} images from {len(doc)} pages")
