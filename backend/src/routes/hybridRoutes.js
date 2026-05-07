const express = require('express');
const router = express.Router();
const {
  getTelemetry,
  getWeather,
  getSessionLogs,
  getTelemetryStats
} = require('../controllers/hybridController');

// Hybrid query routes
router.get('/telemetry/:raceId', getTelemetry);
router.get('/weather/:raceId', getWeather);
router.get('/session-logs/:raceId', getSessionLogs);
router.get('/telemetry-stats/:raceId', getTelemetryStats);

module.exports = router;