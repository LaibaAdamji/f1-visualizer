import { useEffect, useState } from 'react';
import { getDrivers, getDriverPerformance } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, perfRes] = await Promise.all([
          getDrivers(),
          getDriverPerformance()
        ]);
        setDrivers(driversRes.data.data);
        setPerformance(perfRes.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading drivers...</div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = performance.slice(0, 6).map(d => ({
    name: `${d.first_name} ${d.last_name}`,
    Points: parseInt(d.total_points) || 0,
    Wins: parseInt(d.wins) || 0,
    Podiums: parseInt(d.podiums) || 0
  }));

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">Formula 1 Drivers</h1>

      {/* Performance Chart */}
      <div className="bg-f1-gray rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-f1-red mb-4">Driver Performance Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="#fff" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#38383F', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="Points" fill="#E10600" />
            <Bar dataKey="Wins" fill="#FFD700" />
            <Bar dataKey="Podiums" fill="#4A90E2" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => {
          const perf = performance.find(p => p.driver_id === driver.driverId) || {};
          
          return (
            <div 
              key={driver.driverId} 
              className="bg-f1-gray rounded-lg p-6 hover:bg-gray-700 transition cursor-pointer"
              onClick={() => setSelectedDriver(driver)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {driver.firstName} {driver.lastName}
                </h3>
                <span className="text-2xl">🏎️</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Nationality:</span>
                  <span className="text-white font-semibold">{driver.nationality}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Championships:</span>
                  <span className="text-yellow-400 font-bold">{driver.championshipsWon || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Total Points:</span>
                  <span className="text-green-400 font-bold">{perf.total_points || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Wins:</span>
                  <span className="text-f1-red font-bold">{perf.wins || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Podiums:</span>
                  <span className="text-blue-400 font-bold">{perf.podiums || 0}</span>
                </div>

                {driver.dateOfBirth && (
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-600">
                    <span className="text-gray-400">Born:</span>
                    <span className="text-gray-300">
                      {new Date(driver.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Driver Modal (if selected) */}
      {selectedDriver && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedDriver(null)}
        >
          <div 
            className="bg-f1-gray rounded-lg p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-f1-red mb-4">
              {selectedDriver.firstName} {selectedDriver.lastName}
            </h2>
            <div className="space-y-3 text-white">
              <p><strong>Nationality:</strong> {selectedDriver.nationality}</p>
              <p><strong>Date of Birth:</strong> {new Date(selectedDriver.dateOfBirth).toLocaleDateString()}</p>
              <p><strong>Championships Won:</strong> {selectedDriver.championshipsWon}</p>
            </div>
            <button
              onClick={() => setSelectedDriver(null)}
              className="mt-6 w-full bg-f1-red text-white py-2 px-4 rounded hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Drivers;