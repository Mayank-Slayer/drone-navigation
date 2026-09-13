from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import numpy as np
import tensorflow as tf

from PIL import Image
from io import BytesIO

import base64

from ultralytics import YOLO


# ============================================================
# CREATE FASTAPI APP
# ============================================================

app = FastAPI(
    title="AI Autonomous Drone Navigation API",
    description="CNN-based drone navigation with YOLO person detection",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "AI Drone Navigation Backend"
    }


# ============================================================
# LOAD CNN MODEL
# ============================================================

model = tf.keras.models.load_model(
    "drone_model.keras"
)


# CNN CLASS NAMES

class_names = [
    "forward",
    "left",
    "right",
    "unknown"
]


# ============================================================
# LOAD YOLO MODEL
# ============================================================

yolo_model = YOLO(
    "yolov8n.pt"
)


# ============================================================
# REQUEST MODEL
# ============================================================

class ImageData(BaseModel):
    image: str


# ============================================================
# CNN NAVIGATION PREDICTION
# ============================================================

@app.post("/predict")
def predict(data: ImageData):

    try:

        # ----------------------------------------------------
        # GET BASE64 IMAGE
        # ----------------------------------------------------

        image_data = data.image.split(",")[1]

        # ----------------------------------------------------
        # DECODE IMAGE
        # ----------------------------------------------------

        image = Image.open(
            BytesIO(
                base64.b64decode(image_data)
            )
        ).convert("RGB")

        # ----------------------------------------------------
        # RESIZE IMAGE FOR CNN
        # ----------------------------------------------------

        image = image.resize(
            (224, 224)
        )

        # ----------------------------------------------------
        # CONVERT IMAGE TO NUMPY
        # ----------------------------------------------------

        img = np.array(image)

        # ----------------------------------------------------
        # NORMALIZE IMAGE
        # ----------------------------------------------------

        img = np.expand_dims(
            img,
            axis=0
        ) / 255.0

        # ----------------------------------------------------
        # CNN PREDICTION
        # ----------------------------------------------------

        prediction = model.predict(
            img,
            verbose=0
        )

        # ----------------------------------------------------
        # GET CONFIDENCE
        # ----------------------------------------------------

        confidence = float(
            np.max(prediction)
        )

        # ----------------------------------------------------
        # GET PREDICTED CLASS
        # ----------------------------------------------------

        idx = int(
            np.argmax(prediction)
        )

        # ----------------------------------------------------
        # CHECK CLASS INDEX
        # ----------------------------------------------------

        if idx >= len(class_names):

            return {
                "direction": "unknown",
                "confidence": confidence
            }

        # ----------------------------------------------------
        # RETURN RESULT
        # ----------------------------------------------------

        return {
            "direction": class_names[idx],
            "confidence": confidence
        }

    except Exception as e:

        return {
            "error": str(e)
        }


# ============================================================
# YOLO PERSON DETECTION
# ============================================================

@app.post("/detect")
def detect(data: ImageData):

    try:

        # ----------------------------------------------------
        # GET BASE64 IMAGE
        # ----------------------------------------------------

        image_data = data.image.split(",")[1]

        # ----------------------------------------------------
        # DECODE IMAGE
        # ----------------------------------------------------

        image = Image.open(
            BytesIO(
                base64.b64decode(image_data)
            )
        ).convert("RGB")

        # ----------------------------------------------------
        # CONVERT TO NUMPY
        # ----------------------------------------------------

        img = np.array(image)

        # ----------------------------------------------------
        # IMAGE DIMENSIONS
        # ----------------------------------------------------

        height, width = img.shape[:2]

        # ----------------------------------------------------
        # YOLO DETECTION
        # ----------------------------------------------------

        results = yolo_model(
            img,
            verbose=False
        )[0]

        # ----------------------------------------------------
        # STORE PERSON DETECTIONS
        # ----------------------------------------------------

        persons = []

        # ----------------------------------------------------
        # PROCESS DETECTIONS
        # ----------------------------------------------------

        for box in results.boxes:

            # Class ID
            cls = int(
                box.cls[0]
            )

            # Object label
            label = results.names[cls]

            # Confidence
            conf = float(
                box.conf[0]
            )

            # ------------------------------------------------
            # ONLY DETECT PERSON
            # ------------------------------------------------

            if label != "person":
                continue

            # ------------------------------------------------
            # CONFIDENCE FILTER
            # ------------------------------------------------

            if conf < 0.55:
                continue

            # ------------------------------------------------
            # GET BOUNDING BOX
            # ------------------------------------------------

            x1, y1, x2, y2 = map(
                float,
                box.xyxy[0].tolist()
            )

            # ------------------------------------------------
            # CALCULATE BOX SIZE
            # ------------------------------------------------

            box_width = x2 - x1
            box_height = y2 - y1

            # ------------------------------------------------
            # REMOVE SMALL FALSE DETECTIONS
            # ------------------------------------------------

            if box_width < 120:
                continue

            if box_height < 120:
                continue

            # ------------------------------------------------
            # CALCULATE AREA
            # ------------------------------------------------

            area = (
                box_width *
                box_height
            )

            # ------------------------------------------------
            # STORE PERSON
            # ------------------------------------------------

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

        # ====================================================
        # SELECT BIGGEST PERSON
        # ====================================================

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

        # ====================================================
        # RETURN DETECTION RESULT
        # ====================================================

        return {

            "detections":
                detections,

            "image_width":
                width,

            "image_height":
                height
        }

    except Exception as e:

        return {
            "error": str(e)
        }


# ============================================================
# END OF BACKEND
# ============================================================