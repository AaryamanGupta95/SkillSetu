const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sessionId: { type: DataTypes.INTEGER, allowNull: false },
  senderId: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.ENUM('text', 'file', 'system'), defaultValue: 'text' },
  fileUrl: { type: DataTypes.STRING(500), allowNull: true },
}, { tableName: 'messages', timestamps: true });

module.exports = Message;
