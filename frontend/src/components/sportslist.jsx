import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import 'antd'; //

const { Option } = Select;

function SportsList({ onSportSelect }) {
  const [sports, setSports] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/sports')
      .then((response) => response.json())
      .then((data) => setSports(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleSportChange = (value) => {
    onSportSelect(value);
  };

  return (
    <div className="side-menu">
      <Select
        placeholder="Select a Sport"
        style={{ width: 200 }}
        onChange={handleSportChange}
      >
        {sports.map((sport) => (
          <Option key={sport.id} value={sport.id}>
            {sport.name}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default SportsList;
