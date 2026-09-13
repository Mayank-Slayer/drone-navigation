import React from "react";

const MissionPlanner = ({
  mission,
  setMission,
  setGpsMode,
}) => {

  const activateMission = (name) => {

    setGpsMode("AUTO");

    setMission(name);

  };

  return (

    <div className="card">

      <h2>✈ Mission Planner</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >

        <button
          onClick={() =>
            activateMission(
              "SEARCH AREA"
            )
          }
        >
          SEARCH AREA
        </button>

        <button
          onClick={() =>
            activateMission(
              "PATROL MODE"
            )
          }
        >
          PATROL MODE
        </button>

        <button
          onClick={() =>
            activateMission(
              "RETURN HOME"
            )
          }
        >
          RETURN HOME
        </button>

        <button
          onClick={() =>
            activateMission(
              "FOLLOW TARGET"
            )
          }
        >
          FOLLOW TARGET
        </button>

        <button
          onClick={() =>
            activateMission(
              "SCAN BUILDING"
            )
          }
        >
          SCAN BUILDING
        </button>

      </div>

      <h3
        style={{
          marginTop: "20px",
        }}
      >
        Active Mission: {mission}
      </h3>

    </div>
  );
};

export default MissionPlanner;