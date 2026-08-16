import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiMenu,
  FiBarChart2,
  FiBell,
  FiBookmark,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiCode,
  FiFileText,
  FiHome,
  FiMapPin,
  FiMessageCircle,
  FiMoon,
  FiPlus,
  FiSearch,
  FiSend,
  FiSettings,
  FiShield,
  FiSun,
  FiTarget,
  FiUser,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import toast from "react-hot-toast";

import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import API from "../services/api";
import { useAuth } from "../services/authService.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import heroIllustration from "../assets/dashboard-hero.svg";

const STATUS = {
  Applied: { className: "status-applied", icon: FiClock },
  Interview: { className: "status-interview", icon: FiCalendar },
  Offer: { className: "status-offer", icon: FiCheckCircle },
  Rejected: { className: "status-rejected", icon: FiXCircle },
};

const PIE_COLORS = ["#6846ff", "#2587f5", "#ec4d9a", "#20b76a"];
const FALLBACK_PROFILE_PHOTO = "/profile.jpg";

const sidebarSections = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", path: "/", icon: FiHome },
      { label: "Applications", path: "/applications", icon: FiBriefcase },
      { label: "Interviews", path: "/applications", icon: FiCalendar },
      { label: "Offers", path: "/applications", icon: FiShield },
      { label: "Saved Jobs", path: "/applications", icon: FiBookmark },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Add Application", path: "/add-job", icon: FiPlus },
      { label: "Analytics", path: "/analytics", icon: FiBarChart2 },
      { label: "Documents", path: "/profile", icon: FiFileText },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", path: "/profile", icon: FiUser },
      { label: "Settings", path: "/profile", icon: FiSettings },
    ],
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadJobs() {
      try {
        setLoading(true);
        const response = await API.get("/jobs");
        if (mounted) setJobs(Array.isArray(response.data) ? response.data : []);
      } catch {
        if (mounted) toast.error("Unable to load applications");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadJobs();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = jobs.length;
    const applied = jobs.filter((job) => job.status === "Applied").length;
    const interviews = jobs.filter((job) => job.status === "Interview").length;
    const offers = jobs.filter((job) => job.status === "Offer").length;
    const rejected = jobs.filter((job) => job.status === "Rejected").length;
    const active = applied + interviews;
    const responseRate = total ? Math.round(((interviews + offers) / total) * 100) : 0;
    const successRate = total ? Math.round((offers / total) * 100) : 0;

    return { total, applied, interviews, offers, rejected, active, responseRate, successRate };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...jobs]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .filter((job) => {
        if (!query) return true;
        return [job.company, job.title, job.location, job.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      })
      .slice(0, 4);
  }, [jobs, search]);

  const monthlyData = useMemo(() => buildMonthlyData(jobs), [jobs]);
  const pieData = useMemo(
    () => [
      { name: "Applied", value: stats.applied },
      { name: "In Progress", value: stats.active - stats.applied },
      { name: "Interviews", value: stats.interviews },
      { name: "Offers", value: stats.offers },
    ].filter((item) => item.value > 0),
    [stats]
  );

  const upcoming = useMemo(() => {
    return jobs
      .map((job) => {
        const raw = job.interviewDate || job.interviewAt || job.nextInterviewAt || job.nextInterviewDate || job.scheduledAt;
        const time = raw ? new Date(raw).getTime() : NaN;
        return { job, time };
      })
      .filter(({ job, time }) => job.status === "Interview" && Number.isFinite(time) && time >= Date.now())
      .sort((a, b) => a.time - b.time)
      .slice(0, 2);
  }, [jobs]);

  const firstName = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour >= 5 && hour < 12
      ? "Good morning"
      : hour >= 12 && hour < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="tf-app-shell tf-dashboard-shell tf-reference-dashboard">
      <ReferenceSidebar user={user} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      {mobileNavOpen ? (
        <button
          type="button"
          className="tf-reference-nav-backdrop"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation"
        />
      ) : null}

      <main className="tf-main tf-reference-main">
        <ReferenceNavbar user={user} onMenu={() => setMobileNavOpen((value) => !value)} />

        <section className="tf-dashboard tf-reference-dashboard-content">
          <section className="tf-reference-hero-row">
            <div className="tf-reference-hero">
              <div className="tf-reference-hero-copy">
                <span className="tf-reference-eyebrow">WORKSPACE OVERVIEW</span>
                <h1>{greeting}, <strong>{firstName}</strong> <span>👋</span></h1>
                <p>Keep pushing forward. You're making great progress today.</p>
              </div>
              <div className="tf-reference-hero-art" aria-hidden="true">
                <img src={heroIllustration} alt="" />
              </div>
            </div>

            <div className="tf-fire-card">
              <div>
                <strong>You're on fire! 🔥</strong>
                <p>You have {stats.interviews} interviews this week. Prepare well and ace them!</p>
              </div>
              <GoalRing value={Math.max(0, Math.min(100, stats.total ? Math.round((stats.interviews / Math.max(stats.interviews, 2)) * 100) : 75))} />
            </div>
          </section>

          <section className="tf-reference-kpis">
            <ReferenceKpi icon={FiBriefcase} label="Total Applications" value={stats.total} change="12%" tone="purple" spark={[2, 4, 3, 5, 4, 7]} />
            <ReferenceKpi icon={FiClock} label="In Progress" value={stats.active} change="25%" tone="blue" spark={[2, 2, 4, 3, 5, 7]} />
            <ReferenceKpi icon={FiCalendar} label="Interviews" value={stats.interviews} change="67%" tone="pink" spark={[1, 2, 2, 4, 3, 6]} />
            <ReferenceKpi icon={FiCheckCircle} label="Offers" value={stats.offers} change="100%" tone="green" spark={[1, 1, 2, 2, 4, 7]} />
          </section>

          <section className="tf-reference-main-grid">
            <div className="tf-reference-card tf-overview-card">
              <CardHeading title="Application Overview" subtitle="Track your progress over time" action="Last 6 months" />
              <div className="tf-overview-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 8, right: 6, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="referenceOverviewFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a73cf5" stopOpacity={0.28} />
                        <stop offset="100%" stopColor="#ec4d9a" stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#edf0f7" vertical={true} />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#56638b" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#56638b" }} allowDecimals={false} />
                    <Tooltip contentStyle={{ border: "1px solid #e8e9f4", borderRadius: 12, boxShadow: "0 12px 30px rgba(52,42,120,.12)", fontSize: 12 }} />
                    <Area type="monotone" dataKey="applications" stroke="#8c2df1" strokeWidth={3} fill="url(#referenceOverviewFill)" dot={{ r: 4, fill: "#fff", stroke: "#8c2df1", strokeWidth: 2 }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="tf-reference-card tf-recent-card">
              <CardHeading title="Recent Applications" subtitle="" linkText="View all →" linkTo="/applications" />
              {loading ? <LoadingList /> : filteredJobs.length ? (
                <div className="tf-reference-application-list">
                  {filteredJobs.map((job) => <ReferenceApplicationRow job={job} key={job._id} />)}
                </div>
              ) : (
                <EmptyApplications hasSearch={Boolean(search)} />
              )}
            </div>

            <div className="tf-reference-side-column">
              <div className="tf-reference-card tf-pipeline-card">
                <CardHeading title="Application Pipeline" subtitle="" linkText="View Report" linkTo="/analytics" />
                <div className="tf-pipeline-content">
                  <div className="tf-reference-donut">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData.length ? pieData : [{ name: "Empty", value: 1 }]} dataKey="value" innerRadius={34} outerRadius={52} paddingAngle={2} stroke="none">
                          {(pieData.length ? pieData : [{ name: "Empty", value: 1 }]).map((entry, index) => <Cell key={entry.name} fill={pieData.length ? PIE_COLORS[index % PIE_COLORS.length] : "#e7e9f2"} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="tf-reference-donut-center"><strong>{stats.total}</strong><span>Total</span></div>
                  </div>
                  <div className="tf-pipeline-legend">
                    <LegendRow color="#6846ff" label="Applied" value={stats.applied} total={stats.total} />
                    <LegendRow color="#2587f5" label="In Progress" value={stats.active - stats.applied} total={stats.total} />
                    <LegendRow color="#ec4d9a" label="Interviews" value={stats.interviews} total={stats.total} />
                    <LegendRow color="#20b76a" label="Offers" value={stats.offers} total={stats.total} />
                  </div>
                </div>
              </div>

              <div className="tf-reference-card tf-upcoming-reference-card">
                <CardHeading title="Upcoming Interviews" subtitle="" linkText="View Calendar →" linkTo="/applications" />
                {upcoming.length ? upcoming.map(({ job, time }) => <UpcomingReferenceRow job={job} time={time} key={job._id} />) : (
                  <div className="tf-upcoming-empty"><FiCalendar /><span>No interview dates scheduled yet.</span></div>
                )}
              </div>
            </div>
          </section>

          <section className="tf-reference-bottom-grid">
            <div className="tf-ai-coach-card">
              <div>
                <span className="tf-ai-label">AI Career Coach</span>
                <h3>Get personalized insights and interview prep for career success.</h3>
                <Link to="/analytics" className="tf-ai-button"><FiMessageCircle /> Ask AI Coach</Link>
              </div>
              <div className="tf-coach-bot" aria-hidden="true"><FiUsers /></div>
            </div>
            <FeatureCard icon={FiTarget} title="Resume Score" tone="green" value="85%" text="Great score! Your resume is well optimized." link="Improve Now →" />
            <FeatureCard icon={FiUsers} title="Interview Prep" tone="purple" value={`${stats.interviews} upcoming interviews.`} text="Prepare for interviews with practical insights." link="Start Preparing →" />
            <FeatureCard icon={FiTarget} title="Skills Match" tone="green" value="Top Match: 92%" text="Your skills align with in-demand roles." link="View Matches →" />
          </section>
        </section>
      </main>
    </div>
  );
}

