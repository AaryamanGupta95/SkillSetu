const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  issuer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  issueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'certificates',
  timestamps: true,
});

module.exports = Certificate;
