import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRaceWinners, getDriverPerformance, getTeamStandings, getDriverStandings } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingCard from '../components/LoadingCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

function Dashboard() {
  const [winners, setWinners] = useState([]);
  const [driverPerformance, setDriverPerformance] = useState([]);
  const [driverStandings, setDriverStandings] = useState([]);
  const [teamStandings, setTeamStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let animationFrameId = 0;
    let backgroundOffset = 0;
    let lastScrollY = window.scrollY || window.pageYOffset || 0;
    let lastScrollTime = window.performance.now();

    const updateBackgroundPosition = () => {
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      const currentTime = window.performance.now();
      const scrollDelta = currentScrollY - lastScrollY;
      const timeDelta = Math.max(currentTime - lastScrollTime, 16);
      const scrollSpeed = Math.min(Math.abs(scrollDelta) / timeDelta, 2.5);
      const movementFactor = 0.08 + scrollSpeed * 0.12;

      backgroundOffset -= scrollDelta * movementFactor;
      document.documentElement.style.setProperty('--dashboard-parallax-x', `${Math.round(backgroundOffset)}px`);

      lastScrollY = currentScrollY;
      lastScrollTime = currentTime;
      animationFrameId = 0;
    };

    const handleScroll = () => {
      if (animationFrameId) {
        return;
      }
      animationFrameId = window.requestAnimationFrame(updateBackgroundPosition);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const fetchData = async () => {
      try {
        const [winnersRes, perfRes, teamsRes, standingsRes] = await Promise.all([
          getRaceWinners(),
          getDriverPerformance(),
          getTeamStandings(),
          // use standings view for authoritative championship table
          getDriverStandings(2)
        ]);

        setWinners(winnersRes.data.data || []);
        setDriverPerformance(perfRes.data.data || []);
        setTeamStandings(teamsRes.data.data || []);
        setDriverStandings(standingsRes.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();

    document.documentElement.style.setProperty('--dashboard-parallax-x', '0px');

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      document.documentElement.style.removeProperty('--dashboard-parallax-x');
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="page-header text-center space-y-4">
          <div className="skeleton h-6 w-36 rounded-full mx-auto"></div>
          <div className="skeleton h-14 w-2/3 rounded-2xl mx-auto"></div>
          <div className="skeleton h-5 w-1/2 rounded-full mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <LoadingCard key={i} />)}
        </div>
      </div>
    );
  }

  // Stats
  const totalDrivers = driverPerformance.length;
  const totalPoints = driverPerformance.reduce((sum, d) => sum + (parseFloat(d.total_points) || 0), 0);
  const totalWins = driverPerformance.reduce((sum, d) => sum + (parseInt(d.wins) || 0), 0);
  const totalRaces = winners.length;

  // Chart data - sort by points descending and get top 6
  const topDriversData = driverPerformance
    .filter(d => d.total_points !== null && d.total_points !== undefined)
    .sort((a, b) => (parseFloat(b.total_points) || 0) - (parseFloat(a.total_points) || 0))
    .slice(0, 6)
    .map(d => ({
      name: d.last_name,
      Points: parseFloat(d.total_points) || 0,
      Wins: parseInt(d.wins) || 0,
    }));

  const COLORS = ['#E10600', '#00D2BE', '#FFD700', '#4A90E2', '#FF8700', '#9333EA'];
  // compute latest season from teamStandings and use that for pie data
  const latestSeason = teamStandings.length ? Math.max(...teamStandings.map(s => Number(s.season || s.season || 0))) : null;
  const teamPieData = teamStandings
    .filter(t => (latestSeason ? Number(t.season) === Number(latestSeason) : true))
    .filter(t => t.total_points !== null && t.total_points !== undefined)
    .sort((a, b) => (parseFloat(b.total_points) || 0) - (parseFloat(a.total_points) || 0))
    .slice(0, 5)
    .map(t => ({
      name: t.team_name.split(' ').pop(),
      value: parseFloat(t.total_points) || 0,
      fullName: t.team_name
    }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 rounded-lg">
          <p className="text-white font-semibold mb-2">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-header text-center space-y-5 overflow-hidden"
        >
          <div className="page-kicker mx-auto w-fit">2024 Season Intelligence</div>
          <h1 className="text-5xl md:text-7xl font-display font-bold">
            <span className="bg-gradient-to-r from-f1-red via-white to-f1-accent bg-clip-text text-transparent">
              F1 Analytics
            </span>
          </h1>
          <p className="text-base md:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Real-time Formula 1 statistics and performance analytics with a sharper, race-paddock inspired interface.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-300">
            <span className="metric-chip"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>Live Data</span>
            <span className="metric-chip">Hybrid database backed</span>
            <span className="metric-chip">Season snapshots</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard label="Active Drivers" value={totalDrivers} color="blue" trend={5} index={0} />
          <StatCard label="Races Completed" value={totalRaces} color="yellow" trend={12} index={1} />
          <StatCard label="Total Victories" value={totalWins} color="red" trend={-3} index={2} />
          <StatCard label="Championship Points" value={totalPoints} color="green" trend={8} index={3} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Driver Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="panel overflow-hidden"
        >
          <div className="panel-header">
            <div>
              <h2 className="panel-title">
              Driver Performance
              </h2>
              <p className="panel-subtitle">Championship points by driver</p>
            </div>
            <span className="metric-chip">Top 6 drivers</span>
          </div>
          <div className="px-3 sm:px-6 py-6">
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={topDriversData} margin={{ top: 20, right: 20, left: 0, bottom: 50 }}>
              <defs>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E10600" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#E10600" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                angle={-45}
                textAnchor="end"
                height={100}
                style={{ fontSize: '13px', fontWeight: 600 }}
              />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Points" fill="url(#colorPoints)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Team Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="panel overflow-hidden"
        >
          <div className="panel-header">
            <div>
              <h2 className="panel-title"><Link to="/teams">Team Distribution</Link></h2>
              <p className="panel-subtitle">Points share by constructor</p>
            </div>
            <span className="metric-chip">Top 5 teams</span>
          </div>
          <div className="px-3 sm:px-6 py-6">
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie
                data={teamPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                style={{ fontSize: '13px', fontWeight: 600 }}
              >
                {teamPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          </div>
        </motion.div>
        </div>

        {/* Race Winners Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="page-kicker mb-3">Recent results</div>
              <h2 className="text-4xl font-display font-bold text-white mb-2">
                Recent Victories
              </h2>
              <p className="text-gray-400">Latest race winners and results</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {winners.slice(0, 4).map((race, index) => (
              <motion.div
                key={race.race_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="gradient-border rounded-[1.75rem] p-[1px] cursor-pointer group"
              >
                <div className="panel h-full p-6">
                  {/* Trophy badge based on position */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      index === 0 ? 'bg-f1-gold/20 text-f1-gold' : 
                      index === 1 ? 'bg-gray-400/20 text-gray-300' : 
                      index === 2 ? 'bg-orange-600/20 text-orange-400' : 'bg-gray-700/20 text-gray-400'
                    }`}>
                      {index === 0 ? '1st Place' : index === 1 ? '2nd Place' : index === 2 ? '3rd Place' : 'Race'}
                    </div>
                    <div className="w-2 h-2 bg-f1-red rounded-full group-hover:animate-ping"></div>
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-f1-red transition-colors">
                    {race.race_name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{race.circuit_name}</p>
                  
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <div>
                      <p className="text-f1-red font-bold text-lg">{race.winner_name}</p>
                      <p className="text-gray-400 text-sm">{race.winning_team}</p>
                    </div>
                    <p className="text-gray-500 text-xs">
                      {new Date(race.race_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Driver Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="panel overflow-hidden"
        >
            <div className="panel-header">
              <div>
                <h2 className="panel-title"><Link to="/standings">Championship Leaders</Link></h2>
                <p className="panel-subtitle">Current driver standings</p>
              </div>
              <span className="metric-chip">Top 5 drivers</span>
            </div>

          <div className="space-y-4 p-4 sm:p-6">
            {(driverStandings.length ? driverStandings : driverPerformance).slice(0, 5).map((driver, index) => (
              <motion.div
                key={driver.driver_id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.05 }}
                whileHover={{ x: 10 }}
                className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between p-5 glass-card-hover rounded-2xl group"
              >
                <div className="flex items-center space-x-6 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-2xl ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' :
                    'bg-gray-700 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-white font-display font-bold text-xl group-hover:text-f1-red transition-colors">
                      {driver.first_name} {driver.last_name}
                    </p>
                    <p className="text-gray-400 text-sm">{driver.nationality}</p>
                  </div>
                </div>

                <div className="text-left lg:text-right space-y-1">
                  <p className="text-3xl font-display font-bold text-green-400">
                    {driver.total_points || 0}
                  </p>
                  <div className="flex items-center justify-end space-x-4 text-sm">
                    <span className="text-f1-red font-semibold">{driver.wins || 0} wins</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-blue-400">{driver.podiums || 0} podiums</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
    </div>
  );
}

export default Dashboard;