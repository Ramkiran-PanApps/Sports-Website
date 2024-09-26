const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sports_db',
  password: '123456789',
  port: 5432,
});

// To Show all Sports in DB
app.get('/sports', async (req, res) => {
  try {
    const sports = await pool.query('SELECT * FROM sports');
    res.json(sports.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/playerlist', async (req,res) => {
  try{
    const all = await pool.query('SELECT * FROM players')
    res.json(all.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// To show all players from Table
app.get('/players', async (req, res) => {
  const { sport_id } = req.query;

  try {
    let query = 'SELECT * FROM players ORDER BY id';
    let query_agg;
    let player_aggs = { rows: [] }; // Initialize with an empty array
    const values = [];

    if (sport_id) {
      query = 'SELECT * FROM players WHERE sport_id = $1 ORDER BY id';
      values.push(sport_id);

      if (sport_id == 1) {
        query_agg = `
          SELECT player_id, SUM(runs) AS total
          FROM cricket_stats 
          GROUP BY player_id
        `;
      } else if (sport_id == 2) {
        query_agg = `
          SELECT player_id, SUM(goals) AS total
          FROM football_stats 
          GROUP BY player_id
        `;
      } else if (sport_id == 3) {
        query_agg = `
          SELECT player_id, SUM(matches) AS total
          FROM basketball_stats 
          GROUP BY player_id
        `;
      }

      // Fetch aggregated stats only if a sport_id is provided
      if (query_agg) {
        player_aggs = await pool.query(query_agg);
      }
    }

    // Fetch players
    const players = await pool.query(query, values);

    // Map player data and include the total aggregated stats (if available)
    const playerData = players.rows.map(player => {
      const agg = player_aggs.rows.find(a => a.player_id === player.id);
      return {
        ...player,
        total: agg ? agg.total : 0 
      };
    });

    // If no sport_id is provided, return player list
    if (!sport_id) {
      res.json(players.rows);
    } else {
      res.json(playerData);
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Fetch the Topper of each sport
app.get('/topper/:sport', async (req, res) => {
  const sport = req.params.sport;
  try {
    let query;
  
    if (sport === 'cricket') {
      query = `
        SELECT p.name AS player_name, SUM(cs.runs) AS total_runs
        FROM cricket_stats cs
        JOIN players p ON cs.player_id = p.id
        GROUP BY p.name
        ORDER BY total_runs DESC
        LIMIT 1
      `;
    } else if (sport === 'football') {
      query = `
        SELECT p.name AS player_name, SUM(fs.goals) AS total_goals
        FROM football_stats fs
        JOIN players p ON fs.player_id = p.id
        GROUP BY p.name
        ORDER BY total_goals DESC
        LIMIT 1
      `;
    } else if (sport === 'basketball') {
      query = `
        SELECT p.name AS player_name, SUM(bs.matches) AS total_matches
        FROM basketball_stats bs
        JOIN players p ON bs.player_id = p.id
        GROUP BY p.name
        ORDER BY total_matches DESC
        LIMIT 1
      `;
    } else {
      return res.status(400).json({ error: 'Invalid sport' });
    }

    const result = await pool.query(query);
    const topPlayer = result.rows[0];

    res.json(topPlayer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Adding a new Player
app.post('/players', async (req, res) => {
  const { name, country, age, sport_id, active } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO players (name, country, age, sport_id, active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, country, age, sport_id, active]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// updating a player by player ID

app.put('/players/:player_id', async (req, res) => {
  const { player_id } = req.params;
  const { name, country, age, sport_id, active } = req.body;
  try {
    const result = await pool.query(
      'UPDATE players SET name = $1, country = $2, age = $3, sport_id = $4, active = $5 WHERE id = $6 RETURNING *',
      [name, country, age, sport_id, active, player_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// search a player by playerID
app.get('/players/:player_id', async (req, res) => {
  const { player_id } = req.params;
  try {
    const player = await pool.query('SELECT * FROM players WHERE id = $1', [player_id]);
    res.json(player.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a player by playerID
app.delete('/players/:player_id', async (req, res) => {
  const { player_id } = req.params;
  try {
    await pool.query('DELETE FROM players WHERE id = $1', [player_id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// To show overall cricket stats of a player

app.get('/cricket/stats/:player_id', async (req, res) => {
  const { player_id } = req.params;
  try {
    const overallStats = await pool.query(`
      SELECT 
        player_id,
        SUM(matches) AS total_matches,
        SUM(runs) AS total_runs,
        ROUND(AVG(batting_average),3) AS Batting_average,
        ROUND(AVG(strike_rate),3) AS Strike_rate,
        SUM(centuries) AS Centuries,
        SUM(fifties) AS Fifties,
        ROUND(AVG(bowling_average),3) AS Bowling_average,
        ROUND(AVG(economy),3) AS Economy,
        SUM(five_wickets) AS Five_wickets,
        MAX(best_bowling) AS best_bowling
      FROM cricket_stats
      WHERE player_id = $1
      GROUP BY player_id;
    `, [player_id]);
    
    res.json(overallStats.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// To find the yearly cricket stats of a player
app.get('/cricket/stats/:player_id/year', async (req, res) => {
  const { player_id } = req.params;
  const { year } = req.query;
  try {
    const yearlyStats = await pool.query('SELECT * FROM cricket_stats WHERE player_id = $1 AND year = $2', [player_id, year]);
    res.json(yearlyStats.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// for the overall football stats of a player

app.get('/football/stats/:player_id', async (req, res) => {
  const { player_id } = req.params;
  try {
    const overallStats = await pool.query(`
      SELECT 
        player_id,
        SUM(matches) AS Matches,
        SUM(goals) AS Goals,
        SUM(assists) AS Assists,
        SUM(team_trophies) AS Team_trophies,
        SUM(individual_trophies) AS Individual_trophies
      FROM football_stats
      WHERE player_id = $1
      GROUP BY player_id;
    `, [player_id]);

    res.json(overallStats.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// to get the yearly football stats
app.get('/football/stats/:player_id/year', async (req, res) => {
  const { player_id } = req.params;
  const { year } = req.query;
  try {
    const yearlyStats = await pool.query('SELECT * FROM football_stats WHERE player_id = $1 AND year = $2', [player_id, year]);
    res.json(yearlyStats.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// overall basketball stats
app.get('/basketball/stats/:player_id', async (req, res) => {
  const { player_id } = req.params;
  try {
    const overallStats = await pool.query(`
      SELECT 
        player_id,
        SUM(matches) AS total_matches,
        ROUND(AVG(points),3) AS Points,
        ROUND(AVG(rebounds),3) AS Rebounds,
        ROUND(AVG(assists),3) AS Assists,
        ROUND(AVG(efficiency),3) AS Efficiency,
        ROUND(AVG(turnovers),3) AS Turnovers
      FROM basketball_stats
      WHERE player_id = $1
      GROUP BY player_id;
    `, [player_id]);

    res.json(overallStats.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// yearly basketball stats
app.get('/basketball/stats/:player_id/year', async (req, res) => {
  const { player_id } = req.params;
  const { year } = req.query;
  try {
    const yearlyStats = await pool.query('SELECT * FROM basketball_stats WHERE player_id = $1 AND year = $2', [player_id, year]);
    res.json(yearlyStats.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// add new cricket stats
app.post('/cricket/stats', async (req, res) => {
  const { player_id, year, matches, runs, batting_average, strike_rate, centuries, fifties, bowling_average, economy, five_wickets, best_bowling } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO cricket_stats (player_id, year, matches, runs, batting_average, strike_rate, centuries, fifties, bowling_average, economy, five_wickets, best_bowling)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 ) RETURNING *`,
      [player_id, year, matches, runs, batting_average, strike_rate, centuries, fifties, bowling_average, economy, five_wickets, best_bowling]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update current cricket stats by player_id and year
app.put('/cricket/stats/:player_id/:year', async (req, res) => {
  const { player_id, year } = req.params;
  const { matches, runs, batting_average, strike_rate, centuries, fifties, bowling_average, economy, five_wickets, best_bowling } = req.body;
  try {
    const result = await pool.query(
      `UPDATE cricket_stats
       SET matches = $1, runs = $2, batting_average = $3, strike_rate = $4, centuries = $5, fifties = $6, bowling_average = $7, economy = $8, five_wickets = $9, best_bowling = $10
       WHERE player_id = $11 AND year = $12 RETURNING *`,
      [matches, runs, batting_average, strike_rate, centuries, fifties, bowling_average, economy, five_wickets, best_bowling, player_id, year]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete cricket stats by player_id and year
app.delete('/cricket/stats/:player_id/:year', async (req, res) => {
  const { player_id, year } = req.params;
  try {
    await pool.query('DELETE FROM cricket_stats WHERE player_id = $1 AND year = $2', [player_id, year]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// add new football stats
app.post('/football/stats', async (req, res) => {
  const { player_id, year, matches, goals, assists, team_trophies, individual_trophies } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO football_stats (player_id, year, matches, goals, assists, team_trophies, individual_trophies)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [player_id, year, matches, goals, assists, team_trophies, individual_trophies]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update football stats by player_id and year
app.put('/football/stats/:player_id/:year', async (req, res) => {
  const { player_id, year } = req.params;
  const { matches, goals, assists, team_trophies, individual_trophies } = req.body;
  try {
    const result = await pool.query(
      `UPDATE football_stats
       SET matches = $1, goals = $2, assists = $3, team_trophies = $4, individual_trophies = $5
       WHERE player_id = $6 AND year = $7 RETURNING *`,
      [matches, goals, assists, team_trophies, individual_trophies, player_id, year]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE football stats by player_id and year
app.delete('/football/stats/:player_id/:year', async (req, res) => {
  const { player_id, year } = req.params;
  try {
    await pool.query('DELETE FROM football_stats WHERE player_id = $1 AND year = $2', [player_id, year]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// add new basketball stats
app.post('/basketball/stats', async (req, res) => {
  const { player_id, year, matches, points, rebounds, assists, efficiency, turnovers } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO basketball_stats (player_id, year, matches, points, rebounds, assists, efficiency, turnovers)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [player_id, year, matches, points, rebounds, assists, efficiency, turnovers]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update existing basketball stats by player_id and year
app.put('/basketball/stats/:player_id/:year', async (req, res) => {
  const { player_id, year } = req.params;
  const { matches, points, rebounds, assists, efficiency, turnovers } = req.body;
  try {
    const result = await pool.query(
      `UPDATE basketball_stats
       SET matches = $1, points = $2, rebounds = $3, assists = $4, efficiency = $5, turnovers = $6
       WHERE player_id = $7 AND year = $8 RETURNING *`,
      [matches, points, rebounds, assists, efficiency, turnovers, player_id, year]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE basketball stats by player_id and year
app.delete('/basketball/stats/:player_id/:year', async (req, res) => {
  const { player_id, year } = req.params;
  try {
    await pool.query('DELETE FROM basketball_stats WHERE player_id = $1 AND year = $2', [player_id, year]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//To Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
