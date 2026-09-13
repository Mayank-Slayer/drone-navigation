import React from "react";

const LogsPanel = ({ logs }) => {
  return (
    <div className="card">
      <h3>System Logs</h3>
      <ul>
        {logs.map((log, i) => (
          <li key={i}>⚡ {log}</li>
        ))}
      </ul>
    </div>
  );
};

export default LogsPanel;