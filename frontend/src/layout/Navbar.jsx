import { useMemo, useState } from "react";
import { FiBell, FiSearch, FiSun, FiMoon, FiCommand, FiCheck } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../services/authService.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const FALLBACK_PROFILE_PHOTO = "/profile.jpg";

export default function Navbar() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const name = user?.name || "Your name";
  const firstName = name.split(" ")[0];

  const notifications = useMemo(() => [
    {
      id: "profile",
      title: user?.profilePhoto ? "Profile is ready" : "Add your profile photo",
      body: user?.profilePhoto
        ? "Your photo is now shown across your workspace."
        : "Open Profile to add a professional photo.",
    },
    {
      id: "tracking",
      title: "Keep your pipeline moving",
      body: "Add every application so your dashboard stays accurate.",
    },
  ], [user?.profilePhoto]);

  return (
    <header className="tf-topbar">
      <div className="tf-topbar-left">
        <div className="tf-mobile-brand">
          <div className="tf-brand-mark small"><span>T</span></div>
          <div className="tf-mobile-brand-copy">
            <strong>TaskFlow</strong>
            <span>Job workspace</span>
          </div>
        </div>

        <div className="tf-global-search">
          <FiSearch size={17} />
          <input type="search" placeholder="Search your workspace..." aria-label="Search your workspace" />
          <span className="tf-search-shortcut"><FiCommand size={12} /><span>K</span></span>
        </div>
      </div>

      <div className="tf-topbar-right">
        <button
          type="button"
          className="tf-icon-button tf-theme-toggle"
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <div className="tf-notification-wrap">
          <button
            type="button"
            className="tf-icon-button tf-notification-button"
            onClick={() => setOpen((value) => !value)}
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={open}
          >
            <FiBell size={18} />
            <span className="tf-notification-dot" />
          </button>

          {open && (
            <div className="tf-notification-popover">
              <div className="tf-notification-header">
                <div>
                  <strong>Notifications</strong>
                  <span>Workspace updates</span>
                </div>
                <FiCheck size={17} />
              </div>
              {notifications.map((item) => (
                <div className="tf-notification-item" key={item.id}>
                  <div className="tf-notification-item-icon"><FiBell size={14} /></div>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </div>
                </div>
              ))}
              <Link to="/applications" className="tf-notification-footer" onClick={() => setOpen(false)}>
                Open applications
              </Link>
            </div>
          )}
        </div>

        <div className="tf-topbar-divider" />

        <Link to="/profile" className="tf-topbar-user" title="Open profile">
          <div className="tf-topbar-avatar">
            <img src={user?.profilePhoto || FALLBACK_PROFILE_PHOTO} alt="" onError={(event) => { event.currentTarget.src = FALLBACK_PROFILE_PHOTO; }} />
          </div>
          <div className="tf-topbar-user-copy">
            <strong>{firstName}</strong>
            <span>Profile</span>
          </div>
          <span className="tf-user-online-dot" />
        </Link>
      </div>
    </header>
  );
}
