import { useEffect, useState } from 'react';
import { getDrivers, getDriverPerformance } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('all');
  const [sortBy, setSortBy] = useState('points');

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

  const getDriverImage = (driver) => {
    if (!driver) return null;
    // Prefer optimized public assets placed in /public/assets by the optimization script.
    const publicCandidates = [
      `${driver.firstName} ${driver.lastName}.webp`,
      `${driver.firstName} ${driver.lastName}.jpg`,
      `${driver.firstName} ${driver.lastName}.png`,
      `${driver.firstName}_${driver.lastName}.webp`,
      `${driver.firstName}_${driver.lastName}.jpg`,
    ];
    // Return the first candidate URL — if file doesn't exist the browser will 404 and fallback to placeholder.
    return `/assets/${publicCandidates[0]}`;
  };

  if (loading) {
    return (
      <div className="panel p-10 flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading drivers...</div>
      </div>
    );
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const nationalities = [...new Set(drivers.map((driver) => driver.nationality).filter(Boolean))].sort();

  const filteredDrivers = drivers.filter((driver) => {
    const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();
    const matchSearch = !normalizedSearch || fullName.includes(normalizedSearch);
    const matchNationality = selectedNationality === 'all' || driver.nationality === selectedNationality;
    return matchSearch && matchNationality;
  });

  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    const perfA = performance.find((p) => p.driver_id === a.driverId) || {};
    const perfB = performance.find((p) => p.driver_id === b.driverId) || {};
    const pointsA = parseFloat(perfA.total_points) || 0;
    const pointsB = parseFloat(perfB.total_points) || 0;
    const winsA = parseInt(perfA.wins) || 0;
    const winsB = parseInt(perfB.wins) || 0;

    if (sortBy === 'wins') return winsB - winsA;
    if (sortBy === 'name') return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    return pointsB - pointsA;
  });

  const chartData = sortedDrivers.slice(0, 6).map((driver) => {
    const perf = performance.find((p) => p.driver_id === driver.driverId) || {};
    return {
      name: `${driver.firstName} ${driver.lastName}`,
      Points: parseFloat(perf.total_points) || 0,
      Wins: parseInt(perf.wins) || 0,
      Podiums: parseInt(perf.podiums) || 0,
    };
  });

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div className="page-kicker mb-3">Driver roster</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Formula 1 Drivers</h1>
        <p className="text-gray-300 max-w-2xl leading-relaxed">
          Compare every driver, their performance profile, and championship history in a cleaner, more readable layout.
        </p>
      </div>

      <div className="panel p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-gray-400">Search driver</label>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Verstappen"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-f1-red/60"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-gray-400">Nationality</label>
            <select
              value={selectedNationality}
              onChange={(e) => setSelectedNationality(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-f1-red/60"
            >
              <option value="all">All nationalities</option>
              {nationalities.map((nationality) => (
                <option key={nationality} value={nationality}>{nationality}</option>
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

      {/* Performance Chart */}
      <div className="panel overflow-hidden">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Driver Performance Comparison</h2>
            <p className="panel-subtitle">Points, wins, and podiums for the top performers</p>
          </div>
        </div>
        <div className="px-3 sm:px-6 py-6">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="name" stroke="#C9CBD6" angle={-45} textAnchor="end" height={110} />
            <YAxis stroke="#C9CBD6" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(21, 21, 30, 0.96)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', backdropFilter: 'blur(12px)' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar dataKey="Points" fill="#E10600" />
            <Bar dataKey="Wins" fill="#FFD700" />
            <Bar dataKey="Podiums" fill="#4A90E2" />
          </BarChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedDrivers.map((driver) => {
          const perf = performance.find(p => p.driver_id === driver.driverId) || {};
              const thumb = getDriverImage(driver);
          
          return (
            <div 
              key={driver.driverId} 
              className="panel p-6 hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
              onClick={() => setSelectedDriver(driver)}
            >
              <div className="flex items-start justify-between mb-4 gap-4">
                <h3 className="text-xl font-bold text-white">
                  {driver.firstName} {driver.lastName}
                </h3>
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

      {sortedDrivers.length === 0 && (
        <div className="panel p-10 text-center text-gray-300">
          No drivers match your current filters.
        </div>
      )}

      {/* Driver Modal (if selected) */}
      {selectedDriver && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedDriver(null)}
        >
          <div 
                  className="panel rounded-[1.75rem] p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-f1-red mb-4">
              {selectedDriver.firstName} {selectedDriver.lastName}
            </h2>
            <div className="flex items-start gap-6">
              {getDriverImage(selectedDriver) && (
                <div className="w-40 h-40 flex-shrink-0 rounded-2xl overflow-hidden bg-black/40 p-2">
                  <img src={getDriverImage(selectedDriver)} alt={`${selectedDriver.firstName} ${selectedDriver.lastName}`} className="w-full h-full object-contain transform transition-transform duration-300 hover:scale-105" />
                </div>
              )}
              <div className="space-y-3 text-white">
                <p><strong>Nationality:</strong> {selectedDriver.nationality}</p>
                <p><strong>Date of Birth:</strong> {new Date(selectedDriver.dateOfBirth).toLocaleDateString()}</p>
                <p><strong>Championships Won:</strong> {selectedDriver.championshipsWon}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedDriver(null)}
              className="mt-6 w-full bg-gradient-to-r from-f1-red to-red-700 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-f1-red/40 transition-all duration-300 transform hover:scale-105"
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