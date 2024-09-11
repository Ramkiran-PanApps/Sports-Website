import React from 'react';
import axios from 'axios';
import { List, Button, Typography, Card } from 'antd';
import 'antd';

const { Text } = Typography;

function PlayersList({ players, onPlayerSelect, sport, onDelete }) {
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
          renderItem={(player) => (
            <List.Item
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
                {player.name} - {player.country} - {player.age} -{' '}
                {player.active ? 'Active' : 'Inactive'} - {sport === 'cricket' ? `${player.total} runs` : sport === 'football' ? `${player.total} goals` : `${player.total} matches`}
              </Text>
            </List.Item>
          )}
        />
      </Card>
    </div>
    
  );
}

export default PlayersList;
