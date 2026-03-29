import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Compass, User, Wallet, Bell, LogOut, Award, PlayCircle, Inbox, Trophy, Shield, Briefcase } from 'lucide-react';
import { logout } from '../services/api';

const Sidebar = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const userRole = userString ? JSON.parse(userString).role : 'user';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>SkillSetu</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Compass size={18} /> Marketplace
        </NavLink>
        <NavLink to="/sessions" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <PlayCircle size={18} /> Sessions
        </NavLink>
        <NavLink to="/requests" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Inbox size={18} /> Requests
        </NavLink>
        <NavLink to="/community" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Award size={18} /> Community
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Trophy size={18} /> Leaderboard
        </NavLink>
        <NavLink to="/wallet" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Wallet size={18} /> Wallet
        </NavLink>
        <NavLink to="/store" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Wallet size={18} /> Store
        </NavLink>
        <NavLink to="/notifications" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <Bell size={18} /> Notifications
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <User size={18} /> Profile
        </NavLink>
        {userRole === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Shield size={18} /> Admin
          </NavLink>
        )}
        {(userRole === 'admin' || userRole === 'recruiter') && (
          <NavLink to="/recruiter" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <Briefcase size={18} /> Talent Pool
          </NavLink>
        )}
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="nav-item text-danger" style={{background: 'transparent', border:'none', width:'100%', textAlign:'left', cursor:'pointer' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
