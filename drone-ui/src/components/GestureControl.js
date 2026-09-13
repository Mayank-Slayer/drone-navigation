import React, {
  useEffect,
} from "react";

const HandGestureControl = ({
  webcamRef,
  moveDrone,
  setStatus,
}) => {

  useEffect(() => {

    let hands = null;

    let running = true;

    const loadHands = async () => {

      const mpHands =
        await import(
          "@mediapipe/hands"
        );

      hands = new mpHands.Hands({

        locateFile: (file) => {

          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;

        },

      });

      hands.setOptions({

        maxNumHands: 1,

        modelComplexity: 0,

        minDetectionConfidence: 0.7,

        minTrackingConfidence: 0.7,

      });

      hands.onResults((results) => {

        if (
          !results.multiHandLandmarks ||
          results.multiHandLandmarks
            .length === 0
        ) {
          return;
        }

        const hand =
          results.multiHandLandmarks[0];

        const wrist = hand[0];

        const indexTip = hand[8];

        const middleTip = hand[12];

        // ================= LEFT =================

        if (
          indexTip.x <
          wrist.x - 0.15
        ) {

          moveDrone("LEFT");

          setStatus(
            "GESTURE: LEFT"
          );

          return;
        }

        // ================= RIGHT =================

        if (
          indexTip.x >
          wrist.x + 0.15
        ) {

          moveDrone("RIGHT");

          setStatus(
            "GESTURE: RIGHT"
          );

          return;
        }

        // ================= FORWARD =================

        if (
          indexTip.y <
          wrist.y - 0.15
        ) {

          moveDrone("FORWARD");

          setStatus(
            "GESTURE: FORWARD"
          );

          return;
        }

        // ================= STOP =================

        if (
          Math.abs(
            indexTip.x -
            middleTip.x
          ) < 0.03
        ) {

          setStatus(
            "GESTURE: STOP"
          );

          return;
        }

      });

      const detect = async () => {

        if (!running) return;

        if (
          webcamRef.current &&
          webcamRef.current.video
        ) {

          await hands.send({

            image:
              webcamRef.current.video,

          });

        }

        requestAnimationFrame(
          detect
        );

      };

      detect();

    };

    loadHands();

    return () => {

      running = false;

    };

  }, [
    webcamRef,
    moveDrone,
    setStatus,
  ]);

  return null;
};

export default HandGestureControl;