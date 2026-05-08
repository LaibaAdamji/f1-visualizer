import { useEffect, useState } from 'react';
import { getRaces, getRaceWinners } from '../services/api';

function Races() {
  const [races, setRaces] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRace, setSelectedRace] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [racesRes, winnersRes] = await Promise.all([
          getRaces(),
          getRaceWinners()
        ]);
        setRaces(racesRes.data.data);
        setWinners(winnersRes.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching races:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="panel p-10 flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading races...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div className="page-kicker mb-3">Race calendar</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Formula 1 Races</h1>
        <p className="text-gray-300 max-w-2xl leading-relaxed">
          Browse the season schedule, winners, and circuit details in a cleaner event timeline.
        </p>
      </div>

      {/* Race Calendar */}
      <div className="panel overflow-hidden">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">2025 Race Calendar</h2>
            <p className="panel-subtitle">Every round and its winning entry</p>
          </div>
        </div>
        <div className="space-y-4 p-4 sm:p-6">
          {races
            .filter(r => (r.season && (Number(r.season) === 2025 || (r.season.year && Number(r.season.year) === 2025))) || new Date(r.raceDate).getFullYear() === 2025)
            .map((race) => {
            const winner = winners.find(w => w.race_id === race.raceId);
            
            return (
              <div 
                key={race.raceId}
                className="glass-card rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-300 cursor-pointer border border-white/10"
                onClick={() => setSelectedRace(race)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {race.raceName}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {race.circuit?.circuitName} • {race.circuit?.country}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(race.raceDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {winner && (
                    <div className="mt-4 md:mt-0 md:ml-4 text-right">
                      <p className="text-sm text-gray-400">Winner</p>
                      <p className="text-lg font-bold text-f1-red">
                        {winner.winner_name}
                      </p>
                      <p className="text-sm text-gray-300">{winner.winning_team}</p>
                    </div>
                  )}

                  {!winner && (
                    <div className="mt-4 md:mt-0 md:ml-4">
                      <span className="inline-block bg-yellow-600 text-white text-sm px-3 py-1 rounded">
                        Upcoming
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-600 flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Circuit Length: {race.circuit?.length} km
                  </span>
                  <span className="text-sm text-gray-400">
                    Type: {race.raceType}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Race Details Modal */}
      {selectedRace && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedRace(null)}
        >
          <div 
            className="panel rounded-[1.75rem] p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-f1-red mb-4">
              {selectedRace.raceName}
            </h2>
            
            <div className="space-y-3 text-white">
              <p><strong>Circuit:</strong> {selectedRace.circuit?.circuitName}</p>
              <p><strong>Location:</strong> {selectedRace.circuit?.location}, {selectedRace.circuit?.country}</p>
              <p><strong>Date:</strong> {new Date(selectedRace.raceDate).toLocaleDateString()}</p>
              <p><strong>Type:</strong> {selectedRace.raceType}</p>
              <p><strong>Circuit Length:</strong> {selectedRace.circuit?.length} km</p>
              <p><strong>Season:</strong> {selectedRace.season?.year}</p>
            </div>

            <button
              onClick={() => setSelectedRace(null)}
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

export default Races;