const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Badge = sequelize.define('Badge', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  description: { type: DataTypes.STRING(255), allowNull: false },
  icon: { type: DataTypes.STRING(50), defaultValue: '🏆' },
  criteria: { type: DataTypes.STRING(255), allowNull: false },
  threshold: { type: DataTypes.INTEGER, defaultValue: 1 },
}, { tableName: 'badges', timestamps: true });

module.exports = Badge;
