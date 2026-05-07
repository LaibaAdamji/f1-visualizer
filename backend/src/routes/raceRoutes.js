const express = require('express');
const router = express.Router();
const { getAllRaces, getRaceResults, getRacesByCircuit } = require('../controllers/raceController');

router.get('/', getAllRaces);
router.get('/results/:raceId', getRaceResults);
router.get('/circuit/:circuitId', getRacesByCircuit);

module.exports = router;