import React, { useEffect, useState } from "react";

const ConnectionStatus = () => {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/docs");
        setStatus(res.ok ? "ONLINE" : "OFFLINE");
      } catch {
        setStatus("OFFLINE");
      }
    };

    check();
    const interval = setInterval(check, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <h3>Backend</h3>
      <h2>{status}</h2>
    </div>
  );
};

export default ConnectionStatus;