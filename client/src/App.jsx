import React, { useEffect, useState } from 'react';
import { Layout, Form, Input, Button, Typography, message, Modal, Space, Empty, Skeleton, Row, Col, Popconfirm, Card, Tag, Tabs, Select, List, InputNumber, Divider } from 'antd';
import io from 'socket.io-client';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const socket = io('http://localhost:4000');

const API_BASE = 'http://localhost:4000';

export default function App() {
  const [form] = Form.useForm();
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchDisasters = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/disasters`);
      const data = await res.json();
      setDisasters(data);
    } catch (err) {
      message.error('Failed to load disasters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisasters();
    socket.on('disaster_updated', fetchDisasters);
    return () => socket.off('disaster_updated', fetchDisasters);
  }, []);

  const handleCreate = () => {
    setSelected(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setSelected(record);
    form.setFieldsValue({
      title: record.title,
      location_name: record.location_name,
      description: record.description,
      tags: record.tags?.join(', '),
    });
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/disasters/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      message.success('Deleted');
      fetchDisasters();
    } catch (err) {
      message.error(err.message);
    }
  };

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
      message.success(selected ? 'Updated successfully' : 'Disaster created');
      handleCancel();
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529' }}>
        <Title level={3} style={{ color: '#fff', margin: 0 }}>Disaster Response Platform</Title>
      </Header>
      <Content style={{ padding: 24 }}>
        <Tabs defaultActiveKey="disasters" type="line" size="large">
          <Tabs.TabPane tab="Disasters" key="disasters">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                New Disaster
              </Button>

              {loading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : disasters.length === 0 ? (
                <Empty description="No disasters yet" />
              ) : (
                <Row gutter={[16, 16]}>
                  {disasters.map((d) => (
                    <Col key={d.id} xs={24} sm={12} md={8} lg={6}>
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ModalCard record={d} onEdit={openEdit} onDelete={handleDelete} />
                        </motion.div>
                      </AnimatePresence>
                    </Col>
                  ))}
                </Row>
              )}
            </Space>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Social Media" key="social">
            <SocialMediaTab disasters={disasters} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Resources" key="resources">
            <ResourcesTab disasters={disasters} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Official Updates" key="updates">
            <UpdatesTab disasters={disasters} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Image Verify" key="verify">
            <ImageVerifyTab disasters={disasters} />
          </Tabs.TabPane>
        </Tabs>

        {/* Create/Edit Modal */}
        <Modal
          title={selected ? 'Update Disaster' : 'Create Disaster'}
          open={modalOpen}
          onCancel={handleCancel}
          footer={null}
          destroyOnClose
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
              label="Title"
              rules={[{ required: true, message: 'Title is required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="location_name"
              label="Location Name"
              rules={[{ required: true, message: 'Location name is required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Description is required' }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="tags"
              label="Tags (comma-separated)"
              rules={[{ required: true, message: 'Tags required' }]}
            >
              <Input />
            </Form.Item>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Space>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

function ModalCard({ record, onEdit, onDelete }) {
  return (
    <Card
      title={record.title}
      extra={
        <Space>
          <EditOutlined style={{ cursor: 'pointer' }} onClick={() => onEdit(record)} />
          <Popconfirm title="Delete this disaster?" onConfirm={() => onDelete(record.id)} okText="Yes" cancelText="No">
            <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      }
      bordered
      hoverable
      style={{ height: '100%', minWidth: 220 }}
    >
      <Paragraph>{record.description}</Paragraph>
      <Space wrap>
        {record.tags?.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </Space>
    </Card>
  );
}

// ---------- Helper Tabs ----------

function SocialMediaTab({ disasters }) {
  const [selectedId, setSelectedId] = React.useState();
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchPosts = async () => {
    if (!selectedId) return message.warning('Choose a disaster');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/disasters/${selectedId}/social-media`);
      const json = await res.json();
      setPosts(json.data || []);
    } catch (err) {
      message.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Select
        placeholder="Select disaster"
        style={{ minWidth: 200 }}
        value={selectedId}
        onChange={setSelectedId}
      >
        {disasters.map((d) => (
          <Select.Option key={d.id} value={d.id}>{d.title}</Select.Option>
        ))}
      </Select>
      <Button onClick={fetchPosts} type="primary">Fetch Social Media</Button>
      {loading ? <Skeleton /> : posts.length === 0 ? <Empty /> : (
        <List
          bordered
          dataSource={posts}
          renderItem={(p) => <List.Item>{p.user}: {p.post}</List.Item>}
        />
      )}
    </Space>
  );
}

function ResourcesTab({ disasters }) {
  const [selectedId, setSelectedId] = React.useState();
  const [lat, setLat] = React.useState();
  const [lon, setLon] = React.useState();
  const [resources, setResources] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchResources = async () => {
    if (!selectedId || lat == null || lon == null) {
      return message.warning('Select disaster and lat/lon');
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/disasters/${selectedId}/resources?lat=${lat}&lon=${lon}`);
      const json = await res.json();
      setResources(json);
    } catch (err) {
      message.error('Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Select placeholder="Select disaster" value={selectedId} onChange={setSelectedId} style={{ minWidth: 200 }}>
        {disasters.map((d) => <Select.Option key={d.id} value={d.id}>{d.title}</Select.Option>)}
      </Select>
      <Space>
        <InputNumber placeholder="Lat" value={lat} onChange={setLat} />
        <InputNumber placeholder="Lon" value={lon} onChange={setLon} />
        <Button onClick={fetchResources} type="primary">Fetch</Button>
      </Space>
      {loading ? <Skeleton /> : resources.length === 0 ? <Empty /> : (
        <List bordered dataSource={resources} renderItem={(r) => (
          <List.Item>{r.name} ({r.type})</List.Item>
        )}/>
      )}
    </Space>
  );
}

function UpdatesTab({ disasters }) {
  const [selectedId, setSelectedId] = React.useState();
  const [updates, setUpdates] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const fetchUpdates = async () => {
    if (!selectedId) return message.warning('Select disaster');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/disasters/${selectedId}/official-updates`);
      const json = await res.json();
      setUpdates(json.data || []);
    } catch (err) {
      message.error('Failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Select placeholder="Select disaster" value={selectedId} onChange={setSelectedId} style={{ minWidth: 200 }}>
        {disasters.map((d) => <Select.Option key={d.id} value={d.id}>{d.title}</Select.Option>)}
      </Select>
      <Button onClick={fetchUpdates} type="primary">Fetch Updates</Button>
      {loading ? <Skeleton /> : updates.length === 0 ? <Empty /> : (
        <List bordered dataSource={updates} renderItem={(u) => (
          <List.Item>{u.title} - <a href={u.link} target="_blank" rel="noreferrer">source</a></List.Item>
        )} />
      )}
    </Space>
  );
}

function ImageVerifyTab({ disasters }) {
  const [selectedId, setSelectedId] = React.useState();
  const [url, setUrl] = React.useState('');
  const [result, setResult] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const verify = async () => {
    if (!selectedId || !url) return message.warning('Provide disaster and image URL');
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
      message.error('Failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Select placeholder="Select disaster" value={selectedId} onChange={setSelectedId} style={{ minWidth: 200 }}>
        {disasters.map((d) => <Select.Option key={d.id} value={d.id}>{d.title}</Select.Option>)}
      </Select>
      <Input placeholder="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <Button type="primary" onClick={verify}>Verify</Button>
      {loading ? <Skeleton /> : result && (
        <pre style={{ background: '#f6f8fa', padding: 16 }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </Space>
  );
} 