const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM('earned', 'spent', 'locked', 'unlocked', 'bonus', 'refund'), allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.STRING(500), allowNull: false },
  sessionId: { type: DataTypes.INTEGER, allowNull: true },
  balanceAfter: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'transactions', timestamps: true });

module.exports = Transaction;
