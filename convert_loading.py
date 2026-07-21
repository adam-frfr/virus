import glob
import os
from PIL import Image

print("Converting butterfly loading frames to webp...")
filenames = sorted(glob.glob("butterfly loading/*.png"))

count = 0
for f in filenames:
    img = Image.open(f)
    base = os.path.splitext(f)[0]
    img.save(base + ".webp", format="WEBP")
    count += 1
    
print(f"Done! Converted {count} frames to webp.")
