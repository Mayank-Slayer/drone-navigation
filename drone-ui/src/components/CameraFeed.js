import React, { useState } from "react";
import Webcam from "react-webcam";

const CameraFeed = ({
  webcamRef,
  detections,
  imageSize,
  status,
  direction,
  confidence,
}) => {

  const [cameraMode, setCameraMode] =
    useState("normal");

  const videoWidth = 640;
  const videoHeight = 480;

  // CAMERA FILTERS

  const getFilter = () => {

    // GREEN NIGHT VISION

    if (cameraMode === "night") {

      return `
        brightness(0.7)
        contrast(1.8)
        saturate(0)
        sepia(1)
        hue-rotate(50deg)
      `;
    }

    // THERMAL MODE

    if (cameraMode === "thermal") {

      return `
        contrast(2)
        saturate(4)
        hue-rotate(-40deg)
        brightness(1.3)
      `;
    }

    return "none";
  };

  return (

    <div className="card">

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "640px",
          height: "480px",
          margin: "auto",
          overflow: "hidden",
          borderRadius: "20px",
          background: "#000",
        }}
      >

        {/* CAMERA */}

        <Webcam
          ref={webcamRef}
          mirrored={true}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: videoWidth,
            height: videoHeight,
            facingMode: "user",
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            borderRadius: "20px",
            border: "2px solid #4da6ff",
            boxShadow:
              "0 0 20px #4da6ff",
            filter: getFilter(),
            transition: "0.3s",
          }}
        />

        {/* NIGHT VISION GREEN OVERLAY */}

        {cameraMode === "night" && (

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "rgba(0,255,100,0.12)",
              mixBlendMode: "screen",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

        )}

        {/* HUD */}

        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background:
              "rgba(0,0,0,0.75)",
            padding: "10px",
            borderRadius: "10px",
            color: "#8cff66",
            fontFamily: "monospace",
            fontSize: "14px",
            zIndex: 1000,
          }}
        >

          <div>
            Direction: {direction}
          </div>

          <div>
            Confidence:
            {" "}
            {(confidence * 100).toFixed(1)}%
          </div>

          <div>
            Status: {status}
          </div>

          <div>
            Mode:
            {" "}
            {cameraMode.toUpperCase()}
          </div>

        </div>

        {/* DETECTION BOXES */}

        {detections &&
          detections.map((det, index) => {

            if (!det.box)
              return null;

            let [
              x1,
              y1,
              x2,
              y2
            ] = det.box;

            // SCALE FIX

            const scaleX =
              videoWidth /
              (imageSize.width ||
                videoWidth);

            const scaleY =
              videoHeight /
              (imageSize.height ||
                videoHeight);

            x1 *= scaleX;
            x2 *= scaleX;

            y1 *= scaleY;
            y2 *= scaleY;

            // MIRROR FIX

            const mirroredX =
              videoWidth - x2;

            const width =
              x2 - x1;

            const height =
              y2 - y1;

            // IGNORE FAKE SMALL BOXES

            if (
              width < 60 ||
              height < 60
            ) {
              return null;
            }

            const isPerson =
              det.label === "person";

            return (

              <div
                key={index}
                style={{
                  position: "absolute",

                  left: `${mirroredX}px`,
                  top: `${y1}px`,

                  width: `${width}px`,
                  height: `${height}px`,

                  border: isPerson
                    ? "5px solid #ff0000"
                    : "5px solid #00ff00",

                  borderRadius: "12px",

                  boxShadow: isPerson
                    ? "0 0 25px #ff0000"
                    : "0 0 25px #00ff00",

                  zIndex: 9999,

                  pointerEvents:
                    "none",

                  transition:
                    "all 0.05s linear",
                }}
              >

                {/* LABEL */}

                <div
                  style={{
                    position:
                      "absolute",

                    top: "-34px",
                    left: "0",

                    background:
                      isPerson
                        ? "#ff0000"
                        : "#00ff00",

                    color:
                      isPerson
                        ? "white"
                        : "black",

                    padding:
                      "5px 10px",

                    borderRadius:
                      "8px",

                    fontSize:
                      "13px",

                    fontWeight:
                      "bold",
                  }}
                >

                  {det.label.toUpperCase()}
                  {" "}
                  {Math.round(
                    det.confidence * 100
                  )}
                  %

                </div>

              </div>

            );

          })}

        {/* CAMERA MODE BUTTONS */}

        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform:
              "translateX(-50%)",

            display: "flex",
            gap: "12px",
            zIndex: 2000,
          }}
        >

          <button
            onClick={() =>
              setCameraMode("normal")
            }
            style={buttonStyle}
          >
            Normal
          </button>

          <button
            onClick={() =>
              setCameraMode("night")
            }
            style={buttonStyle}
          >
            Night Vision
          </button>

          <button
            onClick={() =>
              setCameraMode("thermal")
            }
            style={buttonStyle}
          >
            Thermal
          </button>

        </div>

      </div>

    </div>

  );

};

// BUTTON STYLE

const buttonStyle = {

  background:
    "linear-gradient(90deg,#4da6ff,#66ccff)",

  color: "white",

  border: "none",

  padding: "10px 16px",

  borderRadius: "10px",

  fontWeight: "bold",

  cursor: "pointer",

  boxShadow:
    "0 0 10px #4da6ff",

  fontSize: "12px",
};

export default CameraFeed;