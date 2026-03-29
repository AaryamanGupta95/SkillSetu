import { useState, useEffect } from 'react';
import { Clock, Check, X, Send, Inbox, ArrowUpRight } from 'lucide-react';
import api from '../services/api';
import './RequestsPage.css';

const RequestsPage = () => {
  const [tab, setTab] = useState('received');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getRequests(tab);
      setRequests(data.requests || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, [tab]);

  const handleAccept = async (id) => {
    try { await api.acceptRequest(id); fetchRequests(); } catch (err) { alert(err.message); }
  };
  const handleReject = async (id) => {
    try { await api.rejectRequest(id); fetchRequests(); } catch (err) { alert(err.message); }
  };

  const statusColors = { pending: '#f59e0b', accepted: '#10b981', rejected: '#ef4444', cancelled: '#6b7280' };

  return (
    <div className="rq-container">
      <div className="rq-header">
        <h1>Session Requests</h1>
        <p>Manage your incoming and outgoing session requests</p>
      </div>

      <div className="rq-tabs">
        <button className={`rq-tab ${tab === 'received' ? 'active' : ''}`} onClick={() => setTab('received')}>
          <Inbox size={16} /> Received
        </button>
        <button className={`rq-tab ${tab === 'sent' ? 'active' : ''}`} onClick={() => setTab('sent')}>
          <Send size={16} /> Sent
        </button>
      </div>

      {loading ? (
        <div className="rq-loading"><div className="rq-spinner"></div></div>
      ) : requests.length === 0 ? (
        <div className="rq-empty">
          <p>No {tab} requests yet</p>
        </div>
      ) : (
        <div className="rq-list">
          {requests.map(r => (
            <div key={r.id} className="rq-card">
              <div className="rq-card-top">
                <div className="rq-user-info">
                  <div className="rq-avatar">
                    {(tab === 'received' ? r.sender?.fullName : r.receiver?.fullName)?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3>{tab === 'received' ? r.sender?.fullName : r.receiver?.fullName}</h3>
                    <span className="rq-email">{tab === 'received' ? r.sender?.email : r.receiver?.email}</span>
                  </div>
                </div>
                <span className="rq-status" style={{ background: `${statusColors[r.status]}15`, color: statusColors[r.status] }}>
                  {r.status}
                </span>
              </div>
              <div className="rq-card-body">
                <div className="rq-detail"><strong>Topic:</strong> {r.topic}</div>
                {r.description && <div className="rq-detail"><strong>Description:</strong> {r.description}</div>}
                <div className="rq-meta">
                  <span><Clock size={14} /> {r.duration} min</span>
                  <span><ArrowUpRight size={14} /> {new Date(r.scheduledDate).toLocaleDateString()}</span>
                  {r.creditsRequired > 0 && <span>💰 {r.creditsRequired} credits</span>}
                </div>
              </div>
              {tab === 'received' && r.status === 'pending' && (
                <div className="rq-actions">
                  <button className="rq-accept-btn" onClick={() => handleAccept(r.id)}><Check size={16} /> Accept</button>
                  <button className="rq-reject-btn" onClick={() => handleReject(r.id)}><X size={16} /> Decline</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
