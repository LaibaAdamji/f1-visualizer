const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TeamDriverSeason = sequelize.define('TeamDriverSeason', {
  contractId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'contract_id'
  },
  // Ternary Relationship Foreign Keys
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'team_id',
    references: {
      model: 'teams',
      key: 'team_id'
    }
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'driver_id',
    references: {
      model: 'drivers',
      key: 'driver_id'
    }
  },
  seasonId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'season_id',
    references: {
      model: 'seasons',
      key: 'season_id'
    }
  },
  // Relationship Attributes
  contractType: {
    type: DataTypes.ENUM('Full-time', 'Reserve', 'Test'),
    allowNull: false,
    defaultValue: 'Full-time',
    field: 'contract_type'
  },
  carNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'car_number',
    validate: {
      min: 1,
      max: 99
    }
  }
}, {
  tableName: 'team_driver_seasons',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['team_id', 'driver_id', 'season_id']
    },
    {
      unique: true,
      fields: ['season_id', 'car_number']
    }
  ]
});

module.exports = TeamDriverSeason;