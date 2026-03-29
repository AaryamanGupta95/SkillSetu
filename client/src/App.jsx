import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import CommunityPage from './pages/CommunityPage';
import ExplorePage from './pages/ExplorePage';

// New Pages
import UserProfilePage from './pages/UserProfilePage';
import SessionsPage from './pages/SessionsPage';
import RequestsPage from './pages/RequestsPage';
import SessionRoomPage from './pages/SessionRoomPage';
import WalletPage from './pages/WalletPage';
import LeaderboardPage from './pages/LeaderboardPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';
import CreditStorePage from './pages/CreditStorePage';
import CommunityDetailsPage from './pages/CommunityDetailsPage';
import RecruiterPage from './pages/RecruiterPage';

import Sidebar from './components/Sidebar';
import { isAuthenticated } from './services/api';
import './index.css';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  
  // Try to parse user role for admin access
  const userStr = localStorage.getItem('user');
  let role = 'user';
  if (userStr) {
    try { role = JSON.parse(userStr).role; } catch (e) {}
  }
  
  return React.cloneElement(children, { userRole: role });
};

// Layout wrapper for pages with Sidebar
const AppLayout = ({ children }) => (
  <div className="dashboard-layout">
    <Sidebar />
    <main className="dashboard-content" style={{ overflowY: 'auto', height: '100vh', width: '100%' }}>
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><AppLayout><CommunityPage /></AppLayout></ProtectedRoute>} />
          <Route path="/community/:id" element={<ProtectedRoute><AppLayout><CommunityDetailsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/store" element={<ProtectedRoute><AppLayout><CreditStorePage /></AppLayout></ProtectedRoute>} />
          <Route path="/recruiter" element={<ProtectedRoute><AppLayout><RecruiterPage /></AppLayout></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><AppLayout><ExplorePage /></AppLayout></ProtectedRoute>} />

          {/* New features with AppLayout wrapper */}
          <Route path="/user/:id" element={<ProtectedRoute><AppLayout><UserProfilePage /></AppLayout></ProtectedRoute>} />
          <Route path="/sessions" element={<ProtectedRoute><AppLayout><SessionsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><AppLayout><RequestsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/session/:id" element={<ProtectedRoute><AppLayout><SessionRoomPage /></AppLayout></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><AppLayout><WalletPage /></AppLayout></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><AppLayout><LeaderboardPage /></AppLayout></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><AppLayout><NotificationsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AppLayout><AdminPage /></AppLayout></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
