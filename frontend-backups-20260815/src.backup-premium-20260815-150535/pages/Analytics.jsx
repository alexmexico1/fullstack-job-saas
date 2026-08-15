import React from "react";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Static data for the Application Growth Line Chart
const lineData = [
  { month: "Jan", jobs: 4 },
  { month: "Feb", jobs: 7 },
  { month: "Mar", jobs: 12 },
  { month: "Apr", jobs: 15 },
  { month: "May", jobs: 22 },
  { month: "Jun", jobs: 28 },
];

// Static data for the Status Distribution Pie Chart
const pieData = [
  { name: "Applied", value: 18 },
  { name: "Interview", value: 8 },
  { name: "Offer", value: 3 },
  { name: "Rejected", value: 5 },
];

// Color palette matching your status badges
const COLORS = [
  "#3b82f6", // Applied (Blue)
  "#f59e0b", // Interview (Orange)
  "#10b981", // Offer (Green)
  "#ef4444", // Rejected (Red)
];

export default function Analytics() {
  return (
    <div style={styles.wrapper}>
      <Sidebar />

      <div style={styles.main}>
        <Navbar />

        <h1 style={styles.pageTitle}>Analytics Dashboard</h1>

        {/* LINE CHART CARD */}
        <div style={styles.card}>
          <h3 style={styles.chartTitle}>Application Growth</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
              <YAxis tick={{ fill: "#6b7280" }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="jobs"
                stroke="#4f46e5"
                strokeWidth={4}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* LOWER GRID FOR PIE CHART & INSIGHTS */}
        <div style={styles.grid}>
          {/* PIE CHART */}
          <div style={styles.card}>
            <h3 style={styles.chartTitle}>Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* INSIGHTS PANEL */}
          <div style={styles.card}>
            <h3 style={styles.chartTitle}>Insights</h3>
            <div style={styles.insightsList}>
              <p style={styles.insightItem}>📈 Applications growing steadily</p>
              <p style={styles.insightItem}>🎤 Interview rate improving</p>
              <p style={styles.insightItem}>💰 Offers increasing</p>
              <p style={styles.insightItem}>🚀 Strong hiring momentum</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* STYLES OBJECT */
const styles = {
  wrapper: {
    display: "flex",
  },
  main: {
    flex: 1,
    padding: "25px",
    background: "#f4f6fb",
    minHeight: "100vh",
  },
  pageTitle: {
    marginBottom: "20px",
    color: "#1f2937",
  },
  chartTitle: {
    marginBottom: "15px",
    color: "#374151",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 2px 10px rgba(0,0,0,.05)",
  },
  insightsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "10px",
  },
  insightItem: {
    margin: 0,
    fontSize: "16px",
    color: "#4b5563",
  }
};