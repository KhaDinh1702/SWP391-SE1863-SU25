import { Button } from 'antd';
import {
  DashboardOutlined,
  CalendarOutlined,
  ProfileOutlined,
  TeamOutlined,
  FileSearchOutlined,
  HistoryOutlined,
  ExperimentOutlined,
  SolutionOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const DoctorSidebar = ({ activeTab, setActiveTab }) => {
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
      <div className="p-4 flex items-center gap-2">
        <TeamOutlined style={{ fontSize: 22 }} />
        <span className="text-lg font-semibold">Doctor Panel</span>
      </div>
      <Button type={activeTab === 'dashboard' ? 'primary' : 'text'} icon={<DashboardOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('dashboard')}>Dashboard</Button>
      <Button type={activeTab === 'schedule' ? 'primary' : 'text'} icon={<CalendarOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('schedule')}>Lịch làm việc</Button>
      <Button type={activeTab === 'appointments' ? 'primary' : 'text'} icon={<CalendarOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('appointments')}>Lịch hẹn</Button>
      <Button type={activeTab === 'patients' ? 'primary' : 'text'} icon={<ProfileOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('patients')}>Hồ sơ Bệnh nhân</Button>
      <Button type={activeTab === 'lab' ? 'primary' : 'text'} icon={<ExperimentOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('lab')}>Xét nghiệm</Button>
      <Button type={activeTab === 'history' ? 'primary' : 'text'} icon={<HistoryOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('history')}>Lịch sử khám</Button>
      <Button type={activeTab === 'arv' ? 'primary' : 'text'} icon={<FileSearchOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('arv')}>Phác đồ ARV</Button>
      <Button type={activeTab === 'treatment' ? 'primary' : 'text'} icon={<SolutionOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('treatment')}>Quy trình điều trị</Button>
      <Button type={activeTab === 'consultation' ? 'primary' : 'text'} icon={<VideoCameraOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('consultation')}>Tư vấn trực tuyến</Button>
      <Button type={activeTab === 'profile' ? 'primary' : 'text'} icon={<ProfileOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0" onClick={() => setActiveTab('profile')}>Hồ sơ cá nhân</Button>
      <Button type="text" icon={<LogoutOutlined />} className="w-full text-left flex items-center h-7 px-4 border-0 text-red-500 mt-2" onClick={handleLogout}>Đăng xuất</Button>
    </div>
  );
};

export default DoctorSidebar; 