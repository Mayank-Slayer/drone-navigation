import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  predictImage,
  detectObjects,
} from "../utils/api";

import GPSMap from "./GPSMap";
import TelemetryPanel from "./TelemetryPanel";
import DroneControls from "./DroneControls";
import CameraFeed from "./CameraFeed";
import StatusCard from "./StatusCard";
import LogsPanel from "./LogsPanel";
import LiveChart from "./LiveChart";
import ConnectionStatus from "./ConnectionStatus";
import ManualControls from "./ManualControls";
import ControlButtons from "./ControlButtons";
import HandGestureControl from "./HandGestureControl";
import MiniMap from "./MiniMap";
import MissionPlanner from "./MissionPlanner";

const ControlPanel = () => {

  const webcamRef = useRef(null);

  const nextId = useRef(1);

  // ================= STATES =================

  const [mode, setMode] =
    useState("AUTO");

  const [voiceEnabled,
    setVoiceEnabled] =
    useState(true);

  const [emergencyStop,
    setEmergencyStop] =
    useState(false);

  const [lockedTarget,
    setLockedTarget] =
    useState(null);

  const [direction,
    setDirection] =
    useState("WAITING");

  const [confidence,
    setConfidence] =
    useState(0);

  const [status,
    setStatus] =
    useState("IDLE");

  const [logs, setLogs] =
    useState([]);

  const [confidenceHistory,
    setConfidenceHistory] =
    useState([]);

  // FIXED CAMERA SIZE

  const imageSize = {
    width: 640,
    height: 480,
  };

  const [trackedObjects,
    setTrackedObjects] =
    useState([]);

  // ================= GPS =================

  const [battery,
    setBattery] =
    useState(100);

  const [altitude,
    setAltitude] =
    useState(0);

  const [speed,
    setSpeed] =
    useState(0);

  const [gpsMode,
    setGpsMode] =
    useState("MANUAL");

  const [mission,
    setMission] =
    useState("IDLE");

  // HOME

  const homePosition = {
    lat: 28.5245,
    lng: 77.2066,
  };

  // DRONE

  const [dronePosition,
    setDronePosition] =
    useState({
      lat: 28.5245,
      lng: 77.2066,
    });

  // TARGET

  const [targetPosition,
    setTargetPosition] =
    useState({
      lat: 28.5249,
      lng: 77.2070,
    });

  // ================= MOVE DRONE =================

  const moveDrone = (dir) => {

    setDirection(dir);

    setDronePosition((prev) => {

      let lat = prev.lat;

      let lng = prev.lng;

      const step = 0.00003;

      if (dir === "FORWARD")
        lat += step;

      if (dir === "BACK")
        lat -= step;

      if (dir === "LEFT")
        lng -= step;

      if (dir === "RIGHT")
        lng += step;

      return {
        lat,
        lng,
      };

    });

  };

  // ================= KEYBOARD =================

  useEffect(() => {

    const handleKey = (e) => {

      if (
        e.key === "w" ||
        e.key === "W"
      ) {

        moveDrone("FORWARD");

        setStatus(
          "MANUAL FORWARD"
        );

      }

      if (
        e.key === "s" ||
        e.key === "S"
      ) {

        moveDrone("BACK");

        setStatus(
          "MANUAL BACK"
        );

      }

      if (
        e.key === "a" ||
        e.key === "A"
      ) {

        moveDrone("LEFT");

        setStatus(
          "MANUAL LEFT"
        );

      }

      if (
        e.key === "d" ||
        e.key === "D"
      ) {

        moveDrone("RIGHT");

        setStatus(
          "MANUAL RIGHT"
        );

      }

    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleKey
      );

    };

  }, []);

  // ================= MISSIONS =================

  useEffect(() => {

    if (
      mission ===
      "RETURN HOME"
    ) {

      setGpsMode("AUTO");

      setTargetPosition(
        homePosition
      );

    }

    if (
      mission ===
      "SEARCH AREA"
    ) {

      setGpsMode("AUTO");

      setTargetPosition({
        lat: 28.5252,
        lng: 77.2072,
      });

    }

    if (
      mission ===
      "PATROL MODE"
    ) {

      setGpsMode("AUTO");

      setTargetPosition({
        lat: 28.5242,
        lng: 77.2078,
      });

    }

    if (
      mission ===
      "SCAN BUILDING"
    ) {

      setGpsMode("AUTO");

      setTargetPosition({
        lat: 28.5249,
        lng: 77.2070,
      });

    }

  }, [mission]);

  // ================= AUTO GPS =================

  useEffect(() => {

    const interval =
      setInterval(() => {

        setBattery((prev) =>
          Math.max(
            prev - 0.02,
            0
          )
        );

        if (gpsMode === "AUTO") {

          setAltitude(2.5);

          setSpeed(1.2);

          setDronePosition(
            (prev) => {

              const latDiff =
                targetPosition.lat -
                prev.lat;

              const lngDiff =
                targetPosition.lng -
                prev.lng;

              const step =
                0.00002;

              return {

                lat:
                  prev.lat +
                  Math.sign(
                    latDiff
                  ) *
                    Math.min(
                      Math.abs(
                        latDiff
                      ),
                      step
                    ),

                lng:
                  prev.lng +
                  Math.sign(
                    lngDiff
                  ) *
                    Math.min(
                      Math.abs(
                        lngDiff
                      ),
                      step
                    ),

              };

            }
          );

        }

      }, 1000);

    return () =>
      clearInterval(
        interval
      );

  }, [
    gpsMode,
    targetPosition,
  ]);

  // ================= SNAPSHOT =================

  const captureSnapshot = () => {

    if (!webcamRef.current)
      return;

    const image =
      webcamRef.current.getScreenshot();

    if (!image) return;

    const link =
      document.createElement("a");

    link.href = image;

    link.download =
      `snapshot_${Date.now()}.jpg`;

    link.click();

  };

  // ================= TRACK =================

  const trackObjects = (
    detections
  ) => {

    const updated = [];

    detections.forEach((det) => {

      if (
        !det ||
        !det.box
      ) return;

      updated.push({

        id: nextId.current++,

        box: det.box,

        label: det.label,

        confidence:
          det.confidence,

      });

    });

    setTrackedObjects(updated);

  };

  // ================= AI LOOP =================

  useEffect(() => {

    let run = true;

    const loop = async () => {

      if (!run) return;

      await captureAndPredict();

      setTimeout(loop, 450);

    };

    loop();

    return () => {

      run = false;

    };

  }, []);

  // ================= TARGET LOCK =================

  const handleTargetLock =
    (id) => {

    setLockedTarget(id);

  };

  // ================= AI =================

  const captureAndPredict =
    async () => {

    if (!webcamRef.current)
      return;

    const imageSrc =
      webcamRef.current.getScreenshot();

    if (!imageSrc) return;

    try {

      const data =
        await predictImage(
          imageSrc
        );

      if (
        !data ||
        data.error
      ) {
        return;
      }

      const conf =
        data.confidence || 0;

      let detectData = null;

      try {

        detectData =
          await detectObjects(
            imageSrc
          );

      } catch {}

      const detectionsSafe =
        detectData?.detections || [];

      // ================= FILTER =================

      const fixedDetections =
        detectionsSafe
          .filter((det) => {

            if (
              !det ||
              !det.box
            ) return false;

            if (
              det.label !==
              "person"
            ) return false;

            const [
              x1,
              y1,
              x2,
              y2,
            ] = det.box;

            const w = x2 - x1;
            const h = y2 - y1;

            if (
              w < 100 ||
              h < 100
            ) {
              return false;
            }

            return true;

          })
          .map((det) => {

            let [
              x1,
              y1,
              x2,
              y2,
            ] = det.box;

            x1 = Math.max(0, x1);
            y1 = Math.max(0, y1);

            x2 = Math.min(
              640,
              x2
            );

            y2 = Math.min(
              480,
              y2
            );

            return {

              ...det,

              box: [
                x1,
                y1,
                x2,
                y2,
              ],

            };

          });

      trackObjects(
        fixedDetections
      );

      // ================= STATUS =================

      if (
        fixedDetections.length > 0
      ) {

        setStatus(
          "PERSON DETECTED"
        );

      } else {

        setStatus("IDLE");

      }

      // ================= DIRECTION =================

      if (
        data.direction
      ) {

        const dir =
          data.direction
            .toUpperCase();

        setDirection(dir);

      }

      setConfidence(conf);

      setConfidenceHistory(
        (prev) => [
          ...prev.slice(-10),
          conf * 100,
        ]
      );

      setLogs((prev) => [

        `${direction} (${(
          conf * 100
        ).toFixed(1)}%)`,

        ...prev.slice(0, 9),

      ]);

    } catch (e) {

      console.error(e);

      setStatus("ERROR");

    }

  };

  // ================= UI =================

  return (

    <div className="dashboard">

      <GPSMap
        dronePosition={
          dronePosition
        }
        targetPosition={
          targetPosition
        }
        setTargetPosition={
          setTargetPosition
        }
      />

      <TelemetryPanel
        battery={battery}
        altitude={altitude}
        speed={speed}
        gps={dronePosition}
        mode={gpsMode}
      />

      <DroneControls
        moveDrone={moveDrone}
        gpsMode={gpsMode}
        setGpsMode={setGpsMode}
      />

      <MiniMap
        detections={
          trackedObjects
        }
      />

      <MissionPlanner
        mission={mission}
        setMission={setMission}
        setGpsMode={setGpsMode}
      />

      <CameraFeed
        webcamRef={webcamRef}
        detections={
          trackedObjects
        }
        imageSize={imageSize}
        status={status}
        direction={direction}
        confidence={confidence}
        onTargetLock={
          handleTargetLock
        }
        lockedTarget={
          lockedTarget
        }
      />

      <StatusCard
        direction={direction}
        confidence={confidence}
        status={status}
      />

      <LiveChart
        dataPoints={
          confidenceHistory
        }
      />

      <LogsPanel
        logs={logs}
      />

      <ControlButtons
        mode={mode}
        setMode={setMode}
        emergencyStop={
          emergencyStop
        }
        setEmergencyStop={
          setEmergencyStop
        }
        voiceEnabled={
          voiceEnabled
        }
        setVoiceEnabled={
          setVoiceEnabled
        }
        captureSnapshot={
          captureSnapshot
        }
        clearTarget={() =>
          setLockedTarget(null)
        }
      />

      <ConnectionStatus />

      <ManualControls />

      <HandGestureControl
        moveDrone={moveDrone}
        setStatus={setStatus}
        setDirection={setDirection}
      />

    </div>

  );

};

export default ControlPanel;