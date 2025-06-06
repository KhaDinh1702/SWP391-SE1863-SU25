import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  ProfileOutlined,
} from '@ant-design/icons';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const items = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'doctors', icon: <UserOutlined />, label: 'Bác sĩ' },
    { key: 'users', icon: <TeamOutlined />, label: 'Người dùng' },  // <-- phải có
    { key: 'profile', icon: <ProfileOutlined />, label: 'Hồ sơ' },
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[activeTab]}
      onClick={({ key }) => setActiveTab(key)}
      items={items}
    />
  );
};

export default AdminSidebar;
