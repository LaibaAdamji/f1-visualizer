import { useEffect, useState } from 'react';
import { getDriverStandings } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Standings() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [sortBy, setSortBy] = useState('points');

  const getDriverKey = (driver, index) => {
    if (driver.driver_id !== undefined && driver.driver_id !== null) {
      return `driver-${driver.driver_id}`;
    }

    return `driver-${driver.first_name}-${driver.last_name}-${driver.team_name}-${index}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get 2024 season standings (seasonId: 2)
        const response = await getDriverStandings(2);
        setStandings(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching standings:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="panel p-10 flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading standings...</div>
      </div>
    );
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const teams = [...new Set(standings.map((driver) => driver.team_name).filter(Boolean))].sort();

  const filteredStandings = standings.filter((driver) => {
    const fullName = `${driver.first_name} ${driver.last_name}`.toLowerCase();
    const matchSearch = !normalizedSearch || fullName.includes(normalizedSearch);
    const matchTeam = selectedTeam === 'all' || driver.team_name === selectedTeam;
    return matchSearch && matchTeam;
  });

  const sortedStandings = [...filteredStandings].sort((a, b) => {
    const pointsA = parseFloat(a.total_points) || 0;
    const pointsB = parseFloat(b.total_points) || 0;
    const winsA = parseInt(a.wins) || 0;
    const winsB = parseInt(b.wins) || 0;

    if (sortBy === 'wins') return winsB - winsA;
    if (sortBy === 'name') return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
    return pointsB - pointsA;
  });

  const chartData = sortedStandings.slice(0, 6).map((driver) => ({
    name: `${driver.first_name} ${driver.last_name}`,
    Points: parseFloat(driver.total_points) || 0,
  }));

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div className="page-kicker mb-3">Championship table</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">2024 Driver Standings</h1>
        <p className="text-gray-300 max-w-2xl leading-relaxed">
          Track championship momentum with a cleaner progression chart and a more legible standings table.
        </p>
      </div>

      <div className="panel p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-gray-400">Search driver</label>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Norris"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-f1-red/60"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-gray-400">Team</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-f1-red/60"
            >
              <option value="all">All teams</option>
              {teams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-gray-400">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-f1-red/60"
            >
              <option value="points">Total points</option>
              <option value="wins">Wins</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Points Chart */}
      <div className="panel overflow-hidden">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Points Progression</h2>
            <p className="panel-subtitle">Top six drivers by championship points</p>
          </div>
        </div>
        <div className="px-3 sm:px-6 py-6">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="name" stroke="#C9CBD6" angle={-45} textAnchor="end" height={110} />
            <YAxis stroke="#C9CBD6" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(21, 21, 30, 0.96)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', backdropFilter: 'blur(12px)' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line type="monotone" dataKey="Points" stroke="#E10600" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* Standings Table */}
      <div className="panel overflow-hidden">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Championship Standings</h2>
            <p className="panel-subtitle">Full driver ranking for the season</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5">
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-5 text-gray-300 font-semibold uppercase tracking-[0.18em] text-xs">Pos</th>
                <th className="text-left py-4 px-5 text-gray-300 font-semibold uppercase tracking-[0.18em] text-xs">Driver</th>
                <th className="text-left py-4 px-5 text-gray-300 font-semibold uppercase tracking-[0.18em] text-xs">Team</th>
                <th className="text-left py-4 px-5 text-gray-300 font-semibold uppercase tracking-[0.18em] text-xs">Points</th>
                <th className="text-right py-4 px-5 text-gray-300 font-semibold uppercase tracking-[0.18em] text-xs">Wins</th>
                <th className="text-right py-4 px-5 text-gray-300 font-semibold uppercase tracking-[0.18em] text-xs">Races</th>
              </tr>
            </thead>
            <tbody>
              {sortedStandings.map((driver, index) => (
                <tr 
                  key={getDriverKey(driver, index)} 
                  className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                    index === 0 ? 'bg-yellow-500/5' :
                    index === 1 ? 'bg-white/5' :
                    index === 2 ? 'bg-orange-500/5' : ''
                  }`}
                >
                  <td className="py-4 px-5">
                    <span className={`font-bold text-sm px-2 py-1 rounded-full inline-block ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-300' :
                      index === 1 ? 'bg-gray-400/20 text-gray-200' :
                      index === 2 ? 'bg-orange-500/20 text-orange-300' :
                      'text-white'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-white font-semibold">
                      {driver.first_name} {driver.last_name}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-gray-300">
                    {driver.team_name}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className="text-green-300 font-bold text-lg">
                      {driver.total_points}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className="text-f1-red font-bold">
                      {driver.wins}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right text-gray-400">
                    {driver.races_entered}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedStandings.length === 0 && (
        <div className="panel p-10 text-center text-gray-300">
          No standings entries match your current filters.
        </div>
      )}
    </div>
  );
}

export default Standings;