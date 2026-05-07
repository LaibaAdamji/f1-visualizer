const express = require('express');
const router = express.Router();
const { getAllDrivers, getDriverStats, getDriverStandings } = require('../controllers/driverController');

router.get('/', getAllDrivers);
router.get('/stats/:driverId', getDriverStats);
router.get('/standings/:seasonId', getDriverStandings);

module.exports = router;