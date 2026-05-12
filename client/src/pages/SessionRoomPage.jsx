import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Send, Clock, Play, CheckCircle, ArrowLeft, Star, AlertCircle } from 'lucide-react';
import api from '../services/api';
import './SessionRoomPage.css';

const SessionRoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [ratingForm, setRatingForm] = useState({ teachingQuality: 5, communication: 5, helpfulness: 5, review: '' });
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const { session: s } = await api.getSession(id);
        setSession(s);
        const { messages: m } = await api.getMessages(id);
        setMessages(m);
        // Show rating modal if session completed but current user hasn't rated
        if (s.status === 'completed') {
            const hasRated = s.mentorId === currentUser.id ? s.mentorRated : s.learnerRated;
            if (!hasRated) setShowRating(true);
        }
      } catch (err) {
        console.error(err);
        navigate('/sessions'); // if unauthorized or error
      } finally {
        setLoading(false);
      }
    };
    fetchSessionData();
  }, [id, navigate, currentUser.id]);

  useEffect(() => {
    if (!session) return;
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('join', currentUser.id);
    newSocket.emit('join_session', id);

    newSocket.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // ── Listen for session ended by the other party ──────────────────────────
    newSocket.on('session_ended', () => {
      setSession((prev) => ({ ...prev, status: 'completed' }));
      setShowRating(true);
    });
    // ─────────────────────────────────────────────────────────────────────────

    return () => newSocket.close();
  }, [session, id, currentUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;
    const msgData = { sessionId: id, content: newMessage, type: 'text' };
    try {
      const { message } = await api.sendMessage(msgData);
      socket.emit('send_message', message);
      setNewMessage('');
    } catch (err) { console.error('Error sending message:', err); }
  };

  const handleAction = async (action) => {
    try {
      if (action === 'start') {
        const { session: s } = await api.startSession(id);
        setSession(s);
        socket.emit('send_message', { sessionId: id, senderId: 0, content: 'Session started! Timer is running.', type: 'system', createdAt: new Date() });
      } else if (action === 'complete') {
        const { session: s } = await api.completeSession(id);
        setSession(s);
        // Notify the other user's screen in real-time
        socket.emit('session_ended', { sessionId: id });
        socket.emit('send_message', { sessionId: id, senderId: currentUser.id, content: 'Session completed. Please rate the session.', type: 'system', createdAt: new Date() });
        setShowRating(true);
      }
    } catch (err) { alert(err.message); }
  };

  const submitRatingModel = async (e) => {
    e.preventDefault();
    try {
      await api.submitRating({ sessionId: session.id, ...ratingForm });
      setShowRating(false);
      const { session: s } = await api.getSession(id);
      setSession(s);
      alert('Rating submitted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="sr-loading"><div className="sr-spinner"></div></div>;
  if (!session) return null;

  const partner = session.mentorId === currentUser.id ? session.learner : session.mentor;
  const isMentor = session.mentorId === currentUser.id;

  return (
    <div className="sr-container">
      <div className="sr-main">
        <div className="sr-header">
          <div className="sr-header-left">
            <button className="sr-back-btn" onClick={() => navigate('/sessions')}><ArrowLeft size={18} /></button>
            <div className="sr-title-info">
              <h1>{session.topic}</h1>
              <p>with <strong>{partner?.fullName}</strong></p>
            </div>
          </div>
          <div className="sr-header-right">
             <div className="sr-status-badge" data-status={session.status}>
                {session.status.toUpperCase()}
             </div>
             {session.status === 'confirmed' && (
               <button className="sr-action-btn start" onClick={() => handleAction('start')}><Play size={16}/> Start Session</button>
             )}
             {session.status === 'active' && (
               <button className="sr-action-btn complete" onClick={() => handleAction('complete')}><CheckCircle size={16}/> End Session</button>
             )}
          </div>
        </div>

        <div className="sr-info-banner">
          <div className="sr-info-item"><Clock size={14}/> {session.duration} min scheduled</div>
          {session.creditsLocked > 0 && <div className="sr-info-item">💰 {session.creditsLocked} credits involved</div>}
        </div>

        <div className="sr-chat-area">
          <div className="sr-messages">
            {messages.map((m, i) => (
              m.type === 'system' ? (
                <div key={i} className="sr-msg-system">
                   <div className="sr-sys-content">{m.content}</div>
                </div>
              ) : (
                <div key={i} className={`sr-message-row ${m.senderId === currentUser.id ? 'mine' : 'theirs'}`}>
                  {m.senderId !== currentUser.id && (
                    <div className="sr-msg-avatar">{partner?.fullName[0]}</div>
                  )}
                  <div className="sr-msg-bubble">
                    <div className="sr-msg-sender">{m.senderId === currentUser.id ? 'You' : partner?.fullName}</div>
                    <div className="sr-msg-text">{m.content}</div>
                    <div className="sr-msg-time">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              )
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="sr-input-area" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              placeholder={session.status === 'completed' ? "Session is complete" : "Type your message..."} 
              value={newMessage} 
              onChange={e => setNewMessage(e.target.value)}
              disabled={session.status === 'completed'}
            />
            <button type="submit" disabled={!newMessage.trim() || session.status === 'completed'}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {showRating && (
        <div className="sr-modal-overlay">
          <div className="sr-modal">
            {isMentor ? (
              <>
                <h2>Rate Your Learner</h2>
                <p>Your feedback helps others know if this learner is legit and worth teaching. <strong>You earn credits for this!</strong></p>
                <form onSubmit={submitRatingModel}>
                  <div className="sr-rating-group">
                    <label>😊 Comfort &amp; Respectfulness</label>
                    <p style={{fontSize:'0.78rem', color:'#888', margin:'-6px 0 6px'}}>Was the learner respectful and made the session comfortable?</p>
                    <input type="range" min="1" max="5" value={ratingForm.teachingQuality} onChange={e => setRatingForm({...ratingForm, teachingQuality: parseInt(e.target.value)})} />
                    <span>{ratingForm.teachingQuality} / 5</span>
                  </div>
                  <div className="sr-rating-group">
                    <label>🎯 Engagement &amp; Effort</label>
                    <p style={{fontSize:'0.78rem', color:'#888', margin:'-6px 0 6px'}}>Did the learner actively participate and try to learn?</p>
                    <input type="range" min="1" max="5" value={ratingForm.communication} onChange={e => setRatingForm({...ratingForm, communication: parseInt(e.target.value)})} />
                    <span>{ratingForm.communication} / 5</span>
                  </div>
                  <div className="sr-rating-group">
                    <label>⏰ Punctuality &amp; Seriousness</label>
                    <p style={{fontSize:'0.78rem', color:'#888', margin:'-6px 0 6px'}}>Was the learner on time and serious about the session?</p>
                    <input type="range" min="1" max="5" value={ratingForm.helpfulness} onChange={e => setRatingForm({...ratingForm, helpfulness: parseInt(e.target.value)})} />
                    <span>{ratingForm.helpfulness} / 5</span>
                  </div>
                  <div className="sr-rating-group">
                    <label>Comments (Optional)</label>
                    <textarea rows="3" placeholder="Any notes for other mentors about this learner..." value={ratingForm.review} onChange={e => setRatingForm({...ratingForm, review: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="sr-submit-rating">Submit Feedback &amp; Earn Credits</button>
                </form>
              </>
            ) : (
              <>
                <h2>Rate Your Session</h2>
                <p>Your feedback helps maintain platform quality.</p>
                <div style={{background:'#fff8e1', border:'1px solid #ffe082', borderRadius:'8px', padding:'10px 14px', marginBottom:'16px', fontSize:'0.85rem', color:'#795548'}}>
                  ℹ️ As a learner, this feedback is your contribution to the community. Credits are not awarded for learner feedback.
                </div>
                <form onSubmit={submitRatingModel}>
                  <div className="sr-rating-group">
                    <label>Teaching Quality</label>
                    <input type="range" min="1" max="5" value={ratingForm.teachingQuality} onChange={e => setRatingForm({...ratingForm, teachingQuality: parseInt(e.target.value)})} />
                    <span>{ratingForm.teachingQuality} / 5</span>
                  </div>
                  <div className="sr-rating-group">
                    <label>Communication</label>
                    <input type="range" min="1" max="5" value={ratingForm.communication} onChange={e => setRatingForm({...ratingForm, communication: parseInt(e.target.value)})} />
                    <span>{ratingForm.communication} / 5</span>
                  </div>
                  <div className="sr-rating-group">
                    <label>Helpfulness</label>
                    <input type="range" min="1" max="5" value={ratingForm.helpfulness} onChange={e => setRatingForm({...ratingForm, helpfulness: parseInt(e.target.value)})} />
                    <span>{ratingForm.helpfulness} / 5</span>
                  </div>
                  <div className="sr-rating-group">
                    <label>Feedback (Optional)</label>
                    <textarea rows="3" placeholder="Leave a review..." value={ratingForm.review} onChange={e => setRatingForm({...ratingForm, review: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="sr-submit-rating">Submit Feedback</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionRoomPage;
