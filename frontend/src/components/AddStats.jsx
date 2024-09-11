import React from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, notification } from 'antd';

const { Title } = Typography;

const AddStats = ({ player, sport }) => {
  const [form] = Form.useForm();

  const checkIfStatsExist = async (player_id, year) => {
    try {
      let response;
      if (sport === 'cricket') {
        response = await axios.get(`http://localhost:5000/cricket/stats/${player_id}/year`, {
          params: { year }
        });
      } else if (sport === 'football') {
        response = await axios.get(`http://localhost:5000/football/stats/${player_id}/year`, {
          params: { year }
        });
      } else if (sport === 'basketball') {
        response = await axios.get(`http://localhost:5000/basketball/stats/${player_id}/year`, {
          params: { year }
        });
      }

      return response.data.length > 0;
    } catch (error) {
      console.error('Error checking stats existence:', error);
      return false;
    }
  };

  const handleSubmit = async (values) => {
    const { year } = values;
    const statsExist = await checkIfStatsExist(player.id, year);

    if (statsExist) {
      notification.error({
        message: 'Error',
        description: `Stats for the year ${year} already exist for this player.`,
      });
      return;
    }

    const statsData = {
      player_id: player.id,
      ...values,
      ...(sport === 'cricket' && {
        runs: values.runs,
        batting_average: values.battingAverage,
        strike_rate: values.strikeRate,
        centuries: values.centuries,
        fifties: values.fifties,
        bowling_average: values.bowlingAverage,
        economy: values.economy,
        five_wickets: values.fiveWickets,
        best_bowling: values.bestBowling,
      }),
      ...(sport === 'football' && {
        goals: values.goals,
        assists: values.assists,
        team_trophies: values.teamTrophies,
        individual_trophies: values.individualTrophies,
      }),
      ...(sport === 'basketball' && {
        points: values.points,
        rebounds: values.rebounds,
        assists: values.assistsBasketball,
        efficiency: values.efficiency,
        turnovers: values.turnovers,
      }),
    };

    try {
      await axios.post(`http://localhost:5000/${sport}/stats`, statsData);
      notification.success({
        message: 'Success',
        description: `Stats for the year ${values.year} added successfully`,
      });
      form.resetFields(); // Clear form fields after successful submission
    } catch (error) {
      console.error('Error adding stats:', error);
      notification.error({
        message: 'Error',
        description: 'There was an error adding the stats.',
      });
    }
  };

  return (
    <Form
      form={form}
      name="add_stats"
      onFinish={handleSubmit}
      layout="vertical"
      style={{ maxWidth: '500px', margin: 'auto' }}
    >
      <Title level={2}>Add Stats</Title>
      <Form.Item
        label="Year"
        name="year"
        rules={[{ required: true, message: 'Please enter the year' }]}
      >
        <Input placeholder="Year" />
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
          Add Stats
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddStats;
