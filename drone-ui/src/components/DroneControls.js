import React from "react";

const DroneControls = ({
  moveDrone,
  gpsMode,
  setGpsMode,
}) => {

  return (
    <div className="card">

      <h2>Drone Controls</h2>

      <button
        onClick={() => setGpsMode("MANUAL")}
      >
        Manual Mode
      </button>

      <button
        onClick={() => setGpsMode("AUTO")}
      >
        Auto GPS Mode
      </button>

      <br />

      <button
        onClick={() => moveDrone("FORWARD")}
      >
        ⬆ Forward
      </button>

      <button
        onClick={() => moveDrone("LEFT")}
      >
        ⬅ Left
      </button>

      <button
        onClick={() => moveDrone("RIGHT")}
      >
        ➡ Right
      </button>

      <button
        onClick={() => moveDrone("BACK")}
      >
        ⬇ Back
      </button>

    </div>
  );
};

export default DroneControls;