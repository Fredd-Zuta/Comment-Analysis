// frontend/src/components/BarChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ ratingFreq }) {
  const labels = ["1","2","3","4","5"];
  const data = {
    labels,
    datasets: [{
      label: "Frecuencia de calificaciones",
      data: labels.map(l => ratingFreq[parseInt(l)] || 0),
    }]
  };
  return (
    <div style={{maxWidth:600}}>
      <h4>Frecuencia de calificaciones (1-5)</h4>
      <Bar data={data} />
    </div>
  );
}
