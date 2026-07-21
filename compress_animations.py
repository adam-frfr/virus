import os
from PIL import Image

animations = [
    "flower_animation.webp",
    "violet_boquett.webp",
    "root.webp",
    "butterfly.webp",
    "falling_flower_3.webp",
    "falling_flower.webp"
]

for name in animations:
    if not os.path.exists(name):
        continue
    print(f"Compressing {name}...")
    try:
        img = Image.open(name)
        frames = []
        durations = []
        for i in range(img.n_frames):
            img.seek(i)
            f = img.copy()
            # Scale down to 50%
            f.thumbnail((max(1, f.width // 2), max(1, f.height // 2)), Image.Resampling.LANCZOS)
            frames.append(f)
            durations.append(img.info.get('duration', 50))
            if i % 10 == 0:
                print(f"  Processed {i}/{img.n_frames} frames")
        
        frames[0].save(
            "temp_" + name,
            format="WEBP",
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=img.info.get('loop', 0),
            quality=30,
            method=2
        )
        os.replace("temp_" + name, name)
        print(f"Done with {name}")
    except Exception as e:
        print(f"Error on {name}: {e}")
