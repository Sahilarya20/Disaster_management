import React, { useState } from 'react';
import { Space, Select, Button, Card, Skeleton, Empty, List, Typography, message } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

const { Title } = Typography;
const API_BASE = 'https://disaster-management-1-ye30.onrender.com';

const UpdatesTab = ({ disasters }) => {
  const [selectedId, setSelectedId] = useState();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchUpdates = async () => {
    if (!selectedId) return message.warning('Please select a disaster');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/disasters/${selectedId}/official-updates`);
      const json = await res.json();
      setUpdates(json.data || []);
    } catch (err) {
      message.error('Failed to fetch updates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="Official Updates">
        <Space>
          <Select 
            placeholder="Select disaster for updates" 
            value={selectedId} 
            onChange={setSelectedId} 
            style={{ minWidth: 250 }}
            size="large"
          >
            {disasters.map((d) => (
              <Select.Option key={d.id} value={d.id}>
                <GlobalOutlined style={{ marginRight: '8px' }} />
                {d.title}
              </Select.Option>
            ))}
          </Select>
          <Button 
            onClick={fetchUpdates} 
            type="primary" 
            size="large"
            icon={<GlobalOutlined />}
          >
            Get Updates
          </Button>
        </Space>
      </Card>
      
      {loading ? (
        <Card>
          <Skeleton active />
        </Card>
      ) : updates.length === 0 ? (
        <Empty description="No official updates available" />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={updates}
          renderItem={(update) => (
            <List.Item>
              <Card hoverable>
                <List.Item.Meta
                  title={<Title level={4}>{update.title}</Title>}
                  description={
                    <Button 
                      type="link" 
                      href={update.link} 
                      target="_blank" 
                      rel="noreferrer"
                      icon={<GlobalOutlined />}
                    >
                      View Official Source
                    </Button>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </Space>
  );
};

export default UpdatesTab; 