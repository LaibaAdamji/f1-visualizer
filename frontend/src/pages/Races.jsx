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
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading races...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">Formula 1 Races</h1>

      {/* Race Calendar */}
      <div className="bg-f1-gray rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-f1-red mb-4">2024 Race Calendar</h2>
        <div className="space-y-4">
          {races.map((race) => {
            const winner = winners.find(w => w.race_id === race.raceId);
            
            return (
              <div 
                key={race.raceId}
                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition cursor-pointer"
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
                        🏆 {winner.winner_name}
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
            className="bg-f1-gray rounded-lg p-8 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto"
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

export default Races;