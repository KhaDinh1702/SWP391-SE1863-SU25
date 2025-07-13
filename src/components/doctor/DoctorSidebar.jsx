import { Button } from 'antd';
import {
  DashboardOutlined,
  CalendarOutlined,
  ProfileOutlined,
  TeamOutlined,
  FileSearchOutlined,
  ExperimentOutlined,
  SolutionOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const DoctorSidebar = ({ activeTab, setActiveTab, availableTabs = [] }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Kiểm tra xem tab có khả dụng không
  const isTabAvailable = (tabName) => {
    return availableTabs.length === 0 || availableTabs.includes(tabName);
  };

  return (
    <div>
      <div className="p-4 flex items-center gap-2">
        <TeamOutlined style={{ fontSize: 22 }} />
        <span className="text-lg font-semibold">Doctor Panel</span>
      </div>
      
      {/* Dashboard - luôn khả dụng */}
      <Button type={activeTab === 'dashboard' ? 'primary' : 'text'} icon={<DashboardOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('dashboard')}>Dashboard</Button>
      
      {/* Schedule - luôn khả dụng */}
      <Button type={activeTab === 'schedule' ? 'primary' : 'text'} icon={<CalendarOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('schedule')}>Lịch làm việc</Button>
      
      {/* Patients - luôn khả dụng */}
      <Button type={activeTab === 'patients' ? 'primary' : 'text'} icon={<ProfileOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('patients')}>Hồ sơ Bệnh nhân</Button>
      
      {/* Lab - chỉ hiển thị cho bác sĩ xét nghiệm và general */}
      {isTabAvailable('lab') && (
        <Button type={activeTab === 'lab' ? 'primary' : 'text'} icon={<ExperimentOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('lab')}>Xét nghiệm</Button>
      )}
      
      {/* Treatment - chỉ hiển thị cho bác sĩ điều trị và general */}
      {isTabAvailable('treatment') && (
        <Button type={activeTab === 'treatment' ? 'primary' : 'text'} icon={<SolutionOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('treatment')}>Quy trình điều trị</Button>
      )}
      
      {/* Profile - luôn khả dụng */}
      <Button type={activeTab === 'profile' ? 'primary' : 'text'} icon={<ProfileOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('profile')}>Hồ sơ cá nhân</Button>
      
      <Button type="text" icon={<LogoutOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0 text-red-500 mt-2" onClick={handleLogout}>Đăng xuất</Button>
    </div>
  );
};

export default DoctorSidebar; 