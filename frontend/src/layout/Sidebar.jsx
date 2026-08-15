import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBriefcase,
  FiPlusCircle,
  FiBarChart2,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../services/authService.jsx";

const navigation = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", path: "/", icon: FiGrid },
    ],
  },
  {
    label: "Applications",
    items: [
      { label: "All Applications", path: "/applications", icon: FiBriefcase },
      { label: "Add Application", path: "/add-job", icon: FiPlusCircle },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Analytics", path: "/analytics", icon: FiBarChart2 },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", path: "/profile", icon: FiUser },
      { label: "Settings", path: "/settings", icon: FiSettings },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  const displayName = user?.name || "Alex Obi";
  const email = user?.email || "";

  return (
    <aside className="tf-sidebar">
      <div className="tf-brand">
        <div className="tf-brand-mark">T</div>

        <div>
          <div className="tf-brand-name">TaskFlow</div>
          <div className="tf-brand-subtitle">Job workspace</div>
        </div>
      </div>

      <nav className="tf-sidebar-nav">
        {navigation.map((section) => (
          <div className="tf-nav-section" key={section.label}>
            <div className="tf-nav-heading">{section.label}</div>

            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `tf-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="tf-sidebar-bottom">
        <div className="tf-user-card">
          <div className="tf-user-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div className="tf-user-details">
            <strong>{displayName}</strong>
            <span>{email || "Account"}</span>
          </div>

          <button
            className="tf-logout-button"
            onClick={logout}
            aria-label="Log out"
            title="Log out"
          >
            <FiLogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}
