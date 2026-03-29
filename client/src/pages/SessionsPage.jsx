import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Play, MessageSquare, Filter } from 'lucide-react';
import api from '../services/api';
import './SessionsPage.css';

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getMySessions();
        setSessions(data.sessions || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.status === filter);
  const statusConfig = {
    confirmed: { color: '#3b82f6', label: 'Confirmed', icon: <CheckCircle size={14} /> },
    active: { color: '#10b981', label: 'Active', icon: <Play size={14} /> },
    completed: { color: '#6b7280', label: 'Completed', icon: <CheckCircle size={14} /> },
    cancelled: { color: '#ef4444', label: 'Cancelled', icon: null },
  };

  return (
    <div className="ss-container">
      <div className="ss-header">
        <div>
          <h1>My Sessions</h1>
          <p>Track your learning and teaching sessions</p>
        </div>
        <div className="ss-stats-row">
          <div className="ss-mini-stat"><span>{sessions.filter(s => s.status === 'active').length}</span> Active</div>
          <div className="ss-mini-stat"><span>{sessions.filter(s => s.status === 'confirmed').length}</span> Upcoming</div>
          <div className="ss-mini-stat"><span>{sessions.filter(s => s.status === 'completed').length}</span> Done</div>
        </div>
      </div>

      <div className="ss-filters">
        {['all', 'confirmed', 'active', 'completed'].map(f => (
          <button key={f} className={`ss-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="ss-loading"><div className="ss-spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="ss-empty"><MessageSquare size={32} /><p>No sessions found</p></div>
      ) : (
        <div className="ss-list">
          {filtered.map(s => {
            const partner = s.mentorId === currentUser.id ? s.learner : s.mentor;
            const role = s.mentorId === currentUser.id ? 'Teaching' : 'Learning';
            const cfg = statusConfig[s.status] || statusConfig.confirmed;
            return (
              <div key={s.id} className="ss-card" onClick={() => navigate(`/session/${s.id}`)}>
                <div className="ss-card-left">
                  <div className="ss-card-avatar">{partner?.fullName?.[0]?.toUpperCase() || '?'}</div>
                  <div className="ss-card-info">
                    <h3>{s.topic}</h3>
                    <p>with <strong>{partner?.fullName || 'Unknown'}</strong> · {role}</p>
                    <div className="ss-card-meta">
                      <span><Clock size={13} /> {s.duration} min</span>
                      <span>{new Date(s.scheduledDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="ss-card-right">
                  <span className="ss-status-pill" style={{ background: `${cfg.color}12`, color: cfg.color }}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
