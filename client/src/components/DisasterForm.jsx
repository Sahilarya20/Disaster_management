import React from 'react';
import { Modal, Form, Input, Button, Space, message } from 'antd';
import { AlertOutlined } from '@ant-design/icons';

const API_BASE = 'https://disaster-management-1-ye30.onrender.com';

const DisasterForm = ({ 
  open, 
  onCancel, 
  form, 
  selected, 
  onSuccess 
}) => {
  const onFinish = async (values) => {
    try {
      const endpoint = selected ? `${API_BASE}/disasters/${selected.id}` : `${API_BASE}/disasters`;
      const method = selected ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'netrunnerX',
        },
        body: JSON.stringify({
          ...values,
          tags: values.tags.split(',').map((t) => t.trim()),
        }),
      });
      if (!res.ok) throw new Error(selected ? 'Failed to update' : 'Failed to create');
      message.success(selected ? 'Updated successfully' : 'Disaster created successfully');
      onSuccess();
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertOutlined />
          {selected ? 'Update Disaster Report' : 'Report New Disaster'}
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={(err) => {
          console.log('Fields with errors:', err.errorFields.map(f => f.name));
          message.error('Please fill all required fields');
        }}
      >
        <Form.Item
          name="title"
          label="Disaster Title"
          rules={[{ required: true, message: 'Title is required' }]}
        >
          <Input size="large" placeholder="e.g., Earthquake in Downtown Area" />
        </Form.Item>
        <Form.Item
          name="location_name"
          label="Location"
          rules={[{ required: true, message: 'Location name is required' }]}
        >
          <Input size="large" placeholder="e.g., Downtown, City Center" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Detailed Description"
          rules={[{ required: true, message: 'Description is required' }]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Provide detailed information about the disaster..."
          />
        </Form.Item>
        <Form.Item
          name="tags"
          label="Tags"
          rules={[{ required: true, message: 'Tags required' }]}
          help="Separate tags with commas (e.g., earthquake, emergency, rescue-needed)"
        >
          <Input placeholder="earthquake, emergency, rescue-needed" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel} size="large">
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              style={{ 
                background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                border: 'none'
              }}
            >
              {selected ? 'Update Report' : 'Submit Report'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DisasterForm; 