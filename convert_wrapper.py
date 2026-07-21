from PIL import Image

print("Converting wrapper.png to wrapper.webp...")
img = Image.open("wrapper.png")
img.save("wrapper.webp", format="WEBP")
print("Done!")
