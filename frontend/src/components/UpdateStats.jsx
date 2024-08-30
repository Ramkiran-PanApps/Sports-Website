import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateStats = ({ player, sport }) => {
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
  const [assistsBasketball, setAssistsBasketball] = useState(''); // Avoid conflict with football's assists
  const [efficiency, setEfficiency] = useState('');
  const [turnovers, setTurnovers] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/${sport}/stats/${player.id}/year?year=${year}`);
        const stats = response.data[0];

        if (sport === 'cricket') {
          setMatches(stats.matches || '');
          setRuns(stats.runs || '');
          setBattingAverage(stats.batting_average || '');
          setStrikeRate(stats.strike_rate || '');
          setCenturies(stats.centuries || '');
          setFifties(stats.fifties || '');
          setBowlingAverage(stats.bowling_average || '');
          setEconomy(stats.economy || '');
          setFiveWickets(stats.five_wickets || '');
          setBestBowling(stats.best_bowling || '');
        } else if (sport === 'football') {
          setMatches(stats.matches || '');
          setGoals(stats.goals || '');
          setAssists(stats.assists || '');
          setTeamTrophies(stats.team_trophies || '');
          setIndividualTrophies(stats.individual_trophies || '');
        } else if (sport === 'basketball') {
          setMatches(stats.matches || '');
          setPoints(stats.points || '');
          setRebounds(stats.rebounds || '');
          setAssistsBasketball(stats.assists || '');
          setEfficiency(stats.efficiency || '');
          setTurnovers(stats.turnovers || '');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (year) {
      fetchStats();
    }
  }, [year, sport, player.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const statsData = {
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
        assists: assistsBasketball,
        efficiency,
        turnovers,
      }),
    };

    try {
      await axios.put(`http://localhost:5000/${sport}/stats/${player.id}/${year}`, statsData);
      console.log('Stats updated successfully');
      alert(`Stats for the year ${year} updated successfully`);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update {sport.charAt(0).toUpperCase() + sport.slice(1)} Stats for {player.name}</h2>
      <div>
        <label>Year</label>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Matches</label>
        <input
          type="number"
          value={matches}
          onChange={(e) => setMatches(e.target.value)}
          required
        />
      </div>
      {sport === 'cricket' && (
        <>
          <div>
            <label>Runs</label>
            <input
              type="number"
              value={runs}
              onChange={(e) => setRuns(e.target.value)}
            />
          </div>
          <div>
            <label>Batting Average</label>
            <input
              type="number"
              value={battingAverage}
              onChange={(e) => setBattingAverage(e.target.value)}
              step="0.01"
            />
          </div>
          <div>
            <label>Strike Rate</label>
            <input
              type="number"
              value={strikeRate}
              onChange={(e) => setStrikeRate(e.target.value)}
              step="0.01"
            />
          </div>
          <div>
            <label>Centuries</label>
            <input
              type="number"
              value={centuries}
              onChange={(e) => setCenturies(e.target.value)}
            />
          </div>
          <div>
            <label>Fifties</label>
            <input
              type="number"
              value={fifties}
              onChange={(e) => setFifties(e.target.value)}
            />
          </div>
          <div>
            <label>Bowling Average</label>
            <input
              type="number"
              value={bowlingAverage}
              onChange={(e) => setBowlingAverage(e.target.value)}
              step="0.01"
            />
          </div>
          <div>
            <label>Economy</label>
            <input
              type="number"
              value={economy}
              onChange={(e) => setEconomy(e.target.value)}
              step="0.01"
            />
          </div>
          <div>
            <label>Five Wickets</label>
            <input
              type="number"
              value={fiveWickets}
              onChange={(e) => setFiveWickets(e.target.value)}
            />
          </div>
          <div>
            <label>Best Bowling</label>
            <input
              type="text"
              value={bestBowling}
              onChange={(e) => setBestBowling(e.target.value)}
            />
          </div>
        </>
      )}
      {sport === 'football' && (
        <>
          <div>
            <label>Goals</label>
            <input
              type="number"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
            />
          </div>
          <div>
            <label>Assists</label>
            <input
              type="number"
              value={assists}
              onChange={(e) => setAssists(e.target.value)}
            />
          </div>
          <div>
            <label>Team Trophies</label>
            <input
              type="number"
              value={teamTrophies}
              onChange={(e) => setTeamTrophies(e.target.value)}
            />
          </div>
          <div>
            <label>Individual Trophies</label>
            <input
              type="number"
              value={individualTrophies}
              onChange={(e) => setIndividualTrophies(e.target.value)}
            />
          </div>
        </>
      )}
      {sport === 'basketball' && (
        <>
          <div>
            <label>Points</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
          </div>
          <div>
            <label>Rebounds</label>
            <input
              type="number"
              value={rebounds}
              onChange={(e) => setRebounds(e.target.value)}
            />
          </div>
          <div>
            <label>Assists</label>
            <input
              type="number"
              value={assistsBasketball}
              onChange={(e) => setAssistsBasketball(e.target.value)}
            />
          </div>
          <div>
            <label>Efficiency</label>
            <input
              type="number"
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
              step="0.01"
            />
          </div>
          <div>
            <label>Turnovers</label>
            <input
              type="number"
              value={turnovers}
              onChange={(e) => setTurnovers(e.target.value)}
            />
          </div>
        </>
      )}
      <button type="submit">Update Stats</button>
    </form>
  );
};

export default UpdateStats;
