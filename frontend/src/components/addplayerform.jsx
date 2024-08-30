import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddPlayerForm({ selectedSport }) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState('');
  const [active, setActive] = useState(true);
  const [sports, setSports] = useState([]);

  // Fetch the list of sports when the component mounts
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/sports');
        setSports(response.data);
      } catch (error) {
        console.error('Error fetching sports:', error);
      }
    };

    fetchSports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/players', {
        name,
        country,
        age: parseInt(age),  // Convert age to integer
        sport_id: selectedSport,
        active,
      });
      alert('Player added successfully');
      setName('');
      setCountry('');
      setAge('');
      setActive(true);
    } catch (err) {
      console.error(err);
      alert('Error adding player');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Player</h3>
      <div>
        <label>
          Player Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Player Name"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Country:
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Age:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Active:
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
        </label>
      </div>
      <button type="submit">Add Player</button>
    </form>
  );
}

export default AddPlayerForm;
