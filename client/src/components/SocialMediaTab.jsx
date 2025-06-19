import React, { useState } from 'react';
import { Space, Select, Button, Card, Skeleton, Empty, List, Typography, message } from 'antd';
import { AlertOutlined, ShareAltOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;
const API_BASE = 'https://disaster-management-1-ye30.onrender.com';

const SocialMediaTab = ({ disasters }) => {
  const [selectedId, setSelectedId] = useState();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    if (!selectedId) return message.warning('Please select a disaster first');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/disasters/${selectedId}/social-media`);
      const json = await res.json();
      setPosts(json.data || []);
    } catch (err) {
      message.error('Failed to fetch social media data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card>
        <Space>
          <Select
            placeholder="Select a disaster to analyze"
            style={{ minWidth: 250 }}
            value={selectedId}
            onChange={setSelectedId}
            size="large"
          >
            {disasters.map((d) => (
              <Select.Option key={d.id} value={d.id}>
                <AlertOutlined style={{ marginRight: '8px' }} />
                {d.title}
              </Select.Option>
            ))}
          </Select>
          <Button 
            onClick={fetchPosts} 
            type="primary" 
            size="large"
            icon={<ShareAltOutlined />}
          >
            Analyze Social Media
          </Button>
        </Space>
      </Card>
      
      {loading ? (
        <Card>
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
      ) : posts.length === 0 ? (
        <Empty description="No social media posts found" />
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
          dataSource={posts}
          renderItem={(post) => (
            <List.Item>
              <Card size="small" hoverable>
                <Text strong>{post.user}</Text>
                <Paragraph style={{ marginTop: '8px' }}>{post.post}</Paragraph>
              </Card>
            </List.Item>
          )}
        />
      )}
    </Space>
  );
};

export default SocialMediaTab; 