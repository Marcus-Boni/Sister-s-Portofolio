"""Convert JPEGs to optimized WebP with semantic names and output dimensions."""
from pathlib import Path
from PIL import Image

IMG_DIR = Path(__file__).resolve().parent.parent / "public" / "images"

# jpeg filename -> slug
IMAGES_TO_PROCESS = [
    "fitness-tennis",
    "cream-blazer-fashion-portrait",
    "sheer-black-outfit-garden",
    "white-swimsuit-seaside-deck",
    "elegant-white-top-portrait",
]

print("Starting image optimization...")
for slug in IMAGES_TO_PROCESS:
    src = IMG_DIR / f"{slug}.jpeg"
    if not src.exists():
        print(f"Error: {src.name} not found!")
        continue
        
    img = Image.open(src).convert("RGB")
    width, height = img.size
    
    # Save full-size webp
    dest_full = IMG_DIR / f"{slug}.webp"
    img.save(dest_full, "WEBP", quality=82, method=6)
    
    # Save small variant for thumbnails / mobile
    small = img.copy()
    small.thumbnail((800, 1600))
    dest_small = IMG_DIR / f"{slug}-800.webp"
    small.save(dest_small, "WEBP", quality=80, method=6)
    
    # Print results and dimensions
    print(f"Processed: {slug}")
    print(f"  Dimensions: {width}x{height}")
    print(f"  Full webp size: {dest_full.stat().st_size // 1024} KB")
    print(f"  Small webp size: {dest_small.stat().st_size // 1024} KB")

print("done")
