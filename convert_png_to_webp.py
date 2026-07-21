import os
from PIL import Image

def convert_pngs_to_webp(directory):
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if filename.lower().endswith(".png"):
                png_path = os.path.join(root, filename)
                webp_path = os.path.splitext(png_path)[0] + ".webp"
                
                try:
                    with Image.open(png_path) as img:
                        img.save(webp_path, "WEBP", quality=80)
                    print(f"Converted: {png_path} -> {webp_path}")
                    os.remove(png_path)
                    print(f"Deleted: {png_path}")
                except Exception as e:
                    print(f"Error converting {png_path}: {e}")

if __name__ == "__main__":
    convert_pngs_to_webp(".")
