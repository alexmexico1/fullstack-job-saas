import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await API.post("/auth/register", form);

      console.log("Registration successful:", response.data);

      setSuccess("Registration successful. You can now log in.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Registration failed:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Registration failed.";

      setError(message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Register</h2>

        {error && <p style={styles.error}>{error}</p>}

        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            style={styles.input}
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            required
          />

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
            minLength={6}
          />

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p style={styles.text}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
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
  success: {
    color: "#166534",
    background: "#dcfce7",
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
