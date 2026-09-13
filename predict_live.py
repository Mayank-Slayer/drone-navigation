import cv2
import numpy as np
import tensorflow as tf

# Load model
model = tf.keras.models.load_model("drone_model.keras")

# IMPORTANT: match folder names EXACTLY
class_names = ["forward", "left", "right", "unknown"]

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    img = cv2.resize(frame, (224, 224))
    img = np.expand_dims(img, axis=0) / 255.0

    prediction = model.predict(img)
    confidence = np.max(prediction)

    if confidence < 0.7:
        label = "unknown"
    else:
        class_index = np.argmax(prediction)
        label = class_names[class_index]

    cv2.putText(frame, f"Direction: {label}", (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)

    cv2.imshow("Drone AI", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()