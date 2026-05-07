const { Telemetry, Weather, SessionLog } = require('../models/mongo');
const { Driver, Race, Team, Circuit, Season } = require('../models');

/**
 * Get telemetry data enriched with driver and race information
 * Simulates a "JOIN" between MongoDB and PostgreSQL
 */
const getTelemetryWithDetails = async (raceId) => {
  try {
    // Step 1: Get telemetry from MongoDB
    const telemetryData = await Telemetry.find({ raceId })
      .sort({ timestamp: 1 })
      .limit(100);

    if (telemetryData.length === 0) {
      return {
        success: true,
        source: 'Hybrid Query (PostgreSQL + MongoDB)',
        message: 'No telemetry data found for this race',
        data: []
      };
    }

    // Step 2: Extract unique driver IDs
    const driverIds = [...new Set(telemetryData.map(t => t.driverId))];

    // Step 3: Get driver details from PostgreSQL
    const drivers = await Driver.findAll({
      where: { driverId: driverIds },
      attributes: ['driverId', 'firstName', 'lastName', 'nationality']
    });

    // Step 4: Get race details from PostgreSQL
    const race = await Race.findByPk(raceId, {
      include: [
        { model: Circuit, as: 'circuit' },
        { model: Season, as: 'season' }
      ]
    });

    if (!race) {
      throw new Error('Race not found in relational database');
    }

    // Step 5: Create a driver lookup map
    const driverMap = {};
    drivers.forEach(d => {
      driverMap[d.driverId] = {
        id: d.driverId,
        name: `${d.firstName} ${d.lastName}`,
        nationality: d.nationality
      };
    });

    // Step 6: Merge data (manual "JOIN")
    const enrichedData = telemetryData.map(telemetry => ({
      timestamp: telemetry.timestamp,
      lapNumber: telemetry.lapNumber,
      sessionType: telemetry.sessionType,
      trackStatus: telemetry.trackStatus,
      driver: driverMap[telemetry.driverId] || { 
        id: telemetry.driverId, 
        name: 'Unknown', 
        nationality: 'Unknown' 
      },
      race: {
        id: race.raceId,
        name: race.raceName,
        date: race.raceDate,
        circuit: race.circuit.circuitName,
        season: race.season.year
      },
      telemetry: {
        speed: telemetry.telemetryData.speed,
        rpm: telemetry.telemetryData.rpm,
        gear: telemetry.telemetryData.gear,
        throttle: telemetry.telemetryData.throttle,
        brake: telemetry.telemetryData.brake,
        drs: telemetry.telemetryData.drs,
        tires: telemetry.telemetryData.tires,
        engine: telemetry.telemetryData.engine
      }
    }));

    return {
      success: true,
      source: 'Hybrid Query (PostgreSQL + MongoDB)',
      count: enrichedData.length,
      data: enrichedData
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get weather data with race context
 */
const getWeatherWithRaceDetails = async (raceId) => {
  try {
    // MongoDB query
    const weatherData = await Weather.find({ raceId }).sort({ timestamp: 1 });

    if (weatherData.length === 0) {
      return {
        success: true,
        source: 'Hybrid Query (PostgreSQL + MongoDB)',
        message: 'No weather data found for this race',
        data: []
      };
    }

    // PostgreSQL query
    const race = await Race.findByPk(raceId, {
      include: [
        { model: Circuit, as: 'circuit' },
        { model: Season, as: 'season' }
      ]
    });

    if (!race) {
      throw new Error('Race not found in relational database');
    }

    return {
      success: true,
      source: 'Hybrid Query (PostgreSQL + MongoDB)',
      race: {
        id: race.raceId,
        name: race.raceName,
        circuit: race.circuit.circuitName,
        country: race.circuit.country,
        date: race.raceDate,
        season: race.season.year
      },
      count: weatherData.length,
      weather: weatherData.map(w => ({
        timestamp: w.timestamp,
        conditions: w.conditions,
        source: w.source
      }))
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get session logs with enriched driver and race data
 */
const getSessionLogsWithDetails = async (raceId) => {
  try {
    // MongoDB query
    const logs = await SessionLog.find({ raceId }).sort({ timestamp: 1 });

    if (logs.length === 0) {
      return {
        success: true,
        source: 'Hybrid Query (PostgreSQL + MongoDB)',
        message: 'No session logs found for this race',
        data: []
      };
    }

    // Get all driver IDs from logs
    const driverIds = [...new Set(
      logs.flatMap(log => log.event.driversInvolved || [])
    )];

    // Get driver details
    const drivers = await Driver.findAll({
      where: { driverId: driverIds }
    });

    // Get race details
    const race = await Race.findByPk(raceId, {
      include: [
        { model: Circuit, as: 'circuit' },
        { model: Season, as: 'season' }
      ]
    });

    if (!race) {
      throw new Error('Race not found in relational database');
    }

    // Create driver lookup
    const driverMap = {};
    drivers.forEach(d => {
      driverMap[d.driverId] = `${d.firstName} ${d.lastName}`;
    });

    // Enrich logs with driver names
    const enrichedLogs = logs.map(log => ({
      timestamp: log.timestamp,
      sessionType: log.sessionType,
      eventType: log.event.type,
      message: log.message,
      severity: log.severity,
      driversInvolved: (log.event.driversInvolved || []).map(id => ({
        id,
        name: driverMap[id] || 'Unknown'
      })),
      details: log.event.details,
      location: log.event.location
    }));

    return {
      success: true,
      source: 'Hybrid Query (PostgreSQL + MongoDB)',
      race: {
        name: race.raceName,
        circuit: race.circuit.circuitName,
        date: race.raceDate,
        season: race.season.year
      },
      count: enrichedLogs.length,
      data: enrichedLogs
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get aggregated telemetry statistics per driver for a race
 */
const getDriverTelemetryStats = async (raceId) => {
  try {
    const stats = await Telemetry.aggregate([
      { $match: { raceId: parseInt(raceId) } },
      {
        $group: {
          _id: '$driverId',
          avgSpeed: { $avg: '$telemetryData.speed' },
          maxSpeed: { $max: '$telemetryData.speed' },
          avgRPM: { $avg: '$telemetryData.rpm' },
          totalLaps: { $max: '$lapNumber' },
          recordCount: { $sum: 1 }
        }
      }
    ]);

    // Get driver details from PostgreSQL
    const driverIds = stats.map(s => s._id);
    const drivers = await Driver.findAll({
      where: { driverId: driverIds }
    });

    const driverMap = {};
    drivers.forEach(d => {
      driverMap[d.driverId] = `${d.firstName} ${d.lastName}`;
    });

    const enrichedStats = stats.map(stat => ({
      driverId: stat._id,
      driverName: driverMap[stat._id] || 'Unknown',
      avgSpeed: Math.round(stat.avgSpeed * 100) / 100,
      maxSpeed: Math.round(stat.maxSpeed * 100) / 100,
      avgRPM: Math.round(stat.avgRPM),
      totalLaps: stat.totalLaps,
      telemetryRecords: stat.recordCount
    }));

    return {
      success: true,
      source: 'MongoDB Aggregation + PostgreSQL JOIN',
      count: enrichedStats.length,
      data: enrichedStats
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTelemetryWithDetails,
  getWeatherWithRaceDetails,
  getSessionLogsWithDetails,
  getDriverTelemetryStats
};