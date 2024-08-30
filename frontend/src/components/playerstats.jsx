import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlayerStats({ player, sport }) {
  const [overallStats, setOverallStats] = useState({});
  const [year, setYear] = useState('');
  const [yearlyStats, setYearlyStats] = useState([]);
  const [hasStats, setHasStats] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setOverallStats({});
    setYearlyStats([]);
    setYear('');
    setHasStats(true);
    setError('');

    if (player && sport && !year) {
      axios.get(`http://localhost:5000/${sport}/stats/${player.id}`)
        .then((response) => {
          if (response.status === 200 && response.data) {
            setOverallStats(response.data);
            setHasStats(Object.keys(response.data).length > 0);
          } else {
            setHasStats(false);
          }
        })
        .catch((error) => {
          setHasStats(false);
          setError('Error fetching overall stats');
          console.error('Error fetching overall stats:', error);
        });
    }
  }, [player, sport]);

  const handleYearChange = (e) => {
    setYear(e.target.value);

    if (player && sport) {
      axios.get(`http://localhost:5000/${sport}/stats/${player.id}/year?year=${e.target.value}`)
        .then((response) => {
          if (response.status === 200 && response.data) {
            setYearlyStats(response.data);
            setHasStats(response.data.length > 0);
          } else {
            setYearlyStats([]);
            setHasStats(false);
          }
        })
        .catch((error) => {
          setYearlyStats([]);
          setHasStats(false);
          setError('Error fetching yearly stats');
          console.error('Error fetching yearly stats:', error);
        });
    }
  };

  const handleDeleteYearlyStats = async () => {
    try {
      await axios.delete(`http://localhost:5000/${sport}/stats/${player.id}/${year}`);
      alert(`Stats for the year ${year} deleted successfully`);
      setYearlyStats([]); // Clear the yearly stats after deletion
    } catch (error) {
      console.error('Error deleting yearly stats:', error);
      alert('Failed to delete yearly stats');
    }
  };

  const renderStats = () => {
    if (error) {
      return <p>{error}</p>;
    }

    if (!hasStats) {
      return <p>No stats available for this player.</p>;
    }

    if (sport === 'cricket') {
      return (
        <>
          <p>Total Matches: {overallStats.total_matches}</p>
          <p>Total Runs: {overallStats.total_runs}</p>
          <p>Batting Average: {overallStats.batting_average}</p>
          <p>Strike Rate: {overallStats.strike_rate}</p>
          <p>Centuries: {overallStats.centuries}</p>
          <p>Fifties: {overallStats.fifties}</p>
          <p>Bowling Average: {overallStats.bowling_average}</p>
          <p>Economy: {overallStats.economy}</p>
          <p>Five-Wicket Hauls: {overallStats.five_wickets}</p>
          <p>Best Bowling: {overallStats.best_bowling}</p>
        </>
      );
    } else if (sport === 'football') {
      return (
        <>
          <p>Total Matches: {overallStats.matches}</p>
          <p>Total Goals: {overallStats.goals}</p>
          <p>Total Assists: {overallStats.assists}</p>
          <p>Team Trophies: {overallStats.team_trophies}</p>
          <p>Individual Trophies: {overallStats.individual_trophies}</p>
        </>
      );
    } else if (sport === 'basketball') {
      return (
        <>
          <p>Total Matches: {overallStats.total_matches}</p>
          <p>Average Points: {overallStats.points}</p>
          <p>Average Rebounds: {overallStats.rebounds}</p>
          <p>Average Assists: {overallStats.assists}</p>
          <p>Average Efficiency: {overallStats.efficiency}</p>
          <p>Average Turnovers: {overallStats.turnovers}</p>
        </>
      );
    } else {
      return <p>No stats available for this sport.</p>;
    }
  };

  const renderYearlyStats = () => {
    if (yearlyStats.length === 0) {
      return <p>No stats available for this year.</p>;
    }

    return (
      <div>
        <ul>
          {yearlyStats.map((stat, index) => (
            <li key={index}>
              <ul>
                {Object.entries(stat)
                  .filter(([key]) => key !== 'id' && key !== 'player_id')
                  .map(([key, value]) => (
                    <li key={key}>
                      <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
        <button onClick={handleDeleteYearlyStats}>Delete {year} stats</button>
      </div>
    );
  };

  return (
    <div>
      <h2>{player.name} Stats</h2>

      <h3>Yearly Stats</h3>
      <input
        type="number"
        value={year}
        onChange={handleYearChange}
        placeholder="Enter Year"
      />
      {year ? renderYearlyStats() : renderStats()}
    </div>
  );
}

export default PlayerStats;
