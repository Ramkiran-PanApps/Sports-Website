import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Checkbox, Typography } from 'antd';

const { Title } = Typography;

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

  const handleSubmit = async (values) => {
    try {
      await axios.post('http://localhost:5000/players', {
        ...values,
        age: parseInt(values.age), // Convert age to integer
        sport_id: selectedSport,
        active: values.active,
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
    <Form
      name="add_player"
      onFinish={handleSubmit}
      layout="vertical"
      style={{ maxWidth: '500px', margin: 'auto' }}
    >
      <Title level={3}>Add Player</Title>
      <Form.Item
        label="Player Name"
        name="name"
        rules={[{ required: true, message: 'Please enter the player name' }]}
      >
        <Input placeholder="Player Name" />
      </Form.Item>
      <Form.Item
        label="Country"
        name="country"
        rules={[{ required: true, message: 'Please enter the country' }]}
      >
        <Input placeholder="Country" />
      </Form.Item>
      <Form.Item
        label="Age"
        name="age"
        rules={[{ required: true, message: 'Please enter the age' }]}
      >
        <Input type="number" placeholder="Age" />
      </Form.Item>
      <Form.Item name="active" valuePropName="checked">
        <Checkbox>Active</Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Add Player
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AddPlayerForm;
