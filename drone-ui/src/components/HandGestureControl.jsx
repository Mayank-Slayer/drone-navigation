import { useEffect } from "react";

const HandGestureControl = ({
  moveDrone,
  setStatus,
  setDirection,
}) => {

  useEffect(() => {

    const handleKey = (e) => {

      // LEFT
      if (
        e.key === "ArrowLeft"
      ) {

        moveDrone("LEFT");

        setDirection("LEFT");

        setStatus(
          "GESTURE LEFT"
        );

      }

      // RIGHT
      if (
        e.key === "ArrowRight"
      ) {

        moveDrone("RIGHT");

        setDirection("RIGHT");

        setStatus(
          "GESTURE RIGHT"
        );

      }

      // FORWARD
      if (
        e.key === "ArrowUp"
      ) {

        moveDrone("FORWARD");

        setDirection(
          "FORWARD"
        );

        setStatus(
          "GESTURE FORWARD"
        );

      }

      // BACK
      if (
        e.key === "ArrowDown"
      ) {

        moveDrone("BACK");

        setDirection("BACK");

        setStatus(
          "GESTURE BACK"
        );

      }

      // STOP
      if (
        e.key === " "
      ) {

        setDirection("STOP");

        setStatus(
          "GESTURE STOP"
        );

      }

    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleKey
      );

    };

  }, [
    moveDrone,
    setStatus,
    setDirection,
  ]);

  return null;

};

export default HandGestureControl;