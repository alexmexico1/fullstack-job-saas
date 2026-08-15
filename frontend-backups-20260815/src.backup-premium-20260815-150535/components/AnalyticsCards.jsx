import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsCards({
  jobs,
}) {
  const applied = jobs.filter(
    (job) => job.status === "Applied"
  ).length;

  const interview = jobs.filter(
    (job) => job.status === "Interview"
  ).length;

  const offer = jobs.filter(
    (job) => job.status === "Offer"
  ).length;

  const rejected = jobs.filter(
    (job) => job.status === "Rejected"
  ).length;

  return (
    <div style={styles.grid}>
      <div style={styles.card}>
        <h2>{applied}</h2>
        <p>Applied</p>
      </div>

      <div style={styles.card}>
        <h2>{interview}</h2>
        <p>Interview</p>
      </div>

      <div style={styles.card}>
        <h2>{offer}</h2>
        <p>Offers</p>
      </div>

      <div style={styles.card}>
        <h2>{rejected}</h2>
        <p>Rejected</p>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(200px,1fr))",
    gap: "20px",
    marginBottom: "25px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)",
  },
};