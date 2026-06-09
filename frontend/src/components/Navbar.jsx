import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div style={styles.nav}>
      <h2>Job Tracker SaaS</h2>

      <button
        onClick={logout}
        style={styles.button}
      >
        Logout
      </button>
    </div>
  );
}

const styles = {
  nav: {
    height: "70px",
    background: "#111827",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
  },

  button: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};