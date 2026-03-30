const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  profilePicture: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  mobileNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  githubLink: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  portfolioLink: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  // Skills stored as CSV (SkillSetu style)
  skillsOffered: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
    get() {
      const raw = this.getDataValue('skillsOffered');
      return raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : [];
    },
    set(val) {
      this.setDataValue('skillsOffered', Array.isArray(val) ? val.join(',') : val);
    },
  },
  skillsWanted: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
    get() {
      const raw = this.getDataValue('skillsWanted');
      return raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : [];
    },
    set(val) {
      this.setDataValue('skillsWanted', Array.isArray(val) ? val.join(',') : val);
    },
  },
  credits: {
    type: DataTypes.INTEGER,
    defaultValue: 500,
  },
  // Role-based access
  role: {
    type: DataTypes.ENUM('user', 'mentor', 'admin', 'recruiter'),
    defaultValue: 'user',
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  availability: {
    type: DataTypes.STRING(255),
    defaultValue: 'Available',
  },
  // Performance metrics
  totalHoursTaught: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalHoursLearned: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  sessionsCompleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  averageRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  reputationScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // Gamification
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastActiveDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  // Password reset
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
