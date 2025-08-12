// frontend/src/api.js
import axios from "axios";
const API_BASE = "http://localhost:5000";

export async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await axios.post(`${API_BASE}/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000
  });
  return res.data;
}
