import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Paths } from '../../routes/paths';
import type { AvailabilityType } from '../../types/availabilities.types';
import { Day } from '../../types/enums.types';
import '../../styles/styleHomeVolunteer.css';
import axios from '../../services/axios';
import type { RootState, AppDispatch } from '../../redux/store';
import { setSlots, setPeopleHelped } from '../../redux/slices/volunteerSlice'; // slice חדש לניהול slots ו-peopleHelped

/* ── helpers ── */
const DAY_NAMES: Record<number, string> = {
  [Day.Sunday]: 'Sunday',
  [Day.Monday]: 'Monday',
  [Day.Tuesday]: 'Tuesday',
  [Day.Wednesday]: 'Wednesday',
  [Day.Thursday]: 'Thursday',
  [Day.Friday]: 'Friday',
  [Day.Saturday]: 'Saturday',
};

const fmtTime = (t: string) => t.slice(0, 5);

const MOCK_ACTIVE_MATCH = {
  name: 'Sarah M.',
  task: 'Grocery Run',
  day: 'Wednesday',
  time: '14:00–16:00',
  city: 'Tel Aviv',
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  if (h < 22) return 'Good evening';
  return 'Good night';
};

export const HomeVolunteer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const slots = useSelector((state: RootState) => state.volunteer.slots);
  const peopleHelped = useSelector((state: RootState) => state.volunteer.peopleHelped);

  const rating = user?.rating ?? 0;

  // ── fetch slots מהשרת
  useEffect(() => {
    const fetchSlots = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get<AvailabilityType[]>(`/Availabilities/user/${user.id}`);
        dispatch(setSlots(res.data));
      } catch (err) {
        console.error('Failed to fetch availabilities:', err);
      }
    };
    fetchSlots();
  }, [user?.id, dispatch]);

  // ── fetch מספר האנשים שעזר המשתמש
  useEffect(() => {
    const fetchPeopleHelped = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get<number>(`/assignments/volunteer/${user.id}/helped-count`);
        dispatch(setPeopleHelped(res.data));
      } catch (err) {
        console.error('Error loading helped count:', err);
      }
    };
    fetchPeopleHelped();
  }, [user?.id, dispatch]);

  const getStatus = (slot: AvailabilityType): 'available' | 'matched' | 'pending' => {
    if (slot.day === Day.Wednesday) return 'matched';
    if (slot.day === Day.Thursday) return 'pending';
    return 'available';
  };

  const STATUS_LABEL: Record<string, string> = {
    available: 'Available',
    matched: `Matched — ${MOCK_ACTIVE_MATCH.name}`,
    pending: 'Pending',
  };

  return (
    <div className="hv-root">
      <div className="hv-greeting">
        {getGreeting()}, {user?.fullName?.split(' ')[0]} 👋
      </div>

      <div className="hv-stats">
        <div className="hv-stat-card">
          <div className="hv-stat-top">
            <span className="hv-stat-n">14</span>
            <span className="hv-stat-icon">🤝</span>
          </div>
          <span className="hv-stat-lbl">Total Hours Volunteered</span>
        </div>

        <div className="hv-stat-card">
          <div className="hv-stat-top">
            <span className="hv-stat-n">{peopleHelped}</span>
            <span className="hv-stat-icon">👥</span>
          </div>
          <span className="hv-stat-lbl">People Helped</span>
        </div>

        <div className="hv-stat-card">
          <div className="hv-stat-top">
            <span className="hv-stat-n">{slots.length}</span>
            <span className="hv-stat-icon">📅</span>
          </div>
          <span className="hv-stat-lbl">This Week's Slots</span>
        </div>

        <div className="hv-stat-card">
          <div className="hv-stat-top">
            <span className="hv-stat-n">{rating > 0 ? rating.toFixed(1) : '—'}</span>
            <span className="hv-stat-icon">⭐</span>
          </div>
          <span className="hv-stat-lbl">Average Rating</span>
        </div>
      </div>

      <div className="hv-grid">
        <div className="hv-card hv-avail">
          <div className="hv-card-title">THIS WEEK'S AVAILABILITY</div>

          {slots.length === 0 ? (
            <div className="hv-empty">No slots added yet.</div>
          ) : (
            <div className="hv-slot-list">
              {slots.map((slot, i) => {
                const status = getStatus(slot);
                return (
                  <div key={i} className="hv-slot-row">
                    <span className={`hv-slot-dot hv-dot-${status}`} />
                    <span className="hv-slot-day">{DAY_NAMES[slot.day]}</span>
                    <span className="hv-slot-time">{fmtTime(slot.from_Time)} – {fmtTime(slot.to_Time)}</span>
                    <span className={`hv-slot-badge hv-badge-${status}`}>{STATUS_LABEL[status]}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="hv-right">
          <div className="hv-card hv-match">
            <div className="hv-match-tag">
              <span className="hv-match-dot" /> Active Match
            </div>
            <div className="hv-match-name">
              {MOCK_ACTIVE_MATCH.name} — {MOCK_ACTIVE_MATCH.task}
            </div>
            <div className="hv-match-detail">
              {MOCK_ACTIVE_MATCH.day} {MOCK_ACTIVE_MATCH.time} · {MOCK_ACTIVE_MATCH.city}
            </div>
            <button className="hv-chat-btn">💬 Open Chat</button>
          </div>

          <div className="hv-card hv-actions">
            <div className="hv-card-title hv-actions-title">QUICK ACTIONS</div>

            <button className="hv-action-btn" onClick={() => navigate(Paths.SchedulePage)}>
              <span className="hv-action-icon">✚</span> Add Availability
            </button>

            <button className="hv-action-btn" onClick={() => navigate(Paths.SchedulePage)}>
              <span className="hv-action-icon">📋</span> View Full Schedule
            </button>

            <button className="hv-action-btn">
              <span className="hv-action-icon">💬</span> Open Messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

