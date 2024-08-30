import React, { useState } from 'react';
import axios from 'axios';

const AddStats = ({ player, sport }) => {
  const [year, setYear] = useState('');
  const [matches, setMatches] = useState('');
  const [runs, setRuns] = useState('');
  const [battingAverage, setBattingAverage] = useState('');
  const [strikeRate, setStrikeRate] = useState('');
  const [centuries, setCenturies] = useState('');
  const [fifties, setFifties] = useState('');
  const [bowlingAverage, setBowlingAverage] = useState('');
  const [economy, setEconomy] = useState('');
  const [fiveWickets, setFiveWickets] = useState('');
  const [bestBowling, setBestBowling] = useState('');
  const [goals, setGoals] = useState('');
  const [assists, setAssists] = useState('');
  const [teamTrophies, setTeamTrophies] = useState('');
  const [individualTrophies, setIndividualTrophies] = useState('');
  const [points, setPoints] = useState('');
  const [rebounds, setRebounds] = useState('');
  const [assistsBasketball,setAssistsBasketball] = useState('')
  const [efficiency, setEfficiency] = useState('');
  const [turnovers, setTurnovers] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const statsData = {
      player_id: player.id,
      year,
      matches,
      ...(sport === 'cricket' && {
        runs,
        batting_average: battingAverage,
        strike_rate: strikeRate,
        centuries,
        fifties,
        bowling_average: bowlingAverage,
        economy,
        five_wickets: fiveWickets,
        best_bowling: bestBowling,
      }),
      ...(sport === 'football' && {
        goals,
        assists,
        team_trophies: teamTrophies,
        individual_trophies: individualTrophies,
      }),
      ...(sport === 'basketball' && {
        points,
        rebounds,
        assists : assistsBasketball,
        efficiency,
        turnovers,
      }),
    };
    
  console.log('Submitting stats data:', statsData);


    try {
      await axios.post(`http://localhost:5000/${sport}/stats`, statsData);
      console.log('Stats added successfully');
      alert(`Stats for the year ${year} added successfully`);

    } catch (error) {
      console.error('Error adding stats:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request data:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Stats</h2>
      <input
        id="year"
        name="year"
        type="text"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year"
        required
      />
      <input
        id="matches"
        name="matches"
        type="number"
        value={matches}
        onChange={(e) => setMatches(e.target.value)}
        placeholder="Matches"
        required
      />
      {sport === 'cricket' && (
        <>
          <input
            id="runs"
            name="runs"
            type="number"
            value={runs}
            onChange={(e) => setRuns(e.target.value)}
            placeholder="Runs"
          />
          <input
            id="battingAverage"
            name="battingAverage"
            type="number"
            step="0.01"
            value={battingAverage}
            onChange={(e) => setBattingAverage(e.target.value)}
            placeholder="Batting Average"
          />
          <input
            id="strikeRate"
            name="strikeRate"
            type="number"
            step="0.01"
            value={strikeRate}
            onChange={(e) => setStrikeRate(e.target.value)}
            placeholder="Strike Rate"
          />
          <input
            id="centuries"
            name="centuries"
            type="number"
            value={centuries}
            onChange={(e) => setCenturies(e.target.value)}
            placeholder="Centuries"
          />
          <input
            id="fifties"
            name="fifties"
            type="number"
            value={fifties}
            onChange={(e) => setFifties(e.target.value)}
            placeholder="Fifties"
          />
          <input
            id="bowlingAverage"
            name="bowlingAverage"
            type="number"
            step="0.01"
            value={bowlingAverage}
            onChange={(e) => setBowlingAverage(e.target.value)}
            placeholder="Bowling Average"
          />
          <input
            id="economy"
            name="economy"
            type="number"
            step="0.01"
            value={economy}
            onChange={(e) => setEconomy(e.target.value)}
            placeholder="Economy"
          />
          <input
            id="fiveWickets"
            name="fiveWickets"
            type="number"
            value={fiveWickets}
            onChange={(e) => setFiveWickets(e.target.value)}
            placeholder="Five Wickets"
          />
          <input
            id="bestBowling"
            name="bestBowling"
            type="text"
            value={bestBowling}
            onChange={(e) => setBestBowling(e.target.value)}
            placeholder="Best Bowling"
          />
        </>
      )}
      {sport === 'football' && (
        <>
          <input
            id="goals"
            name="goals"
            type="number"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Goals"
          />
          <input
            id="assists"
            name="assists"
            type="number"
            value={assists}
            onChange={(e) => setAssists(e.target.value)}
            placeholder="Assists"
          />
          <input
            id="teamTrophies"
            name="teamTrophies"
            type="number"
            value={teamTrophies}
            onChange={(e) => setTeamTrophies(e.target.value)}
            placeholder="Team Trophies"
          />
          <input
            id="individualTrophies"
            name="individualTrophies"
            type="number"
            value={individualTrophies}
            onChange={(e) => setIndividualTrophies(e.target.value)}
            placeholder="Individual Trophies"
          />
        </>
      )}
      {sport === 'basketball' && (
        <>
          <input
            id="points"
            name="points"
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="Points"
          />
          <input
            id="rebounds"
            name="rebounds"
            type="number"
            value={rebounds}
            onChange={(e) => setRebounds(e.target.value)}
            placeholder="Rebounds"
          />
          <input
            id="assists"
            name="assists"
            type="number"
            value={assistsBasketball}
            onChange={(e) => setAssistsBasketball(e.target.value)}
            placeholder="Assists"
          />
          <input
            id="efficiency"
            name="efficiency"
            type="number"
            step="0.01"
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
            placeholder="Efficiency"
          />
          <input
            id="turnovers"
            name="turnovers"
            type="number"
            value={turnovers}
            onChange={(e) => setTurnovers(e.target.value)}
            placeholder="Turnovers"
          />
        </>
      )}
      <button type="submit">Add Stats</button>
    </form>
  );
};

export default AddStats;
