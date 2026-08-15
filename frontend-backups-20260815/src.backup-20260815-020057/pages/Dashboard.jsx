import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiSearch,
  FiTrendingUp,
  FiXCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import API from "../services/api";
import { useAuth } from "../services/authService.jsx";

const statusConfig = {
  Applied: {
    className: "status-applied",
    icon: FiClock,
  },
  Interview: {
    className: "status-interview",
    icon: FiCalendar,
  },
  Offer: {
    className: "status-offer",
    icon: FiCheckCircle,
  },
  Rejected: {
    className: "status-rejected",
    icon: FiXCircle,
  },
};

export default function Dashboard() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
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

  const stats = useMemo(() => {
    const total = jobs.length;
    const applied = jobs.filter((job) => job.status === "Applied").length;
    const interviews = jobs.filter((job) => job.status === "Interview").length;
    const offers = jobs.filter((job) => job.status === "Offer").length;
    const rejected = jobs.filter((job) => job.status === "Rejected").length;

    const responseRate =
      total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0;

    return {
      total,
      applied,
      interviews,
      offers,
      rejected,
      responseRate,
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return jobs.slice(0, 6);
    }

    return jobs
      .filter(
        (job) =>
          job.company?.toLowerCase().includes(query) ||
          job.title?.toLowerCase().includes(query) ||
          job.location?.toLowerCase().includes(query) ||
          job.status?.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }, [jobs, search]);

  return (
    <div className="tf-app-shell">
      <Sidebar />

      <main className="tf-main">
        <Navbar />

        <section className="tf-dashboard">
          <div className="tf-dashboard-header">
            <div>
              <span className="tf-eyebrow">WORKSPACE OVERVIEW</span>

              <h1>
                Good morning,{" "}
                <span>{user?.name?.split(" ")[0] || "Alex"}</span>
              </h1>

              <p>
                Keep your job search organized and stay ahead of every
                opportunity.
              </p>
            </div>

            <Link to="/add-job" className="tf-primary-button">
              <FiPlus size={18} />
              Add application
            </Link>
          </div>

          <section className="tf-kpi-grid">
            <KpiCard
              icon={FiBriefcase}
              label="Total applications"
              value={stats.total}
              detail="All tracked opportunities"
              className="blue"
            />

            <KpiCard
              icon={FiClock}
              label="In progress"
              value={stats.applied}
              detail="Applications awaiting response"
              className="violet"
            />

            <KpiCard
              icon={FiCalendar}
              label="Interviews"
              value={stats.interviews}
              detail="Active interview stages"
              className="amber"
            />

            <KpiCard
              icon={FiCheckCircle}
              label="Offers"
              value={stats.offers}
              detail="Successful opportunities"
              className="green"
            />
          </section>

          <section className="tf-dashboard-grid">
            <div className="tf-panel tf-applications-panel">
              <div className="tf-panel-header">
                <div>
                  <h2>Recent applications</h2>
                  <p>Your latest tracked opportunities</p>
                </div>

                <Link to="/applications" className="tf-text-link">
                  View all
                  <FiArrowUpRight size={16} />
                </Link>
              </div>

              <div className="tf-search-wrapper">
                <FiSearch size={17} />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search applications..."
                  aria-label="Search applications"
                />
              </div>

              {loading ? (
                <div className="tf-loading-list">
                  {[1, 2, 3, 4].map((item) => (
                    <div className="tf-skeleton-row" key={item}>
                      <div />
                      <div />
                      <div />
                    </div>
                  ))}
                </div>
              ) : filteredJobs.length === 0 ? (
                <EmptyApplications />
              ) : (
                <div className="tf-application-list">
                  {filteredJobs.map((job) => (
                    <ApplicationRow key={job._id} job={job} />
                  ))}
                </div>
              )}
            </div>

            <div className="tf-side-column">
              <div className="tf-panel tf-progress-panel">
                <div className="tf-panel-header">
                  <div>
                    <h2>Application pipeline</h2>
                    <p>Current search progress</p>
                  </div>

                  <FiTrendingUp size={20} />
                </div>

                <div className="tf-pipeline">
                  <PipelineRow
                    label="Applied"
                    value={stats.applied}
                    total={stats.total}
                    className="blue"
                  />

                  <PipelineRow
                    label="Interview"
                    value={stats.interviews}
                    total={stats.total}
                    className="amber"
                  />

                  <PipelineRow
                    label="Offers"
                    value={stats.offers}
                    total={stats.total}
                    className="green"
                  />

                  <PipelineRow
                    label="Rejected"
                    value={stats.rejected}
                    total={stats.total}
                    className="red"
                  />
                </div>
              </div>

              <div className="tf-insight-card">
                <div className="tf-insight-icon">
                  <FiTrendingUp size={19} />
                </div>

                <div>
                  <strong>{stats.responseRate}% response rate</strong>
                  <p>
                    {stats.total
                      ? "Keep applying consistently to increase your chances."
                      : "Start tracking applications to unlock your insights."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, detail, className }) {
  return (
    <div className={`tf-kpi-card ${className}`}>
      <div className="tf-kpi-top">
        <div className="tf-kpi-icon">
          <Icon size={19} />
        </div>

        <span className="tf-kpi-label">{label}</span>
      </div>

      <strong>{value}</strong>

      <span className="tf-kpi-detail">{detail}</span>
    </div>
  );
}

function ApplicationRow({ job }) {
  const config = statusConfig[job.status] || statusConfig.Applied;
  const StatusIcon = config.icon;

  return (
    <div className="tf-application-row">
      <div className="tf-company-avatar">
        {job.company?.charAt(0)?.toUpperCase() || "J"}
      </div>

      <div className="tf-application-main">
        <strong>{job.title || "Untitled position"}</strong>
        <span>
          {job.company || "Unknown company"}
          {job.location ? ` • ${job.location}` : ""}
        </span>
      </div>

      <span className={`tf-status ${config.className}`}>
        <StatusIcon size={13} />
        {job.status || "Applied"}
      </span>

      <span className="tf-row-date">
        {job.createdAt
          ? new Date(job.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })
          : "Recently"}
      </span>
    </div>
  );
}

function PipelineRow({ label, value, total, className }) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="tf-pipeline-row">
      <div className="tf-pipeline-label">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="tf-progress-track">
        <div
          className={`tf-progress-fill ${className}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function EmptyApplications() {
  return (
    <div className="tf-empty-state">
      <div className="tf-empty-icon">
        <FiBriefcase size={22} />
      </div>

      <h3>No applications yet</h3>

      <p>
        Start building your job pipeline by adding your first application.
      </p>

      <Link to="/add-job" className="tf-secondary-button">
        <FiPlus size={16} />
        Add application
      </Link>
    </div>
  );
}
