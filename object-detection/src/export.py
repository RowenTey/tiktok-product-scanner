from ultralytics import YOLO

# Load a model
model = YOLO("yolov8x-cls.pt") 

# CoreML is good for Apple Neural Engine
path = model.export(format="coreml") 
