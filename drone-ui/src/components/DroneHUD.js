import React from "react";

const DroneHUD = ({
  status,
  direction,
  confidence,
}) => {
  return (
    <div className="hud">

      <div>Direction: {direction}</div>

      <div>
        Confidence:
        {" "}
        {confidence
          ? (confidence * 100).toFixed(1)
          : 0}
        %
      </div>

      <div>Status: {status}</div>

    </div>
  );
};

export default DroneHUD;