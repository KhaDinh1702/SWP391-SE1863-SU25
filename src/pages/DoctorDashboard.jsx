// src/pages/DoctorDashboard.jsx
import React, { useState } from 'react';
import { Layout, Typography } from 'antd';
import DoctorSidebar from '../components/doctor/DoctorSidebar';
import DoctorHeader from '../components/doctor/DoctorHeader';
import DoctorSchedule from '../components/doctor/Schedule/DoctorSchedule';
import DoctorAppointments from '../components/doctor/Appointments/DoctorAppointments';
import PatientProfiles from '../components/doctor/Patient/PatientProfiles';
import LabResults from '../components/doctor/Lab/LabResults';
import MedicalHistory from '../components/doctor/History/MedicalHistory';
import ARVProtocols from '../components/doctor/ARV/ARVProtocols';
import TreatmentProtocol from '../components/doctor/Treatment/TreatmentProtocol';
import OnlineConsultation from '../components/doctor/Consultation/OnlineConsultation';
import DoctorProfile from '../components/doctor/Profile/DoctorProfile';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Tổng quan';
      case 'schedule': return 'Lịch làm việc';
      case 'appointments': return 'Lịch hẹn';
      case 'patients': return 'Hồ sơ Bệnh nhân';
      case 'lab': return 'Xét nghiệm';
      case 'history': return 'Lịch sử khám';
      case 'arv': return 'Phác đồ ARV';
      case 'treatment': return 'Quy trình điều trị';
      case 'consultation': return 'Tư vấn trực tuyến';
      case 'profile': return 'Hồ sơ cá nhân';
      default: return 'Dashboard';
    }
  };

  return (
    <Layout className="min-h-screen">
      <Sider width={220} className="fixed left-0 h-screen overflow-y-auto bg-white shadow-sm" theme="light">
        <DoctorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </Sider>
      <Layout className="ml-[220px]">
        <DoctorHeader />
        <Content className="bg-gray-50 p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Title level={2} className="!mb-0">{getPageTitle()}</Title>
            </div>
            <Text type="secondary">
              {activeTab === 'dashboard' && 'Tổng quan về hoạt động của bác sĩ'}
              {activeTab === 'schedule' && 'Xem lịch làm việc của bản thân'}
              {activeTab === 'appointments' && 'Kiểm tra các lịch hẹn đã được đặt với mình'}
              {activeTab === 'patients' && 'Xem thông tin chi tiết về bệnh nhân'}
              {activeTab === 'lab' && 'Xem kết quả xét nghiệm của bệnh nhân'}
              {activeTab === 'history' && 'Xem lại lịch sử điều trị của bệnh nhân'}
              {activeTab === 'arv' && 'Chọn hoặc tùy chỉnh phác đồ ARV cho bệnh nhân'}
              {activeTab === 'treatment' && 'Tạo quy trình khám bệnh cho bệnh nhân'}
              {activeTab === 'consultation' && 'Thực hiện tư vấn trực tuyến'}
              {activeTab === 'profile' && 'Thông tin cá nhân của bác sĩ'}
            </Text>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            {activeTab === 'dashboard' && <div>Chào mừng đến với trang bác sĩ!</div>}
            {activeTab === 'schedule' && <DoctorSchedule />}
            {activeTab === 'appointments' && <DoctorAppointments />}
            {activeTab === 'patients' && <PatientProfiles />}
            {activeTab === 'lab' && <LabResults />}
            {activeTab === 'history' && <MedicalHistory />}
            {activeTab === 'arv' && <ARVProtocols />}
            {activeTab === 'treatment' && <TreatmentProtocol />}
            {activeTab === 'consultation' && <OnlineConsultation />}
            {activeTab === 'profile' && <DoctorProfile />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorDashboard;
