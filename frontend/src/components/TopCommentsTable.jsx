// frontend/src/components/TopCommentsTable.jsx
import React from "react";

function Table({ title, rows }) {
  return (
    <div>
      <h4>{title}</h4>
      <table border="1" cellPadding="6">
        <thead>
          <tr><th>ID</th><th>Usuario</th><th>Comentario</th><th>Calificación</th><th>Pred Star</th><th>Score</th></tr>
        </thead>
        <tbody>
          {rows.map((r, idx)=>(
            <tr key={idx}>
              <td>{r.id}</td>
              <td>{r.nombre_usuario}</td>
              <td style={{maxWidth:400, whiteSpace:"normal"}}>{r.comentario}</td>
              <td>{r["calificación"]}</td>
              <td>{r.pred_star}</td>
              <td>{Number(r.pred_score).toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TopCommentsTable({ top_positive, top_negative }) {
  return (
    <div>
      <Table title="Top 5 positivos" rows={top_positive} />
      <Table title="Top 5 negativos" rows={top_negative} />
    </div>
  );
}
