import pandas as pd
import joblib
from pathlib import Path
import numpy as np
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent.parent  # backend/
MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "xgboost_cve_model.pkl"
FEATURES_PATH = MODEL_DIR / "feature_columns.pkl"
ENCODERS_PATH = MODEL_DIR / "label_encoders.pkl"

print(MODEL_PATH)

# Load model, expected feature list, and encoders
model = joblib.load(MODEL_PATH)
expected_features = joblib.load(FEATURES_PATH)
encoders = joblib.load(ENCODERS_PATH)


def preprocess_input(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # ---- 1. Parse date ----
    if "published_date" in df.columns:
        df["published_date"] = pd.to_datetime(df["published_date"], utc=False).dt.tz_localize(None)
        df["days_since_published"] = (datetime.now() - df["published_date"]).dt.days
        df.drop(columns=["published_date"], inplace=True, errors="ignore")
    else:
        df["days_since_published"] = 0

    # ---- 2. Ensure categorical columns exist ----
    for col in encoders.keys():
        if col not in df.columns:
            df[col] = "Unknown"
        df[col] = df[col].astype(str)

    # ---- 3. Apply label encoders safely ----
    for col, le in encoders.items():

        # Handle unseen categories
        df[col] = df[col].apply(lambda x: x if x in le.classes_ else "Unknown")

        # If Unknown does not exist in training classes, add it
        if "Unknown" not in le.classes_:
            le.classes_ = np.append(le.classes_, "Unknown")

        df[col] = le.transform(df[col])

    # ---- 4. Ensure numeric columns exist (set missing numeric values to 0) ----
    for col in expected_features:
        if col not in df.columns:
            df[col] = 0

    # Drop extra columns
    df = df[expected_features]

    return df


def run_prediction(df: pd.DataFrame):
    processed = preprocess_input(df)

    preds = model.predict(processed)
    probs = model.predict_proba(processed)[:, 1]

    return preds.tolist(), probs.tolist()
