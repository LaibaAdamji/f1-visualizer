const { Driver, Team, RaceParticipation, Race, Season, TeamDriverSeason } = require('../models');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

/**
 * Get all drivers with their current teams
 * Demonstrates: JOIN operation
 */
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      include: [
        {
          model: TeamDriverSeason,
          as: 'contracts',
          include: [
            { model: Team, as: 'team' },
            { model: Season, as: 'season' }
          ],
          where: { seasonId: 2 }, // 2024 season
          required: false
        }
      ],
      order: [['lastName', 'ASC']]
    });

    res.json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get driver statistics using complex SQL query
 * Demonstrates: Aggregation, GROUP BY, Subqueries
 */
const getDriverStats = async (req, res) => {
  try {
    const { driverId } = req.params;

    // Complex SQL query with aggregations
    const stats = await sequelize.query(`
      SELECT 
        d.driver_id,
        d.first_name,
        d.last_name,
        d.nationality,
        COUNT(rp.participation_id) as total_races,
        SUM(rp.points) as total_points,
        AVG(rp.points) as avg_points_per_race,
        COUNT(CASE WHEN rp.position = 1 THEN 1 END) as wins,
        COUNT(CASE WHEN rp.position <= 3 THEN 1 END) as podiums,
        COUNT(CASE WHEN rp.fastest_lap = true THEN 1 END) as fastest_laps,
        MIN(rp.position) as best_finish,
        COUNT(CASE WHEN rp.status = 'DNF' THEN 1 END) as dnf_count
      FROM drivers d
      LEFT JOIN race_participations rp ON d.driver_id = rp.driver_id
      WHERE d.driver_id = :driverId
      GROUP BY d.driver_id, d.first_name, d.last_name, d.nationality
    `, {
      replacements: { driverId },
      type: QueryTypes.SELECT
    });

    if (stats.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Driver not found'
      });
    }

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

/**
 * Get driver standings for a season
 * Demonstrates: Complex JOIN, ORDER BY, Ranking
 */
const getDriverStandings = async (req, res) => {
  try {
    const { seasonId } = req.params;

    const standings = await sequelize.query(`
      SELECT 
        d.driver_id,
        d.first_name,
        d.last_name,
        t.team_name,
        SUM(rp.points) as total_points,
        COUNT(rp.participation_id) as races_entered,
        COUNT(CASE WHEN rp.position = 1 THEN 1 END) as wins,
        ROW_NUMBER() OVER (ORDER BY SUM(rp.points) DESC) as position
      FROM drivers d
      INNER JOIN race_participations rp ON d.driver_id = rp.driver_id
      INNER JOIN races r ON rp.race_id = r.race_id
      INNER JOIN teams t ON rp.team_id = t.team_id
      WHERE r.season_id = :seasonId
      GROUP BY d.driver_id, d.first_name, d.last_name, t.team_name
      ORDER BY total_points DESC
    `, {
      replacements: { seasonId },
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      season: seasonId,
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

module.exports = {
  getAllDrivers,
  getDriverStats,
  getDriverStandings
};