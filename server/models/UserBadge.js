const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserBadge = sequelize.define('UserBadge', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  badgeId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'user_badges', timestamps: true });

module.exports = UserBadge;
