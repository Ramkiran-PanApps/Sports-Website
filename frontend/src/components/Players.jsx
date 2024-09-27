import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Select, Switch, Typography } from 'antd';

function Players() {
  const [players, setPlayers] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null); // To track which player is being edited
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm(); // Ant Design Form

  const { Title } = Typography;

  const sportMap = {
    1: 'Cricket',
    2: 'Football',
    3: 'Basketball',
  };

  useEffect(() => {
    const fetchAllPlayers = async () => {
      try {
        // Fetching players from the new /players API
        const result = await axios.get('http://localhost:5000/players');
        setPlayers(result.data);
      } catch (error) {
        console.error('Error fetching All Players:', error);
      }
    };
    fetchAllPlayers();
  }, []);

  // Show the modal to edit a player
  const showEditModal = (player) => {
    setEditingPlayer(player);
    form.setFieldsValue({ ...player, active: player.active ? true : false }); // Prefill the form with player data
    setIsModalVisible(true);
  };

  // Handle the form submission to update the player
  const handleUpdatePlayer = async (values) => {
    try {
      const { name, country, age, sport_id, active } = values;
      await axios.put(`http://localhost:5000/players/${editingPlayer.id}`, {
        name,
        country,
        age: parseInt(age),
        sport_id: parseInt(sport_id),
        active,
      });

      // Update player list
      const updatedPlayers = players.map((player) =>
        player.id === editingPlayer.id ? { ...player, ...values } : player
      );
      setPlayers(updatedPlayers);

      // Hide modal and reset form
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error updating player:', error);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Sport',
      dataIndex: 'sport_id',
      key: 'sport_id',
      render: (sport_id) => sportMap[sport_id] || 'Unknown',
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (text) => (text ? 'Yes' : 'No'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, player) => (
        <Button type="primary" onClick={() => showEditModal(player)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="Players">
      <Title level={2} style={{ fontSize: '36px', color: '#1890ff', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
        Player Database
      </Title>

      {players.length > 0 ? (
        <Table dataSource={players} columns={columns} rowKey="id" />
      ) : (
        <p>No players found.</p>
      )}

      {/* Edit Player Modal */}
      <Modal
        title="Edit Player"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdatePlayer}
          initialValues={{ active: false }} // Set default for 'active'
        >
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the player name!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Country" name="country" rules={[{ required: true, message: 'Please input the country!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Age" name="age" rules={[{ required: true, message: 'Please input the age!' }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Sport"
            name="sport_id"
            rules={[{ required: true, message: 'Please select a sport!' }]}
          >
            <Select>
              <Select.Option value={1}>Cricket</Select.Option>
              <Select.Option value={2}>Football</Select.Option>
              <Select.Option value={3}>Basketball</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Active" name="active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Players;
