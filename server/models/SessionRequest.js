const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SessionRequest = sequelize.define('SessionRequest', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  senderId: { type: DataTypes.INTEGER, allowNull: false },
  receiverId: { type: DataTypes.INTEGER, allowNull: false },
  skillId: { type: DataTypes.INTEGER, allowNull: true },
  topic: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  duration: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 60 },
  scheduledDate: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'cancelled'), defaultValue: 'pending' },
  creditsRequired: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'session_requests', timestamps: true });

module.exports = SessionRequest;
