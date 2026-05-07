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
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading teams...</div>
      </div>
    );
  }

  // Chart colors
  const COLORS = ['#E10600', '#00D2BE', '#DC0000', '#FF8700', '#006F62', '#0090FF'];

  // Prepare pie chart data
  const pieData = standings
    .filter(s => s.season === 2024)
    .map(s => ({
      name: s.team_name,
      value: parseInt(s.total_points) || 0
    }))
    .filter(d => d.value > 0);

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">Formula 1 Teams</h1>

      {/* Points Distribution Chart */}
      {pieData.length > 0 && (
        <div className="bg-f1-gray rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-f1-red mb-4">2024 Points Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
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
                contentStyle={{ backgroundColor: '#38383F', border: 'none', borderRadius: '8px' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => {
          const teamStanding = standings.find(s => s.team_id === team.teamId && s.season === 2024) || {};
          
          return (
            <div 
              key={team.teamId} 
              className="bg-f1-gray rounded-lg p-6 hover:bg-gray-700 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">{team.teamName}</h3>
                <span className="text-3xl">🏁</span>
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
                    {team.championshipsWon} 🏆
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