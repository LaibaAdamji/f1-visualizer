const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PracticeSession = sequelize.define('PracticeSession', {
  sessionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'session_id'
  },
  sessionNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'session_number',
    validate: {
      min: 1,
      max: 3
    }
  },
  sessionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'session_date'
  },
  sessionType: {
    type: DataTypes.ENUM('FP1', 'FP2', 'FP3'),
    allowNull: false,
    field: 'session_type'
  },
  // Foreign Key (Weak Entity Dependency)
  raceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'race_id',
    references: {
      model: 'races',
      key: 'race_id'
    }
  }
}, {
  tableName: 'practice_sessions',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['race_id', 'session_number']
    }
  ]
});

module.exports = PracticeSession;