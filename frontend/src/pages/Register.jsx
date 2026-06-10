import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            style={styles.input} // FIX: Added missing input styles
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Email"
            style={styles.input} // FIX: Added missing input styles
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input} // FIX: Added missing input styles
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button style={styles.button}>Register</button>
        </form>

        <p style={styles.text}>
          Already have account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
    fontFamily: "system-ui, sans-serif"
  },
  card: {
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    width: "300px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ddd",
    boxSizing: "border-box"
  },
  button: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  text: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "14px"
  },
  link: {
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "500"
  }
};