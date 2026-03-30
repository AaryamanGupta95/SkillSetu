import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Calendar, MessageSquare } from 'lucide-react';
import './CommunityDetailsPage.css';

const CommunityDetailsPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [userId, setUserId] = useState(null);

  const fetchDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/community/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setCommunity(data.community);
      const userStr = localStorage.getItem('user');
      if (userStr) setUserId(JSON.parse(userStr).id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleJoin = async () => {
    try {
      await fetch(`http://localhost:5000/api/community/${id}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDetails();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      await fetch(`http://localhost:5000/api/community/${id}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newPost })
      });
      setNewPost('');
      fetchDetails();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || !community) return <div className="p-8">Loading community details...</div>;

  const members = community.communityMemberships || [];
  const posts = community.posts || [];
  const isMember = members.some(m => m.userId === userId);
  const leaders = members.filter(m => m.role === 'leader');

  return (
    <div className="comm-details-container">
      <div className="comm-banner">
        <div className="comm-banner-header">
          <div className="comm-title">
            <h1>{community.name}</h1>
            <div className="comm-meta">
              <span><Users size={16}/> {community.memberCount} Members</span>
              <span><Calendar size={16}/> Created {new Date(community.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <button 
            className="join-comm-btn"
            disabled={isMember}
            onClick={handleJoin}
          >
            {isMember ? 'Joined' : 'Join Community'}
          </button>
        </div>
        <p className="comm-description">{community.description}</p>
      </div>

      <div className="comm-content">
        <div className="discussion-section">
          <h2 className="section-header">Discussion <MessageSquare size={20} style={{display:'inline', marginLeft:'0.5rem'}}/></h2>
          
          {isMember ? (
            <form className="write-post" onSubmit={handlePost}>
              <textarea 
                placeholder="Share knowledge, ask a question, or introduce yourself..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                required
              />
              <button type="submit" className="post-btn">Post to Community</button>
            </form>
          ) : (
            <div className="p-4 mb-8 bg-gray-50 border rounded text-center text-gray-500">
              Join the community to post in the discussion!
            </div>
          )}

          <div className="posts-list">
            {posts.length > 0 ? posts.map(post => (
              <div className="post-card" key={post.id}>
                <div className="post-header">
                  <div className="post-avatar"></div>
                  <div className="post-meta">
                    <h4>{post.author?.fullName || 'User'}</h4>
                    <span>{new Date(post.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="post-content">
                  {post.content}
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-8">No discussions yet. Be the first to start one!</p>
            )}
          </div>
        </div>

        <div className="members-section">
          <h2 className="section-header">Leadership</h2>
          <div className="members-list">
            {leaders.map(member => (
              <div className="member-item" key={member.id}>
                <div className="post-avatar" style={{width: '32px', height: '32px'}}></div>
                <div className="member-info">
                  <h4>{member.user?.fullName}</h4>
                  <span className="role-badge leader">Leader</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailsPage;
