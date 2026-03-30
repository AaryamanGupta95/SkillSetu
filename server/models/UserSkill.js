const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserSkill = sequelize.define('UserSkill', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  skillId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM('teach', 'learn'), allowNull: false },
  proficiency: { type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'), defaultValue: 'beginner' },
}, { tableName: 'user_skills', timestamps: true });

module.exports = UserSkill;
