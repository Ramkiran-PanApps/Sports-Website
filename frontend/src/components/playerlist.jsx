import React from 'react';
import axios from 'axios';
import { List, Button, Typography, Card } from 'antd';
import 'antd';

const { Text } = Typography;

function PlayersList({ players, onPlayerSelect, sport, onDelete, selectedPlayer }) {
  const handleDelete = async (playerId) => {
    try {
      await axios.delete(`http://localhost:5000/players/${playerId}`);
      alert('Player deleted successfully');
      onDelete(playerId);
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('Failed to delete player');
    }
  };

  return (
    <div className="player-list compact">
      <h2>Select a Player</h2>
      <Card className="players-card">
        <List
          bordered
          dataSource={players}
          renderItem={(player) => {
            // Conditionally apply styles based on whether the player is selected
            const isSelected = selectedPlayer && selectedPlayer.id === player.id;
            const itemClass = isSelected ? 'selected-player' : '';

            return (
              <List.Item
                className={itemClass}  // Add a class for selected players
                actions={[
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleDelete(player.id)}
                    size="small"
                  >
                    Delete
                  </Button>,
                ]}
              >
                <Text
                  onClick={() => onPlayerSelect(player)}
                  style={{ cursor: 'pointer', fontSize: 16 }}
                >
                  {player.name} &nbsp; ( Country : {player.country} - Age: {player.age} -{' '}
                  Status : {player.active ? 'Active' : 'Inactive'} - {sport === 'cricket' ? `${player.total} career runs` : sport === 'football' ? `${player.total} career goals` : `${player.total} career matches`} )
                </Text>
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
}

export default PlayersList;
