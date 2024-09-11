import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;

const UpdateStats = ({ player, sport }) => {
  const [form] = Form.useForm();
  const [year, setYear] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/${sport}/stats/${player.id}/year?year=${year}`);
        const stats = response.data[0];
        form.setFieldsValue(stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (year) {
      fetchStats();
    }
  }, [year, sport, player.id, form]);

  const handleSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:5000/${sport}/stats/${player.id}/${year}`, values);
      alert(`Stats for ${year} updated successfully`);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  return (
    <Form
      form={form}
      name="update_stats"
      onFinish={handleSubmit}
      layout="vertical"
      style={{ maxWidth: '500px', margin: 'auto' }}
    >
      <Title level={2}>Update Stats</Title>
      <Form.Item
        label="Year"
        name="year"
        rules={[{ required: true, message: 'Please enter the year' }]}
      >
        <Input type="number" placeholder="Year" onChange={(e) => setYear(e.target.value)} />
      </Form.Item>
      <Form.Item
        label="Matches"
        name="matches"
        rules={[{ required: true, message: 'Please enter the number of matches' }]}
      >
        <Input type="number" placeholder="Matches" />
      </Form.Item>
      {sport === 'cricket' && (
        <>
          <Form.Item label="Runs" name="runs">
            <Input type="number" placeholder="Runs" />
          </Form.Item>
          <Form.Item label="Batting Average" name="battingAverage">
            <Input type="number" step="0.01" placeholder="Batting Average" />
          </Form.Item>
          <Form.Item label="Strike Rate" name="strikeRate">
            <Input type="number" step="0.01" placeholder="Strike Rate" />
          </Form.Item>
          <Form.Item label="Centuries" name="centuries">
            <Input type="number" placeholder="Centuries" />
          </Form.Item>
          <Form.Item label="Fifties" name="fifties">
            <Input type="number" placeholder="Fifties" />
          </Form.Item>
          <Form.Item label="Bowling Average" name="bowlingAverage">
            <Input type="number" step="0.01" placeholder="Bowling Average" />
          </Form.Item>
          <Form.Item label="Economy" name="economy">
            <Input type="number" step="0.01" placeholder="Economy" />
          </Form.Item>
          <Form.Item label="Five Wickets" name="fiveWickets">
            <Input type="number" placeholder="Five Wickets" />
          </Form.Item>
          <Form.Item label="Best Bowling" name="bestBowling">
            <Input placeholder="Best Bowling" />
          </Form.Item>
        </>
      )}
      {sport === 'football' && (
        <>
          <Form.Item label="Goals" name="goals">
            <Input type="number" placeholder="Goals" />
          </Form.Item>
          <Form.Item label="Assists" name="assists">
            <Input type="number" placeholder="Assists" />
          </Form.Item>
          <Form.Item label="Team Trophies" name="teamTrophies">
            <Input type="number" placeholder="Team Trophies" />
          </Form.Item>
          <Form.Item label="Individual Trophies" name="individualTrophies">
            <Input type="number" placeholder="Individual Trophies" />
          </Form.Item>
        </>
      )}
      {sport === 'basketball' && (
        <>
          <Form.Item label="Points" name="points">
            <Input type="number" placeholder="Points" />
          </Form.Item>
          <Form.Item label="Rebounds" name="rebounds">
            <Input type="number" placeholder="Rebounds" />
          </Form.Item>
          <Form.Item label="Assists" name="assistsBasketball">
            <Input type="number" placeholder="Assists" />
          </Form.Item>
          <Form.Item label="Efficiency" name="efficiency">
            <Input type="number" step="0.01" placeholder="Efficiency" />
          </Form.Item>
          <Form.Item label="Turnovers" name="turnovers">
            <Input type="number" placeholder="Turnovers" />
          </Form.Item>
        </>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Update Stats
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateStats;
