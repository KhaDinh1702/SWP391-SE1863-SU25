import { Button } from 'antd';
import {
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  ProfileOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const StaffSidebar = ({ activeTab, setActiveTab }) => {
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
        className="w-full text-left flex items-center h-7 px-4 border-0"
        onClick={() => setActiveTab('dashboard')}
      >
        Dashboard
      </Button>      <Button
        type={activeTab === 'appointments' ? 'primary' : 'text'}
        icon={<CalendarOutlined />}
        className="w-full text-left flex items-center h-7 px-4 border-0"
        onClick={() => setActiveTab('appointments')}
      >
        Xem lịch hẹn
      </Button>
      <Button
        type={activeTab === 'doctor-schedule' ? 'primary' : 'text'}
        icon={<TeamOutlined />}
        className="w-full text-left flex items-center h-7 px-4 border-0"
        onClick={() => setActiveTab('doctor-schedule')}
      >
        Lịch làm việc Bác sĩ
      </Button>
      <Button
        type={activeTab === 'notifications' ? 'primary' : 'text'}
        icon={<BellOutlined />}
        className="w-full text-left flex items-center h-7 px-4 border-0"
        onClick={() => setActiveTab('notifications')}
      >
        Quản lý thông báo
      </Button>
      <Button
        type={activeTab === 'profile' ? 'primary' : 'text'}
        icon={<ProfileOutlined />}
        className="w-full text-left flex items-center h-7 px-4 border-0"
        onClick={() => setActiveTab('profile')}
      >
        Hồ sơ
      </Button>
      <Button
        type="text"
        icon={<LogoutOutlined />}
        className="w-full text-left flex items-center h-7 px-4 border-0 text-red-500"
        onClick={handleLogout}
      >
        Đăng xuất
      </Button>
    </div>
  );
};

export default StaffSidebar;