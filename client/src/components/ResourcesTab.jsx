import React, { useState } from 'react';
import { Space, Select, Card, Skeleton, Empty, List, Typography, message, Row, Col, Button, InputNumber, Tag } from 'antd';
import { SafetyOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const API_BASE = 'https://disaster-management-1-ye30.onrender.com';

const ResourcesTab = ({ disasters }) => {
  const [selectedId, setSelectedId] = useState();
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResources = async () => {
    if (!selectedId || lat == null || lon == null) {
      return message.warning('Please select disaster and provide coordinates');
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/disasters/${selectedId}/resources?lat=${lat}&lon=${lon}`);
      const json = await res.json();
      setResources(json);
    } catch (err) {
      message.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="Resource Locator">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select 
            placeholder="Select disaster" 
            value={selectedId} 
            onChange={setSelectedId} 
            style={{ width: '100%' }}
            size="large"
          >
            {disasters.map((d) => (
              <Select.Option key={d.id} value={d.id}>
                <SafetyOutlined style={{ marginRight: '8px' }} />
                {d.title}
              </Select.Option>
            ))}
          </Select>
          
          <Row gutter={16}>
            <Col span={8}>
              <InputNumber 
                placeholder="Latitude" 
                value={lat} 
                onChange={setLat} 
                style={{ width: '100%' }}
                size="large"
              />
            </Col>
            <Col span={8}>
              <InputNumber 
                placeholder="Longitude" 
                value={lon} 
                onChange={setLon} 
                style={{ width: '100%' }}
                size="large"
              />
            </Col>
            <Col span={8}>
              <Button 
                onClick={fetchResources} 
                type="primary" 
                style={{ width: '100%' }}
                size="large"
                icon={<SearchOutlined />}
              >
                Find Resources
              </Button>
            </Col>
          </Row>
        </Space>
      </Card>
      
      {loading ? (
        <Card>
          <Skeleton active />
        </Card>
      ) : resources.length === 0 ? (
        <Empty description="No resources found in this area" />
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
          dataSource={resources}
          renderItem={(resource) => (
            <List.Item>
              <Card size="small" hoverable>
                <Title level={5}>{resource.name}</Title>
                <Tag color="blue">{resource.type}</Tag>
              </Card>
            </List.Item>
          )}
        />
      )}
    </Space>
  );
};

export default ResourcesTab; 