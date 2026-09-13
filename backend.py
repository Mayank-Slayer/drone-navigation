from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import numpy as np
import tensorflow as tf

from PIL import Image
from io import BytesIO

import base64

from ultralytics import YOLO

app = FastAPI()

# ----------------------------
# CORS
# ----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# LOAD MODELS
# ----------------------------

model = tf.keras.models.load_model(
    "drone_model.keras"
)

class_names = [
    "forward",
    "left",
    "right",
    "unknown"
]

# YOLO

yolo_model = YOLO("yolov8n.pt")

# ----------------------------
# REQUEST MODEL
# ----------------------------

class ImageData(BaseModel):
    image: str

# ----------------------------
# CLASSIFICATION
# ----------------------------

@app.post("/predict")
def predict(data: ImageData):

    try:

        image_data = data.image.split(",")[1]

        image = Image.open(
            BytesIO(
                base64.b64decode(image_data)
            )
        ).convert("RGB")

        image = image.resize((224, 224))

        img = np.array(image)

        img = np.expand_dims(
            img,
            axis=0
        ) / 255.0

        prediction = model.predict(
            img,
            verbose=0
        )

        confidence = float(
            np.max(prediction)
        )

        idx = int(
            np.argmax(prediction)
        )

        if idx >= len(class_names):

            return {
                "direction": "unknown",
                "confidence": confidence
            }

        return {
            "direction": class_names[idx],
            "confidence": confidence
        }

    except Exception as e:

        return {
            "error": str(e)
        }

# ----------------------------
# OBJECT DETECTION
# ----------------------------

@app.post("/detect")
def detect(data: ImageData):

    try:

        image_data = data.image.split(",")[1]

        image = Image.open(
            BytesIO(
                base64.b64decode(image_data)
            )
        ).convert("RGB")

        img = np.array(image)

        height, width = img.shape[:2]

        # YOLO DETECTION

        results = yolo_model(
            img,
            verbose=False
        )[0]

        persons = []

        for box in results.boxes:

            cls = int(box.cls[0])

            label = results.names[cls]

            conf = float(box.conf[0])

            # ONLY PERSON

            if label != "person":
                continue

            # CONFIDENCE FILTER

            if conf < 0.55:
                continue

            # GET BOX

            x1, y1, x2, y2 = map(
                float,
                box.xyxy[0].tolist()
            )

            box_width = x2 - x1
            box_height = y2 - y1

            # REMOVE SMALL FALSE BOXES

            if box_width < 120:
                continue

            if box_height < 120:
                continue

            area = box_width * box_height

            persons.append({

                "label": "person",

                "confidence": conf,

                "box": [
                    x1,
                    y1,
                    x2,
                    y2
                ],

                "area": area
            })

        # PICK BIGGEST PERSON

        detections = []

        if len(persons) > 0:

            best_person = max(
                persons,
                key=lambda p: p["area"]
            )

            detections.append({

                "label":
                    best_person["label"],

                "confidence":
                    best_person["confidence"],

                "box":
                    best_person["box"]
            })

        return {

            "detections": detections,

            "image_width": width,

            "image_height": height
        }

    except Exception as e:

        return {
            "error": str(e)
        }