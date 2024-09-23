import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SportsList from './components/sportslist';
import PlayerList from './components/playerlist';
import PlayerStats from './components/playerstats';
import AddPlayerForm from './components/addplayerform';
import AddStats from './components/AddStats';
import UpdateStats from './components/UpdateStats';
import { Modal, Button } from 'antd';
import 'antd/dist/reset.css';
import './App.css';

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
  const [topPlayer, setTopPlayer] = useState(null);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const result = await axios.get('http://localhost:5000/sports');
        setSports(result.data);
      } catch (error) {
        console.error('Error fetching sports:', error);
      }
    };
    fetchSports();
  }, []);

  useEffect(() => {
    if (selectedSport) {
      setSportname(['cricket', 'football', 'basketball'][selectedSport - 1]);
      const fetchPlayers = async () => {
        try {
          const result = await axios.get(`http://localhost:5000/players?sport_id=${selectedSport}`);
          const maxPlayer = result.data.reduce((max, play) => {
            const playTotal = Number(play.total);
            const maxTotal = Number(max.total);
            return playTotal > maxTotal ? play : max;
          }, { total: 0 });
          setTopPlayer(maxPlayer);
          setPlayers(result.data);
        } catch (error) {
          console.error('Error fetching players:', error);
        }
      };
      fetchPlayers();
    }
  }, [selectedSport, sportname]);

  useEffect(() => {
    if (selectedPlayer && sportname) {
      const fetchStats = async () => {
        try {
          const result = await axios.get(`http://localhost:5000/${sportname}/stats/${selectedPlayer.id}`);
          setStats(result.data);
        } catch (error) {
          console.error('Error fetching player stats:', error);
        }
      };
      fetchStats();
    }
  }, [selectedPlayer, sportname]);

  const handleSportSelect = (sportId) => {
    setSelectedSport(sportId);
    setSelectedPlayer(null);
    setStats([]);
  };

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    setStats([]);
  };

  const closeAllModals = () => {
    setShowAddPlayerForm(false);
    setShowAddStats(false);
    setShowUpdateStats(false);
  };

  return (
    <div className="App">
      <h1>Sports Website</h1>

      <SportsList sports={sports} onSportSelect={handleSportSelect} />

      {selectedSport && (
        <div className='topper' style={{ textAlign: 'center', margin: '20px 0' }}>
          {topPlayer && (
            <p>
              The player with the most {sportname === 'cricket' ? 'runs' : sportname === 'football' ? 'goals' : 'matches'} in {sportname} is {topPlayer.name} with {topPlayer.total} {sportname === 'cricket' ? 'runs' : sportname === 'football' ? 'goals' : 'matches'}.
            </p>
          )}
        </div>
      )}

      {selectedSport && (
        <>
          <PlayerList 
          players={players} 
          onPlayerSelect={handlePlayerSelect} 
          sport={sportname} 
          selectedPlayer={selectedPlayer} // Highlight selected player
        />

          <Button type="primary" onClick={() => { closeAllModals(); setShowAddPlayerForm(true); }}>
            Add New Player
          </Button>
        </>
      )}

      {selectedPlayer && !showAddPlayerForm && !showAddStats && !showUpdateStats && (
        <PlayerStats player={selectedPlayer} sport={sportname} />
      )}

      {selectedPlayer && (
        <>
          <Button type="primary" onClick={() => { closeAllModals(); setShowAddStats(true); }}>
            Add Stats
          </Button>
          <Button type="primary" onClick={() => { closeAllModals(); setShowUpdateStats(true); }}>
            Update Stats
          </Button>
        </>
      )}

      {/* Modals with Transition Effects */}
      <Modal
        title="Add New Player"
        visible={showAddPlayerForm}
        onCancel={closeAllModals}
        footer={null}
        className={showAddPlayerForm ? "show" : ""}
      >
        {showAddPlayerForm && <AddPlayerForm selectedSport={selectedSport} />}
      </Modal>

      <Modal
        title="Add Stats"
        visible={showAddStats}
        onCancel={closeAllModals}
        footer={null}
        className={showAddStats ? "show" : ""}
      >
        {showAddStats && <AddStats player={selectedPlayer} sport={sportname} />}
      </Modal>

      <Modal
        title="Update Stats"
        visible={showUpdateStats}
        onCancel={closeAllModals}
        footer={null}
        className={showUpdateStats ? "show" : ""}
      >
        {showUpdateStats && <UpdateStats player={selectedPlayer} sport={sportname} />}
      </Modal>
    </div>
  );
}

export default App;
