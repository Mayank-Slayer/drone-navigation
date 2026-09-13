import React from "react";

import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const LiveChart = ({ dataPoints }) => {
  const data = {
    labels: dataPoints.map((_, i) => i + 1),

    datasets: [
      {
        label: "Confidence %",
        data: dataPoints,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#22c55e",
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },

      y: {
        ticks: {
          color: "white",
        },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="card">
      <h2>Live Confidence Graph</h2>

      <Line data={data} options={options} />
    </div>
  );
};

export default LiveChart;