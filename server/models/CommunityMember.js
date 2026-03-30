const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommunityMember = sequelize.define('CommunityMember', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  communityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('leader', 'member'),
    defaultValue: 'member',
  },
}, {
  tableName: 'community_members',
  timestamps: true,
});

module.exports = CommunityMember;
