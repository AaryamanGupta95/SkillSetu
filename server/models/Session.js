const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Session = sequelize.define('Session', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  requestId: { type: DataTypes.INTEGER, allowNull: false },
  mentorId: { type: DataTypes.INTEGER, allowNull: false },
  learnerId: { type: DataTypes.INTEGER, allowNull: false },
  skillId: { type: DataTypes.INTEGER, allowNull: true },
  topic: { type: DataTypes.STRING(255), allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  scheduledDate: { type: DataTypes.DATE, allowNull: false },
  startTime: { type: DataTypes.DATE, allowNull: true },
  endTime: { type: DataTypes.DATE, allowNull: true },
  status: { type: DataTypes.ENUM('confirmed', 'active', 'completed', 'cancelled', 'disputed'), defaultValue: 'confirmed' },
  isMentorSession: { type: DataTypes.BOOLEAN, defaultValue: false },
  creditsLocked: { type: DataTypes.INTEGER, defaultValue: 0 },
  mentorRated: { type: DataTypes.BOOLEAN, defaultValue: false },
  learnerRated: { type: DataTypes.BOOLEAN, defaultValue: false },
  messageCount: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'sessions', timestamps: true });

module.exports = Session;
