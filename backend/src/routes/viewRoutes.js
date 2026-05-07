const express = require('express');
const router = express.Router();
const {
  getDriverPerformance,
  getTeamStandings,
  getRaceWinners,
  getCurrentLineups,
  getCircuitStats
} = require('../controllers/viewController');

router.get('/driver-performance', getDriverPerformance);
router.get('/team-standings', getTeamStandings);
router.get('/race-winners', getRaceWinners);
router.get('/current-lineups', getCurrentLineups);
router.get('/circuit-stats', getCircuitStats);

module.exports = router;