import glob
from PIL import Image

print("Converting to animated webp...")
# Read and sort frames. 
filenames = sorted(glob.glob("root/*.png"))
        
frames = [Image.open(f) for f in filenames]
if frames:
    frames[0].save(
        "root.webp",
        format="WEBP",
        append_images=frames[1:],
        save_all=True,
        duration=50,
        loop=1 # Only loop once, since it should "grow" and stay? Or maybe loop=0 (infinite). The user said "grows as she opens the gift box", which suggests it should play once and stay, or just play. Let's set loop=1.
    )
    print(f"Done! Created root.webp with {len(frames)} frames")
else:
    print("No frames found!")
