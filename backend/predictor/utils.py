import pandas as pd

REQUIRED_COLUMNS = [
    "days_since_published",
    "epss_score",
    "epss_perc",
    "base_score",
    "exploitability_score",
    "impact_score",
    "attack_vector"
]


def parse_uploaded_file(file):
    """
    Takes an uploaded CSV or XLSX file and returns a validated DataFrame.
    Raises ValueError for invalid formats or column issues.
    """

    file_name = file.name.lower()

    try:
        # 1. Read file based on extension
        if file_name.endswith(".csv"):
            df = pd.read_csv(file)
        elif file_name.endswith(".xlsx"):
            df = pd.read_excel(file)
        else:
            raise ValueError("Invalid file type. Only CSV and XLSX supported.")

        # 2. Strip and clean column names
        df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

        # 3. Validate required columns
        missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]

        if missing:
            raise ValueError(
                f"Missing required columns: {', '.join(missing)}"
            )

        # 4. Convert numeric columns safely
        numeric_cols = [
            "days_since_published",
            "epss_score",
            "epss_perc",
            "base_score",
            "exploitability_score",
            "impact_score"
        ]

        for col in numeric_cols:
            df[col] = pd.to_numeric(df[col], errors="coerce")

        # 5. Drop rows with missing numeric values
        df = df.dropna(subset=numeric_cols)

        if df.empty:
            raise ValueError("Uploaded file has no valid rows after cleaning.")

        return df

    except Exception as e:
        raise ValueError(f"File parsing failed: {str(e)}")
