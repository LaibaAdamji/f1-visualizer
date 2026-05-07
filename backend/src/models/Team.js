const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Team = sequelize.define('Team', {
  teamId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'team_id'
  },
  teamName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'team_name'
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  foundedYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'founded_year',
    validate: {
      min: 1950,
      max: new Date().getFullYear()
    }
  },
  championshipsWon: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'championships_won'
  }
}, {
  tableName: 'teams',
  timestamps: true,
  indexes: [
    {
      unique: false,
      fields: ['country']
    }
  ]
});

module.exports = Team;