import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import Home from "./components/Home";
import Players from "./components/Players";
import Sports from "./components/Sports";
import './App.css'

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Router>
      <Layout className="layout">
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={3} style={{ color: 'white', margin: '0 20px 0 0' }}>
            Sports Website
          </Title>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ flex: 1 }}>
            <Menu.Item key="1">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/sportslist">Sports</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/playerlist">Players</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '50px 50px', textAlign: 'center' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sportslist" element={<Sports />} />
            <Route path="/playerlist" element={<Players />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Sports Website ©2024 Created by Ramkiran V M
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
