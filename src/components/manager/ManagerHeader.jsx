import { Layout } from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header } = Layout;

const ManagerHeader = ({ manager }) => {
  const items = [
    {
      key: 'profile',
      label: 'Hồ Sơ',
      icon: <UserOutlined />,
    },
    {
      key: 'logout',
      label: 'Đăng Xuất',
      icon: <LogoutOutlined />,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (key === 'profile') console.log('Profile clicked');
  };

  return (
    <Header
      style={{
        background: '#fff',
        padding: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px #f0f1f2',
      }}
    >
      <div></div>
      {/* Avatar and dropdown removed as requested */}
    </Header>
  );
};

export default ManagerHeader; 