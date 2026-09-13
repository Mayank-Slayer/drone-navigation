import React, { useRef, useEffect, useState } from "react";

const DetectionOverlay = ({
  detections = [],
  imageSize,
  containerRef,
  onTargetLock,
  lockedTarget,
}) => {
  const overlayRef = useRef(null);

  const [displaySize, setDisplaySize] = useState({
    width: 1,
    height: 1,
  });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) return;

        setDisplaySize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, [containerRef]);

  // 🚨 FULL SAFETY CHECK
  if (
    !detections ||
    !Array.isArray(detections) ||
    !imageSize ||
    imageSize.width === 0 ||
    imageSize.height === 0
  ) {
    return null;
  }

  const scaleX = displaySize.width / (imageSize.width || 1);
  const scaleY = displaySize.height / (imageSize.height || 1);

  return (
    <div className="overlay" ref={overlayRef}>
      {detections.map((det, i) => {
        if (!det || !det.box) return null;

        const [x1, y1, x2, y2] = det.box;

        // 🚨 skip invalid boxes
        if (x1 === x2 || y1 === y2) return null;

        return (
          <div
            key={det.id || i}
            onClick={() => onTargetLock && onTargetLock(det.id)}
            className={`box 
              ${det.label === "person" ? "danger" : ""}
              ${det.label === "chair" ? "warning" : ""}
              ${det.id === lockedTarget ? "locked-box" : ""}
            `}
            style={{
              left: `${x1 * scaleX}px`,
              top: `${y1 * scaleY}px`,
              width: `${(x2 - x1) * scaleX}px`,
              height: `${(y2 - y1) * scaleY}px`,
              cursor: "pointer",
            }}
          >
            {det.label} #{det.id || ""}{" "}
            {det.confidence
              ? `(${(det.confidence * 100).toFixed(0)}%)`
              : ""}
          </div>
        );
      })}
    </div>
  );
};

export default DetectionOverlay;