const { sequelize } = require('./database');
const models = require('../models');

// Sync function to create all tables
const syncDatabase = async (options = {}) => {
  try {
    console.log('🔄 Starting database synchronization...');
    
    // Sync all models to database
    await sequelize.sync(options);
    
    console.log('✅ Database synchronized successfully!');
    console.log('📊 Tables created:');
    console.log('   - drivers');
    console.log('   - teams');
    console.log('   - circuits');
    console.log('   - seasons');
    console.log('   - races');
    console.log('   - practice_sessions');
    console.log('   - race_participations');
    console.log('   - team_driver_seasons');
    
    return true;
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    throw error;
  }
};

// Function to reset database (drop all tables and recreate)
const resetDatabase = async () => {
  try {
    console.log('⚠️  WARNING: Dropping all tables...');
    await syncDatabase({ force: true });
    console.log('✅ Database reset complete!');
    return true;
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    throw error;
  }
};

module.exports = {
  syncDatabase,
  resetDatabase
};