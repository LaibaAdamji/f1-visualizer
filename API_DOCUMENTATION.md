# F1 Analytics - API Documentation

Complete REST API reference for the Formula 1 Analytics platform.

## Table of Contents
1. [Base URL & Authentication](#base-url--authentication)
2. [Response Format](#response-format)
3. [Endpoints](#endpoints)
4. [Error Handling](#error-handling)
5. [Examples](#examples)

## Base URL & Authentication

**Development:**
```
http://localhost:5000/api
```

**Production:**
```
https://api.your-domain.com/api
```

No authentication required for public endpoints. All requests use standard HTTP methods (GET, POST, etc.).

## Response Format

All responses are JSON with the following structure:

### Success Response
```json
{
  "data": { /* Response data */ },
  "status": 200
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400
}
```

## Endpoints

### Health Check

#### GET /health
Check API status and connectivity.

**Response:**
```json
{
  "status": "OK",
  "message": "F1 Visualizer API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Drivers

### GET /drivers
Get all drivers in the database.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Maximum results (default: 100) |
| offset | number | Pagination offset (default: 0) |

**Response:**
```json
{
  "data": [
    {
      "driverId": 1,
      "firstName": "Max",
      "lastName": "Verstappen",
      "nationality": "Dutch",
      "dateOfBirth": "1997-12-31",
      "championshipsWon": 3
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/drivers
curl http://localhost:5000/api/drivers?limit=10&offset=0
```

---

### GET /drivers/stats/:driverId
Get detailed statistics for a specific driver.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| driverId | number | Yes | Driver ID |

**Response:**
```json
{
  "data": {
    "driverId": 1,
    "firstName": "Max",
    "lastName": "Verstappen",
    "totalPoints": 575,
    "wins": 25,
    "podiums": 45,
    "polePositions": 18,
    "fastestLaps": 15
  }
}
```

**Example:**
```bash
curl http://localhost:5000/api/drivers/stats/1
```

---

### GET /drivers/standings/:seasonId
Get driver championship standings for a specific season.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| seasonId | number | Yes | Season ID (e.g., 2 for 2024) |

**Response:**
```json
{
  "data": [
    {
      "position": 1,
      "driver_id": 1,
      "first_name": "Max",
      "last_name": "Verstappen",
      "team_name": "Red Bull Racing",
      "total_points": 575,
      "wins": 25,
      "podiums": 45,
      "races_entered": 24
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/drivers/standings/2
```

---

## Races

### GET /races
Get all races in the database.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| season | number | Filter by season ID |
| limit | number | Maximum results (default: 100) |
| offset | number | Pagination offset (default: 0) |

**Response:**
```json
{
  "data": [
    {
      "raceId": 1,
      "raceName": "Bahrain Grand Prix",
      "circuit": {
        "circuitId": 1,
        "circuitName": "Bahrain International Circuit",
        "country": "Bahrain",
        "location": "Sakhir",
        "length": 5.412
      },
      "raceDate": "2024-03-02",
      "raceType": "Grand Prix"
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/races
curl http://localhost:5000/api/races?season=2
```

---

### GET /races/results/:raceId
Get detailed results for a specific race.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| raceId | number | Yes | Race ID |

**Response:**
```json
{
  "data": {
    "raceId": 1,
    "raceName": "Bahrain Grand Prix",
    "results": [
      {
        "position": 1,
        "driver_name": "Max Verstappen",
        "team": "Red Bull Racing",
        "points": 25,
        "laps_completed": 57
      }
    ]
  }
}
```

**Example:**
```bash
curl http://localhost:5000/api/races/results/1
```

---

### GET /races/circuit/:circuitId
Get all races held at a specific circuit.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| circuitId | number | Yes | Circuit ID |

**Response:**
```json
{
  "data": [
    {
      "raceId": 1,
      "raceName": "Bahrain Grand Prix",
      "raceDate": "2024-03-02",
      "season": 2024
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/races/circuit/1
```

---

## Teams

### GET /teams
Get all Formula 1 teams.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Maximum results (default: 100) |
| offset | number | Pagination offset (default: 0) |

**Response:**
```json
{
  "data": [
    {
      "teamId": 1,
      "teamName": "Red Bull Racing",
      "country": "Austria",
      "foundedYear": 2005,
      "championshipsWon": 6
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/teams
```

---

### GET /teams/:teamId/drivers/:seasonId
Get drivers for a team in a specific season.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| teamId | number | Yes | Team ID |
| seasonId | number | Yes | Season ID |

**Response:**
```json
{
  "data": [
    {
      "driverId": 1,
      "firstName": "Max",
      "lastName": "Verstappen",
      "nationality": "Dutch",
      "raceNumber": 1
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/teams/1/drivers/2
```

---

### GET /teams/stats/:teamId
Get statistics for a specific team.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| teamId | number | Yes | Team ID |

**Response:**
```json
{
  "data": {
    "teamId": 1,
    "teamName": "Red Bull Racing",
    "totalPoints": 1150,
    "wins": 50,
    "podiums": 90,
    "polePositions": 36,
    "championships": 6
  }
}
```

**Example:**
```bash
curl http://localhost:5000/api/teams/stats/1
```

---

## Views (Optimized Queries)

These endpoints use pre-calculated database views for optimized performance.

### GET /views/driver-performance
Get performance metrics for all drivers.

**Response:**
```json
{
  "data": [
    {
      "driver_id": 1,
      "first_name": "Max",
      "last_name": "Verstappen",
      "nationality": "Dutch",
      "team_name": "Red Bull Racing",
      "total_points": 575,
      "wins": 25,
      "podiums": 45,
      "races_entered": 24
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/views/driver-performance
```

---

### GET /views/team-standings
Get current team championship standings.

**Response:**
```json
{
  "data": [
    {
      "team_id": 1,
      "team_name": "Red Bull Racing",
      "total_points": 1150,
      "wins": 50,
      "podiums": 90,
      "races_completed": 24,
      "season": 2024
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/views/team-standings
```

---

### GET /views/race-winners
Get recent race winners.

**Response:**
```json
{
  "data": [
    {
      "race_id": 24,
      "race_name": "Abu Dhabi Grand Prix",
      "circuit_name": "Yas Marina Circuit",
      "race_date": "2024-12-08",
      "winner_name": "Max Verstappen",
      "winning_team": "Red Bull Racing",
      "winning_time": "01:26:45.234"
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/views/race-winners
```

---

### GET /views/current-lineups
Get current driver lineups for all teams.

**Response:**
```json
{
  "data": [
    {
      "team_name": "Red Bull Racing",
      "driver1": "Max Verstappen",
      "driver2": "Sergio Perez",
      "car_number_1": 1,
      "car_number_2": 11,
      "season": 2024
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/views/current-lineups
```

---

### GET /views/circuit-stats
Get statistics for all circuits.

**Response:**
```json
{
  "data": [
    {
      "circuit_id": 1,
      "circuit_name": "Bahrain International Circuit",
      "country": "Bahrain",
      "location": "Sakhir",
      "length": 5.412,
      "races_held": 16,
      "total_laps": 912
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/views/circuit-stats
```

---

## Hybrid Queries (MongoDB Integration)

These endpoints combine PostgreSQL and MongoDB data for advanced analytics.

### GET /hybrid/*
Hybrid endpoints require both databases to be operational.

**Available endpoints:**
- `/api/hybrid/telemetry/:raceId` - Race telemetry data
- `/api/hybrid/weather/:raceId` - Weather conditions during race
- `/api/hybrid/session-logs/:driverId` - Driver session logs

**Example:**
```bash
curl http://localhost:5000/api/hybrid/telemetry/1
```

---

## Error Handling

### Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

### Error Response Format

```json
{
  "error": "Resource not found",
  "status": 404
}
```

### Common Errors

**404 - Driver Not Found**
```json
{
  "error": "Driver with ID 999 not found",
  "status": 404
}
```

**400 - Invalid Parameter**
```json
{
  "error": "Invalid seasonId: must be a number",
  "status": 400
}
```

**500 - Server Error**
```json
{
  "error": "Internal server error",
  "status": 500
}
```

---

## Examples

### JavaScript/Fetch

```javascript
// Get all drivers
fetch('http://localhost:5000/api/drivers')
  .then(res => res.json())
  .then(data => console.log(data.data));

// Get driver standings
fetch('http://localhost:5000/api/drivers/standings/2')
  .then(res => res.json())
  .then(data => console.log(data.data));
```

### JavaScript/Axios

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Get all teams
axios.get(`${API_BASE}/teams`)
  .then(res => console.log(res.data.data))
  .catch(err => console.error(err));

// Get race results
axios.get(`${API_BASE}/races/results/1`)
  .then(res => console.log(res.data.data))
  .catch(err => console.error(err));
```

### Python/Requests

```python
import requests

API_BASE = 'http://localhost:5000/api'

# Get all races
response = requests.get(f'{API_BASE}/races')
races = response.json()['data']

# Get driver performance
response = requests.get(f'{API_BASE}/views/driver-performance')
drivers = response.json()['data']
```

### cURL

```bash
# Get health status
curl http://localhost:5000/api/health

# Get all drivers with limit
curl "http://localhost:5000/api/drivers?limit=5"

# Get specific race results
curl http://localhost:5000/api/races/results/1

# Get team standings
curl http://localhost:5000/api/views/team-standings
```

---

## Rate Limiting

Currently no rate limiting is enforced. In production, consider implementing:
- 100 requests per minute per IP for public endpoints
- 1000 requests per minute for authenticated users

---

## CORS Policy

Cross-Origin Resource Sharing (CORS) is enabled for all origins in development. For production, configure CORS to only allow your frontend domain.

---

## Pagination

For endpoints that support pagination, use `limit` and `offset` parameters:

```bash
# Get 10 drivers, starting from position 20
curl "http://localhost:5000/api/drivers?limit=10&offset=20"
```

---

## Performance Tips

1. Use `limit` parameter to reduce response size
2. Use specific endpoint views instead of raw data when possible
3. Cache frequently accessed endpoints (driver/team stats)
4. Use pagination for large result sets

---

## Status Page

Check API health status:
```bash
curl http://localhost:5000/api/health
```

---

## Support & Issues

- Report API bugs: Create an issue in the repository
- Ask questions: Use discussions in the repository
- Feature requests: Submit via GitHub issues

---

## Version History

### v1.0.0 (Current)
- Initial release
- Basic CRUD operations
- Optimized views
- Hybrid database support
- Comprehensive error handling

---

Last Updated: May 8, 2026
