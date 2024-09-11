import React from 'react';

const Topper = ({ player, sport }) => {
  return (
    <div>
      <h2>Top Player in {sport.charAt(0).toUpperCase() + sport.slice(1)}</h2>
      {player ? (
        <div>
          <p><strong>Name:</strong> {player.name}</p>
          <p><strong>Country:</strong> {player.country}</p>
          <p><strong>Age:</strong> {player.age}</p>
        </div>
      ) : (
        <p>No top player found.</p>
      )}
    </div>
  );
};

export default Topper;
