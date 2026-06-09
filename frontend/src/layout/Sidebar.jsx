import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Add Job", path: "/add-job" },
    { name: "Analytics", path: "/analytics" },
    { name: "Profile", path: "/profile" }
  ];

  return (
    <div style={styles.sidebar}>
      <div>
        <h2 style={styles.logo}>TaskFlow</h2>

        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.link,
              background:
                location.pathname === item.path
                  ? "#4f46e5"
                  : "transparent",
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div style={styles.bottom}>
        <p style={{ fontSize: 13 }}>
          Job Tracker SaaS
        </p>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    minHeight: "100vh",
    background: "#111827",
    color: "#fff",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logo: {
    marginBottom: "40px",
  },

  link: {
    display: "block",
    color: "#fff",
    textDecoration: "none",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "10px",
  },

  bottom: {
    opacity: 0.7,
  },
};