import React, { useState, useEffect } from 'react';

function SportsList({ onSportSelect }) {
  const [sports, setSports] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/sports')
      .then((response) => response.json())
      .then((data) => setSports(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h2>Select a Sport</h2>
      <ul>
        {sports.map((sport) => (
          <li key={sport.id} onClick={() => onSportSelect(sport.id)}>
            {sport.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SportsList;
