import { Layout, Dropdown, Avatar } from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header } = Layout;

const AdminHeader = ({ onLogout }) => {
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
    if (key === 'logout') onLogout();
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
      <div style={{ marginRight: 24 }}>
        <Dropdown menu={{ items, onClick: handleMenuClick }}>
          <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default AdminHeader;
