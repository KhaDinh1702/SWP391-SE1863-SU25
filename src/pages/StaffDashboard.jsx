import { useState } from 'react';
import { Layout, Typography } from 'antd';
import StaffSidebar from '../components/staff/StaffSidebar';
import StaffHeader from '../components/staff/StaffHeader';
import StaffAppointmentList from '../components/staff/StaffAppointmentList';
import StaffDoctorSchedule from '../components/staff/StaffDoctorSchedule';
import StaffProfile from '../components/staff/StaffProfile';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const staff = {
    fullName: 'Staff',
    email: 'staff@example.com',
    phone: '',
    role: 'Staff',
    joinedDate: '',
    avatarUrl: '',
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Tổng quan';
      case 'appointments':
        return 'Quản lý Lịch hẹn';
      case 'doctor-schedule':
        return 'Lịch làm việc Bác sĩ';
      case 'profile':
        return 'Hồ sơ';
      default:
        return 'Dashboard';
    }
  };

  return (
    <Layout className="min-h-screen">
      <Sider width={200} className="fixed left-0 h-screen overflow-y-auto bg-white shadow-sm" theme="light">
        <div className="p-4 flex items-center gap-2">
          <span className="text-lg font-semibold">Staff Panel</span>
        </div>
        <div className="px-4 pb-1 text-gray-400 text-sm">MENU CHÍNH</div>
        <StaffSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </Sider>
      <Layout className="ml-[10px]">
        <StaffHeader staff={staff} />
        <Content className="bg-gray-50 p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Title level={2} className="!mb-0">{getPageTitle()}</Title>
            </div>
            <Text type="secondary">
              {activeTab === 'dashboard' && 'Tổng quan về hoạt động của nhân viên'}
              {activeTab === 'appointments' && 'Xác nhận, hủy, hoặc sắp xếp lại các lịch hẹn của bệnh nhân'}
              {activeTab === 'doctor-schedule' && 'Kiểm tra lịch trống của các bác sĩ'}
              {activeTab === 'profile' && 'Thông tin cá nhân của nhân viên'}
            </Text>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            {activeTab === 'dashboard' && <div>Chào mừng đến với trang nhân viên!</div>}
            {activeTab === 'appointments' && <StaffAppointmentList />}
            {activeTab === 'doctor-schedule' && <StaffDoctorSchedule />}
            {activeTab === 'profile' && <StaffProfile staff={staff} />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StaffDashboard; 