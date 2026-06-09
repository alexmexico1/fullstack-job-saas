import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { logout } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img
          src="https://i.pravatar.cc/150"
          alt=""
          style={styles.avatar}
        />

        <h2>Alex Obi</h2>

        <p>Software Engineer</p>

        <p>alex@email.com</p>

        <button
          onClick={logout}
          style={styles.button}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8fafc",
  },

  card: {
    width: "400px",
    background: "#fff",
    padding: "40px",
    textAlign: "center",
    borderRadius: "20px",
    boxShadow: "0 5px 20px rgba(0,0,0,.08)",
  },

  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    marginBottom: "20px",
  },

  button: {
    marginTop: "20px",
    padding: "12px 20px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
  },
};