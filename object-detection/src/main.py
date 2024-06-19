from ultralytics import YOLO

## Load the exported model
model = YOLO("yolov8x-cls.mlpackage")

## Load an image
img = "https://ultralytics.com/images/zidane.jpg"


## Detect objects in the image
results = model(img, stream=True, imgsz=224)

for result in results:
    ids = result.probs.top5
    confs = result.probs.top5conf

    for i, id in enumerate(ids):
        name = result.names[id]
        print(name, confs[i])