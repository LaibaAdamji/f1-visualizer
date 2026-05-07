const {
  getTelemetryWithDetails,
  getWeatherWithRaceDetails,
  getSessionLogsWithDetails,
  getDriverTelemetryStats
} = require('../services/hybridQueryService');

/**
 * Get telemetry with enriched relational data
 */
const getTelemetry = async (req, res) => {
  try {
    const { raceId } = req.params;
    const result = await getTelemetryWithDetails(raceId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get weather with race context
 */
const getWeather = async (req, res) => {
  try {
    const { raceId } = req.params;
    const result = await getWeatherWithRaceDetails(raceId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get session logs with driver details
 */
const getSessionLogs = async (req, res) => {
  try {
    const { raceId } = req.params;
    const result = await getSessionLogsWithDetails(raceId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get telemetry statistics per driver
 */
const getTelemetryStats = async (req, res) => {
  try {
    const { raceId } = req.params;
    const result = await getDriverTelemetryStats(raceId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getTelemetry,
  getWeather,
  getSessionLogs,
  getTelemetryStats
};