const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Driver = sequelize.define('Driver', {
  driverId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'driver_id'
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'last_name'
  },
  nationality: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'date_of_birth'
  },
  championshipsWon: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'championships_won'
  }
}, {
  tableName: 'drivers',
  timestamps: true,
  indexes: [
    {
      unique: false,
      fields: ['nationality']
    },
    {
      unique: true,
      fields: ['first_name', 'last_name', 'date_of_birth']
    }
  ]
});

module.exports = Driver;