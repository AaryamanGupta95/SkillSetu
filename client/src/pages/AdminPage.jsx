import { useState, useEffect } from 'react';
import { Users, BookOpen, Clock, Trash2, CheckCircle, Search, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import './AdminPage.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ analytics }, { users: u }, { sessions: s }] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminUsers(),
        api.getAdminSessions()
      ]);
      setStats(analytics);
      setUsers(u);
      setSessions(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleVerify = async (id) => {
    if (window.confirm('Verify this user as a Mentor?')) {
      try { await api.verifyUser(id); fetchData(); } catch (err) { alert(err.message); }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? All their data will be removed.')) {
      try { await api.deleteUser(id); fetchData(); } catch (err) { alert(err.message); }
    }
  };

  if (loading) return <div className="ap-loading"><div className="ap-spinner"></div></div>;

  const filteredUsers = users.filter(u => u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="ap-container">
      <div className="ap-header">
        <h1>Admin Dashboard</h1>
        <p>Platform management and analytics</p>
      </div>

      <div className="ap-tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>User Management</button>
        <button className={activeTab === 'sessions' ? 'active' : ''} onClick={() => setActiveTab('sessions')}>Session Logs</button>
        <button className={activeTab === 'recruiters' ? 'active' : ''} onClick={() => setActiveTab('recruiters')}>Recruitment Control</button>
      </div>

      {activeTab === 'overview' && (
        <div className="ap-stats-grid">
          <div className="ap-stat-card">
            <Users size={24} />
            <div><h3>Total Users</h3><p>{stats?.totalUsers || 0}</p></div>
          </div>
          <div className="ap-stat-card">
            <BookOpen size={24} />
            <div><h3>Total Sessions</h3><p>{stats?.totalSessions || 0}</p></div>
          </div>
          <div className="ap-stat-card">
            <CheckCircle size={24} />
            <div><h3>Completed</h3><p>{stats?.completedSessions || 0}</p></div>
          </div>
          <div className="ap-stat-card">
            <Clock size={24} />
            <div><h3>Active Now</h3><p>{stats?.activeSessions || 0}</p></div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="ap-management">
          <div className="ap-search">
            <Search size={18} />
            <input type="text" placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <table className="ap-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Reputation</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="ap-user-cell">
                      <div className="ap-avatar">{user.fullName[0]}</div>
                      <div>
                        <strong>{user.fullName} {user.isVerified && <ShieldCheck size={14} color="#3b82f6"/>}</strong>
                        <span className="ap-email">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className={`ap-role-pill ${user.role}`}>{user.role}</span></td>
                  <td>{user.reputationScore}</td>
                  <td>{user.wallet?.balance || 0}</td>
                  <td>
                    <div className="ap-actions">
                      {!user.isVerified && <button className="ap-verify-btn" onClick={() => handleVerify(user.id)}>Verify</button>}
                      <button className="ap-delete-btn" onClick={() => handleDelete(user.id)}><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="ap-management">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Mentor</th>
                <th>Learner</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.topic}</strong><br/><span className="ap-duration">{s.duration} min</span></td>
                  <td>{s.mentor?.fullName}</td>
                  <td>{s.learner?.fullName}</td>
                  <td><span className={`ap-status-pill ${s.status}`}>{s.status}</span></td>
                  <td>{new Date(s.scheduledDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'recruiters' && (
        <div className="ap-management">
          <div style={{ background: 'var(--shiro)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <h2>Add New Recruiter</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Enter the email of an existing user to upgrade their account to a Recruiter role.</p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.email.value;
              try {
                await api.createRecruiter(email);
                alert('User upgraded to recruiter successfully!');
                e.target.reset();
                fetchData();
              } catch (err) {
                alert(err.message);
              }
            }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="user@company.com" 
                  required 
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }} 
                />
                <button 
                  type="submit" 
                  style={{ background: 'var(--kuro)', color: 'var(--shiro)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Make Recruiter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
