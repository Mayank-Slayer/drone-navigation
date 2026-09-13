import React from "react";

const ManualControls = () => {
  return (
    <div className="card">
      <h3>Manual Control</h3>

      <button>⬆ Forward</button>
      <button>⬅ Left</button>
      <button>➡ Right</button>
      <button>⛔ Stop</button>

      <p>Keyboard: W A D S</p>
    </div>
  );
};

export default ManualControls;