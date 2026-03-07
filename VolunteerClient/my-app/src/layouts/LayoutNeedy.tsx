import { NavLink, Outlet } from 'react-router';
import { Paths } from '../routes/paths';
import { removeSession } from '../auth/auth.utils';
import '../styles/styleLayout.css';

const LayoutNeedy = () => {
  return (
    <div className="layout-container">

      <header className="layout-header">
        <div className="layout-header-inner">

          {/* Logo */}
          <NavLink to={Paths.homeNeedy} className="layout-logo">
                <div className="w1-logo">
          <div className="w1-logo-icon">🤝</div>
        </div>
            <span className="layout-logo-name">Together</span>
          </NavLink>

          {/* Nav */}
          <nav className="layout-nav">
            <NavLink to={Paths.homeNeedy} className="layout-nav-link" end>
              Home
            </NavLink>
          </nav>

          {/* Logout */}
          <button className="layout-logout" onClick={() => removeSession()}>
            <svg viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>

        </div>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>

      <footer className="layout-footer">
        <div className="layout-footer-inner">
          <div className="layout-footer-left">
            <div className="layout-footer-dot" />
            <span className="layout-footer-copy">© 2025 Together. All rights reserved.</span>
          </div>
          <span className="layout-footer-right">Built on trust, driven by community.</span>
        </div>
      </footer>

    </div>
  );
};

export default LayoutNeedy;