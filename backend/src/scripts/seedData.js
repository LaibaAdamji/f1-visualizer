require('dotenv').config();
const { connectPostgreSQL, connectMongoDB } = require('../config/database');
const { executeTransaction } = require('../utils/transaction');
const models = require('../models');

const { Driver, Team, Circuit, Season, Race, TeamDriverSeason, RaceParticipation } = models;

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to databases
    await connectPostgreSQL();
    await connectMongoDB();

    // TRANSACTION 1: Insert Seasons
    await executeTransaction(async (transaction) => {
      console.log('\n📅 Seeding Seasons...');
      await Season.bulkCreate([
        { year: 2023 },
        { year: 2024 }
      ], { transaction });
      console.log('   ✓ Created 2 seasons');
    });

    // TRANSACTION 2: Insert Teams
    await executeTransaction(async (transaction) => {
      console.log('\n🏎️  Seeding Teams...');
      await Team.bulkCreate([
        { teamName: 'Red Bull Racing', country: 'Austria', foundedYear: 2005, championshipsWon: 6 },
        { teamName: 'Mercedes', country: 'Germany', foundedYear: 2010, championshipsWon: 8 },
        { teamName: 'Ferrari', country: 'Italy', foundedYear: 1950, championshipsWon: 16 },
        { teamName: 'McLaren', country: 'United Kingdom', foundedYear: 1966, championshipsWon: 8 }
      ], { transaction });
      console.log('   ✓ Created 4 teams');
    });

    // TRANSACTION 3: Insert Drivers
    await executeTransaction(async (transaction) => {
      console.log('\n👤 Seeding Drivers...');
      await Driver.bulkCreate([
        { firstName: 'Max', lastName: 'Verstappen', nationality: 'Dutch', dateOfBirth: '1997-09-30', championshipsWon: 3 },
        { firstName: 'Lewis', lastName: 'Hamilton', nationality: 'British', dateOfBirth: '1985-01-07', championshipsWon: 7 },
        { firstName: 'Charles', lastName: 'Leclerc', nationality: 'Monegasque', dateOfBirth: '1997-10-16', championshipsWon: 0 },
        { firstName: 'Lando', lastName: 'Norris', nationality: 'British', dateOfBirth: '1999-11-13', championshipsWon: 0 },
        { firstName: 'Sergio', lastName: 'Perez', nationality: 'Mexican', dateOfBirth: '1990-01-26', championshipsWon: 0 },
        { firstName: 'George', lastName: 'Russell', nationality: 'British', dateOfBirth: '1998-02-15', championshipsWon: 0 }
      ], { transaction });
      console.log('   ✓ Created 6 drivers');
    });

    // TRANSACTION 4: Insert Circuits
    await executeTransaction(async (transaction) => {
      console.log('\n🏁 Seeding Circuits...');
      await Circuit.bulkCreate([
        { circuitName: 'Monaco Grand Prix Circuit', location: 'Monte Carlo', country: 'Monaco', length: 3.337 },
        { circuitName: 'Silverstone Circuit', location: 'Silverstone', country: 'United Kingdom', length: 5.891 },
        { circuitName: 'Monza Circuit', location: 'Monza', country: 'Italy', length: 5.793 },
        { circuitName: 'Spa-Francorchamps', location: 'Spa', country: 'Belgium', length: 7.004 }
      ], { transaction });
      console.log('   ✓ Created 4 circuits');
    });

    // TRANSACTION 5: Insert Team-Driver-Season Contracts (Ternary Relationship)
    await executeTransaction(async (transaction) => {
      console.log('\n📝 Seeding Team-Driver Contracts (2024 Season)...');
      await TeamDriverSeason.bulkCreate([
        { teamId: 1, driverId: 1, seasonId: 2, contractType: 'Full-time', carNumber: 1 },  // Max - Red Bull
        { teamId: 1, driverId: 5, seasonId: 2, contractType: 'Full-time', carNumber: 11 }, // Perez - Red Bull
        { teamId: 2, driverId: 2, seasonId: 2, contractType: 'Full-time', carNumber: 44 }, // Hamilton - Mercedes
        { teamId: 2, driverId: 6, seasonId: 2, contractType: 'Full-time', carNumber: 63 }, // Russell - Mercedes
        { teamId: 3, driverId: 3, seasonId: 2, contractType: 'Full-time', carNumber: 16 }, // Leclerc - Ferrari
        { teamId: 4, driverId: 4, seasonId: 2, contractType: 'Full-time', carNumber: 4 }   // Norris - McLaren
      ], { transaction });
      console.log('   ✓ Created 6 driver contracts');
    });

    // TRANSACTION 6: Insert Races (Weak Entity)
    await executeTransaction(async (transaction) => {
      console.log('\n🏆 Seeding Races (2024 Season)...');
      await Race.bulkCreate([
        { raceName: 'Monaco Grand Prix', raceDate: '2024-05-26', raceType: 'Grand Prix', seasonId: 2, circuitId: 1 },
        { raceName: 'British Grand Prix', raceDate: '2024-07-07', raceType: 'Grand Prix', seasonId: 2, circuitId: 2 },
        { raceName: 'Italian Grand Prix', raceDate: '2024-09-01', raceType: 'Grand Prix', seasonId: 2, circuitId: 3 },
        { raceName: 'Belgian Grand Prix', raceDate: '2024-07-28', raceType: 'Grand Prix', seasonId: 2, circuitId: 4 }
      ], { transaction });
      console.log('   ✓ Created 4 races');
    });

    // TRANSACTION 7: Insert Race Participations (Ternary Relationship)
    await executeTransaction(async (transaction) => {
      console.log('\n🎯 Seeding Race Participations (Monaco GP)...');
      await RaceParticipation.bulkCreate([
        { driverId: 1, teamId: 1, raceId: 1, gridPosition: 1, position: 1, points: 25, fastestLap: true, status: 'Finished' },
        { driverId: 3, teamId: 3, raceId: 1, gridPosition: 2, position: 2, points: 18, fastestLap: false, status: 'Finished' },
        { driverId: 4, teamId: 4, raceId: 1, gridPosition: 3, position: 3, points: 15, fastestLap: false, status: 'Finished' },
        { driverId: 2, teamId: 2, raceId: 1, gridPosition: 5, position: 4, points: 12, fastestLap: false, status: 'Finished' },
        { driverId: 5, teamId: 1, raceId: 1, gridPosition: 4, position: 5, points: 10, fastestLap: false, status: 'Finished' },
        { driverId: 6, teamId: 2, raceId: 1, gridPosition: 6, position: null, points: 0, fastestLap: false, status: 'DNF' }
      ], { transaction });
      console.log('   ✓ Created 6 race participations');
    });

    console.log('\n✅ Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log('   - 2 Seasons');
    console.log('   - 4 Teams');
    console.log('   - 6 Drivers');
    console.log('   - 4 Circuits');
    console.log('   - 6 Contracts');
    console.log('   - 4 Races');
    console.log('   - 6 Race Participations\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();