import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';

const StatsCards = ({ disasters }) => {
  // Statistics for dashboard
  const stats = [
    { title: 'Total Disasters', value: disasters.length, color: '#ff4d4f' },
    { title: 'Active Cases', value: disasters.filter(d => d.status !== 'resolved').length, color: '#faad14' },
    { title: 'Resolved', value: disasters.filter(d => d.status === 'resolved').length, color: '#52c41a' },
  ];

  return (
    <Row gutter={16} style={{ marginBottom: '24px' }}>
      {stats.map((stat, index) => (
        <Col xs={24} sm={8} key={index}>
          <Card size="small">
            <Statistic
              title={stat.title}
              value={stat.value}
              valueStyle={{ color: stat.color, fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards; 