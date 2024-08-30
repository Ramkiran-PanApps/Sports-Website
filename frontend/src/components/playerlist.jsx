import React from 'react';
import axios from 'axios';

function PlayersList({ players, onPlayerSelect }) {
  const handleDelete = async (playerId) => {
    try {
      await axios.delete(`http://localhost:5000/players/${playerId}`);
      alert('Player deleted successfully');
      window.location.reload(); // Refresh the page to update the players list
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('Failed to delete player');
    }
  };

  return (
    <div>
      <h2>Select a Player</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            <span onClick={() => onPlayerSelect(player)}>
              {player.name} - {player.country} - {player.age} - {player.active ? 'Active' : 'Inactive'}
            </span>
            <button onClick={() => handleDelete(player.id)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayersList;
