const express = require('express');
const router = express.Router();
const { getAllTeams, getTeamDrivers, getTeamStats } = require('../controllers/teamController');

router.get('/', getAllTeams);
router.get('/:teamId/drivers/:seasonId', getTeamDrivers);
router.get('/stats/:teamId', getTeamStats);

module.exports = router;