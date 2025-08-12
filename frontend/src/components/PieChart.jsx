// frontend/src/components/PieChart.jsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ distribution }) {
  const labels = ["Positivo","Neutro","Negativo"];
  const data = {
    labels,
    datasets: [
      {
        data: [distribution.positorio ?? distribution.positivo ?? 0, distribution.neutro ?? 0, distribution.negativo ?? 0],
        // Chart.js will pick colors automatically; no color forcing per instructions
      }
    ]
  };
  // ensure keys mapping correct
  const correctedData = {
    labels,
    datasets: [{ data: [distribution["positivo"]||0, distribution["neutro"]||0, distribution["negativo"]||0] }]
  };

  return (
    <div style={{maxWidth:400}}>
      <h4>Distribución de Sentimientos (%)</h4>
      <Pie data={correctedData} />
    </div>
  );
}
