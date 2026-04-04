"""
Downloads the UCI Online Retail dataset and saves a small sample (5000 rows)
to data/raw/online_retail_sample.csv
"""

import urllib.request
import os
import pandas as pd

RAW_DIR = os.path.join(os.path.dirname(__file__), "raw")
OUTPUT_FILE = os.path.join(RAW_DIR, "online_retail_sample.csv")
EXCEL_FILE = os.path.join(RAW_DIR, "online_retail.xlsx")

URL = "https://archive.ics.uci.edu/ml/machine-learning-databases/00352/Online%20Retail.xlsx"

def download():
    if not os.path.exists(EXCEL_FILE):
        print("Downloading dataset (~23MB)...")
        urllib.request.urlretrieve(URL, EXCEL_FILE)
        print("Download complete.")
    else:
        print("Excel file already exists, skipping download.")

    print("Reading and sampling data...")
    df = pd.read_excel(EXCEL_FILE, engine="openpyxl")

    # Basic cleaning
    df = df.dropna(subset=["CustomerID", "Description"])
    df = df[df["Quantity"] > 0]
    df = df[df["UnitPrice"] > 0]

    # Small scale: take 5000 rows
    sample = df.sample(n=5000, random_state=42).reset_index(drop=True)

    sample.to_csv(OUTPUT_FILE, index=False)
    print(f"Saved {len(sample)} rows to {OUTPUT_FILE}")
    print(sample.head())

if __name__ == "__main__":
    download()
