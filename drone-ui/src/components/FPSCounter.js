import React, { useEffect, useState } from "react";

const FPSCounter = () => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;

    const loop = () => {
      frames++;
      const now = performance.now();

      if (now - lastTime >= 1000) {
        setFps(frames);
        frames = 0;
        lastTime = now;
      }

      requestAnimationFrame(loop);
    };

    loop();
  }, []);

  return <div className="fps">FPS: {fps}</div>;
};

export default FPSCounter;