const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Skill = sequelize.define('Skill', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  category: { type: DataTypes.STRING(100), defaultValue: 'General' },
  icon: { type: DataTypes.STRING(10), defaultValue: '📘' },
}, { tableName: 'skills', timestamps: true });

module.exports = Skill;
