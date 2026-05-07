
/**
 * Telemetry Schema - Document-based NoSQL
 * Stores high-frequency car telemetry data (unstructured/semi-structured)
 * This data changes rapidly and doesn't fit well in relational tables
 */
const mongoose = require('mongoose');
const { Driver } = require('../index'); // Import PostgreSQL models

const TelemetrySchema = new mongoose.Schema({
  driverId: {
    type: Number,
    required: true,
    index: true,
    validate: {
      validator: async function(value) {
        // Check if driver exists in PostgreSQL
        const driver = await Driver.findByPk(value);
        return driver !== null;
      },
      message: 'Driver ID must reference a valid driver in the relational database'
    }
  },
  raceId: {
    type: Number,
    required: true,
    index: true,
    validate: {
      validator: async function(value) {
        const { Race } = require('../index');
        const race = await Race.findByPk(value);
        return race !== null;
      },
      message: 'Race ID must reference a valid race in the relational database'
    }
  },
  sessionType: {
    type: String,
    enum: ['Practice', 'Qualifying', 'Race', 'Sprint'],
    required: true
  },
  
  // Telemetry timestamp
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  
  // Lap information
  lapNumber: {
    type: Number,
    required: true
  },
  
  // Car telemetry data (flexible JSON structure)
  telemetryData: {
    speed: Number,              // km/h
    rpm: Number,                // Engine RPM
    gear: Number,               // Current gear (1-8)
    throttle: Number,           // 0-100%
    brake: Number,              // 0-100%
    drs: Boolean,               // DRS active
    
    // Tire data (nested document)
    tires: {
      compound: String,         // Soft, Medium, Hard
      age: Number,              // Laps
      temperature: {
        frontLeft: Number,
        frontRight: Number,
        rearLeft: Number,
        rearRight: Number
      },
      pressure: {
        frontLeft: Number,
        frontRight: Number,
        rearLeft: Number,
        rearRight: Number
      }
    },
    
    // Position data
    position: {
      x: Number,
      y: Number,
      z: Number
    },
    
    // Engine data
    engine: {
      temperature: Number,
      oilPressure: Number,
      fuelRemaining: Number,
      ersDeployment: Number     // 0-100%
    }
  },
  
  // Track conditions at this moment
  trackStatus: {
    type: String,
    enum: ['Green', 'Yellow', 'Red', 'VSC', 'SC']
  }
}, {
  timestamps: true,
  // Compound index for efficient queries
  indexes: [
    { driverId: 1, raceId: 1, timestamp: 1 }
  ]
});

// Add index for time-series queries
TelemetrySchema.index({ raceId: 1, lapNumber: 1, timestamp: 1 });

module.exports = mongoose.model('Telemetry', TelemetrySchema);