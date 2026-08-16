import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBriefcase,
  FiPlus,
  FiBarChart2,
  FiUser,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import { useAuth } from "../services/authService.jsx";
import { getProfilePhoto } from "../utils/profilePhoto.js";

const navigation = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", path: "/", icon: FiGrid },
      { label: "Applications", path: "/applications", icon: FiBriefcase },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Add Application", path: "/add-job", icon: FiPlus },
      { label: "Analytics", path: "/analytics", icon: FiBarChart2 },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", path: "/profile", icon: FiUser },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  const displayName = user?.name || "Alex";
  const email = user?.email || "Account";

  return (
    <aside className="tf-sidebar">
      <div className="tf-brand">
        <div className="tf-brand-mark">
          <span>T</span>
        </div>

        <div className="tf-brand-copy">
          <div className="tf-brand-name">TaskFlow</div>
          <div className="tf-brand-subtitle">Job workspace</div>
        </div>
      </div>

      <div className="tf-sidebar-content">
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
                    <span className="tf-nav-icon">
                      <Icon size={17} />
                    </span>

                    <span className="tf-nav-label">{item.label}</span>

                    <FiChevronRight className="tf-nav-arrow" size={14} />
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="tf-sidebar-footer">
        <div className="tf-user-card">
          <div className="tf-user-avatar">
            <img
              src={getProfilePhoto()}
              alt="Alex profile"
              className="tf-profile-avatar-image"
            />
          </div>

          <div className="tf-user-details">
            <strong>{displayName}</strong>
            <span>{email}</span>
          </div>

          <button
            className="tf-logout-button"
            onClick={logout}
            aria-label="Log out"
            title="Log out"
          >
            <FiLogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
