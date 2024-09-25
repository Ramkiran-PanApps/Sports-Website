import React, { useState,useEffect } from 'react';
import axios from 'axios';

function Players() {

  const[players,setPlayers] = useState([]);

  useEffect(() => {
    const fetchAllPlayers = async () => {
      try {
        const result = await axios.get('http://localhost:5000/playertable');
        setPlayers(result.data);
      } catch (error) {
        console.error('Error fetching All Players:', error);
      }
    };
    fetchAllPlayers();
  }, []);

  return (
    <div>
      <h1>Players Page</h1>
      
    </div>
  );
}

export default Players;
