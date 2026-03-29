const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM('session_request', 'request_accepted', 'request_rejected', 'session_started', 'session_completed', 'rating_received', 'credits_earned', 'badge_earned', 'system'), allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  linkTo: { type: DataTypes.STRING(500), allowNull: true },
}, { tableName: 'notifications', timestamps: true });

module.exports = Notification;
