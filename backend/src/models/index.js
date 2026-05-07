const Driver = require('./Driver');
const Team = require('./Team');
const Circuit = require('./Circuit');
const Season = require('./Season');
const Race = require('./Race');
const PracticeSession = require('./PracticeSession');
const RaceParticipation = require('./RaceParticipation');
const TeamDriverSeason = require('./TeamDriverSeason');

// Define Relationships

// Race belongs to Season (Weak Entity)
Race.belongsTo(Season, {
  foreignKey: 'seasonId',
  as: 'season'
});
Season.hasMany(Race, {
  foreignKey: 'seasonId',
  as: 'races'
});

// Race belongs to Circuit (Weak Entity)
Race.belongsTo(Circuit, {
  foreignKey: 'circuitId',
  as: 'circuit'
});
Circuit.hasMany(Race, {
  foreignKey: 'circuitId',
  as: 'races'
});

// PracticeSession belongs to Race (Weak Entity)
PracticeSession.belongsTo(Race, {
  foreignKey: 'raceId',
  as: 'race'
});
Race.hasMany(PracticeSession, {
  foreignKey: 'raceId',
  as: 'practiceSessions'
});

// RaceParticipation Ternary Relationship
RaceParticipation.belongsTo(Driver, {
  foreignKey: 'driverId',
  as: 'driver'
});
RaceParticipation.belongsTo(Team, {
  foreignKey: 'teamId',
  as: 'team'
});
RaceParticipation.belongsTo(Race, {
  foreignKey: 'raceId',
  as: 'race'
});

Driver.hasMany(RaceParticipation, {
  foreignKey: 'driverId',
  as: 'participations'
});
Team.hasMany(RaceParticipation, {
  foreignKey: 'teamId',
  as: 'participations'
});
Race.hasMany(RaceParticipation, {
  foreignKey: 'raceId',
  as: 'participations'
});

// TeamDriverSeason Ternary Relationship
TeamDriverSeason.belongsTo(Team, {
  foreignKey: 'teamId',
  as: 'team'
});
TeamDriverSeason.belongsTo(Driver, {
  foreignKey: 'driverId',
  as: 'driver'
});
TeamDriverSeason.belongsTo(Season, {
  foreignKey: 'seasonId',
  as: 'season'
});

Team.hasMany(TeamDriverSeason, {
  foreignKey: 'teamId',
  as: 'contracts'
});
Driver.hasMany(TeamDriverSeason, {
  foreignKey: 'driverId',
  as: 'contracts'
});
Season.hasMany(TeamDriverSeason, {
  foreignKey: 'seasonId',
  as: 'contracts'
});

// Export all models
module.exports = {
  Driver,
  Team,
  Circuit,
  Season,
  Race,
  PracticeSession,
  RaceParticipation,
  TeamDriverSeason
};