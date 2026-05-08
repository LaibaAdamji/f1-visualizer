import { useEffect, useState } from 'react';
import { getTeams, getTeamStandings } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes, standingsRes] = await Promise.all([
          getTeams(),
          getTeamStandings()
        ]);
        setTeams(teamsRes.data.data);
        setStandings(standingsRes.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="panel p-10 flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading teams...</div>
      </div>
    );
  }

  // Chart colors
  const COLORS = ['#E10600', '#00D2BE', '#DC0000', '#FF8700', '#006F62', '#0090FF'];

  // Prepare pie chart data
  const pieData = standings
    .filter(s => s.total_points !== null && s.total_points !== undefined)
    .sort((a, b) => (parseFloat(b.total_points) || 0) - (parseFloat(a.total_points) || 0))
    .slice(0, 5)
    .map(s => ({
      name: s.team_name,
      value: parseFloat(s.total_points) || 0
    }))
    .filter(d => d.value > 0);

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div className="page-kicker mb-3">Constructor overview</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Formula 1 Teams</h1>
        <p className="text-gray-300 max-w-2xl leading-relaxed">
          Explore each constructor’s identity, home country, and 2024 season performance in one polished view.
        </p>
      </div>

      {/* Points Distribution Chart */}
      {pieData.length > 0 && (
        <div className="panel overflow-hidden">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">2024 Points Distribution</h2>
              <p className="panel-subtitle">Share of total constructor points</p>
            </div>
          </div>
          <div className="px-3 sm:px-6 py-6">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(21, 21, 30, 0.96)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', backdropFilter: 'blur(12px)' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
            </div>
        </div>
      )}

      {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => {
          const teamStanding = standings.find(s => s.team_id === team.teamId) || {};
          
          return (
            <div 
              key={team.teamId} 
                className="panel p-6 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">{team.teamName}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Country:</span>
                  <span className="text-white font-semibold">{team.country}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Founded:</span>
                  <span className="text-white font-semibold">{team.foundedYear}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Championships:</span>
                  <span className="text-yellow-400 font-bold text-lg">
                    {team.championshipsWon} Title{team.championshipsWon !== 1 ? 's' : ''}
                  </span>
                </div>

                {teamStanding.total_points && (
                  <>
                    <div className="border-t border-gray-600 pt-3 mt-3">
                      <p className="text-gray-400 text-sm mb-2">2024 Season Performance:</p>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Points:</span>
                      <span className="text-green-400 font-bold text-lg">
                        {teamStanding.total_points}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Wins:</span>
                      <span className="text-f1-red font-bold">{teamStanding.wins || 0}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Podiums:</span>
                      <span className="text-blue-400 font-bold">{teamStanding.podiums || 0}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Teams;