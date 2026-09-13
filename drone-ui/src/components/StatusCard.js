import React from "react";

const StatusCard = ({ direction, confidence, status }) => {

  const getStatusColor = () => {
    if (status.includes("STOP")) return "red-glow";
    if (status.includes("FORWARD")) return "green-glow";
    if (status.includes("LEFT") || status.includes("RIGHT")) return "blue-glow";
    if (status.includes("LOW")) return "yellow-glow";
    return "";
  };

  return (
    <div className={`card ${getStatusColor()}`}>
      <h2>Direction: {direction}</h2>
      <h3>Confidence: {(confidence * 100).toFixed(2)}%</h3>
      <h2>Status: {status}</h2>
    </div>
  );
};

export default StatusCard;