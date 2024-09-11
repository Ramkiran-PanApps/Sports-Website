import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Card, Row, Col, Input, Button, Descriptions } from 'antd';

function PlayerStats({ player, sport }) {
  const [overallStats, setOverallStats] = useState({});
  const [year, setYear] = useState('');
  const [yearlyStats, setYearlyStats] = useState([]);
  const [overallError, setOverallError] = useState(''); 
  const [yearlyError, setYearlyError] = useState(''); 

  useEffect(() => {
    
    setOverallStats({});
    setOverallError('');
    
    if (player && sport) {
      axios.get(`http://localhost:5000/${sport}/stats/${player.id}`)
        .then((response) => {
          if (response.status === 200 && response.data) {
            setOverallStats(response.data);
          } else {
            setOverallError('No overall stats available for this player.');
          }
        })
        .catch((error) => {
          setOverallError('Error fetching overall stats');
          console.error('Error fetching overall stats:', error);
        });
    }
  }, [player, sport]);

  const handleYearChange = (e) => {
    const yearValue = e.target.value;
    setYear(yearValue);
    setYearlyError(''); 

    if (player && sport && yearValue) {
      axios.get(`http://localhost:5000/${sport}/stats/${player.id}/year?year=${yearValue}`)
        .then((response) => {
          if (response.status === 200 && response.data) {
            setYearlyStats(response.data);
          } else {
            setYearlyStats([]);
            setYearlyError('No stats available for this year');
          }
        })
        .catch((error) => {
          setYearlyStats([]);
          setYearlyError('Error fetching yearly stats');
          console.error('Error fetching yearly stats:', error);
        });
    }
  };

  const handleDeleteYearlyStats = async () => {
    try {
      await axios.delete(`http://localhost:5000/${sport}/stats/${player.id}/${year}`);
      alert(`Stats for the year ${year} deleted successfully`);
      setYearlyStats([]); 
    } catch (error) {
      console.error('Error deleting yearly stats:', error);
      alert('Failed to delete yearly stats');
    }
  };

  const renderOverallStats = () => {
    if (overallError) {
      return <p>{overallError}</p>;
    }

    if (!Object.keys(overallStats).length) {
      return <p>No overall stats available for this player.</p>;
    }

    return (
      <Descriptions bordered column={2} title={`${sport.toUpperCase()} Overall Stats`} layout="vertical">
        {Object.entries(overallStats).map(([key, value]) => (
          <Descriptions.Item label={key.replace(/_/g, ' ').toUpperCase()} key={key}>
            {value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    );
  };

  const renderYearlyStats = () => {
    if (yearlyError) {
      return <p>{yearlyError}</p>;
    }
  
    if (!yearlyStats.length) {
      return <p>No stats available for this year.</p>;
    }
  
    return (
      <Card title={`Yearly Stats for ${year}`} bordered={false} style={{ marginTop: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <List
          bordered
          dataSource={yearlyStats}
          renderItem={(stat, index) => (
            <List.Item>
              <ul style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
                {Object.entries(stat)
                  .filter(([key]) => key !== 'id' && key !== 'player_id')
                  .map(([key, value]) => (
                    <li key={key} style={{ marginBottom: '8px' }}>
                      <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
                    </li>
                  ))}
              </ul>
            </List.Item>
          )}
        />
        <Button type="danger" onClick={handleDeleteYearlyStats} style={{ marginTop: '10px' }}>
          Delete {year} stats
        </Button>
      </Card>
    );
  };
  

  return (
    <div className="player-stats">
      <h2>{player.name} Stats</h2>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Overall Stats" bordered={false}>
            {renderOverallStats()}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Yearly Stats" bordered={false}>
            <Input
              type="number"
              value={year}
              onChange={handleYearChange}
              placeholder="Enter Year"
              style={{ marginBottom: '10px' }}
            />
            {year ? renderYearlyStats() : <p>Please enter a year to see stats.</p>}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlayerStats;
