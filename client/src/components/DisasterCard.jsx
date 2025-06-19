import React from 'react';
import { Card, Typography, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const DisasterCard = ({ record, onEdit, onDelete }) => {
  const getSeverityColor = (tags) => {
    if (tags?.includes('critical') || tags?.includes('emergency')) return '#ff4d4f';
    if (tags?.includes('urgent') || tags?.includes('rescue-needed')) return '#faad14';
    return '#52c41a';
  };

  return (
    <Card
      hoverable
      style={{ 
        height: '100%', 
        minWidth: 220,
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: `2px solid ${getSeverityColor(record.tags)}`
      }}
      bodyStyle={{ padding: '16px' }}
      actions={[
        <EditOutlined 
          key="edit" 
          onClick={() => onEdit(record)}
          style={{ color: '#1890ff' }}
        />,
        <Popconfirm 
          title="Delete this disaster report?" 
          description="This action cannot be undone."
          onConfirm={() => onDelete(record.id)} 
          okText="Yes, Delete" 
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <DeleteOutlined style={{ color: '#ff4d4f' }} />
        </Popconfirm>
      ]}
    >
      <div style={{ marginBottom: '12px' }}>
        <Title level={5} style={{ margin: 0, marginBottom: '8px' }}>
          {record.title}
        </Title>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          📍 {record.location_name}
        </Text>
      </div>
      
      <Paragraph 
        ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}
        style={{ marginBottom: '12px', minHeight: '60px' }}
      >
        {record.description}
      </Paragraph>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {record.tags?.slice(0, 3).map((tag) => (
          <Tag 
            key={tag} 
            color={tag === 'emergency' || tag === 'critical' ? 'red' : 
                   tag === 'urgent' || tag === 'rescue-needed' ? 'orange' : 'blue'}
            size="small"
          >
            {tag}
          </Tag>
        ))}
        {record.tags?.length > 3 && (
          <Tag size="small">+{record.tags.length - 3} more</Tag>
        )}
      </div>
    </Card>
  );
};

export default DisasterCard; 