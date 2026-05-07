const mongoose = require('mongoose');

/**
 * Weather Schema - Document-based NoSQL
 * Stores weather conditions during races (JSON from weather APIs)
 * Unstructured data that varies by source and doesn't need strict schema
 */
const WeatherSchema = new mongoose.Schema({
  // Reference to relational database
  raceId: {
    type: Number,
    required: true,
    index: true
  },
  circuitId: {
    type: Number,
    required: true
  },
  
  // When this weather reading was taken
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  
  // Weather conditions (flexible structure to accommodate different APIs)
  conditions: {
    temperature: {
      air: Number,              // Celsius
      track: Number             // Celsius
    },
    
    humidity: Number,           // Percentage
    
    wind: {
      speed: Number,            // km/h
      direction: Number,        // Degrees (0-360)
      gusts: Number            // km/h
    },
    
    precipitation: {
      type: {
        type: String,           // None, Rain, Snow
        enum: ['None', 'Rain', 'Snow', 'Drizzle']
      },
      intensity: Number,        // mm/hour
      probability: Number       // Percentage
    },
    
    pressure: Number,           // hPa
    
    visibility: Number,         // kilometers
    
    cloudCover: Number          // Percentage
  },
  
  // Raw API response (store original for reference)
  rawData: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  
  // Data source
  source: {
    type: String,
    enum: ['OpenWeather', 'WeatherAPI', 'AccuWeather', 'Manual'],
    default: 'Manual'
  }
}, {
  timestamps: true
});

// Compound index for race weather queries
WeatherSchema.index({ raceId: 1, timestamp: 1 });

module.exports = mongoose.model('Weather', WeatherSchema);