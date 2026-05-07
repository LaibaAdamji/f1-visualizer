const mongoose = require('mongoose');

/**
 * Session Log Schema - Document-based NoSQL
 * Stores event logs during practice/qualifying/race sessions
 * Variable structure depending on event type
 */
const SessionLogSchema = new mongoose.Schema({
  raceId: {
    type: Number,
    required: true,
    index: true
  },
  
  sessionType: {
    type: String,
    enum: ['FP1', 'FP2', 'FP3', 'Qualifying', 'Sprint', 'Race'],
    required: true
  },
  
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  
  // Event information (flexible structure)
  event: {
    type: {
      type: String,
      enum: [
        'Flag',
        'Incident',
        'PitStop',
        'Overtake',
        'FastestLap',
        'Penalty',
        'Retirement',
        'SafetyCar',
        'RedFlag'
      ],
      required: true
    },
    
    // Drivers involved
    driversInvolved: [Number],
    
    // Event-specific data (varies by event type)
    details: mongoose.Schema.Types.Mixed,
    
    // Location on track
    location: {
      sector: Number,
      turn: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    }
  },
  
  // Race control messages
  message: String,
  
  // Severity for incidents
  severity: {
    type: String,
    enum: ['Info', 'Warning', 'Critical'],
    default: 'Info'
  }
}, {
  timestamps: true
});

// Compound indexes
SessionLogSchema.index({ raceId: 1, sessionType: 1, timestamp: 1 });
SessionLogSchema.index({ 'event.type': 1, timestamp: -1 });

module.exports = mongoose.model('SessionLog', SessionLogSchema);