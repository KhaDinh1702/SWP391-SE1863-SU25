import { Button } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ManagerSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div>
      <Button
        type={activeTab === 'dashboard' ? 'primary' : 'text'}
        icon={<DashboardOutlined />}
        className="w-full text-left flex items-center h-10 px-4 border-0"
        onClick={() => setActiveTab('dashboard')}
      >
        Dashboard
      </Button>

      <Button
        type={activeTab === 'doctors' ? 'primary' : 'text'}
        icon={<TeamOutlined />}
        className="w-full text-left flex items-center h-10 px-4 border-0"
        onClick={() => setActiveTab('doctors')}
      >
        Quản lý Bác sĩ
      </Button>

      <Button
        type={activeTab === 'schedules' ? 'primary' : 'text'}
        icon={<CalendarOutlined />}
        className="w-full text-left flex items-center h-10 px-4 border-0"
        onClick={() => setActiveTab('schedules')}
      >
        Lịch làm việc
      </Button>

      <Button
        type={activeTab === 'profile' ? 'primary' : 'text'}
        icon={<ProfileOutlined />}
        className="w-full text-left flex items-center h-10 px-4 border-0"
        onClick={() => setActiveTab('profile')}
      >
        Hồ sơ cá nhân
      </Button>

      <Button
        type={activeTab === 'arvProtocols' ? 'primary' : 'text'}
        icon={<ProfileOutlined />}
        className="w-full text-left flex items-center h-10 px-4 border-0"
        onClick={() => setActiveTab('arvProtocols')}
      >
        Phác đồ ARV
      </Button>

      <Button
        type="text"
        icon={<LogoutOutlined />}
        className="w-full text-left flex items-center h-10 px-4 border-0"
        onClick={handleLogout}
      >
        Đăng xuất
      </Button>
    </div>
  );
};

export default ManagerSidebar; 