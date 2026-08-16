import {
  FiBell,
  FiSearch,
  FiSun,
  FiMoon,
  FiCommand,
} from "react-icons/fi";
import { useAuth } from "../services/authService.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { getProfilePhoto } from "../utils/profilePhoto.js";
import TaskFlowThemeToggle from "../TaskFlowThemeToggle.jsx";

export default function Navbar() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const name = user?.name || "Alex";
  const firstName = name.split(" ")[0];

  return (
    <header className="tf-topbar">
      <div className="tf-topbar-left">
        <div className="tf-mobile-brand">
          <div className="tf-brand-mark small">
            <span>T</span>
          </div>

          <div className="tf-mobile-brand-copy">
            <strong>TaskFlow</strong>
            <span>Workspace</span>
          </div>
        </div>

        <div className="tf-global-search">
          <FiSearch size={17} />

          <input
            type="search"
            placeholder="Search your workspace..."
            aria-label="Search your workspace"
          />

          <span className="tf-search-shortcut">
            <FiCommand size={12} />
            <span>K</span>
          </span>
        </div>
      </div>

      <div className="tf-topbar-right">
        <button
          className="tf-icon-button tf-theme-toggle"
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <div className="tf-header-actions">
  <div className="tf-theme-action">
    <TaskFlowThemeToggle />
  </div>
  <button
          className="tf-icon-button tf-notification-button"
          title="Notifications"
          aria-label="Notifications"
        >
          <FiBell size={18} />
          <span className="tf-notification-dot" />
        </button>
</div>

        <div className="tf-topbar-divider" />

        <div className="tf-topbar-user">
          <div className="tf-topbar-avatar">
            <img
              src={getProfilePhoto()}
              alt="Alex profile"
              className="tf-profile-avatar-image"
            />
          </div>

          <div className="tf-topbar-user-copy">
            <strong>{firstName}</strong>
            <span>Workspace</span>
          </div>

          <span className="tf-user-online-dot" />
        </div>
      </div>
    </header>
  );
}
