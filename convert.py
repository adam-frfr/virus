import glob
from PIL import Image

print("Converting to animated webp...")
# Read and sort frames. 
filenames = sorted(glob.glob("violet flower 3/*.png"))
if not filenames:
    # try inner directory
    import os
    subdirs = [f.path for f in os.scandir("violet flower 3") if f.is_dir()]
    if subdirs:
        filenames = sorted(glob.glob(f"{subdirs[0]}/*.png"))
        
frames = [Image.open(f) for f in filenames]
frames[0].save(
    "falling_flower_3.webp",
    format="WEBP",
    append_images=frames[1:],
    save_all=True,
    duration=50,
    loop=0
)
print(f"Done! Created falling_flower_3.webp with {len(frames)} frames")
