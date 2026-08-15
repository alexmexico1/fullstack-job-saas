import { useState } from "react";
import API from "../services/api";
import { setToken } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const { data } = await API.post(
        "/auth/login",
        form
      );

      setToken(data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed."
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            required
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.text}>
          No account?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
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
    background: "#f3f4f6",
    fontFamily: "system-ui, sans-serif",
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
    boxSizing: "border-box",
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
    fontWeight: "bold",
  },
  error: {
    color: "#b91c1c",
    background: "#fee2e2",
    padding: "10px",
    borderRadius: "6px",
  },
  text: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "14px",
  },
  link: {
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "500",
  },
};
