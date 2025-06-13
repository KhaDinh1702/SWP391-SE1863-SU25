import { Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ProfileOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const ManagerSidebar = ({ activeTab, setActiveTab }) => {
  const items = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'doctors', icon: <TeamOutlined />, label: 'Bác sĩ' },
    { key: 'schedule', icon: <CalendarOutlined />, label: 'Lịch làm việc' },
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

export default ManagerSidebar; 