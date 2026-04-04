import { useEffect, useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import './App.css'

const API = 'http://localhost:5000/api'
const COLORS = ['#2196f3', '#4caf50', '#ff9800', '#e91e63']

function KPICard({ title, value }) {
  return (
    <div className="kpi-card">
      <div className="kpi-value">{value}</div>
      <div className="kpi-title">{title}</div>
    </div>
  )
}

export default function App() {
  const [summary, setSummary] = useState(null)
  const [segments, setSegments] = useState([])
  const [monthlyRevenue, setMonthlyRevenue] = useState([])

  useEffect(() => {
    fetch(`${API}/summary`).then(r => r.json()).then(setSummary)
    fetch(`${API}/segments`).then(r => r.json()).then(setSegments)
    fetch(`${API}/monthly-revenue`).then(r => r.json()).then(setMonthlyRevenue)
  }, [])

  if (!summary) return <div className="loading">Loading...</div>

  return (
    <div className="dashboard">
      <h1>E-Commerce Customer Analytics</h1>

      <div className="kpi-row">
        <KPICard title="Total Customers" value={summary.total_customers.toLocaleString()} />
        <KPICard title="Total Revenue" value={`£${summary.total_revenue.toLocaleString()}`} />
        <KPICard title="Avg Order Frequency" value={`${summary.avg_order_frequency}x`} />
        <KPICard title="Avg Recency" value={`${summary.avg_recency_days} days`} />
      </div>

      <div className="charts-row">
        <div className="chart-box">
          <h2>Customer Segments</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={segments}
                dataKey="size"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
              >
                {segments.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v} customers`, 'Size']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h2>Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyRevenue}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`£${v.toFixed(2)}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#2196f3" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-box full-width">
        <h2>Segment RFM Comparison</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={segments} margin={{ left: 10 }}>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="avg_recency" name="Avg Recency (days)" fill="#e91e63" />
            <Bar dataKey="avg_frequency" name="Avg Frequency" fill="#4caf50" />
            <Bar dataKey="avg_monetary" name="Avg Monetary (£)" fill="#2196f3" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="table-box">
        <h2>Segment Details</h2>
        <table>
          <thead>
            <tr>
              <th>Segment</th>
              <th>Customers</th>
              <th>Avg Recency (days)</th>
              <th>Avg Frequency</th>
              <th>Avg Spend (£)</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((s, i) => (
              <tr key={i}>
                <td><span className="badge" style={{ background: COLORS[i % COLORS.length] }}>{s.label}</span></td>
                <td>{s.size}</td>
                <td>{s.avg_recency}</td>
                <td>{s.avg_frequency}</td>
                <td>{s.avg_monetary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
