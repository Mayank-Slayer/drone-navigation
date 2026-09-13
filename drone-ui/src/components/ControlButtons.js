import React from "react";

const ControlButtons = ({
  mode,
  setMode,
  emergencyStop,
  setEmergencyStop,
  voiceEnabled,
  setVoiceEnabled,
  captureSnapshot,
  clearTarget,
}) => {
  return (
    <div className="card">
      <h3>🎮 Control Center</h3>

      <button onClick={() => setMode(mode === "AUTO" ? "MANUAL" : "AUTO")}>
        Mode: {mode}
      </button>

      <button onClick={() => setEmergencyStop(!emergencyStop)}>
        🚨 {emergencyStop ? "RESUME" : "EMERGENCY STOP"}
      </button>

      <button onClick={() => setVoiceEnabled(!voiceEnabled)}>
        🔊 Voice: {voiceEnabled ? "ON" : "OFF"}
      </button>

      <button onClick={captureSnapshot}>
        📸 Capture
      </button>

      <button onClick={clearTarget}>
        🎯 Clear Target
      </button>
    </div>
  );
};

export default ControlButtons;