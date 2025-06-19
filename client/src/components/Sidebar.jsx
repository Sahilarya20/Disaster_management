import React from 'react';
import { Layout, Menu } from 'antd';
import { 
  AlertOutlined,
  ShareAltOutlined,
  SafetyOutlined,
  GlobalOutlined,
  FileSearchOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed, activeTab, setActiveTab }) => {
  // Sidebar menu items
  const sidebarItems = [
    {
      key: 'disasters',
      icon: <AlertOutlined />,
      label: 'Disasters',
    },
    {
      key: 'social',
      icon: <ShareAltOutlined />,
      label: 'Social Media',
    },
    {
      key: 'resources',
      icon: <SafetyOutlined />,
      label: 'Resources',
    },
    {
      key: 'updates',
      icon: <GlobalOutlined />,
      label: 'Official Updates',
    },
    {
      key: 'verify',
      icon: <FileSearchOutlined />,
      label: 'Image Verify',
    },
  ];

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={setCollapsed}
      theme="light"
      style={{
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        background: '#fafafa'
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[activeTab]}
        style={{ borderRight: 0, background: 'transparent', marginTop: '16px' }}
        items={sidebarItems}
        onClick={({ key }) => setActiveTab(key)}
      />
    </Sider>
  );
};

export default Sidebar; 