require('dotenv').config();
const { connectPostgreSQL, connectMongoDB } = require('../config/database');
const { executeTransaction } = require('../utils/transaction');
const models = require('../models');

const { Driver, Team, Circuit, Season, Race, TeamDriverSeason, RaceParticipation } = models;

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding with real F1 data...\n');

    // Connect to databases
    await connectPostgreSQL();
    await connectMongoDB();

    // TRANSACTION 1: Insert Seasons
    await executeTransaction(async (transaction) => {
      console.log('\n📅 Seeding Seasons...');
      await Season.bulkCreate([
        { year: 2024 },
        { year: 2025 }
      ], { transaction });
      console.log('   ✓ Created 2 seasons (2024, 2025)');
    });

    // TRANSACTION 2: Insert Teams
    await executeTransaction(async (transaction) => {
      console.log('\n🏎️  Seeding Teams...');
      await Team.bulkCreate([
        { teamName: 'Red Bull Racing', country: 'Austria', foundedYear: 2005, championshipsWon: 6 },
        { teamName: 'McLaren', country: 'United Kingdom', foundedYear: 1966, championshipsWon: 8 },
        { teamName: 'Ferrari', country: 'Italy', foundedYear: 1950, championshipsWon: 16 },
        { teamName: 'Mercedes', country: 'Germany', foundedYear: 2010, championshipsWon: 8 },
        { teamName: 'Aston Martin', country: 'United Kingdom', foundedYear: 2018, championshipsWon: 0 },
        { teamName: 'Alpine', country: 'France', foundedYear: 2021, championshipsWon: 0 },
        { teamName: 'Haas F1 Team', country: 'United States', foundedYear: 2016, championshipsWon: 0 },
        { teamName: 'Alfa Romeo', country: 'Switzerland', foundedYear: 2021, championshipsWon: 0 },
        { teamName: 'Williams Racing', country: 'United Kingdom', foundedYear: 1977, championshipsWon: 7 },
        { teamName: 'RB F1 Team', country: 'Italy', foundedYear: 2006, championshipsWon: 0 }
      ], { transaction });
      console.log('   ✓ Created 10 teams');
    });

    // TRANSACTION 3: Insert Drivers
    await executeTransaction(async (transaction) => {
      console.log('\n👤 Seeding Drivers...');
      await Driver.bulkCreate([
        // Red Bull
        { firstName: 'Max', lastName: 'Verstappen', nationality: 'Dutch', dateOfBirth: '1997-09-30', championshipsWon: 4 },
        { firstName: 'Sergio', lastName: 'Perez', nationality: 'Mexican', dateOfBirth: '1990-01-26', championshipsWon: 0 },
        // McLaren
        { firstName: 'Lando', lastName: 'Norris', nationality: 'British', dateOfBirth: '1999-11-13', championshipsWon: 0 },
        { firstName: 'Oscar', lastName: 'Piastri', nationality: 'Australian', dateOfBirth: '2001-04-06', championshipsWon: 0 },
        // Ferrari
        { firstName: 'Charles', lastName: 'Leclerc', nationality: 'Monegasque', dateOfBirth: '1997-10-16', championshipsWon: 0 },
        { firstName: 'Lewis', lastName: 'Hamilton', nationality: 'British', dateOfBirth: '1985-01-07', championshipsWon: 7 },
        // Mercedes
        { firstName: 'George', lastName: 'Russell', nationality: 'British', dateOfBirth: '1998-02-15', championshipsWon: 0 },
        { firstName: 'Andrea', lastName: 'Kimi', nationality: 'Finnish', dateOfBirth: '1998-10-22', championshipsWon: 0 },
        // Aston Martin
        { firstName: 'Fernando', lastName: 'Alonso', nationality: 'Spanish', dateOfBirth: '1981-07-29', championshipsWon: 2 },
        { firstName: 'Lance', lastName: 'Stroll', nationality: 'Canadian', dateOfBirth: '1998-10-29', championshipsWon: 0 },
        // Alpine
        { firstName: 'Pierre', lastName: 'Gasly', nationality: 'French', dateOfBirth: '1996-08-07', championshipsWon: 0 },
        { firstName: 'Jack', lastName: 'Doohan', nationality: 'Australian', dateOfBirth: '2003-09-21', championshipsWon: 0 },
        // Haas
        { firstName: 'Nico', lastName: 'Hulkenberg', nationality: 'German', dateOfBirth: '1987-08-19', championshipsWon: 0 },
        { firstName: 'Gabriel', lastName: 'Bortoleto', nationality: 'Brazilian', dateOfBirth: '2004-03-10', championshipsWon: 0 },
        // Alfa Romeo
        { firstName: 'Valtteri', lastName: 'Bottas', nationality: 'Finnish', dateOfBirth: '1989-08-28', championshipsWon: 0 },
        { firstName: 'Zhou', lastName: 'Guanyu', nationality: 'Chinese', dateOfBirth: '1999-05-30', championshipsWon: 0 },
        // Williams
        { firstName: 'Alexander', lastName: 'Albon', nationality: 'Thai-British', dateOfBirth: '1996-03-23', championshipsWon: 0 },
        { firstName: 'Carlos', lastName: 'Sainz', nationality: 'Spanish', dateOfBirth: '1994-09-01', championshipsWon: 0 },
        // RB
        { firstName: 'Yuki', lastName: 'Tsunoda', nationality: 'Japanese', dateOfBirth: '2000-05-11', championshipsWon: 0 },
        { firstName: 'Liam', lastName: 'Lawson', nationality: 'New Zealand', dateOfBirth: '2002-11-11', championshipsWon: 0 }
      ], { transaction });
      console.log('   ✓ Created 20 drivers');
    });

    // TRANSACTION 4: Insert Circuits
    await executeTransaction(async (transaction) => {
      console.log('\n🏁 Seeding Circuits...');
      await Circuit.bulkCreate([
        { circuitName: 'Albert Park Circuit', location: 'Melbourne', country: 'Australia', length: 5.303 },
        { circuitName: 'Jeddah Corniche Circuit', location: 'Jeddah', country: 'Saudi Arabia', length: 6.174 },
        { circuitName: 'Bahrain International Circuit', location: 'Sakhir', country: 'Bahrain', length: 5.412 },
        { circuitName: 'Shanghai International Circuit', location: 'Shanghai', country: 'China', length: 5.451 },
        { circuitName: 'Miami International Autodrome', location: 'Miami', country: 'United States', length: 5.410 },
        { circuitName: 'Circuit de Barcelona-Catalunya', location: 'Barcelona', country: 'Spain', length: 4.655 },
        { circuitName: 'Circuit de Monaco', location: 'Monte Carlo', country: 'Monaco', length: 3.337 },
        { circuitName: 'Circuit Gilles Villeneuve', location: 'Montreal', country: 'Canada', length: 4.361 },
        { circuitName: 'Red Bull Ring', location: 'Spielberg', country: 'Austria', length: 4.318 },
        { circuitName: 'Silverstone Circuit', location: 'Silverstone', country: 'United Kingdom', length: 5.891 },
        { circuitName: 'Hungaroring', location: 'Budapest', country: 'Hungary', length: 4.381 },
        { circuitName: 'Circuit de Spa-Francorchamps', location: 'Spa', country: 'Belgium', length: 7.004 },
        { circuitName: 'Autodromo Nazionale di Monza', location: 'Monza', country: 'Italy', length: 5.793 },
        { circuitName: 'Marina Bay Street Circuit', location: 'Singapore', country: 'Singapore', length: 5.065 },
        { circuitName: 'Circuit of The Americas', location: 'Austin', country: 'United States', length: 5.515 },
        { circuitName: 'Mexico City Circuit', location: 'Mexico City', country: 'Mexico', length: 4.304 },
        { circuitName: 'Interlagos', location: 'São Paulo', country: 'Brazil', length: 4.309 },
        { circuitName: 'Yas Marina Circuit', location: 'Abu Dhabi', country: 'United Arab Emirates', length: 5.281 }
      ], { transaction });
      console.log('   ✓ Created 18 circuits');
    });

    // TRANSACTION 5: Insert Team-Driver-Season Contracts (2025 Season)
    await executeTransaction(async (transaction) => {
      console.log('\n📝 Seeding Team-Driver Contracts (2025 Season)...');
      await TeamDriverSeason.bulkCreate([
        // Red Bull
        { teamId: 1, driverId: 1, seasonId: 2, contractType: 'Full-time', carNumber: 1 },
        { teamId: 1, driverId: 2, seasonId: 2, contractType: 'Full-time', carNumber: 11 },
        // McLaren
        { teamId: 2, driverId: 3, seasonId: 2, contractType: 'Full-time', carNumber: 4 },
        { teamId: 2, driverId: 4, seasonId: 2, contractType: 'Full-time', carNumber: 81 },
        // Ferrari
        { teamId: 3, driverId: 5, seasonId: 2, contractType: 'Full-time', carNumber: 16 },
        { teamId: 3, driverId: 6, seasonId: 2, contractType: 'Full-time', carNumber: 44 },
        // Mercedes
        { teamId: 4, driverId: 7, seasonId: 2, contractType: 'Full-time', carNumber: 63 },
        { teamId: 4, driverId: 8, seasonId: 2, contractType: 'Full-time', carNumber: 64 },
        // Aston Martin
        { teamId: 5, driverId: 9, seasonId: 2, contractType: 'Full-time', carNumber: 14 },
        { teamId: 5, driverId: 10, seasonId: 2, contractType: 'Full-time', carNumber: 18 },
        // Alpine
        { teamId: 6, driverId: 11, seasonId: 2, contractType: 'Full-time', carNumber: 10 },
        { teamId: 6, driverId: 12, seasonId: 2, contractType: 'Full-time', carNumber: 31 },
        // Haas
        { teamId: 7, driverId: 13, seasonId: 2, contractType: 'Full-time', carNumber: 27 },
        { teamId: 7, driverId: 14, seasonId: 2, contractType: 'Full-time', carNumber: 28 },
        // Alfa Romeo
        { teamId: 8, driverId: 15, seasonId: 2, contractType: 'Full-time', carNumber: 77 },
        { teamId: 8, driverId: 16, seasonId: 2, contractType: 'Full-time', carNumber: 24 },
        // Williams
        { teamId: 9, driverId: 17, seasonId: 2, contractType: 'Full-time', carNumber: 23 },
        { teamId: 9, driverId: 18, seasonId: 2, contractType: 'Full-time', carNumber: 55 },
        // RB
        { teamId: 10, driverId: 19, seasonId: 2, contractType: 'Full-time', carNumber: 22 },
        { teamId: 10, driverId: 20, seasonId: 2, contractType: 'Full-time', carNumber: 30 }
      ], { transaction });
      console.log('   ✓ Created 20 driver contracts');
    });

    // TRANSACTION 6: Insert Races (2025 Season - First 5 races)
    await executeTransaction(async (transaction) => {
      console.log('\n🏆 Seeding Races (2025 Season - Early Season)...');
      await Race.bulkCreate([
        { raceName: 'Australian Grand Prix', raceDate: '2025-03-16', raceType: 'Grand Prix', seasonId: 2, circuitId: 1 },
        { raceName: 'Saudi Arabian Grand Prix', raceDate: '2025-03-23', raceType: 'Grand Prix', seasonId: 2, circuitId: 2 },
        { raceName: 'Bahrain Grand Prix', raceDate: '2025-03-30', raceType: 'Grand Prix', seasonId: 2, circuitId: 3 },
        { raceName: 'Chinese Grand Prix', raceDate: '2025-04-13', raceType: 'Grand Prix', seasonId: 2, circuitId: 4 },
        { raceName: 'Miami Grand Prix', raceDate: '2025-05-04', raceType: 'Grand Prix', seasonId: 2, circuitId: 5 }
      ], { transaction });
      console.log('   ✓ Created 5 races');
    });

    // TRANSACTION 7: Insert Race Participations (2025 Australian GP)
    await executeTransaction(async (transaction) => {
      console.log('\n🎯 Seeding Race Participations (2025 Australian GP)...');
      await RaceParticipation.bulkCreate([
        { driverId: 1, teamId: 1, raceId: 1, gridPosition: 1, position: 1, points: 25, fastestLap: true, status: 'Finished' },
        { driverId: 3, teamId: 2, raceId: 1, gridPosition: 2, position: 2, points: 18, fastestLap: false, status: 'Finished' },
        { driverId: 5, teamId: 3, raceId: 1, gridPosition: 3, position: 3, points: 15, fastestLap: false, status: 'Finished' },
        { driverId: 7, teamId: 4, raceId: 1, gridPosition: 4, position: 4, points: 12, fastestLap: false, status: 'Finished' },
        { driverId: 2, teamId: 1, raceId: 1, gridPosition: 5, position: 5, points: 10, fastestLap: false, status: 'Finished' },
        { driverId: 4, teamId: 2, raceId: 1, gridPosition: 6, position: 6, points: 8, fastestLap: false, status: 'Finished' },
        { driverId: 6, teamId: 3, raceId: 1, gridPosition: 7, position: 7, points: 6, fastestLap: false, status: 'Finished' },
        { driverId: 9, teamId: 5, raceId: 1, gridPosition: 8, position: 8, points: 4, fastestLap: false, status: 'Finished' },
        { driverId: 11, teamId: 6, raceId: 1, gridPosition: 9, position: 9, points: 2, fastestLap: false, status: 'Finished' },
        { driverId: 13, teamId: 7, raceId: 1, gridPosition: 10, position: 10, points: 1, fastestLap: false, status: 'Finished' },
        { driverId: 15, teamId: 8, raceId: 1, gridPosition: 11, position: 11, points: 0, fastestLap: false, status: 'Finished' },
        { driverId: 17, teamId: 9, raceId: 1, gridPosition: 12, position: 12, points: 0, fastestLap: false, status: 'Finished' },
        { driverId: 19, teamId: 10, raceId: 1, gridPosition: 13, position: null, points: 0, fastestLap: false, status: 'DNF' },
        { driverId: 8, teamId: 4, raceId: 1, gridPosition: 14, position: null, points: 0, fastestLap: false, status: 'DNF' }
      ], { transaction });
      console.log('   ✓ Created 14 race participations');
    });

    console.log('\n✅ Database seeding completed successfully with real F1 data!');
    console.log('📊 Summary:');
    console.log('   - 2 Seasons (2024-2025)');
    console.log('   - 10 Teams (all official F1 teams)');
    console.log('   - 20 Drivers (full 2025 grid)');
    console.log('   - 18 Circuits (major F1 venues)');
    console.log('   - 20 Contracts (2025 Season)');
    console.log('   - 5 Races (2025 early season)');
    console.log('   - 14 Race Participations\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();