# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sentiment_processor import classify_comments, compute_metrics
import io

app = Flask(__name__)
CORS(app)

EXPECTED_COLS = {"id","nombre_usuario","comentario","calificación"}

@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error":"No file part"}), 400
    f = request.files["file"]
    filename = f.filename.lower()
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(f)
        elif filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(f)
        else:
            return jsonify({"error":"Formato no soportado. Usa .csv o .xlsx"}), 400
    except Exception as e:
        return jsonify({"error": f"Error leyendo archivo: {str(e)}"}), 400

    # Validar columnas
    cols = set([c.strip() for c in df.columns])
    if not EXPECTED_COLS.issubset(cols):
        return jsonify({"error": f"Columnas incorrectas. Se esperan: {sorted(list(EXPECTED_COLS))}. Columnas detectadas: {sorted(list(cols))}"}), 400

    # Normalizar nombres columnas por seguridad
    df = df.rename(columns={c:c.strip() for c in df.columns})
    # Procesar
    df_processed = classify_comments(df, comment_col="comentario", batch_size=32)
    metrics = compute_metrics(df_processed)
    # Opcional: devolver algunos samples si quieres
    return jsonify(metrics)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
