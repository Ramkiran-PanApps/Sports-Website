import React from 'react';
import { Typography, Space, Row, Col, Card } from 'antd';

const { Title, Paragraph, Text } = Typography;

const quotes = [
  {
    name: 'Lionel Messi',
    quote: "You have to fight to reach your dream. You have to sacrifice and work hard for it."
  },
  {
    name: 'LeBron James',
    quote: "I like criticism. It makes you strong."
  },
  {
    name: 'Sachin Tendulkar',
    quote: "People throw stones at you and you convert them into milestones."
  },
  {
    name: 'Virat Kohli',
    quote: "Self-belief and hard work will always earn you success."
  },
  {
    name: 'Michael Jordan',
    quote: "I've missed more than 9000 shots in my career. I've lost almost 300 games. 26 times, I've been trusted to take the game-winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed."
  },
  {
    name: 'Cristiano Ronaldo',
    quote: "Your love makes me strong, your hate makes me unstoppable."
  },
  {
    name: 'Stephen Curry',
    quote: "Success is not an accident, success is actually a choice."
  }
];

function Home() {
  return (
    <div style={{ padding: '50px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
        <Title 
          level={1} 
          style={{ 
            fontSize: '48px', 
            color: '#1890ff', 
            fontFamily: 'Arial, sans-serif',
            
          }}
        >
          Sports Addicts - The Home of Sports
        </Title>
        <Paragraph style={{ fontSize: '18px', maxWidth: '800px', margin: '0 auto' }}>
          Explore the world of sports through the eyes of legends. Here, we celebrate not just the statistics, but the stories, dedication, and passion that define greatness.
        </Paragraph>
        <Title level={3} style={{ marginBottom: '40px' }}>
          Select Sports or Players from the top menu for more
        </Title>

        <Row gutter={[16, 16]} justify="center">
          {quotes.map((item, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card 
                hoverable 
                bordered={false} 
                style={{ backgroundColor: '#ffffff', borderRadius: '10px' }}
              >
                <Title level={4}>{item.name}</Title>
                <Text italic>{`"${item.quote}"`}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </div>
  );
}

export default Home;
