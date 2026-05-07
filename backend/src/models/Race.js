const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Race = sequelize.define('Race', {
  raceId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'race_id'
  },
  raceName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'race_name'
  },
  raceDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'race_date'
  },
  raceType: {
    type: DataTypes.ENUM('Grand Prix', 'Sprint', 'Qualifying'),
    allowNull: false,
    defaultValue: 'Grand Prix',
    field: 'race_type'
  },
  // Foreign Keys (Weak Entity Dependencies)
  seasonId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'season_id',
    references: {
      model: 'seasons',
      key: 'season_id'
    }
  },
  circuitId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'circuit_id',
    references: {
      model: 'circuits',
      key: 'circuit_id'
    }
  }
}, {
  tableName: 'races',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['season_id', 'circuit_id', 'race_date']
    },
    {
      fields: ['race_date']
    }
  ]
});

module.exports = Race;