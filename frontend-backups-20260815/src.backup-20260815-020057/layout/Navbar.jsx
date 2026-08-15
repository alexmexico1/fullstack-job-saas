import { FiBell, FiSearch } from "react-icons/fi";
import { useAuth } from "../services/authService.jsx";

export default function Navbar() {
  const { user } = useAuth();

  const name = user?.name || "Alex Obi";
  const firstName = name.split(" ")[0];

  return (
    <header className="tf-topbar">
      <div className="tf-topbar-left">
        <div className="tf-mobile-brand">
          <div className="tf-brand-mark small">
            <span>T</span>
          </div>
          <strong>TaskFlow</strong>
        </div>

        <div className="tf-global-search">
          <FiSearch size={17} />
          <input placeholder="Search your workspace..." />
          <kbd>⌘ K</kbd>
        </div>
      </div>

      <div className="tf-topbar-right">
        <button className="tf-icon-button" title="Notifications">
          <FiBell size={18} />
          <span className="tf-notification-dot" />
        </button>

        <div className="tf-topbar-divider" />

        <div className="tf-topbar-user">
          <div className="tf-topbar-avatar">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="tf-topbar-user-copy">
            <strong>{firstName}</strong>
            <span>Workspace</span>
          </div>
        </div>
      </div>
    </header>
  );
}
