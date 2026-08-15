import { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import API from "../services/api";
import toast from "react-hot-toast";
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

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

export default function Analytics() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/jobs")
      .then((res) => setJobs(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error("Unable to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  const pieData = ["Applied", "Interview", "Offer", "Rejected"].map((name) => ({
    name,
    value: jobs.filter((job) => job.status === name).length,
  }));

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return {
      month: date.toLocaleString("en-US", { month: "short" }),
      jobs: jobs.filter((job) => {
        const created = new Date(job.createdAt);
        return (
          created.getMonth() === date.getMonth() &&
          created.getFullYear() === date.getFullYear()
        );
      }).length,
    };
  });

  const total = jobs.length;
  const interviews = jobs.filter((j) => j.status === "Interview").length;
  const offers = jobs.filter((j) => j.status === "Offer").length;
  const responseRate =
    total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0;

  return (
    <div style={styles.wrapper}>
      <Sidebar />

      <div style={styles.main}>
        <Navbar />

        <h1 style={styles.pageTitle}>Analytics Dashboard</h1>

        {loading ? (
          <div style={styles.card}>
            <h3>Loading analytics...</h3>
          </div>
        ) : (
          <>
            <div style={styles.card}>
              <h3 style={styles.chartTitle}>Application Growth</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={months} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#6b7280" }} />
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

            <div style={styles.grid}>
              <div style={styles.card}>
                <h3 style={styles.chartTitle}>Status Distribution</h3>

                {total === 0 ? (
                  <div style={styles.empty}>No applications yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div style={styles.card}>
                <h3 style={styles.chartTitle}>Insights</h3>

                <div style={styles.insightsList}>
                  <p style={styles.insightItem}>
                    Total applications: <strong>{total}</strong>
                  </p>
                  <p style={styles.insightItem}>
                    Interviews: <strong>{interviews}</strong>
                  </p>
                  <p style={styles.insightItem}>
                    Offers: <strong>{offers}</strong>
                  </p>
                  <p style={styles.insightItem}>
                    Response rate: <strong>{responseRate}%</strong>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

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
  },
  empty: {
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
  },
};
