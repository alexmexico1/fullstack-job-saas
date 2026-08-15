import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiBriefcase,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiMapPin,
  FiCalendar,
  FiChevronDown,
} from "react-icons/fi";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import API from "../services/api";

const STATUS_OPTIONS = ["All", "Applied", "Interview", "Offer", "Rejected"];

export default function Applications() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await API.get("/jobs");
      setJobs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error("Unable to load applications");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      await API.delete(`/jobs/${id}`);
      setJobs((current) => current.filter((job) => job._id !== id));
      toast.success("Application deleted");
    } catch {
      toast.error("Unable to delete application");
    }
  };

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title?.toLowerCase().includes(query) ||
        job.company?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || job.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, status]);

  const counts = {
    all: jobs.length,
    applied: jobs.filter((job) => job.status === "Applied").length,
    interview: jobs.filter((job) => job.status === "Interview").length,
    offer: jobs.filter((job) => job.status === "Offer").length,
    rejected: jobs.filter((job) => job.status === "Rejected").length,
  };

  return (
    <div className="tf-app-shell">
      <Sidebar />

      <main className="tf-main">
        <Navbar />

        <section className="tf-page-header">
          <div>
            <Link to="/" className="tf-back-link">
              <FiArrowLeft size={15} />
              Dashboard
            </Link>

            <div className="tf-page-title-row">
              <div className="tf-page-icon">
                <FiBriefcase size={22} />
              </div>

              <div>
                <h1>Applications</h1>
                <p>Manage and track every job application in one place.</p>
              </div>
            </div>
          </div>

          <Link to="/add-job" className="tf-primary-button">
            <FiPlus size={17} />
            Add Application
          </Link>
        </section>

        <section className="tf-application-summary">
          <SummaryCard label="Total" value={counts.all} />
          <SummaryCard label="Applied" value={counts.applied} />
          <SummaryCard label="Interviews" value={counts.interview} />
          <SummaryCard label="Offers" value={counts.offer} />
          <SummaryCard label="Rejected" value={counts.rejected} />
        </section>

        <section className="tf-applications-card">
          <div className="tf-applications-toolbar">
            <div>
              <h2>All Applications</h2>
              <span>
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "application" : "applications"}
              </span>
            </div>

            <div className="tf-toolbar-controls">
              <div className="tf-search-box">
                <FiSearch size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search company, role..."
                />
              </div>

              <div className="tf-select-box">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option === "All" ? "All statuses" : option}
                    </option>
                  ))}
                </select>
                <FiChevronDown size={15} />
              </div>
            </div>
          </div>

          <div className="tf-table-wrapper">
            {loading ? (
              <div className="tf-empty-state">
                <div className="tf-spinner" />
                <p>Loading applications...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="tf-empty-state">
                <div className="tf-empty-icon">
                  <FiBriefcase size={25} />
                </div>

                <h3>No applications found</h3>

                <p>
                  {jobs.length === 0
                    ? "Start tracking your job search by adding your first application."
                    : "Try changing your search or status filter."}
                </p>

                {jobs.length === 0 && (
                  <Link to="/add-job" className="tf-primary-button">
                    <FiPlus size={16} />
                    Add Application
                  </Link>
                )}
              </div>
            ) : (
              <table className="tf-modern-table">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Date Added</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job._id}>
                      <td>
                        <div className="tf-job-title-cell">
                          <div className="tf-company-logo">
                            {(job.company || "C").charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <strong>{job.title || "Untitled position"}</strong>
                            <span>Job application</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="tf-company-name">
                          {job.company || "—"}
                        </span>
                      </td>

                      <td>
                        <span className="tf-location">
                          <FiMapPin size={14} />
                          {job.location || "Remote"}
                        </span>
                      </td>

                      <td>
                        <StatusBadge status={job.status} />
                      </td>

                      <td>
                        <span className="tf-date">
                          <FiCalendar size={14} />
                          {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString()
                            : "—"}
                        </span>
                      </td>

                      <td>
                        <div className="tf-row-actions">
                          <Link
                            to={`/edit-job/${job._id}`}
                            className="tf-icon-button"
                            title="Edit application"
                          >
                            <FiEdit2 size={15} />
                          </Link>

                          <button
                            className="tf-icon-button danger"
                            title="Delete application"
                            onClick={() => deleteJob(job._id)}
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="tf-summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = status || "Applied";

  return (
    <span className={`tf-status-badge ${normalized.toLowerCase()}`}>
      <span />
      {normalized}
    </span>
  );
}
