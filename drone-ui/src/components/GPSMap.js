import React from "react";

import L from "leaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";

// ================= DRONE ICON =================

const droneIcon = new L.DivIcon({

  html: `
    <div style="
      font-size:32px;
      filter: drop-shadow(0 0 8px cyan);
    ">
      🚁
    </div>
  `,

  className: "",

  iconSize: [40, 40],

  iconAnchor: [20, 20],
});

// ================= TARGET ICON =================

const targetIcon = new L.DivIcon({

  html: `
    <div style="
      font-size:28px;
      filter: drop-shadow(0 0 10px red);
      animation: pulse 1s infinite;
    ">
      🎯
    </div>
  `,

  className: "",

  iconSize: [40, 40],

  iconAnchor: [20, 20],
});

// ================= CLICK HANDLER =================

const ClickHandler = ({
  setTarget,
}) => {

  useMapEvents({

    click(e) {

      setTarget({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });

    },

  });

  return null;
};

// ================= MAP FOLLOW =================

const MapUpdater = ({
  dronePosition,
}) => {

  const map = useMap();

  map.setView(
    [
      dronePosition.lat,
      dronePosition.lng,
    ],
    map.getZoom(),
    {
      animate: true,
    }
  );

  return null;
};

// ================= MAIN COMPONENT =================

const GPSMap = ({
  dronePosition,
  targetPosition,
  setTargetPosition,
}) => {

  const path = [

    [
      dronePosition.lat,
      dronePosition.lng,
    ],

    [
      targetPosition.lat,
      targetPosition.lng,
    ],

  ];

  return (

    <div className="card">

      <h2>🛰 GPS Navigation</h2>

      <MapContainer

        center={[
          dronePosition.lat,
          dronePosition.lng,
        ]}

        zoom={18}

        scrollWheelZoom={true}

        style={{
          height: "320px",
          width: "100%",
          borderRadius: "16px",
        }}
      >

        {/* FOLLOW DRONE */}
        <MapUpdater
          dronePosition={
            dronePosition
          }
        />

        {/* MAP */}
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* CLICK TO MOVE */}
        <ClickHandler
          setTarget={
            setTargetPosition
          }
        />

        {/* DRONE */}
        <Marker
          position={[
            dronePosition.lat,
            dronePosition.lng,
          ]}
          icon={droneIcon}
        >
          <Popup>
            🚁 Drone Current Position
          </Popup>
        </Marker>

        {/* TARGET */}
        <Marker
          position={[
            targetPosition.lat,
            targetPosition.lng,
          ]}
          icon={targetIcon}
        >
          <Popup>
            🎯 Target Destination
          </Popup>
        </Marker>

        {/* PATH */}
        <Polyline

          positions={path}

          pathOptions={{
            color: "cyan",
            weight: 4,
            dashArray: "10",
          }}
        />

      </MapContainer>

      <div
        style={{
          marginTop: "10px",
          fontSize: "14px",
          color: "#93c5fd",
        }}
      >
        Click anywhere on map to set target.
      </div>

    </div>
  );
};

export default GPSMap;