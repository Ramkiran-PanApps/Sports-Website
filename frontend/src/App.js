import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SportsList from './components/sportslist';
import PlayerList from './components/playerlist';
import PlayerStats from './components/playerstats';
import AddPlayerForm from './components/addplayerform';
import AddStats from './components/AddStats';
import UpdateStats from './components/UpdateStats';

function App() {
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [stats, setStats] = useState([]);
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  const [showAddStats, setShowAddStats] = useState(false);
  const [showUpdateStats, setShowUpdateStats] = useState(false);
  const [sportname, setSportname] = useState('');

  useEffect(() => {
    const fetchSports = async () => {
      const result = await axios.get('http://localhost:5000/sports');
      setSports(result.data);
    };
    fetchSports();
  }, []);

  useEffect(() => {
    if (selectedSport === 1) {
      setSportname('cricket');
    } else if (selectedSport === 2) {
      setSportname('football');
    } else if (selectedSport === 3) {
      setSportname('basketball');
    }
  }, [selectedSport]);

  useEffect(() => {
    if (selectedSport) {
      const fetchPlayers = async () => {
        const result = await axios.get(`http://localhost:5000/players?sport_id=${selectedSport}`);
        setPlayers(result.data);
        setSelectedPlayer(null); // Clear selected player when sport changes
        setStats([]); // Clear stats when sport changes
      };
      fetchPlayers();
    }
  }, [selectedSport]);

  useEffect(() => {
    if (selectedPlayer && sportname) {
      const fetchStats = async () => {
        const result = await axios.get(`http://localhost:5000/${sportname}/stats/${selectedPlayer.id}`);
        setStats(result.data);
      };
      fetchStats();
    }
  }, [selectedPlayer, sportname]);

  const handleNewPlayerClick = () => {
    setShowAddPlayerForm(!showAddPlayerForm);
  };

  const handleAddStatsClick = () => {
    setShowAddStats(!showAddStats);
  };

  const handleUpdateStatsClick = () => {
    setShowUpdateStats(!showUpdateStats);
  };

  const handleSportSelect = (sportId) => {
    setSelectedSport(sportId);
    setSelectedPlayer(null); // Clear selected player when a new sport is selected
    setStats([]); // Clear stats when a new sport is selected
  };

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    setStats([]); // Clear stats when a new player is selected
  };

  return (
    <div className="App">
      <h1>Sports Website</h1>

      <SportsList sports={sports} onSportSelect={handleSportSelect} />

      {selectedSport && (
        <>
          <PlayerList players={players} onPlayerSelect={handlePlayerSelect} />

          <button onClick={handleNewPlayerClick}>
            {showAddPlayerForm ? 'Cancel' : 'New Player'}
          </button>

          {showAddPlayerForm && <AddPlayerForm selectedSport={selectedSport} />}
        </>
      )}

      {selectedPlayer && (
        <>
          <PlayerStats player={selectedPlayer} sport={sportname} />

          <button onClick={handleAddStatsClick}>
            {showAddStats ? 'Cancel Add Stats' : 'Add Stats'}
          </button>
          {showAddStats && <AddStats player={selectedPlayer} sport={sportname} />}

          <button onClick={handleUpdateStatsClick}>
            {showUpdateStats ? 'Cancel Update Stats' : 'Update Stats'}
          </button>
          {showUpdateStats && <UpdateStats player={selectedPlayer} sport={sportname} />}
        </>
      )}
    </div>
  );
}

export default App;
