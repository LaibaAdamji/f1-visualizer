const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

/**
 * Get driver performance from view
 */
const getDriverPerformance = async (req, res) => {
  try {
    const performance = await sequelize.query(
      'SELECT * FROM driver_performance_summary ORDER BY total_points DESC',
      { type: QueryTypes.SELECT }
    );

    res.json({
      success: true,
      source: 'Virtual Table (View)',
      count: performance.length,
      data: performance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get team standings from view
 */
const getTeamStandings = async (req, res) => {
  try {
    const standings = await sequelize.query(
      'SELECT * FROM team_standings',
      { type: QueryTypes.SELECT }
    );

    res.json({
      success: true,
      source: 'Virtual Table (View)',
      count: standings.length,
      data: standings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get race winners from view
 */
const getRaceWinners = async (req, res) => {
  try {
    const winners = await sequelize.query(
      'SELECT * FROM race_winners',
      { type: QueryTypes.SELECT }
    );

    res.json({
      success: true,
      source: 'Virtual Table (View)',
      count: winners.length,
      data: winners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get current driver lineups from view
 */
const getCurrentLineups = async (req, res) => {
  try {
    const lineups = await sequelize.query(
      'SELECT * FROM current_driver_lineups',
      { type: QueryTypes.SELECT }
    );

    res.json({
      success: true,
      source: 'Virtual Table (View)',
      count: lineups.length,
      data: lineups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get circuit statistics from view
 */
const getCircuitStats = async (req, res) => {
  try {
    const stats = await sequelize.query(
      'SELECT * FROM circuit_statistics',
      { type: QueryTypes.SELECT }
    );

    res.json({
      success: true,
      source: 'Virtual Table (View)',
      count: stats.length,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getDriverPerformance,
  getTeamStandings,
  getRaceWinners,
  getCurrentLineups,
  getCircuitStats
};