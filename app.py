import streamlit as st
import cv2
import numpy as np
import tensorflow as tf
import time

# Page setup
st.set_page_config(page_title="Drone AI", layout="wide")

# Custom CSS (🔥 makes it look pro)
st.markdown("""
<style>
.main {
    background-color: #0E1117;
}
h1 {
    color: white;
}
.block-container {
    padding-top: 2rem;
}
.metric-box {
    background-color: #1f2937;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    color: white;
}
</style>
""", unsafe_allow_html=True)

st.title("🚁 Autonomous Drone Navigation Dashboard")

# Load model
model = tf.keras.models.load_model("drone_model.keras")
class_names = ["forward", "left", "right", "unknown"]

# Sidebar
st.sidebar.title("⚙️ Controls")
run = st.sidebar.toggle("Start Camera")
threshold = st.sidebar.slider("Confidence", 0.0, 1.0, 0.7)

# Layout
col1, col2 = st.columns([3, 1])

frame_placeholder = col1.empty()

status_placeholder = col2.empty()
conf_placeholder = col2.empty()

cap = cv2.VideoCapture(0)

while run:
    ret, frame = cap.read()
    if not ret:
        break

    img = cv2.resize(frame, (224, 224))
    img = np.expand_dims(img, axis=0) / 255.0

    prediction = model.predict(img, verbose=0)
    confidence = float(np.max(prediction))
    idx = int(np.argmax(prediction))
    label = class_names[idx]

    if confidence < threshold:
        label = "unknown"

    # 🎯 Professional UI cards
    if label == "left":
        status_placeholder.markdown(
            '<div class="metric-box">⬅️ <h2>GO LEFT</h2></div>',
            unsafe_allow_html=True
        )
    elif label == "right":
        status_placeholder.markdown(
            '<div class="metric-box">➡️ <h2>GO RIGHT</h2></div>',
            unsafe_allow_html=True
        )
    elif label == "forward":
        status_placeholder.markdown(
            '<div class="metric-box">⬆️ <h2>GO FORWARD</h2></div>',
            unsafe_allow_html=True
        )
    else:
        status_placeholder.markdown(
            '<div class="metric-box">❓ <h2>UNKNOWN</h2></div>',
            unsafe_allow_html=True
        )

    # Confidence display
    conf_placeholder.metric("Confidence", f"{confidence:.2f}")

    # Show frame
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame_placeholder.image(frame, use_container_width=True)

    time.sleep(0.03)

cap.release()