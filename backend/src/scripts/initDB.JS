require('dotenv').config();
const { connectPostgreSQL, connectMongoDB } = require('../config/database');
const { syncDatabase, resetDatabase } = require('../config/sync');

// Get command line argument
const args = process.argv.slice(2);
const shouldReset = args.includes('--reset');

const initializeDatabase = async () => {
  try {
    console.log('🚀 Initializing F1 Visualizer Database...\n');
    
    // Connect to databases
    await connectPostgreSQL();
    await connectMongoDB();
    
    console.log('');
    
    // Sync or Reset database
    if (shouldReset) {
      console.log('⚠️  RESET MODE: All existing data will be deleted!\n');
      await resetDatabase();
    } else {
      await syncDatabase({ alter: true });
    }
    
    console.log('\n✅ Database initialization complete!');
    console.log('🎯 You can now start adding data to your F1 database.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Initialization failed:', error);
    process.exit(1);
  }
};

// Run initialization
initializeDatabase();