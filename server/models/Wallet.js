const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Wallet = sequelize.define('Wallet', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  balance: { type: DataTypes.INTEGER, defaultValue: 100 },
  locked: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalEarned: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalSpent: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'wallets', timestamps: true });

module.exports = Wallet;
