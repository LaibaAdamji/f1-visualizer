require('dotenv').config();
const { connectMongoDB } = require('../config/database');
const { Telemetry, Weather, SessionLog } = require('../models/mongo');

const seedMongoData = async () => {
  try {
    console.log('🌱 Starting MongoDB seeding...\n');
    
    await connectMongoDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing MongoDB data...');
    await Telemetry.deleteMany({});
    await Weather.deleteMany({});
    await SessionLog.deleteMany({});
    console.log('   ✓ Collections cleared\n');
    
    // Seed Telemetry Data
    console.log('📊 Seeding Telemetry Data...');
    const telemetryData = [];
    
    // Generate sample telemetry for Monaco GP (raceId: 1)
    const baseDate = new Date('2024-05-26T14:00:00Z');
    
    for (let lap = 1; lap <= 5; lap++) {
      for (let sample = 0; sample < 10; sample++) {
        const timestamp = new Date(baseDate.getTime() + (lap * 60000) + (sample * 6000));
        
        telemetryData.push({
          driverId: 1, // Max Verstappen
          raceId: 1,   // Monaco GP
          sessionType: 'Race',
          timestamp: timestamp,
          lapNumber: lap,
          telemetryData: {
            speed: 280 + Math.random() * 40,
            rpm: 11000 + Math.random() * 1000,
            gear: Math.floor(Math.random() * 8) + 1,
            throttle: 50 + Math.random() * 50,
            brake: Math.random() * 100,
            drs: Math.random() > 0.7,
            tires: {
              compound: 'Soft',
              age: lap * 2,
              temperature: {
                frontLeft: 95 + Math.random() * 10,
                frontRight: 95 + Math.random() * 10,
                rearLeft: 90 + Math.random() * 10,
                rearRight: 90 + Math.random() * 10
              },
              pressure: {
                frontLeft: 21.5 + Math.random(),
                frontRight: 21.5 + Math.random(),
                rearLeft: 20.5 + Math.random(),
                rearRight: 20.5 + Math.random()
              }
            },
            position: {
              x: Math.random() * 1000,
              y: Math.random() * 100,
              z: Math.random() * 50
            },
            engine: {
              temperature: 100 + Math.random() * 20,
              oilPressure: 4.5 + Math.random() * 0.5,
              fuelRemaining: 100 - (lap * 3),
              ersDeployment: Math.random() * 100
            }
          },
          trackStatus: 'Green'
        });
      }
    }
    
    await Telemetry.insertMany(telemetryData);
    console.log(`   ✓ Created ${telemetryData.length} telemetry records\n`);
    
    // Seed Weather Data
    console.log('🌤️  Seeding Weather Data...');
    const weatherData = [
      {
        raceId: 1,
        circuitId: 1,
        timestamp: new Date('2024-05-26T14:00:00Z'),
        conditions: {
          temperature: {
            air: 24,
            track: 38
          },
          humidity: 65,
          wind: {
            speed: 12,
            direction: 180,
            gusts: 18
          },
          precipitation: {
            type: 'None',
            intensity: 0,
            probability: 10
          },
          pressure: 1013,
          visibility: 10,
          cloudCover: 30
        },
        source: 'OpenWeather'
      },
      {
        raceId: 2,
        circuitId: 2,
        timestamp: new Date('2024-07-07T14:00:00Z'),
        conditions: {
          temperature: {
            air: 19,
            track: 28
          },
          humidity: 75,
          wind: {
            speed: 15,
            direction: 270,
            gusts: 22
          },
          precipitation: {
            type: 'Rain',
            intensity: 2.5,
            probability: 80
          },
          pressure: 1008,
          visibility: 8,
          cloudCover: 90
        },
        source: 'WeatherAPI'
      }
    ];
    
    await Weather.insertMany(weatherData);
    console.log(`   ✓ Created ${weatherData.length} weather records\n`);
    
    // Seed Session Logs
    console.log('📝 Seeding Session Logs...');
    const sessionLogs = [
      {
        raceId: 1,
        sessionType: 'Race',
        timestamp: new Date('2024-05-26T14:05:00Z'),
        event: {
          type: 'FastestLap',
          driversInvolved: [1],
          details: {
            lapTime: '1:12.345',
            sector1: '23.456',
            sector2: '28.789',
            sector3: '20.100'
          }
        },
        message: 'Verstappen sets fastest lap',
        severity: 'Info'
      },
      {
        raceId: 1,
        sessionType: 'Race',
        timestamp: new Date('2024-05-26T14:15:00Z'),
        event: {
          type: 'PitStop',
          driversInvolved: [6],
          details: {
            pitLane: 'In',
            stopDuration: 2.3,
            tyreChange: 'Medium to Soft'
          },
          location: {
            sector: 3,
            turn: 'Pit Entry'
          }
        },
        message: 'Russell pits for soft tyres',
        severity: 'Info'
      },
      {
        raceId: 1,
        sessionType: 'Race',
        timestamp: new Date('2024-05-26T14:45:00Z'),
        event: {
          type: 'Incident',
          driversInvolved: [6],
          details: {
            type: 'Collision',
            damage: 'Front wing',
            cause: 'Barrier contact'
          },
          location: {
            sector: 2,
            turn: 'Turn 10',
            coordinates: {
              lat: 43.7347,
              lng: 7.4206
            }
          }
        },
        message: 'Russell crashes out - Safety Car deployed',
        severity: 'Critical'
      }
    ];
    
    await SessionLog.insertMany(sessionLogs);
    console.log(`   ✓ Created ${sessionLogs.length} session log entries\n`);
    
    console.log('✅ MongoDB seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${telemetryData.length} Telemetry records`);
    console.log(`   - ${weatherData.length} Weather records`);
    console.log(`   - ${sessionLogs.length} Session log entries\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ MongoDB seeding failed:', error);
    process.exit(1);
  }
};

seedMongoData();