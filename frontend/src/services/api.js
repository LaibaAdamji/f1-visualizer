import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Driver endpoints
export const getDrivers = () => api.get('/drivers');
export const getDriverStats = (driverId) => api.get(`/drivers/stats/${driverId}`);
export const getDriverStandings = (seasonId) => api.get(`/drivers/standings/${seasonId}`);

// Race endpoints
export const getRaces = () => api.get('/races');
export const getRaceResults = (raceId) => api.get(`/races/results/${raceId}`);
export const getRacesByCircuit = (circuitId) => api.get(`/races/circuit/${circuitId}`);

// Team endpoints
export const getTeams = () => api.get('/teams');
export const getTeamDrivers = (teamId, seasonId) => api.get(`/teams/${teamId}/drivers/${seasonId}`);
export const getTeamStats = (teamId) => api.get(`/teams/stats/${teamId}`);

// View endpoints
export const getDriverPerformance = () => api.get('/views/driver-performance');
export const getTeamStandings = () => api.get('/views/team-standings');
export const getRaceWinners = () => api.get('/views/race-winners');
export const getCurrentLineups = () => api.get('/views/current-lineups');
export const getCircuitStats = () => api.get('/views/circuit-stats');

export default api;