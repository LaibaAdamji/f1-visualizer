require('dotenv').config();
const { connectPostgreSQL } = require('../config/database');
const { sequelize } = require('../config/database');

const createViews = async () => {
  try {
    console.log('🔍 Creating database views...\n');
    
    await connectPostgreSQL();

    // VIEW 1: Driver Performance Summary
    console.log('Creating view: driver_performance_summary');
    await sequelize.query(`
      CREATE OR REPLACE VIEW driver_performance_summary AS
      SELECT 
        d.driver_id,
        d.first_name,
        d.last_name,
        d.nationality,
        COUNT(rp.participation_id) as total_races,
        SUM(rp.points) as total_points,
        AVG(rp.points) as avg_points,
        COUNT(CASE WHEN rp.position = 1 THEN 1 END) as wins,
        COUNT(CASE WHEN rp.position <= 3 THEN 1 END) as podiums,
        COUNT(CASE WHEN rp.fastest_lap = true THEN 1 END) as fastest_laps
      FROM drivers d
      LEFT JOIN race_participations rp ON d.driver_id = rp.driver_id
      GROUP BY d.driver_id, d.first_name, d.last_name, d.nationality
    `);
    console.log('   ✓ driver_performance_summary created\n');

    // VIEW 2: Team Standings
    console.log('Creating view: team_standings');
    await sequelize.query(`
      CREATE OR REPLACE VIEW team_standings AS
      SELECT 
        t.team_id,
        t.team_name,
        s.year as season,
        SUM(rp.points) as total_points,
        COUNT(CASE WHEN rp.position = 1 THEN 1 END) as wins,
        COUNT(CASE WHEN rp.position <= 3 THEN 1 END) as podiums
      FROM teams t
      INNER JOIN race_participations rp ON t.team_id = rp.team_id
      INNER JOIN races r ON rp.race_id = r.race_id
      INNER JOIN seasons s ON r.season_id = s.season_id
      GROUP BY t.team_id, t.team_name, s.year
      ORDER BY s.year DESC, total_points DESC
    `);
    console.log('   ✓ team_standings created\n');

    // VIEW 3: Race Winners
    console.log('Creating view: race_winners');
    await sequelize.query(`
      CREATE OR REPLACE VIEW race_winners AS
      SELECT 
        r.race_id,
        r.race_name,
        r.race_date,
        c.circuit_name,
        s.year as season,
        d.first_name || ' ' || d.last_name as winner_name,
        t.team_name as winning_team,
        rp.points
      FROM races r
      INNER JOIN circuits c ON r.circuit_id = c.circuit_id
      INNER JOIN seasons s ON r.season_id = s.season_id
      INNER JOIN race_participations rp ON r.race_id = rp.race_id
      INNER JOIN drivers d ON rp.driver_id = d.driver_id
      INNER JOIN teams t ON rp.team_id = t.team_id
      WHERE rp.position = 1
      ORDER BY r.race_date DESC
    `);
    console.log('   ✓ race_winners created\n');

    // VIEW 4: Current Season Driver Lineups
    console.log('Creating view: current_driver_lineups');
    await sequelize.query(`
      CREATE OR REPLACE VIEW current_driver_lineups AS
      SELECT 
        t.team_name,
        d.first_name || ' ' || d.last_name as driver_name,
        tds.car_number,
        tds.contract_type,
        s.year as season
      FROM team_driver_seasons tds
      INNER JOIN teams t ON tds.team_id = t.team_id
      INNER JOIN drivers d ON tds.driver_id = d.driver_id
      INNER JOIN seasons s ON tds.season_id = s.season_id
      WHERE s.year = (SELECT MAX(year) FROM seasons)
      ORDER BY t.team_name, tds.contract_type DESC
    `);
    console.log('   ✓ current_driver_lineups created\n');

    // VIEW 5: Circuit Statistics
    console.log('Creating view: circuit_statistics');
    await sequelize.query(`
      CREATE OR REPLACE VIEW circuit_statistics AS
      SELECT 
        c.circuit_id,
        c.circuit_name,
        c.country,
        c.length,
        COUNT(r.race_id) as total_races,
        AVG(
          (SELECT AVG(rp.points) 
           FROM race_participations rp 
           WHERE rp.race_id = r.race_id)
        ) as avg_points_scored
      FROM circuits c
      LEFT JOIN races r ON c.circuit_id = r.circuit_id
      GROUP BY c.circuit_id, c.circuit_name, c.country, c.length
    `);
    console.log('   ✓ circuit_statistics created\n');

    console.log('✅ All views created successfully!\n');
    console.log('📊 Views created:');
    console.log('   1. driver_performance_summary');
    console.log('   2. team_standings');
    console.log('   3. race_winners');
    console.log('   4. current_driver_lineups');
    console.log('   5. circuit_statistics\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ View creation failed:', error);
    process.exit(1);
  }
};

createViews();