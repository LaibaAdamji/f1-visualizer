# F1 Analytics Backend API

RESTful API for Formula 1 analytics and statistics. Provides comprehensive endpoints for drivers, races, teams, and analytical views.

## Features

- Express.js REST API
- PostgreSQL database with Sequelize ORM
- MongoDB integration with Mongoose
- Database views for optimized queries
- CORS enabled for cross-origin requests
- Health check endpoint
- Error handling and logging

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Databases**: PostgreSQL + MongoDB
- **ORMs**: Sequelize (PostgreSQL), Mongoose (MongoDB)
- **Development**: Nodemon

## Setup

### Installation

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=f1_data

# MongoDB Configuration (optional)
MONGODB_URI=mongodb://localhost:27017/f1_analytics
```

### Database Setup

1. **Create PostgreSQL database:**
   ```bash
   createdb f1_data
   ```

2. **Initialize database schema:**
   ```bash
   npm run db:init
   ```

3. **Seed sample data:**
   ```bash
   npm run db:seed
   ```

4. **Create optimized views:**
   ```bash
   npm run db:views
   ```

5. **Optional - Seed MongoDB:**
   ```bash
   npm run mongo:seed
   ```

## Development

### Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "F1 Visualizer API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Production

### Start Production Server

```bash
npm start
```

### Build Considerations

- Ensure all environment variables are set
- Use a process manager like PM2
- Enable CORS appropriately for your frontend domain
- Use a reverse proxy (nginx) in front of Express
- Enable HTTPS

### Production Environment Variables

```env
PORT=5000
NODE_ENV=production

# Database credentials (use strong passwords)
DB_HOST=prod-db-server
DB_PORT=5432
DB_USER=prod_user
DB_PASSWORD=very_strong_password
DB_NAME=f1_data_prod

# MongoDB (if using)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/f1_analytics
```

## API Endpoints

### Drivers

```
GET    /api/drivers                    # Get all drivers
GET    /api/drivers/stats/:driverId    # Get driver statistics
GET    /api/drivers/standings/:seasonId # Get driver standings
```

### Races

```
GET    /api/races                      # Get all races
GET    /api/races/results/:raceId      # Get race results
GET    /api/races/circuit/:circuitId   # Get races by circuit
```

### Teams

```
GET    /api/teams                      # Get all teams
GET    /api/teams/:teamId/drivers/:seasonId # Get team drivers
GET    /api/teams/stats/:teamId        # Get team statistics
```

### Views (Optimized Queries)

```
GET    /api/views/driver-performance   # Driver performance data
GET    /api/views/team-standings       # Team standings
GET    /api/views/race-winners         # Recent race winners
GET    /api/views/current-lineups      # Current driver lineups
GET    /api/views/circuit-stats        # Circuit statistics
```

### Hybrid Queries (Requires MongoDB)

```
GET    /api/hybrid/*                   # Hybrid database queries
```

## Project Structure

```
backend/
├── src/
│   ├── server.js              # Express app setup
│   ├── config/
│   │   ├── database.js        # Database connections
│   │   └── sync.js            # Sequelize sync
│   ├── controllers/           # Route controllers
│   ├── models/                # Database models
│   │   ├── index.js           # PostgreSQL models
│   │   └── mongo/             # MongoDB models
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── middleware/            # Express middleware
│   ├── utils/                 # Utilities
│   └── scripts/               # Database scripts
│       ├── initDB.js          # Initialize database
│       ├── seedData.js        # Seed PostgreSQL
│       ├── seedMongo.js       # Seed MongoDB
│       ├── createViews.js     # Create database views
│       └── sync.js            # Sync databases
├── .env                       # Environment variables
├── package.json               # Dependencies
└── README.md                  # This file
```

## Database Schema

### PostgreSQL Tables

- **Drivers**: Driver information
- **Teams**: Team/Constructor information
- **Races**: Race details and schedule
- **Seasons**: Season information
- **Circuits**: Race circuit details
- **PracticeSession**: Practice session data
- **RaceParticipation**: Driver participation in races
- **TeamDriverSeason**: Team-driver-season relationships

### MongoDB Collections

- **SessionLog**: Session logging
- **Telemetry**: Telemetry data
- **Weather**: Weather conditions

## Error Handling

The API returns standardized error responses:

```json
{
  "error": "Error message",
  "status": 400
}
```

## Performance Considerations

- Database views are used for complex queries
- Connection pooling enabled
- Indexes on frequently queried fields
- Response pagination where applicable

## Security

- CORS configured for trusted domains
- Environment variables for sensitive data
- Input validation on all endpoints
- Error messages don't expose sensitive data

## Logging

Development mode includes detailed console logs. Configure logging service for production environments.

## Testing

Currently no automated tests. Consider adding:
- Unit tests for services
- Integration tests for API endpoints
- Load testing

## Deployment Platforms

Tested and compatible with:
- Heroku
- AWS EC2
- Railway
- Render
- DigitalOcean
- Self-hosted servers

## PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'f1-analytics-api',
    script: './src/server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

Start with: `pm2 start ecosystem.config.js`

## Troubleshooting

### Port already in use
```bash
# Change PORT in .env or
lsof -i :5000
kill -9 <PID>
```

### Database connection errors
- Verify PostgreSQL/MongoDB are running
- Check credentials in .env
- Ensure databases exist

### CORS errors
- Update CORS configuration in server.js
- Verify frontend URL is whitelisted

## Support

For issues and support, open an issue in the repository.

## License

MIT License - See LICENSE file for details
