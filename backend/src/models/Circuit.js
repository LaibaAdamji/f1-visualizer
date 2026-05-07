const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Circuit = sequelize.define('Circuit', {
  circuitId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'circuit_id'
  },
  circuitName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'circuit_name'
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  length: {
    type: DataTypes.DECIMAL(5, 3),
    allowNull: false,
    comment: 'Circuit length in kilometers'
  }
}, {
  tableName: 'circuits',
  timestamps: true,
  indexes: [
    {
      unique: false,
      fields: ['country']
    }
  ]
});

module.exports = Circuit;