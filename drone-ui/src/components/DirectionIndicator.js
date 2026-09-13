import React from "react";

const DirectionIndicator = ({ status }) => {
  let arrow = "⬆";

  if (status.includes("LEFT")) arrow = "⬅";
  if (status.includes("RIGHT")) arrow = "➡";
  if (status.includes("STOP")) arrow = "⛔";

  return (
    <div className="direction-indicator">
      {arrow}
    </div>
  );
};

export default DirectionIndicator;