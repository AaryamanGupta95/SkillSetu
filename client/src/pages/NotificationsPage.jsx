import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifs = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data.notifications || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifs(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) { console.error(err); }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) { console.error(err); }
  };

  const handleActionClick = (notif) => {
    if (!notif.isRead) handleMarkRead(notif.id);
    if (notif.linkTo) navigate(notif.linkTo);
  };

  const getTypeIcon = (type) => {
    if (type.includes('request')) return '📨';
    if (type.includes('session')) return '📅';
    if (type.includes('rating')) return '⭐';
    if (type.includes('credit')) return '💰';
    if (type.includes('badge')) return '🏆';
    return '🔔';
  };

  if (loading) return <div className="nf-loading"><div className="nf-spinner"></div></div>;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="nf-container">
      <div className="nf-header">
        <div className="nf-header-left">
          <Bell size={28} />
          <div>
            <h1>Notifications</h1>
            <p>You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button className="nf-mark-all" onClick={handleMarkAllRead}>
            <Check size={16} /> Mark all read
          </button>
        )}
      </div>

      <div className="nf-list">
        {notifications.length === 0 ? (
          <div className="nf-empty">No notifications yet</div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className={`nf-card ${!notif.isRead ? 'unread' : ''}`} onClick={() => handleActionClick(notif)}>
              <div className="nf-icon">{getTypeIcon(notif.type)}</div>
              <div className="nf-content">
                <h3>{notif.title}</h3>
                <p>{notif.message}</p>
                <div className="nf-meta">
                  <span>{new Date(notif.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  {notif.linkTo && <span className="nf-link-indicator">View <ArrowRight size={12}/></span>}
                </div>
              </div>
              {!notif.isRead && <div className="nf-unread-dot"></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
