import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, X, Globe } from 'lucide-react';
import './CommunityPage.css';

const CommunityPage = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newComm, setNewComm] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  const fetchCommunities = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/community', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setCommunities(data.communities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newComm)
      });
      setShowModal(false);
      setNewComm({ name: '', description: '' });
      fetchCommunities();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="community-hub">
      <div className="community-header">
        <div>
          <h1>Skill Communities</h1>
          <p>Join focused groups to learn, share, and connect with peers.</p>
        </div>
        <button className="create-comm-btn" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Create Group
        </button>
      </div>

      {loading ? (
        <div className="p-8">Loading communities...</div>
      ) : (
        <div className="community-grid">
          {communities.map((comm) => (
            <div className="community-card" key={comm.id}>
              <div className="comm-icon">
                <Globe size={24} />
              </div>
              <h3>{comm.name}</h3>
              <p>{comm.description}</p>
              <div className="comm-footer">
                <div className="comm-members">
                  <Users size={16} />
                  <span>{comm.memberCount} Members</span>
                </div>
                <button 
                  className="view-comm-btn"
                  onClick={() => navigate(`/community/${comm.id}`)}
                >
                  View Group
                </button>
              </div>
            </div>
          ))}
          {communities.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
              No communities exist yet. Be the first to create one!
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            <h2>Create Community</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Community Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Advanced System Design"
                  value={newComm.name}
                  onChange={(e) => setNewComm({...newComm, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  required 
                  rows={4}
                  placeholder="What is this group about?"
                  value={newComm.description}
                  onChange={(e) => setNewComm({...newComm, description: e.target.value})}
                />
              </div>
              <button type="submit" className="submit-btn">Create Group</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
