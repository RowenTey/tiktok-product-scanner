from ultralytics import YOLO

# Load a model
## model = YOLO("yolov8n.yaml")  # build a new model from scratch
model = YOLO("yolov8x-cls.pt")  # load a pretrained model (recommended for training)

# Use the model
path = model.export(format="coreml")  # export the model to CoreML format