function getProfilePhoto(user) {
  return user?.profilePhoto || FALLBACK_PROFILE_PHOTO;
}

function ReferenceSidebar({ user, open, onClose }) {
  return (
    <aside className={`tf-reference-sidebar ${open ? "is-open" : ""}`}>
      <div className="tf-reference-brand">
        <div className="tf-reference-logo"><FiSend /></div>
        <div><strong>TaskFlow</strong><span>Workspace</span></div>
      </div>

      <div className="tf-reference-nav">
        <button type="button" className="tf-mobile-nav-close" onClick={onClose} aria-label="Close navigation">×</button>
        {sidebarSections.map((section) => (
          <div key={section.title} className="tf-reference-nav-section">
            <span className="tf-reference-nav-title">{section.title}</span>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={`${section.title}-${item.label}`} to={item.path} className={`tf-reference-nav-link ${item.label === "Dashboard" ? "active" : ""}`} onClick={onClose}>
                  <Icon /><span>{item.label}</span>
                  {(item.label === "Applications" && "")}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="tf-premium-card">
        <strong>👑 Go Premium</strong>
        <span>Unlock advanced analytics and AI career tools.</span>
        <Link to="/analytics">Upgrade now ↗</Link>
      </div>

      <Link to="/profile" className="tf-reference-profile">
        <div className="tf-reference-avatar">
          <img src={getProfilePhoto(user)} alt="" onError={(event) => { event.currentTarget.src = FALLBACK_PROFILE_PHOTO; }} />
        </div>
        <div><strong>{user?.name || "alex"}</strong><span>{user?.email || "Your account"}</span><small><i /> Online</small></div>
        <FiChevronDown />
      </Link>
    </aside>
  );
}

function ReferenceNavbar({ user, onMenu }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <header className="tf-reference-topbar">
      <button type="button" className="tf-reference-menu" onClick={onMenu} aria-label="Open navigation"><FiMenu /></button>
      <div className="tf-reference-search"><FiSearch /><input placeholder="Search your workspace..." /><span>⌘ K</span></div>
      <div className="tf-reference-top-actions">
        <div className="tf-weather"><FiSun /><strong>28°C</strong><span>Lagos, NG</span></div>
        <Link to="/applications" className="tf-reference-icon" aria-label="Notifications"><FiBell /><b>2</b></Link>
        <button type="button" className="tf-reference-icon" onClick={toggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}><FiMoon /></button>
        <Link to="/profile" className="tf-reference-account">
          <div className="tf-reference-top-avatar"><img src={getProfilePhoto(user)} alt="" onError={(event) => { event.currentTarget.src = FALLBACK_PROFILE_PHOTO; }} /></div>
          <div><strong>{user?.name?.split(" ")[0] || "alex"}</strong><span>Workspace</span></div>
          <FiChevronDown />
        </Link>
      </div>
    </header>
  );
}

function CardHeading({ title, subtitle, action, linkText, linkTo }) {
  return (
    <div className="tf-reference-card-heading">
      <div><h2>{title}</h2>{subtitle ? <p>{subtitle}</p> : null}</div>
      {linkText ? <Link to={linkTo}>{linkText}</Link> : action ? <button type="button">{action}<FiChevronDown /></button> : null}
    </div>
  );
}

function ReferenceKpi({ icon: Icon, label, value, change, tone, spark }) {
  return (
    <div className={`tf-reference-kpi ${tone}`}>
      <div className="tf-reference-kpi-icon"><Icon /></div>
      <div className="tf-reference-kpi-copy"><span>{label}</span><strong>{value}</strong><small>↑ {change} <em>from last month</em></small></div>
      <Sparkline points={spark} tone={tone} />
    </div>
  );
}

function Sparkline({ points, tone }) {
  const width = 76;
  const height = 32;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const path = points.map((point, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((point - min) / Math.max(1, max - min)) * (height - 8) - 4;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const stroke = { purple: "#20b76a", blue: "#2587f5", pink: "#8c2df1", green: "#20b76a" }[tone];
  return <svg className="tf-sparkline" viewBox={`0 0 ${width} ${height}`} aria-hidden="true"><path d={path} fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function GoalRing({ value }) {
  const circumference = 2 * Math.PI * 29;
  return (
    <div className="tf-goal-ring">
      <svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="29" fill="none" stroke="#ece8fa" strokeWidth="6" /><circle cx="36" cy="36" r="29" fill="none" stroke="#5d25e9" strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)} transform="rotate(-90 36 36)" /></svg>
      <strong>{value}%</strong>
      <span>Weekly Goal</span>
    </div>
  );
}

function LegendRow({ color, label, value, total }) {
  const percent = total ? Math.round((value / total) * 100) : 0;
  return <div className="tf-legend-row-reference"><span><i style={{ background: color }} />{label}</span><strong>{value} ({percent}%)</strong></div>;
}

function ReferenceApplicationRow({ job }) {
  const config = STATUS[job.status] || STATUS.Applied;
  const StatusIcon = config.icon;
  return (
    <Link to={`/edit-job/${job._id}`} className="tf-reference-application-row">
      <div className={`tf-job-icon ${job.status === "Interview" ? "pink" : job.status === "Offer" ? "green" : job.status === "Applied" ? "blue" : "dark"}`}><FiCode /></div>
      <div className="tf-reference-job-copy"><strong>{job.title || "Untitled position"}</strong><span>{job.company || "Unknown company"} • {job.location || "Remote"}</span></div>
      <span className={`tf-reference-status ${config.className}`}><StatusIcon />{job.status || "Applied"}</span>
      <time>{formatDateShort(job.createdAt)}</time>
    </Link>
  );
}

function UpcomingReferenceRow({ job, time }) {
  const date = new Date(time);
  return (
    <Link to={`/edit-job/${job._id}`} className="tf-reference-upcoming-row">
      <div className="tf-upcoming-date-reference"><small>{date.toLocaleDateString(undefined, { month: "short" }).toUpperCase()}</small><strong>{date.getDate()}</strong></div>
      <div><strong>{job.title || "Interview"}</strong><span>{job.company || "Company"} • {job.location || "Remote"}</span></div>
      <time>{date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</time>
    </Link>
  );
}

function FeatureCard({ icon: Icon, title, value, text, link, tone }) {
  return <div className="tf-feature-card"><div className={`tf-feature-icon ${tone}`}><Icon /></div><div className="tf-feature-copy"><strong>{title}</strong><span>{value}</span><p>{text}</p><Link to="/analytics">{link}</Link></div></div>;
}

function LoadingList() {
  return <div className="tf-reference-loading">{[1, 2, 3, 4].map((item) => <div key={item}><i /><span /><b /></div>)}</div>;
}

function EmptyApplications({ hasSearch }) {
  return <div className="tf-reference-empty"><FiBriefcase /><strong>{hasSearch ? "No matching applications" : "No applications yet"}</strong><span>{hasSearch ? "Try another search." : "Add your first application to populate this dashboard."}</span>{!hasSearch && <Link to="/add-job"><FiPlus /> Add application</Link>}</div>;
}

function formatDateShort(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const diff = Math.max(0, Math.round((Date.now() - date.getTime()) / 86400000));
  if (diff === 0) return "Today";
  if (diff === 1) return "1d ago";
  if (diff < 7) return `${diff}d ago`;
  if (diff < 14) return "1w ago";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function buildMonthlyData(jobs) {
  const now = new Date();
  const result = [];
  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const next = new Date(now.getFullYear(), now.getMonth() - offset + 1, 1);
    const count = jobs.filter((job) => {
      const created = new Date(job.createdAt || 0);
      return Number.isFinite(created.getTime()) && created >= date && created < next;
    }).length;
    result.push({ label: date.toLocaleDateString(undefined, { month: "short" }), applications: count });
  }
  return result;
}
