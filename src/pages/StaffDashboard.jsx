import { useState } from 'react';
import { Layout, Typography, Card } from 'antd';
import StaffSidebar from '../components/staff/StaffSidebar';
import StaffHeader from '../components/staff/StaffHeader';
import StaffAppointmentList from '../components/staff/StaffAppointmentList';
import StaffDoctorSchedule from '../components/staff/StaffDoctorSchedule';
import StaffProfile from '../components/staff/StaffProfile';
import StaffNotificationManager from '../components/staff/StaffNotificationManager';
import StaffMedicalRecordView from '../components/staff/StaffMedicalRecordView';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const StaffDashboard = () => {
  // Lấy ngày hiện tại
  const today = new Date();
  const formattedDate = today.toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const staff = {
    fullName: 'Staff',
    email: 'staff@example.com',
    phone: '',
    role: 'Staff',
    joinedDate: '',
    avatarUrl: '',
  };
  // Dashboard stats (dummy, replace with real API if needed)
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalDoctors: 0,
    totalPatients: 0
  });
  // Simulate fetching stats (replace with real API calls if needed)
  useState(() => {
    setStats({
      totalAppointments: 0,
      totalDoctors: 0,
      totalPatients: 0
    });
  });

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Tổng quan';
      case 'appointments':
        return 'Xem lịch hẹn';
      case 'doctor-schedule':
        return 'Lịch làm việc Bác sĩ';
      case 'medical-records':
        return 'Hồ sơ bệnh án';
      case 'notifications':
        return 'Quản lý thông báo';
      case 'profile':
        return 'Hồ sơ';
      default:
        return 'Dashboard';
    }
  };

  return (
    <Layout className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
      <Sider width={220} className="fixed left-0 h-screen overflow-y-auto bg-white shadow-lg" theme="light">
        <div className="p-5 flex items-center gap-3">
          <span className="text-xl font-bold text-blue-700">Staff Panel</span>
        </div>
        <div className="px-5 pb-2 text-gray-400 text-sm tracking-wide">MENU CHÍNH</div>
        <StaffSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </Sider>
      <Layout className="ml-[10px]">
        <StaffHeader staff={staff} />
        <Content className="bg-transparent p-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <Title level={2} className="!mb-0 text-gray-800 font-semibold tracking-tight drop-shadow">
                {getPageTitle()}
              </Title>
            </div>
            <Text type="secondary" className="text-lg">
              {activeTab === 'dashboard' && 'Tổng quan về hoạt động của nhân viên'}
              {activeTab === 'appointments' && 'Quản lý lịch hẹn của phòng khám'}
              {activeTab === 'doctor-schedule' && 'Xem lịch làm việc của bác sĩ'}
              {activeTab === 'medical-records' && 'Xem hồ sơ bệnh án'}
              {activeTab === 'notifications' && 'Quản lý thông báo'}
              {activeTab === 'profile' && 'Thông tin cá nhân của nhân viên'}
            </Text>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl transition-all duration-300">
            {activeTab === 'dashboard' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center py-6 border-0" style={{ borderColor: 'transparent' }}>
                  <span style={{ fontSize: 36, color: '#2563eb' }}>
                    <span role="img" aria-label="calendar">📅</span>
                  </span>
                  <div className="mt-2 text-lg text-gray-500">Tổng số lịch hẹn</div>
                  <div className="mt-1 text-2xl font-bold text-blue-600">{stats.totalAppointments}</div>
                </Card>
                <Card className="rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center py-6 border-0" style={{ borderColor: 'transparent' }}>
                  <span style={{ fontSize: 36, color: '#22c55e' }}>
                    <span role="img" aria-label="doctor">👨‍⚕️</span>
                  </span>
                  <div className="mt-2 text-lg text-gray-500">Tổng số bác sĩ</div>
                  <div className="mt-1 text-2xl font-bold text-green-600">{stats.totalDoctors}</div>
                </Card>
                <Card className="rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center py-6 border-0" style={{ borderColor: 'transparent' }}>
                  <span style={{ fontSize: 36, color: '#a21caf' }}>
                    <span role="img" aria-label="patient">🧑‍🤝‍🧑</span>
                  </span>
                  <div className="mt-2 text-lg text-gray-500">Tổng số bệnh nhân</div>
                  <div className="mt-1 text-2xl font-bold text-purple-600">{stats.totalPatients}</div>
                </Card>
              </div>
            ) : null}
            {activeTab === 'appointments' && <StaffAppointmentList />}
            {activeTab === 'doctor-schedule' && <StaffDoctorSchedule />}
            {activeTab === 'medical-records' && <StaffMedicalRecordView />}
            {activeTab === 'notifications' && <StaffNotificationManager />}
            {activeTab === 'profile' && <StaffProfile staff={staff} />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StaffDashboard; 