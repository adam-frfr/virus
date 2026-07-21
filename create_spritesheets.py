import os
from PIL import Image

def create_spritesheet(folder, out_file, target_size, prefix="ezgif-frame-", cols=10, ext=".webp"):
    print(f"Processing {folder}...")
    files = [f for f in os.listdir(folder) if f.startswith(prefix) and f.endswith(ext)]
    files.sort(key=lambda x: int(x.replace(prefix, "").replace(ext, "")))
    
    if not files:
        print(f"No files found in {folder}")
        return

    num_frames = len(files)
    rows = (num_frames + cols - 1) // cols
    
    frame_width, frame_height = target_size
    sheet_width = cols * frame_width
    sheet_height = rows * frame_height
    
    print(f"Creating {out_file}: {num_frames} frames, {cols}x{rows} grid, sheet size {sheet_width}x{sheet_height}")
    
    spritesheet = Image.new("RGBA", (sheet_width, sheet_height), (0, 0, 0, 0))
    
    for i, file in enumerate(files):
        img = Image.open(os.path.join(folder, file))
        if img.mode != "RGBA":
            img = img.convert("RGBA")
        
        img = img.resize(target_size, Image.Resampling.LANCZOS)
        
        row = i // cols
        col = i % cols
        
        x = col * frame_width
        y = row * frame_height
        
        spritesheet.paste(img, (x, y))
        
    spritesheet.save(out_file, "WEBP", quality=90, lossless=False)
    print(f"Saved {out_file}")

create_spritesheet("bowww", "bowww_spritesheet.webp", (640, 360), cols=10, ext=".png")
