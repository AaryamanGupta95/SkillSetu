# 🚀 SkillSetu: Exchange Skills, Not Money

SkillSetu is a smart skill-barter platform functioning as a mix of a learning platform, a skill marketplace, and a community. It enables students to teach skills to earn credits and spend them to learn new skills from their peers. Zero cost, infinite growth.

## 🛠️ Tech Stack
- **Frontend:** React.js, React Router, Vite
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **ORM:** Sequelize

---

## 👥 Team Structure & Feature Distribution

This project was built collaboratively by a team of 5 members, each handling the full stack (React + Node + MySQL + Sequelize) of their respective modules.

### 👤 Member 1 – User Entry & Personal Dashboard
Handles the authentication flow, onboarding, and the main user hub.
- **Pages:**
  - `LandingPage` (`/`): Public website with hero section, "how it works", featured mentors, and testimonials.
  - `AuthPage` (`/auth`): Secure registration and login.
  - `Dashboard` (`/dashboard`): Smart user home showing credit balances, recommended mentors, current sessions, and notifications.
  - `NotificationsPage` (`/notifications`): Centralized alerts and updates.
- **Backend/DB:** Users, Auth, JWT Integration.

### 👤 Member 2 – Skill Marketplace & Profiles
Manages how users discover learning opportunities and build their distinct learning identity.
- **Pages:**
  - `ExplorePage` (`/explore`): Skill marketplace to search and filter mentors/learners by rating, level, and credit costs.
  - `ProfilePage` (`/profile`): Creating/updating personal profiles, skills offered/learning.
  - `UserProfilePage` (`/user/:id`): Viewing other users' profiles, reviews, and session history.
- **Backend/DB:** Skills, UserSkills, Ratings, Reviews.

### 👤 Member 3 – Session Booking System
Develops the core interaction of the platform: scheduling and conducting peer-to-peer lessons.
- **Pages:**
  - `SessionsPage` (`/sessions`): Viewing and scheduling upcoming learning sessions.
  - `RequestsPage` (`/requests`): Managing incoming / outgoing session requests.
  - `SessionRoomPage` (`/session/:id`): Live space for the session including a chat, file sharing, and timer.
- **Backend/DB:** Sessions, SessionRequests, Messages, Feedback.

### 👤 Member 4 – Credit Economy & Gamification
Architects the platform's internal currency system and motivates users through gamification.
- **Pages:**
  - `WalletPage` (`/wallet`): Shows current credits, earned/spent history, and transaction logs.
  - `CreditStorePage` (`/store`): Platform economy interaction.
  - `LeaderboardPage` (`/leaderboard`): Gamification features displaying top mentors, hours taught, and badges.
- **Backend/DB:** Credits, Transactions, Achievements, Leaderboard, UserStats.

### 👤 Member 5 – Community & Admin System
Regulates the ecosystem, ensures safety, and builds collaborative spaces.
- **Pages:**
  - `CommunityPage` (`/community`): Skill circles (e.g., React Circle, DSA Circle) with discussion posts.
  - `CommunityDetailsPage` (`/community/:id`): Deep dive into specific community groups, weekly challenges, and Q&A.
  - `AdminPage` (`/admin`): Admin portal to view users, manage reports, block users, and verify skills.
  - `RecruiterPage` (`/recruiter`): Portal for external recruiters to find top mentors based on reputation scores.
- **Backend/DB:** Communities, Posts, Comments, Reports, Admin/Recruiter interactions.

---

## 💻 Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://dev.mysql.com/downloads/) installed and running locally.

### 1. Database Setup
1. Create a MySQL database named `skillsetu` (or your preferred name).
2. Configure your backend `.env` file with your MySQL credentials (User, Password, Database Name, Port).

### 2. Backend (Server) Setup
```bash
cd server
npm install
npm start
# The server will start (default is typically port 5000)
# Sequelize will automatically sync and create tables upon starting.
```

### 3. Frontend (Client) Setup
```bash
cd client
npm install
npm run dev
# The Vite development server will start at http://localhost:5173
```

---

## 🤝 Contributing
- Follow the feature branch workflow: `git checkout -b feature/your-feature-name`
- Ensure all your specific module models and routes are properly synced with the central `server/app.js` and `db.js`.

---
*Built with passion by Team SkillSetu for a culture of shared learning.*
