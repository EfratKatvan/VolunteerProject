
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Paths } from '../../routes/paths';
import type { RootState } from '../../redux/store';
import { fetchStart, fetchSuccess, fetchFailure } from '../../redux/slices/helpRequestsSlice';
import axios from '../../services/axios';
import { HelpRequestStatus } from '../../types/enums.types';
import '../../styles/styleHomeNeedy.css';

/* ── Greeting by time of day ── */
const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  if (h >= 17 && h < 21) return 'Good evening';
  return 'Good night';
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const STATUS_CLASS: Record<number, string> = {
  [HelpRequestStatus.Open]: 'hn-status-pending',
  [HelpRequestStatus.Matched]: 'hn-status-matched',
  [HelpRequestStatus.Completed]: 'hn-status-done',
  [HelpRequestStatus.Cancelled]: 'hn-status-cancelled',
};

const STATUS_LABEL: Record<number, string> = {
  [HelpRequestStatus.Open]: '⏳ Open',
  [HelpRequestStatus.Matched]: '✓ Matched',
  [HelpRequestStatus.Completed]: '✅ Completed',
  [HelpRequestStatus.Cancelled]: '✕ Cancelled',
};

const STATUS_ICON: Record<number, string> = {
  [HelpRequestStatus.Open]: '📋',
  [HelpRequestStatus.Matched]: '🤝',
  [HelpRequestStatus.Completed]: '✅',
  [HelpRequestStatus.Cancelled]: '❌',
};

export const HomeNeedy = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  const { user } = useSelector((state: RootState) => state.auth);
  const { list, loading } = useSelector((state: RootState) => state.helpRequests);

  useEffect(() => {
    document.title = 'Home – Needy';
   
    const loadRequests = async () => {
      dispatch(fetchStart());
      try {
        const res = await axios.get('/HelpRequests');
        dispatch(fetchSuccess(res.data));
      } catch (err) {
        dispatch(fetchFailure('Failed to load requests'));
      }
    };
   
    loadRequests();
  }, [dispatch]);

  const requests = list.filter(r => r.needyID === user?.id);
  const openCount = requests.filter(r => r.status === HelpRequestStatus.Open).length;
  const completedCount = requests.filter(r => r.status === HelpRequestStatus.Completed).length;
  const matchedCount = requests.filter(r => r.status === HelpRequestStatus.Matched).length;
  const activeMatch = requests.find(r => r.status === HelpRequestStatus.Matched);

  const STATS = [
    { icon: '📋', num: openCount, label: 'Open Requests' },
    { icon: '✅', num: completedCount, label: 'Completed' },
    { icon: '🤝', num: matchedCount, label: 'Active Matches' },
    { icon: '⭐', num: requests.length, label: 'Total Requests' },
  ];

  return (
    <div className="hn-root">
      {/* ── Greeting ── */}
      <div className="hn-greeting">
        <h1 className="hn-greeting-h">{getGreeting()}, {user?.fullName ?? 'there'} 👋</h1>
      </div>

      {/* ── Stats ── */}
      <div className="hn-stats">
        {STATS.map(s => (
          <div className="hn-stat" key={s.label}>
            <div className="hn-stat-icon">{s.icon}</div>
            <div className="hn-stat-num">{s.num}</div>
            <div className="hn-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="hn-grid">
        <div className="hn-card">
          <div className="hn-card-title">My Requests</div>
          {loading ? (
            <div className="hn-empty">Loading your requests...</div>
          ) : requests.length === 0 ? (
            <div className="hn-empty">No requests yet — submit one to get started!</div>
          ) : (
            requests.map(req => (
              <div
                className="hn-req-row"
                key={req.id}
                onClick={() => req.status === HelpRequestStatus.Matched && navigate(Paths.chatNeedy)}
                style={{ cursor: req.status === HelpRequestStatus.Matched ? 'pointer' : 'default' }}
              >
                <div className="hn-req-icon">{STATUS_ICON[req.status] ?? '📋'}</div>
                <div className="hn-req-info">
                  <div className="hn-req-title">{req.description}</div>
                  <span className="hn-req-cat">Category #{req.categoryID}</span>
                  <div className="hn-req-date">Submitted {formatDate(req.createdAt)}</div>
                </div>
                <div className={`hn-req-status ${STATUS_CLASS[req.status] ?? ''}`}>
                  {STATUS_LABEL[req.status] ?? req.status}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Side cards ── */}
        <div className="hn-side">
          {activeMatch && (
            <div className="hn-match">
              <div className="hn-match-badge"><span className="hn-match-dot" /> Active Match</div>
              <div className="hn-match-name">{activeMatch.description}</div>
              <div className="hn-match-detail">Submitted {formatDate(activeMatch.createdAt)} · Category #{activeMatch.categoryID}</div>
              <button className="hn-match-btn" onClick={() => navigate(Paths.chatNeedy)}>💬 Open Chat</button>
            </div>
          )}

          <div className="hn-cta" onClick={() => navigate(Paths.NewRequestPage)}>
            <div className="hn-cta-label">✦ Free Service</div>
            <div className="hn-cta-title">Need help? We're here for you</div>
            <div className="hn-cta-sub">Describe your need and our AI will find the right volunteer in minutes.</div>
            <button className="hn-cta-btn">+ Submit a New Request</button>
          </div>

          <div className="hn-quick">
            <div className="hn-quick-title">Quick Actions</div>
            <button className="hn-quick-btn" onClick={() => navigate(Paths.NewRequestPage)}><span className="hn-quick-icon">✏️</span> New Request</button>
            <button className="hn-quick-btn" onClick={() => navigate(Paths.chatNeedy)}><span className="hn-quick-icon">💬</span> Open Messages</button>
          </div>
        </div>
      </div>
    </div>
  );
};
