const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Community = sequelize.define('Community', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  coverImage: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  memberCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'communities',
  timestamps: true,
});

module.exports = Community;
