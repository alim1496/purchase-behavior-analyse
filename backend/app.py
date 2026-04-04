from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'processed')

def load_data():
    rfm = pd.read_csv(os.path.join(DATA_DIR, 'rfm_clustered.csv'))
    cluster_summary = pd.read_csv(os.path.join(DATA_DIR, 'cluster_summary.csv'))
    return rfm, cluster_summary


@app.route('/api/summary')
def summary():
    rfm, cluster_summary = load_data()
    return jsonify({
        'total_customers': len(rfm),
        'total_revenue': round(rfm['Monetary'].sum(), 2),
        'avg_order_frequency': round(rfm['Frequency'].mean(), 2),
        'avg_recency_days': round(rfm['Recency'].mean(), 1),
    })


@app.route('/api/segments')
def segments():
    rfm, cluster_summary = load_data()
    result = []
    for _, row in cluster_summary.iterrows():
        result.append({
            'cluster': int(row['Cluster']),
            'label': row['Label'],
            'size': int(row['Size']),
            'avg_recency': round(row['Recency'], 1),
            'avg_frequency': round(row['Frequency'], 1),
            'avg_monetary': round(row['Monetary'], 1),
        })
    return jsonify(result)


@app.route('/api/customers')
def customers():
    rfm, _ = load_data()
    return jsonify(rfm[['CustomerID', 'Recency', 'Frequency', 'Monetary', 'Cluster']].to_dict(orient='records'))


@app.route('/api/monthly-revenue')
def monthly_revenue():
    clean = pd.read_csv(os.path.join(DATA_DIR, 'online_retail_clean.csv'), parse_dates=['InvoiceDate'])
    monthly = (
        clean.set_index('InvoiceDate')
        .resample('ME')['Revenue']
        .sum()
        .reset_index()
    )
    monthly['InvoiceDate'] = monthly['InvoiceDate'].dt.strftime('%Y-%m')
    return jsonify(monthly.rename(columns={'InvoiceDate': 'month', 'Revenue': 'revenue'}).to_dict(orient='records'))


if __name__ == '__main__':
    app.run(debug=True, port=5000)
