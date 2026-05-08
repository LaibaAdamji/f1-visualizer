const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import database connections
const { connectPostgreSQL, connectMongoDB } = require('./config/database');

// Import routes
const driverRoutes = require('./routes/driverRoutes');
const raceRoutes = require('./routes/raceRoutes');
const teamRoutes = require('./routes/teamRoutes');
const viewRoutes = require('./routes/viewRoutes');
const hybridRoutes = require('./routes/hybridRoutes');


// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'F1 Visualizer API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/drivers', driverRoutes);
app.use('/api/races', raceRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/views', viewRoutes);
app.use('/api/hybrid', hybridRoutes);

// Initialize databases and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to required database first
    await connectPostgreSQL();
    const mongoConnected = await connectMongoDB();
    if (!mongoConnected) {
      console.warn(' Continuing without MongoDB. Hybrid endpoints may be unavailable.');
    }
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(`\n API Endpoints:`);
      console.log(`   GET  /api/drivers`);
      console.log(`   GET  /api/drivers/stats/:driverId`);
      console.log(`   GET  /api/drivers/standings/:seasonId`);
      console.log(`   GET  /api/races`);
      console.log(`   GET  /api/races/results/:raceId`);
      console.log(`   GET  /api/races/circuit/:circuitId`);
      console.log(`   GET  /api/teams`);
      console.log(`   GET  /api/teams/:teamId/drivers/:seasonId`);
      console.log(`   GET  /api/teams/stats/:teamId`);
      console.log(`   GET  /api/views/*`);
      console.log(`   GET  /api/hybrid/* (requires MongoDB)\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;