# E-Commerce Customer Analytics Dashboard

A full-stack analytics dashboard that segments e-commerce customers using RFM analysis and K-Means clustering, built with Python and React.

## Overview

Raw transaction data is transformed into customer-level RFM metrics (Recency, Frequency, Monetary), then clustered using K-Means to identify distinct behavioral segments. Results are served via a Flask REST API and visualized in an interactive React dashboard.

## Project Structure

```
purchase-behavior-analyse/
├── data/
│   ├── raw/                        # Downloaded dataset
│   ├── processed/                  # Cleaned data, RFM tables, cluster results
│   └── download_data.py            # Downloads and samples the UCI dataset
├── notebooks/
│   ├── 01_eda_cleaning.ipynb       # Exploratory data analysis & cleaning
│   ├── 02_rfm_features.ipynb       # RFM feature engineering & normalization
│   └── 03_clustering.ipynb         # K-Means clustering & evaluation
├── backend/
│   └── app.py                      # Flask REST API
├── frontend/                       # React + Vite dashboard
├── requirements.txt                # Python dependencies
└── README.md
```

## Dataset

[UCI Online Retail Dataset](https://archive.ics.uci.edu/ml/datasets/online+retail) — real transactional data from a UK-based online retailer (2010–2011). A 5000-row sample is used for this project.

## Methodology

### 1. Data Cleaning
- Removed duplicates, null CustomerIDs, returns (negative quantities), and zero-price items
- Added a `Revenue` column (`Quantity × UnitPrice`)

### 2. RFM Feature Engineering
Per-customer metrics computed from transaction history:
- **Recency** — days since last purchase (lower = more recent)
- **Frequency** — number of distinct orders
- **Monetary** — total spend

### 3. Clustering
- Applied log transformation + StandardScaler to handle skewed distributions
- Used **Elbow method** and **Silhouette score** to determine optimal k
- Fitted **K-Means** and labeled each cluster based on RFM profile

### Cluster Results

| Segment | Customers | Avg Recency | Avg Frequency | Avg Spend |
|---|---|---|---|---|
| Champions | 587 | 46.2 days | 3.8 orders | £126.8 |
| Lost / Low Engagement | 1422 | 150.3 days | 1.2 orders | £21.3 |

## Tech Stack

| Layer | Technology |
|---|---|
| Data & ML | Python, pandas, scikit-learn |
| Visualization | matplotlib, seaborn, Recharts |
| Backend | Flask, Flask-CORS |
| Frontend | React, Vite |

## Setup & Run

### Prerequisites
- Python 3.8+
- Node.js 18+

### Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Download and prepare data
python data/download_data.py

# Run notebooks in order (in Jupyter)
jupyter notebook

# Start Flask API
python backend/app.py
```

API runs at `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard runs at `http://localhost:5173`

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/summary` | KPI totals (customers, revenue, frequency, recency) |
| `GET /api/segments` | Cluster profiles with RFM averages and labels |
| `GET /api/customers` | Full customer-level RFM + cluster assignment |
| `GET /api/monthly-revenue` | Revenue aggregated by month |
