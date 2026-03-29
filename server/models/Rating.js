const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sessionId: { type: DataTypes.INTEGER, allowNull: false },
  raterId: { type: DataTypes.INTEGER, allowNull: false },
  ratedUserId: { type: DataTypes.INTEGER, allowNull: false },
  teachingQuality: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  communication: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  helpfulness: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  overallRating: { type: DataTypes.FLOAT, allowNull: false },
  review: { type: DataTypes.TEXT, defaultValue: '' },
}, { tableName: 'ratings', timestamps: true });

module.exports = Rating;
