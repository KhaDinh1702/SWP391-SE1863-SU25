import { Button } from 'antd';
import {
  DashboardOutlined,
  UsergroupAddOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <div>
      <Button
        type={activeTab === 'dashboard' ? 'primary' : 'text'}
        icon={<DashboardOutlined />}
        className="w-full text-left flex items-center h-7 px-4 border-0"
        onClick={() => setActiveTab('dashboard')}
      >
        Dashboard
      </Button>
      <Button
        type={activeTab === 'users' ? 'primary' : 'text'}
        icon={<UsergroupAddOutlined />}
        className="w-full text-left flex items-center h-7 px-4 border-0"
        onClick={() => setActiveTab('users')}
      >
        Quản lý Người dùng
      </Button>
      <Button
        type={activeTab === 'reports' ? 'primary' : 'text'}
        icon={<BarChartOutlined />}
        className="w-full text-left flex items-center h-7 px-4 border-0"
        onClick={() => setActiveTab('reports')}
      >
        Báo cáo & Thống kê
      </Button>
      <Button
        type={activeTab === 'profile' ? 'primary' : 'text'}
        icon={<UserOutlined />}
        className="w-full text-left flex items-center h-7 px-4 border-0"
        onClick={() => setActiveTab('profile')}
      >
        Hồ sơ
      </Button>
      <Button
        type="text"
        icon={<LogoutOutlined />}
        className="w-full text-left flex items-center h-7 px-4 border-0 text-red-500"
        onClick={onLogout}
      >
        Đăng xuất
      </Button>
    </div>
  );
};

export default AdminSidebar;
