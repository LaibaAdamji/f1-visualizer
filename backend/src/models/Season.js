const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Season = sequelize.define('Season', {
  seasonId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'season_id'
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      min: 1950,
      max: 2100
    }
  }
}, {
  tableName: 'seasons',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['year']
    }
  ]
});

module.exports = Season;