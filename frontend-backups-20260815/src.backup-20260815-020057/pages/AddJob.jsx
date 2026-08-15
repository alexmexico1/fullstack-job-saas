import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

export default function AddJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    status: "Applied",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/jobs", formData);

      toast.success("Job added successfully");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Add New Job</h1>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label>Job Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Frontend Developer"
            />
          </div>

          <div style={styles.formGroup}>
            <label>Company</label>

            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Google"
            />
          </div>

          <div style={styles.formGroup}>
            <label>Location</label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={styles.input}
              placeholder="Chicago, IL"
            />
          </div>

          <div style={styles.formGroup}>
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Saving..." : "Add Job"}
          </button>
        </form>
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
    background: "#f4f6fb",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "600px",
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
  },

  title: {
    marginBottom: "25px",
    textAlign: "center",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "18px",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    marginTop: "6px",
    fontSize: "15px",
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
};