import { useState } from "react";
import api from "../services/api";
import { useAuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Paths } from "../routes/paths";
import "../styles/styleLogin.css";

export default function LoginAdmin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const { setUser }  = useAuthContext();
  const navigate     = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      if (res.data.role !== "ADMIN") {
        alert("Access denied — admin privileges required.");
        return;
      }
      setUser(res.data);
      navigate(`/${Paths.dashboard}`);
    } catch {
      alert("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alp">
      {/* ── AMBIENT GLOWS ── */}
      <div className="alp-glow alp-glow-1" />
      <div className="alp-glow alp-glow-2" />
      <div className="alp-glow alp-glow-3" />

      {/* ── CENTER DIVIDER ── */}
      <div className="alp-divider" />

      {/* ══════════════════════════════════
          NAVBAR  (spans full width)
      ══════════════════════════════════ */}
      <nav className="alp-nav">
        <div className="alp-logo">
          <div className="alp-logo-icon">🤝</div>
          <span className="alp-logo-name">Together</span>
        </div>
        <div className="alp-pill">
          <span className="alp-pill-dot" />
          Admin Portal
        </div>
      </nav>

      {/* ══════════════════════════════════
          LEFT — Hero copy & stats
      ══════════════════════════════════ */}
      <div className="alp-left">

        {/* Decorative ring behind content */}
        <div className="alp-ring-wrap">
          <div className="alp-ring">
            <div className="alp-ring-inner">🤝</div>
          </div>
        </div>

        {/* Eyebrow */}
        <div className="alp-eyebrow">
          <div className="alp-eyebrow-line" />
          <span className="alp-eyebrow-text">Admin Dashboard</span>
        </div>

        {/* Headline */}
        <h1 className="alp-headline">
          Manage.<br />
          <em>Monitor.</em>
          <strong>Control.</strong>
        </h1>

        {/* Sub */}
        <p className="alp-sub">
          Your central command for the Together platform —
          oversee volunteers, resolve requests, and keep the
          community running smoothly.
        </p>

        <div className="alp-stats">
          <div className="alp-stat">
            <div className="alp-stat-num">2.4k</div>
            <div className="alp-stat-lbl">Users managed</div>
          </div>
          <div className="alp-stat">
            <div className="alp-stat-num">850</div>
            <div className="alp-stat-lbl">Requests resolved</div>
          </div>
          <div className="alp-stat">
            <div className="alp-stat-num">98%</div>
            <div className="alp-stat-lbl">Uptime</div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          RIGHT — Login form
      ══════════════════════════════════ */}
      <div className="alp-right">
        <div className="alp-card">

          <p className="alp-form-label">Restricted Access</p>
          <h2 className="alp-form-title">Welcome back,<br />Administrator</h2>
          <p className="alp-form-desc">Sign in to access the control panel.</p>

          <form onSubmit={handleLogin}>
            <div className="alp-field">
              <label className="alp-field-label">Email address</label>
              <div className="alp-field-wrap">
                <input
                  className="alp-input"
                  type="email"
                  placeholder="admin@together.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="alp-field">
              <label className="alp-field-label">Password</label>
              <div className="alp-field-wrap">
                <input
                  className="alp-input"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button className="alp-btn" type="submit" disabled={loading}>
              {loading ? (
                <><div className="alp-spinner" /> Signing in…</>
              ) : (
                <>Sign In →</>
              )}
            </button>
          </form>

          <p className="alp-back">
            Back to the site? <a href="/">Go to homepage</a>
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════
          FOOTER BAR  (spans full width)
      ══════════════════════════════════ */}
      <footer className="alp-footer">
        <div className="alp-footer-item">
          <span className="alp-footer-icon">🔒</span>
          Encrypted session
        </div>
        <div className="alp-footer-item">
          <span className="alp-footer-icon">🛡️</span>
          Admin access only
        </div>
        <div className="alp-footer-item">
          <span className="alp-footer-icon">📋</span>
          Activity is logged
        </div>
      </footer>
    </div>
  );
}



