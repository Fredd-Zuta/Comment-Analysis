// frontend/src/App.jsx
import React, { useState } from "react";
import UploadPanel from "./components/UploadPanel";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import TopCommentsTable from "./components/TopCommentsTable";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div style={{padding:20, fontFamily:"Arial"}}>
      <h2>Sentiment Dashboard</h2>
      <p>Sube tu hoja de cálculo con columnas: id, nombre_usuario, comentario, calificación.</p>
      <UploadPanel onResult={setResult} />
      {result && (
        <div style={{marginTop:20}}>
          <div style={{display:"flex", gap:20}}>
            <PieChart distribution={result.distribution_pct} />
            <BarChart ratingFreq={result.rating_freq} />
          </div>
          <div style={{marginTop:20}}>
            <TopCommentsTable top_positive={result.top_positive} top_negative={result.top_negative} />
          </div>
          <div style={{marginTop:10}}>
            <small>Total comentarios procesados: {result.total_comments}</small>
          </div>
        </div>
      )}
    </div>
  );
}
