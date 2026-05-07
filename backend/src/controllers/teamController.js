const { Team, TeamDriverSeason, Driver, Season } = require('../models');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

/**
 * Get all teams
 */
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      order: [['teamName', 'ASC']]
    });

    res.json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get team with drivers for a season
 * Demonstrates: Ternary relationship query
 */
const getTeamDrivers = async (req, res) => {
  try {
    const { teamId, seasonId } = req.params;

    const teamDrivers = await sequelize.query(`
      SELECT 
        t.team_name,
        d.driver_id,
        d.first_name,
        d.last_name,
        tds.contract_type,
        tds.car_number,
        s.year as season
      FROM team_driver_seasons tds
      INNER JOIN teams t ON tds.team_id = t.team_id
      INNER JOIN drivers d ON tds.driver_id = d.driver_id
      INNER JOIN seasons s ON tds.season_id = s.season_id
      WHERE tds.team_id = :teamId AND tds.season_id = :seasonId
      ORDER BY tds.contract_type DESC, d.last_name ASC
    `, {
      replacements: { teamId, seasonId },
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      teamId: teamId,
      seasonId: seasonId,
      data: teamDrivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get team statistics
 * Demonstrates: Complex aggregation
 */
const getTeamStats = async (req, res) => {
  try {
    const { teamId } = req.params;

    const stats = await sequelize.query(`
      SELECT 
        t.team_id,
        t.team_name,
        COUNT(rp.participation_id) as total_entries,
        SUM(rp.points) as total_points,
        COUNT(CASE WHEN rp.position = 1 THEN 1 END) as wins,
        COUNT(CASE WHEN rp.position <= 3 THEN 1 END) as podiums
      FROM teams t
      LEFT JOIN race_participations rp ON t.team_id = rp.team_id
      WHERE t.team_id = :teamId
      GROUP BY t.team_id, t.team_name
    `, {
      replacements: { teamId },
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllTeams,
  getTeamDrivers,
  getTeamStats
};