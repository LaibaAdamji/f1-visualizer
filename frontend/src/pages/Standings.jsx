import { useEffect, useState } from 'react';
import { getDriverStandings } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Standings() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading standings...</div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = standings.slice(0, 6).map(d => ({
    name: `${d.first_name} ${d.last_name}`,
    Points: parseInt(d.total_points)
  }));

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">2024 Driver Standings</h1>

      {/* Points Chart */}
      <div className="bg-f1-gray rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-f1-red mb-4">Points Progression</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="#fff" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#38383F', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line type="monotone" dataKey="Points" stroke="#E10600" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Standings Table */}
      <div className="bg-f1-gray rounded-lg p-6">
        <h2 className="text-2xl font-bold text-f1-red mb-4">Championship Standings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-f1-red">
                <th className="text-left py-3 px-4 text-white">Pos</th>
                <th className="text-left py-3 px-4 text-white">Driver</th>
                <th className="text-left py-3 px-4 text-white">Team</th>
                <th className="text-right py-3 px-4 text-white">Points</th>
                <th className="text-right py-3 px-4 text-white">Wins</th>
                <th className="text-right py-3 px-4 text-white">Races</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((driver, index) => (
                <tr 
                  key={driver.driver_id} 
                  className={`border-b border-gray-700 hover:bg-gray-700 ${
                    index === 0 ? 'bg-yellow-900 bg-opacity-20' :
                    index === 1 ? 'bg-gray-600 bg-opacity-20' :
                    index === 2 ? 'bg-orange-900 bg-opacity-20' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className={`font-bold ${
                      index === 0 ? 'text-yellow-400 text-xl' :
                      index === 1 ? 'text-gray-300 text-xl' :
                      index === 2 ? 'text-orange-400 text-xl' :
                      'text-white'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : driver.position}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white font-semibold">
                      {driver.first_name} {driver.last_name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {driver.team_name}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-green-400 font-bold text-lg">
                      {driver.total_points}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-f1-red font-bold">
                      {driver.wins}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-400">
                    {driver.races_entered}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Standings;