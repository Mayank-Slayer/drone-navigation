import React, { useEffect, useRef } from "react";

const Radar = ({ detections = [] }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // ✅ SAFE SIZE (VERY IMPORTANT)
    const width = 200;
    const height = 200;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    if (!Array.isArray(detections)) return;

    ctx.fillStyle = "lime";

    detections.forEach((d) => {
      if (!d || !d.box) return;

      const x = Math.random() * width;
      const y = Math.random() * height;

      ctx.fillRect(x, y, 4, 4);
    });

  }, [detections]);

  return (
    <div style={{ width: "200px", height: "200px" }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Radar;