const { Race, Circuit, Season, RaceParticipation, Driver, Team } = require('../models');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

/**
 * Get all races with circuit and season info
 * Demonstrates: Multiple JOINs
 */
const getAllRaces = async (req, res) => {
  try {
    const races = await Race.findAll({
      include: [
        { model: Circuit, as: 'circuit' },
        { model: Season, as: 'season' }
      ],
      order: [['raceDate', 'DESC']]
    });

    res.json({
      success: true,
      count: races.length,
      data: races
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get race results with full details
 * Demonstrates: Complex multi-table JOIN
 */
const getRaceResults = async (req, res) => {
  try {
    const { raceId } = req.params;

    const results = await sequelize.query(`
      SELECT 
        rp.position,
        d.first_name,
        d.last_name,
        t.team_name,
        rp.grid_position,
        rp.points,
        rp.fastest_lap,
        rp.status,
        r.race_name,
        c.circuit_name,
        s.year as season
      FROM race_participations rp
      INNER JOIN drivers d ON rp.driver_id = d.driver_id
      INNER JOIN teams t ON rp.team_id = t.team_id
      INNER JOIN races r ON rp.race_id = r.race_id
      INNER JOIN circuits c ON r.circuit_id = c.circuit_id
      INNER JOIN seasons s ON r.season_id = s.season_id
      WHERE rp.race_id = :raceId
      ORDER BY 
        CASE WHEN rp.position IS NULL THEN 1 ELSE 0 END,
        rp.position ASC
    `, {
      replacements: { raceId },
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      raceId: raceId,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get races by circuit with winner history
 * Demonstrates: Nested subquery
 */
const getRacesByCircuit = async (req, res) => {
  try {
    const { circuitId } = req.params;

    const races = await sequelize.query(`
      SELECT 
        r.race_id,
        r.race_name,
        r.race_date,
        s.year as season,
        (
          SELECT CONCAT(d.first_name, ' ', d.last_name)
          FROM race_participations rp
          INNER JOIN drivers d ON rp.driver_id = d.driver_id
          WHERE rp.race_id = r.race_id AND rp.position = 1
          LIMIT 1
        ) as winner
      FROM races r
      INNER JOIN seasons s ON r.season_id = s.season_id
      WHERE r.circuit_id = :circuitId
      ORDER BY r.race_date DESC
    `, {
      replacements: { circuitId },
      type: QueryTypes.SELECT
    });

    res.json({
      success: true,
      circuitId: circuitId,
      count: races.length,
      data: races
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllRaces,
  getRaceResults,
  getRacesByCircuit
};