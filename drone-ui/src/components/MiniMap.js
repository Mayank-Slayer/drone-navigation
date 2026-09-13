import React from "react";

const MiniMap = ({ detections = [] }) => {
  if (!Array.isArray(detections) || detections.length === 0) {
    return (
      <div className="minimap">
        <h3>🗺 MiniMap</h3>
        <p>No objects</p>
      </div>
    );
  }

  return (
    <div className="minimap">
      <h3>🗺 MiniMap</h3>

      {detections.map((obj) => {
        if (!obj || !obj.box) return null;

        const [x1, y1] = obj.box;

        if (x1 === undefined || y1 === undefined) return null;

        return (
          <div
            key={obj.id}
            className="dot"
            style={{
              left: `${(x1 / 640) * 100}%`,
              top: `${(y1 / 480) * 100}%`,
            }}
          />
        );
      })}
    </div>
  );
};

export default MiniMap;