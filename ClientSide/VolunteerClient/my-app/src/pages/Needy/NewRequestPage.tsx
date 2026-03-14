import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import type { RootState } from '../../redux/store';
import { addRequestSuccess } from '../../redux/slices/helpRequestsSlice';
import axios from '../../services/axios';
import '../../styles/styleNewRequest.css';

type Urgency = 'urgent' | 'soon' | 'flexible';

const URGENCY_OPTIONS = [
  { value: 'urgent' as Urgency, label: 'Urgent', sub: 'Today', dot: 'dot-red' },
  { value: 'soon' as Urgency, label: 'Soon', sub: 'Within 2 days', dot: 'dot-yellow' },
  { value: 'flexible' as Urgency, label: 'Flexible', sub: 'Within a week', dot: 'dot-green' },
];

const MAX = 500;

export const NewRequestPage = () => {
  useDocumentTitle('New Request');
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [text, setText] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('flexible');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!text.trim() || !user) return;
    try {
      setLoading(true);
      const res = await axios.post('/HelpRequests', {
        needyID: user.id,
        description: text.trim(),
        urgency: urgency // הוספתי את הדחיפות שנבחרה
      });
      // עדכון ה-Store הגלובלי בבקשה החדשה
      dispatch(addRequestSuccess(res.data));
      setSent(true);
    } catch (err) {
      console.error('Failed to submit request:', err);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="req-root">
        <div className="req-success">
          <div className="req-success-icon">🤖</div>
          <h2 className="req-success-title">Request Sent!</h2>
          <p className="req-success-sub">Our system is classifying your request. We'll update you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="req-root">
      <form onSubmit={e => { e.preventDefault(); submit(); }}>
        <div className="req-header">
          <div className="req-tag">New Request</div>
          <h1 className="req-title">Tell us how we can help you</h1>
        </div>

        <div className="req-card">
          <div className="req-field">
            <label className="req-lbl">Describe your request <span className="req-required">*</span></label>
            <textarea
              className="req-textarea"
              value={text}
              onChange={e => setText(e.target.value.slice(0, MAX))}
              placeholder="Example: My mother is hospitalized..."
              rows={6}
            />
            <div className="req-textarea-footer">
              <span className={`req-count ${text.length >= MAX * 0.9 ? 'req-count-warn' : ''}`}>
                {text.length} / {MAX}
              </span>
            </div>
          </div>

          <div className="req-urgency-label">URGENCY</div>
          <div className="req-urgency">
            {URGENCY_OPTIONS.map(opt => (
              <button
                type="button"
                key={opt.value}
                className={`req-urg-btn ${urgency === opt.value ? 'req-urg-on' : ''}`}
                onClick={() => setUrgency(opt.value)}
              >
                <span className={`req-urg-dot ${opt.dot}`} />
                <span className="req-urg-label">{opt.label}</span>
                <span className="req-urg-sub">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="req-submit" disabled={loading || !text.trim()}>
          {loading ? <span className="w1-spinner" /> : <>🤖 Send Request</>}
        </button>
      </form>
    </div>
  );
};