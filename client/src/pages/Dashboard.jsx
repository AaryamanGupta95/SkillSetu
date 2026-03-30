import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  LayoutDashboard, Compass, User, Wallet, Bell, PlayCircle,
  LogOut, TrendingUp, Clock, BookOpen, ChevronRight, Star, Award, Tag
} from 'lucide-react';
import { api, getUser } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Fetch latest profile from server
    const fetchProfile = async () => {
      try {
        const result = await api.getProfile();
        if (result.user) {
          setUser(result.user);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    // GSAP entry animation
    gsap.fromTo(headerRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );

    cardsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.15 + i * 0.1, ease: 'power3.out' }
      );
    });
  }, []);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const firstName = user?.fullName?.split(' ')[0] || 'User';

  // Mock sessions and recommendations (would come from API later)
  const sessions = [
    { title: 'Advanced Python', mentor: 'Rahul Verma', time: 'Today, 5:00 PM' },
    { title: 'React Hooks Deep Dive', mentor: 'Priya Sharma', time: 'Tomorrow, 3:00 PM' },
  ];

  const recommendations = [
    { title: 'UI/UX Masterclass', credits: 400, mentor: 'Neha Roy', rating: 4.8 },
    { title: 'Data Structures in Java', credits: 350, mentor: 'Vikram Singh', rating: 4.9 },
    { title: 'Cloud with AWS', credits: 500, mentor: 'Ankit Jain', rating: 4.7 },
  ];

  return (
    <>
        {/* Header */}
        <header className="dashboard-header" ref={headerRef}>
          <div className="welcome-text">
            <h1>Welcome back, {firstName}</h1>
            <p>{user?.email}</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn notification-btn">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </button>
            <div className="avatar-circle">{getInitials(user?.fullName)}</div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">

          {/* Credit Balance Card */}
          <section className="credit-card dash-card highlight-border" ref={el => (cardsRef.current[0] = el)}>
            <div className="card-header">
              <h3>Available Credits</h3>
              <Wallet size={22} />
            </div>
            <div className="credit-amount">
              <span className="amount">{(user?.wallet?.balance || user?.credits || 0).toLocaleString()}</span>
              <span className="currency">SC</span>
            </div>
            <div className="credit-meta">
              <span className="credit-change positive"><TrendingUp size={14} /> Account Balance</span>
            </div>
            <button className="btn-primary full-width mt-4" onClick={() => navigate('/store')}>Spend Credits</button>
          </section>

          {/* Upcoming Sessions */}
          <section className="sessions-card dash-card" ref={el => (cardsRef.current[1] = el)}>
            <div className="card-header">
              <h3>Upcoming Sessions</h3>
              <Clock size={20} />
            </div>
            <div className="session-list">
              {sessions.map((s, i) => (
                <div key={i} className="session-item">
                  <div className="session-icon"><PlayCircle size={20} /></div>
                  <div className="session-details">
                    <h4>{s.title}</h4>
                    <p>with {s.mentor} · {s.time}</p>
                  </div>
                  <button className="btn-outline">Join</button>
                </div>
              ))}
            </div>
          </section>

          {/* User's Skills Card */}
          <section className="skills-card dash-card col-span-2" ref={el => (cardsRef.current[2] = el)}>
            <div className="card-header">
              <h3>Your Skills</h3>
              <Tag size={20} />
            </div>
            <div className="skills-row">
              <div className="skills-column">
                <h4 className="skills-label">Skills You Teach</h4>
                <div className="skill-tags">
                  {user?.skillsOffered?.length > 0
                    ? user.skillsOffered.map((s, i) => (
                        <span key={i} className="skill-tag teach">{s}</span>
                      ))
                    : <span className="skill-empty">No skills added yet</span>
                  }
                </div>
              </div>
              <div className="skills-divider"></div>
              <div className="skills-column">
                <h4 className="skills-label">Skills You're Learning</h4>
                <div className="skill-tags">
                  {user?.skillsWanted?.length > 0
                    ? user.skillsWanted.map((s, i) => (
                        <span key={i} className="skill-tag learn">{s}</span>
                      ))
                    : <span className="skill-empty">No skills added yet</span>
                  }
                </div>
              </div>
            </div>
          </section>

          {/* Recommended Skills */}
          <section className="recommendations-card dash-card col-span-2" ref={el => (cardsRef.current[3] = el)}>
            <div className="card-header">
              <h3>Recommended for You</h3>
              <a href="#" className="view-all-link">View All <ChevronRight size={16} /></a>
            </div>
            <div className="recommendations-grid">
              {recommendations.map((r, i) => (
                <div key={i} className="rec-card">
                  <div className="rec-image">
                    <div className="rec-badge">{r.credits} SC</div>
                  </div>
                  <div className="rec-info">
                    <h4>{r.title}</h4>
                    <p className="rec-mentor">by {r.mentor}</p>
                    <div className="rec-rating">
                      <Star size={12} fill="currentColor" /> {r.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
    </>
  );
};

export default Dashboard;
