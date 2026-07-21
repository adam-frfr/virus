import glob
from PIL import Image

print("Converting to animated webp...")
# Read and sort frames. 
filenames = sorted(glob.glob("violet boquett/*.png"))
if not filenames:
    import os
    subdirs = [f.path for f in os.scandir("violet boquett") if f.is_dir()]
    if subdirs:
        filenames = sorted(glob.glob(f"{subdirs[0]}/*.png"))
        
frames = [Image.open(f) for f in filenames]
frames[0].save(
    "violet_boquett.webp",
    format="WEBP",
    append_images=frames[1:],
    save_all=True,
    duration=50,
    loop=0
)
print(f"Done! Created violet_boquett.webp with {len(frames)} frames")
