import React, { useState } from 'react';
import { Space, Select, Button, Card, Input, message } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';

const API_BASE = 'https://disaster-management-1-ye30.onrender.com';

const ImageVerifyTab = ({ disasters }) => {
  const [selectedId, setSelectedId] = useState();
  const [url, setUrl] = useState('');
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  
  const verify = async () => {
    if (!selectedId || !url) return message.warning('Please provide disaster and image URL');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/disasters/${selectedId}/verify-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: url }),
      });
      const json = await res.json();
      setResult(json);
    } catch (err) {
      message.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="Image Verification System">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select 
            placeholder="Select disaster context" 
            value={selectedId} 
            onChange={setSelectedId} 
            style={{ width: '100%' }}
            size="large"
          >
            {disasters.map((d) => (
              <Select.Option key={d.id} value={d.id}>
                <FileSearchOutlined style={{ marginRight: '8px' }} />
                {d.title}
              </Select.Option>
            ))}
          </Select>
          
          <Input 
            placeholder="Enter image URL to verify..." 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            size="large"
          />
          
          <Button 
            type="primary" 
            onClick={verify}
            size="large"
            loading={loading}
            icon={<FileSearchOutlined />}
            style={{ width: '100%' }}
          >
            Verify Image Authenticity
          </Button>
        </Space>
      </Card>
      
      {result && (
        <Card title="Verification Results">
          <pre style={{ 
            background: '#f6f8fa', 
            padding: '16px', 
            borderRadius: '6px',
            border: '1px solid #e1e4e8',
            fontSize: '13px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}
    </Space>
  );
};

export default ImageVerifyTab; 