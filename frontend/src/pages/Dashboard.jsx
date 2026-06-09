import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import API from "../services/api";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");

  // STATE CONFIGURATIONS
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [showMenu, setShowMenu] = useState(false); 

  // MODAL TOGGLE STATES
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // FORM INPUT TRACKING STATES
  const [newJobData, setNewJobData] = useState({ company: "", title: "", status: "Applied" });
  const [editJobData, setEditJobData] = useState({ company: "", title: "", status: "Applied" });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(
      (job) =>
        job.company?.toLowerCase().includes(search.toLowerCase()) ||
        job.title?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [search, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs");
      setJobs(res.data);
      setFilteredJobs(res.data);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  const handleSaveNewJob = () => {
    if (!newJobData.company || !newJobData.title) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const temporaryJob = { _id: Date.now().toString(), ...newJobData };
    setJobs([temporaryJob, ...jobs]);
    toast.success("Job successfully saved 🎉");
    
    setNewJobData({ company: "", title: "", status: "Applied" });
    setShowAddModal(false);
  };

  const handleUpdateJob = () => {
    if (!editJobData.company || !editJobData.title) {
      toast.error("Fields cannot be empty");
      return;
    }

    const updatedJobsList = jobs.map((j) => 
      j._id === editingJob._id ? { ...j, ...editJobData } : j
    );
    
    setJobs(updatedJobsList);
    toast.success("Job successfully saved 🎉");
    setEditingJob(null);
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await API.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      fetchJobs();
    } catch {
      setJobs(jobs.filter(j => j._id !== id));
      toast.success("Removed locally");
    }
  };

  const stats = {
    applied: jobs.filter((j) => j.status === "Applied").length,
    interview: jobs.filter((j) => j.status === "Interview").length,
    offer: jobs.filter((j) => j.status === "Offer").length,
    rejected: jobs.filter((j) => j.status === "Rejected").length,
  };

  return (
    <div style={styles.wrapper}>
      <Sidebar />

      <div
        style={{
          ...styles.main,
          background: darkMode ? "#0f172a" : "linear-gradient(120deg, #f4f6fb, #eef2ff)",
          color: darkMode ? "#fff" : "#000",
        }}
      >
        <Navbar />

        {/* HERO SECTION */}
        <div style={styles.hero}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div>
              <h1>Welcome back, {user?.name || "User"}!</h1>
              <p>Track applications, interviews and offers in one place.</p>
            </div>
            
            {/* UTILITY CONTROL ROW */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background: darkMode ? "#fff" : "#111",
                  color: darkMode ? "#000" : "#fff",
                  fontWeight: "bold"
                }}
              >
                {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
              </button>

              {/* ACCOUNT DROPDOWN BAR LAYOUT */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    background: "#4f46e5",
                    color: "#fff",
                    fontWeight: "bold"
                  }}
                >
                  👤 {user?.name || "Account"}
                </button>

                {showMenu && (
                  <div style={{ 
                    ...styles.dropdown, 
                    background: darkMode ? "#1e293b" : "#fff", 
                    color: darkMode ? "#fff" : "#000",
                    border: darkMode ? "1px solid #334155" : "none"
                  }}>
                    <p style={{ margin: "4px 0", cursor: "pointer" }}>My Profile</p>
                    <p style={{ margin: "4px 0", cursor: "pointer" }}>Settings</p>
                    <hr style={{ borderColor: darkMode ? "#334155" : "#eee" }} />
                    <p
                      style={{ color: "red", cursor: "pointer", margin: "4px 0" }}
                      onClick={() => {
                        logout();
                        setShowMenu(false);
                        toast.success("Logged out successfully");
                      }}
                    >
                      Logout
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              marginTop: "15px",
              padding: "10px 15px",
              border: "none",
              borderRadius: "10px",
              background: "#fff",
              color: "#4f46e5",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            + Add Job
          </button>
        </div>

        {/* SKELETON DISPLAY SWITCH */}
        {loading ? (
          <div 
            style={{
              ...styles.skeletonGrid,
              gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "repeat(4, 1fr)",
              marginBottom: "25px"
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ ...styles.skeletonCard, background: darkMode ? "linear-gradient(90deg, #1e293b, #334155, #1e293b)" : "linear-gradient(90deg, #eee, #f5f5f5, #eee)" }}></div>
            ))}
          </div>
        ) : (
          /* STATS OVERVIEW CARDS */
          <div 
            style={{
              ...styles.statsGrid,
              gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "repeat(4, 1fr)"
            }}
          >
            <Card title="Applications" value={stats.applied} darkMode={darkMode} />
            <Card title="Interviews" value={stats.interview} darkMode={darkMode} />
            <Card title="Offers" value={stats.offer} darkMode={darkMode} />
            <Card title="Rejected" value={stats.rejected} darkMode={darkMode} />
          </div>
        )}

        {/* DATA CONTAINER GRID */}
        <div style={{ ...styles.tableContainer, background: darkMode ? "#1e293b" : "#fff", border: darkMode ? "1px solid #334155" : "none" }}>
          <div style={styles.header}>
            <h2 style={{ color: darkMode ? "#fff" : "inherit" }}>Recent Applications</h2>

            <input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...styles.search, background: darkMode ? "#0f172a" : "#fff", color: darkMode ? "#fff" : "#000", borderColor: darkMode ? "#475569" : "#ddd" }}
            />
          </div>

          <table style={styles.table}>
            <thead>
              <tr style={{ color: darkMode ? "#94a3b8" : "inherit" }}>
                <th>Company</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "40px", color: darkMode ? "#94a3b8" : "#64748b", fontWeight: "500" }}>
                    🚀 No jobs found. Start by adding your first job.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job._id} style={{ ...styles.row, background: darkMode ? "#334155" : "#fff" }}>
                    <td style={{ color: darkMode ? "#fff" : "inherit", padding: "12px" }}>{job.company}</td>
                    <td style={{ color: darkMode ? "#fff" : "inherit" }}>{job.title}</td>

                    <td>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: "20px",
                          color: "#fff",
                          fontSize: "12px",
                          background:
                            job.status === "Applied"
                              ? "#3b82f6"
                              : job.status === "Interview"
                              ? "#f59e0b"
                              : job.status === "Offer"
                              ? "#10b981"
                              : "#ef4444",
                        }}
                      >
                        {job.status}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() => {
                          setEditingJob(job);
                          setEditJobData({ company: job.company, title: job.title, status: job.status });
                        }}
                        style={{
                          marginRight: "10px",
                          background: "#f59e0b",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          color: "#fff",
                        }}
                      >
                        Edit
                      </button>
                      {" | "}
                      <button
                        onClick={() => deleteJob(job._id)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Lower Dashboard Widget Panels */}
        <div style={styles.bottomGrid}>
          <div style={{ ...styles.activityCard, background: darkMode ? "#1e293b" : "#fff", border: darkMode ? "1px solid #334155" : "none" }}>
            <h3>Recent Activity</h3>
            <p>✅ New application submitted</p>
            <p>🎤 Interview scheduled</p>
            <p>🎉 Offer received</p>
            <p>👤 Profile updated</p>
          </div>

          <div style={{ ...styles.activityCard, background: darkMode ? "#1e293b" : "#fff", border: darkMode ? "1px solid #334155" : "none" }}>
            <h3>Quick Actions</h3>
            <button 
              onClick={() => setShowAddModal(true)} 
              style={{ ...styles.actionBtn, width: "100%", border: "none", cursor: "pointer" }}
            >
              + Add Job
            </button>
            <Link to="/analytics" style={styles.actionBtn}>
              Analytics
            </Link>
            <Link to="/profile" style={styles.actionBtn}>
              Profile
            </Link>
          </div>
        </div>

        {/* ADD JOB MODAL */}
        {showAddModal && (
          <div style={styles.modalOverlay}>
            <div style={{ ...styles.modal, background: darkMode ? "#1e293b" : "#fff" }}>
              <h2>Add Job</h2>

              <input 
                placeholder="Company" 
                style={{ ...styles.input, background: darkMode ? "#334155" : "#fff", color: darkMode ? "#fff" : "#000", borderColor: darkMode ? "#475569" : "#ddd" }} 
                value={newJobData.company}
                onChange={(e) => setNewJobData({ ...newJobData, company: e.target.value })}
              />
              <input 
                placeholder="Job Title" 
                style={{ ...styles.input, background: darkMode ? "#334155" : "#fff", color: darkMode ? "#fff" : "#000", borderColor: darkMode ? "#475569" : "#ddd" }} 
                value={newJobData.title}
                onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
              />

              <select 
                style={{ ...styles.input, background: darkMode ? "#334155" : "#fff", color: darkMode ? "#fff" : "#000", borderColor: darkMode ? "#475569" : "#ddd" }}
                value={newJobData.status}
                onChange={(e) => setNewJobData({ ...newJobData, status: e.target.value })}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button style={styles.saveBtn} onClick={handleSaveNewJob}>
                Save
              </button>

              <button style={styles.cancelBtn} onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* EDIT JOB MODAL */}
        {editingJob && (
          <div style={styles.modalOverlay}>
            <div style={{ ...styles.modal, background: darkMode ? "#1e293b" : "#fff" }}>
              <h2>Edit Job</h2>

              <input
                value={editJobData.company}
                style={{ ...styles.input, background: darkMode ? "#334155" : "#fff", color: darkMode ? "#fff" : "#000", borderColor: darkMode ? "#475569" : "#ddd" }}
                onChange={(e) => setEditJobData({ ...editJobData, company: e.target.value })}
              />

              <input
                value={editJobData.title}
                style={{ ...styles.input, background: darkMode ? "#334155" : "#fff", color: darkMode ? "#fff" : "#000", borderColor: darkMode ? "#475569" : "#ddd" }}
                onChange={(e) => setEditJobData({ ...editJobData, title: e.target.value })}
              />

              <select
                value={editJobData.status}
                style={{ ...styles.input, background: darkMode ? "#334155" : "#fff", color: darkMode ? "#fff" : "#000", borderColor: darkMode ? "#475569" : "#ddd" }}
                onChange={(e) => setEditJobData({ ...editJobData, status: e.target.value })}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button style={styles.saveBtn} onClick={handleUpdateJob}>
                Update
              </button>

              <button style={styles.cancelBtn} onClick={() => setEditingJob(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function Card({ title, value, darkMode }) {
  return (
    <div
      style={{
        ...styles.kpiCard,
        background: darkMode ? "linear-gradient(135deg, #1e293b, #334155)" : "linear-gradient(135deg, #ffffff, #f9fafb)",
        borderColor: darkMode ? "#475569" : "#eee"
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
    >
      <h2 style={{ color: darkMode ? "#fff" : "inherit" }}>{value}</h2>
      <p style={{ color: darkMode ? "#94a3b8" : "inherit" }}>{title}</p>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex" },
  main: {
    flex: 1,
    padding: "25px",
    minHeight: "100vh",
    transition: "background 0.3s ease, color 0.3s ease"
  },
  hero: {
    background: "linear-gradient(135deg,#4f46e5,#2563eb)",
    color: "#fff",
    padding: "30px",
    borderRadius: "18px",
    marginBottom: "25px",
  },
  statsGrid: {
    display: "grid",
    gap: "15px",
    marginBottom: "25px",
  },
  skeletonGrid: {
    display: "grid",
    gap: "15px",
  },
  skeletonCard: {
    height: "120px", 
    borderRadius: "14px",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },
  kpiCard: {
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.06)",
    transition: "0.3s",
    border: "1px solid",
    minHeight: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  tableContainer: {
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,.05)",
  },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  search: { padding: "10px", width: "250px", borderRadius: "8px", border: "1px solid" },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" },
  row: { boxShadow: "0 5px 15px rgba(0,0,0,0.05)", borderRadius: "12px" },
  deleteBtn: { border: "none", background: "transparent", color: "red", cursor: "pointer" },
  bottomGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" },
  activityCard: { 
    padding: "20px", 
    borderRadius: "16px", 
    boxShadow: "0 2px 10px rgba(0,0,0,.05)",
    minHeight: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  actionBtn: {
    display: "block",
    marginTop: "10px",
    padding: "12px",
    textDecoration: "none",
    background: "#4f46e5",
    color: "#fff",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "14px",
    fontFamily: "inherit"
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "45px",
    padding: "12px",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    width: "150px",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    padding: "25px",
    borderRadius: "15px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid", fontSize: "14px" },
  saveBtn: { background: "#4f46e5", color: "#fff", padding: "10px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  cancelBtn: { background: "#ef4444", color: "#fff", padding: "10px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
};