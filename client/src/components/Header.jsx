import React from 'react';
import { Layout, Typography, Input, Button, Badge, Dropdown, Avatar, Menu } from 'antd';
import { 
  DashboardOutlined, 
  SearchOutlined, 
  BellOutlined, 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const Header = () => {
  // User menu for dropdown
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader style={{ 
      background: 'linear-gradient(135deg, #1890ff 0%, #001529 100%)', 
      padding: '0 24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DashboardOutlined style={{ fontSize: '24px', color: '#fff', marginRight: '12px' }} />
          <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 600 }}>
            Disaster Response Platform
          </Title>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Search
            placeholder="Search disasters..."
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          
          <Badge count={5} size="small">
            <Button 
              type="text" 
              icon={<BellOutlined style={{ fontSize: '18px' }} />} 
              style={{ color: '#fff', border: 'none' }}
            />
          </Badge>
          
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar size="small" icon={<UserOutlined />} />
              <Text style={{ color: '#fff' }}>NetrunnerX</Text>
            </div>
          </Dropdown>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header; 