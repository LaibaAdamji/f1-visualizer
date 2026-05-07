const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();

// PostgreSQL Connection (Sequelize)
const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// MongoDB Connection (Mongoose)
// MongoDB Connection (Mongoose)
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Test PostgreSQL Connection
const connectPostgreSQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected Successfully');
  } catch (error) {
    console.error('❌ PostgreSQL Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  mongoose,
  connectPostgreSQL,
  connectMongoDB
};