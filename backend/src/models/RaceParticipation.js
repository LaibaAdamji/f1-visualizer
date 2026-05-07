const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RaceParticipation = sequelize.define('RaceParticipation', {
  participationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'participation_id'
  },
  // Ternary Relationship Foreign Keys
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'driver_id',
    references: {
      model: 'drivers',
      key: 'driver_id'
    }
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'team_id',
    references: {
      model: 'teams',
      key: 'team_id'
    }
  },
  raceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'race_id',
    references: {
      model: 'races',
      key: 'race_id'
    }
  },
  // Relationship Attributes
  position: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 20
    }
  },
  points: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: false,
    defaultValue: 0
  },
  fastestLap: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'fastest_lap'
  },
  gridPosition: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'grid_position',
    validate: {
      min: 1,
      max: 20
    }
  },
  status: {
    type: DataTypes.ENUM('Finished', 'DNF', 'DNS', 'DSQ'),
    allowNull: false,
    defaultValue: 'Finished'
  }
}, {
  tableName: 'race_participations',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['driver_id', 'race_id']
    },
    {
      fields: ['team_id', 'race_id']
    },
    {
      fields: ['position']
    }
  ]
});

module.exports = RaceParticipation;