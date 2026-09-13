import React from "react";

const TelemetryPanel = ({
  battery,
  altitude,
  speed,
  gps,
  mode,
}) => {

  return (
    <div className="card">

      <h2>Drone Telemetry</h2>

      <h3>Battery: {battery.toFixed(0)}%</h3>

      <h3>
        Altitude:
        {" "}
        {altitude.toFixed(1)}
        m
      </h3>

      <h3>
        Speed:
        {" "}
        {speed.toFixed(1)}
        m/s
      </h3>

      <h3>Mode: {mode}</h3>

      <h3>
        GPS:
        {" "}
        {gps.lat.toFixed(5)},
        {" "}
        {gps.lng.toFixed(5)}
      </h3>

    </div>
  );
};

export default TelemetryPanel;