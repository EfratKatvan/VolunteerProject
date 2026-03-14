import "../styles/styleDashboard.css";

export default function DashboardAdmin() {
  return (
    <div className="dash-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="7" height="7" fill="#0a0a0a" />
              <rect x="11" y="2" width="7" height="7" fill="#0a0a0a" />
              <rect x="2" y="11" width="7" height="7" fill="#0a0a0a" />
              <rect x="11" y="11" width="7" height="7" fill="#4a4af0" />
            </svg>
          </div>
          <span className="sidebar-brand-name">AdminOS</span>
        </div>

        <nav className="sidebar-nav">
          {[
            { label: "Dashboard", active: true,  icon: "M2 2h6v6H2zM10 2h6v6h-6zM2 10h6v6H2zM10 10h6v6h-6z" },
            { label: "Users",     active: false, icon: "M8 8a3 3 0 100-6 3 3 0 000 6zM2 14s1-4 6-4 6 4 6 4" },
            { label: "Requests",  active: false, icon: "M2 4h12M2 8h8M2 12h10" },
            { label: "Settings",  active: false, icon: "M8 5a3 3 0 100 6 3 3 0 000-6zM1 8h1M14 8h1M8 1v1M8 14v1" },
          ].map((item) => (
            <div key={item.label} className={`nav-item${item.active ? " nav-item--active" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d={item.icon} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-avatar">A</div>
          <div>
            <div className="sidebar-admin-name">Admin</div>
            <div className="sidebar-admin-role">Administrator</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <div className="top-bar">
          <div>
            <div className="page-eyebrow">Overview</div>
            <h1 className="page-title">Dashboard</h1>
          </div>
          <div className="live-badge">Live</div>
        </div>

        {/* Metrics */}
        <div className="metrics-grid">
          {[
            { label: "Total Users",       value: "2,841", change: "+12%",   up: true  },
            { label: "Pending Requests",  value: "34",    change: "+3",     up: false },
            { label: "Active Sessions",   value: "128",   change: "+8%",    up: true  },
            { label: "System Health",     value: "99.9%", change: "Stable", up: true  },
          ].map((m) => (
            <div key={m.label} className="metric-card">
              <div className="metric-label">{m.label}</div>
              <div className="metric-value">{m.value}</div>
              <div className={`metric-change metric-change--${m.up ? "up" : "down"}`}>
                {m.change}
              </div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Recent Users</h2>
            <button className="section-btn">View all</button>
          </div>
          <table className="users-table">
            <thead>
              <tr>
                {["Name", "Email", "Role", "Status", "Joined"].map((h) => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Sarah Cohen",    email: "s.cohen@example.com",    role: "User",   status: "Active",   joined: "Mar 10, 2026" },
                { name: "David Levy",     email: "d.levy@example.com",     role: "Editor", status: "Active",   joined: "Mar 8, 2026"  },
                { name: "Maya Shapiro",   email: "m.shapiro@example.com",  role: "User",   status: "Pending",  joined: "Mar 7, 2026"  },
                { name: "Oren Ben-David", email: "o.bendavid@example.com", role: "User",   status: "Inactive", joined: "Mar 5, 2026"  },
              ].map((row, i) => (
                <tr key={i} className="table-row">
                  <td className="table-td">
                    <div className="user-cell">
                      <div className="user-avatar">{row.name[0]}</div>
                      <span className="user-name">{row.name}</span>
                    </div>
                  </td>
                  <td className="table-td table-td--muted">{row.email}</td>
                  <td className="table-td">
                    <span className="role-badge">{row.role}</span>
                  </td>
                  <td className="table-td">
                    <span className={`status-badge status-badge--${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="table-td table-td--dim">{row.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}