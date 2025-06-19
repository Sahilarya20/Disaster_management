import React, { useEffect, useState } from 'react';
import { 
  Layout, 
  Form, 
  Button, 
  Typography, 
  message, 
  Space, 
  Empty, 
  Skeleton, 
  Row, 
  Col, 
  Tabs, 
  Breadcrumb,
  Alert,
  Card
} from 'antd';
import io from 'socket.io-client';
import { 
  PlusOutlined, 
  AlertOutlined,
  ShareAltOutlined,
  SafetyOutlined,
  GlobalOutlined,
  FileSearchOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

// Import components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DisasterCard from './components/DisasterCard';
import DisasterForm from './components/DisasterForm';
import StatsCards from './components/StatsCards';
import SocialMediaTab from './components/SocialMediaTab';
import ResourcesTab from './components/ResourcesTab';
import UpdatesTab from './components/UpdatesTab';
import ImageVerifyTab from './components/ImageVerifyTab';

const { Content } = Layout;
const { Title } = Typography;

const API_BASE = 'https://disaster-management-1-ye30.onrender.com';

const socket = io(API_BASE);

export default function App() {
  const [form] = Form.useForm();
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('disasters');

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
      message.success('Deleted successfully');
      fetchDisasters();
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleFormSuccess = () => {
    handleCancel();
    fetchDisasters();
  };

  // Sidebar menu items for breadcrumb
  const sidebarItems = [
    { key: 'disasters', label: 'Disasters' },
    { key: 'social', label: 'Social Media' },
    { key: 'resources', label: 'Resources' },
    { key: 'updates', label: 'Official Updates' },
    { key: 'verify', label: 'Image Verify' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />

      <Layout>
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        <Layout style={{ padding: '0 24px 24px' }}>
          {/* Breadcrumb */}
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>{sidebarItems.find(item => item.key === activeTab)?.label}</Breadcrumb.Item>
          </Breadcrumb>

          <Content style={{ 
            background: '#fff', 
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Statistics Dashboard */}
            {activeTab === 'disasters' && <StatsCards disasters={disasters} />}

            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              type="card" 
              size="large"
              style={{ marginTop: activeTab === 'disasters' ? 0 : '24px' }}
            >
              <Tabs.TabPane 
                tab={<span><AlertOutlined />Disasters</span>} 
                key="disasters"
              >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0 }}>Disaster Management</Title>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={handleCreate}
                      size="large"
                      style={{ 
                        background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                        border: 'none',
                        borderRadius: '6px'
                      }}
                    >
                      Report New Disaster
                    </Button>
                  </div>

                  {disasters.length > 0 && (
                    <Alert
                      message={`${disasters.length} disaster(s) currently being monitored`}
                      type="info"
                      showIcon
                      style={{ marginBottom: '16px' }}
                    />
                  )}

                  {loading ? (
                    <Row gutter={[16, 16]}>
                      {[...Array(6)].map((_, i) => (
                        <Col key={i} xs={24} sm={12} md={8} lg={6}>
                          <Skeleton active />
                        </Col>
                      ))}
                    </Row>
                  ) : disasters.length === 0 ? (
                    <Empty 
                      description="No disasters reported yet"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                      <Button type="primary" onClick={handleCreate}>
                        Report First Disaster
                      </Button>
                    </Empty>
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
                              <DisasterCard record={d} onEdit={openEdit} onDelete={handleDelete} />
                            </motion.div>
                          </AnimatePresence>
                        </Col>
                      ))}
                    </Row>
                  )}
                </Space>
              </Tabs.TabPane>

              <Tabs.TabPane 
                tab={<span><ShareAltOutlined />Social Media</span>} 
                key="social"
              >
                <SocialMediaTab disasters={disasters} />
              </Tabs.TabPane>

              <Tabs.TabPane 
                tab={<span><SafetyOutlined />Resources</span>} 
                key="resources"
              >
                <ResourcesTab disasters={disasters} />
              </Tabs.TabPane>

              <Tabs.TabPane 
                tab={<span><GlobalOutlined />Official Updates</span>} 
                key="updates"
              >
                <UpdatesTab disasters={disasters} />
              </Tabs.TabPane>

              <Tabs.TabPane 
                tab={<span><FileSearchOutlined />Image Verify</span>} 
                key="verify"
              >
                <ImageVerifyTab disasters={disasters} />
              </Tabs.TabPane>
            </Tabs>

            {/* Enhanced Create/Edit Modal */}
            <DisasterForm 
              open={modalOpen}
              onCancel={handleCancel}
              form={form}
              selected={selected}
              onSuccess={handleFormSuccess}
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
} 