# backend/sentiment_processor.py
from transformers import pipeline
import pandas as pd
import numpy as np

# Inicializa pipeline global (cargar una vez)
_sentiment_pipeline = None

def get_pipeline():
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        # Modelo multilingüe que predice 1-5 estrellas
        _sentiment_pipeline = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")
    return _sentiment_pipeline

def classify_comments(df, comment_col="comentario", batch_size=32):
    """
    Input: DataFrame con columna de comentario
    Output: DataFrame con columnas añadidas:
      - star (1..5)
      - sentiment_label (positivo/neutro/negativo)
      - sentiment_score (probabilidad estimada asociada a la etiqueta)
    """
    pipe = get_pipeline()

    comments = df[comment_col].fillna("").astype(str).tolist()
    results = []
    for i in range(0, len(comments), batch_size):
        batch = comments[i:i+batch_size]
        out = pipe(batch)  # devuelve lista de dicts {'label': '1 star', 'score': 0.75} etc
        results.extend(out)

    # parse results
    stars = []
    scores = []
    for r in results:
        # label ejemplo: "5 stars" o "1 star"
        label = r["label"].split()[0]
        star = int(label)
        stars.append(star)
        scores.append(float(r["score"]))

    df = df.copy()
    df["pred_star"] = stars
    df["pred_score"] = scores

    # Mapear a sentimiento categórico
    def map_sentiment(s):
        if s >= 4:
            return "positivo"
        elif s == 3:
            return "neutro"
        else:
            return "negativo"

    df["sentiment"] = df["pred_star"].apply(map_sentiment)
    return df

def compute_metrics(df):
    """
    Devuelve un dict con:
      - distribution: {positivo, neutro, negativo} porcentajes
      - top_pos: top 5 comentarios positivos (por pred_score y pred_star)
      - top_neg: top 5 negativos
      - rating_freq: counts para 1..5 en la columna 'calificación' (original)
    """
    total = len(df)
    dist = df["sentiment"].value_counts(normalize=True).to_dict()
    # asegurar llaves
    for k in ["positivo","neutro","negativo"]:
        dist.setdefault(k, 0.0)
    dist_pct = {k: round(v*100, 2) for k,v in dist.items()}

    # Top comentarios por pred_score y pred_star
    # Para positivos: ordenar por pred_star desc, luego pred_score desc
    pos_df = df[df["sentiment"]=="positivo"].sort_values(["pred_star", "pred_score"], ascending=[False, False])
    neg_df = df[df["sentiment"]=="negativo"].sort_values(["pred_star", "pred_score"], ascending=[True, True])

    top_pos = pos_df.head(5)[["id","nombre_usuario","comentario","calificación","pred_star","pred_score"]].to_dict(orient="records")
    top_neg = neg_df.head(5)[["id","nombre_usuario","comentario","calificación","pred_star","pred_score"]].to_dict(orient="records")

    # Frecuencia de calificaciones originales (1..5)
    if "calificación" in df.columns:
        rating_counts = df["calificación"].fillna(0).astype(int).value_counts().to_dict()
    else:
        rating_counts = {}

    # garantizar 1..5
    rating_freq = {i: int(rating_counts.get(i,0)) for i in range(1,6)}

    return {
        "distribution_pct": dist_pct,
        "top_positive": top_pos,
        "top_negative": top_neg,
        "rating_freq": rating_freq,
        "total_comments": total
    }
