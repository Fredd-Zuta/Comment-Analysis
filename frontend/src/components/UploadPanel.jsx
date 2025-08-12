// frontend/src/components/UploadPanel.jsx
import React, { useState } from "react";
import { uploadFile } from "../api";

export default function UploadPanel({ onResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Selecciona un archivo .csv o .xlsx");
    setError(null);
    setLoading(true);
    try {
      const data = await uploadFile(file);
      onResult(data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv,.xlsx,.xls" onChange={(e)=>setFile(e.target.files[0])} />
        <button type="submit" disabled={loading}>{loading ? "Procesando..." : "Procesar"}</button>
      </form>
      {error && <div style={{color:"red"}}>{error}</div>}
    </div>
  );
}
