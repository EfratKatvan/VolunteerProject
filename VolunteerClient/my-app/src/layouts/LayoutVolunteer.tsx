import { NavLink, Outlet } from 'react-router';
import { Paths } from '../routes/paths';
import { removeSession } from '../auth/auth.utils';
import '../styles/styleLayout.css';

const LayoutVolunteer = () => {
  return (
    <div className="layout-container">

      <header className="layout-header">
        <div className="layout-header-inner">

          {/* Logo */}
          <NavLink to={Paths.homeVolunteer} className="layout-logo">
            <div className="layout-logo-mark">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
              </svg>
            </div>
            <span className="layout-logo-name">Together</span>
          </NavLink>

          {/* Nav */}
          <nav className="layout-nav">
            <NavLink to={Paths.homeVolunteer} className="layout-nav-link" end>
               Home
            </NavLink>

            <NavLink to={Paths.SchedulePage} className="layout-nav-link">
              Availabilities
             </NavLink>

            <NavLink to={Paths.CategoriesPage} className="layout-nav-link">
             My Categories
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

export default LayoutVolunteer;