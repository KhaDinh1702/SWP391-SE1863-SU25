// src/pages/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Card, Statistic, Table, Tag, Space } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  FileTextOutlined, 
  ExperimentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import DoctorSidebar from '../components/doctor/DoctorSidebar';
import DoctorHeader from '../components/doctor/DoctorHeader';
import DoctorSchedule from '../components/doctor/Schedule/DoctorSchedule';
import DoctorAppointments from '../components/doctor/Appointments/DoctorAppointments';
import PatientProfiles from '../components/doctor/Patient/PatientProfiles';
import LabResults from '../components/doctor/Lab/LabResults';
import MedicalHistory from '../components/doctor/History/MedicalHistory';
import TreatmentProtocol from '../components/doctor/Treatment/TreatmentProtocol';
import OnlineConsultation from '../components/doctor/Consultation/OnlineConsultation';
import DoctorProfile from '../components/doctor/Profile/DoctorProfile';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingLabResults: 0,
    activeTreatments: 0
  });

  useEffect(() => {
    if (activeTab === 'dashboard') {
      // Simulate loading stats - in real app, this would fetch from API
      setStats({
        totalPatients: 156,
        todayAppointments: 8,
        pendingLabResults: 12,
        activeTreatments: 23
      });
    }
  }, [activeTab]);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Tổng quan';
      case 'schedule': return 'Lịch làm việc';
      case 'appointments': return 'Lịch hẹn';
      case 'patients': return 'Hồ sơ Bệnh nhân';
      case 'lab': return 'Xét nghiệm';
      case 'history': return 'Lịch sử khám';
      case 'treatment': return 'Quy trình điều trị';
      case 'consultation': return 'Tư vấn trực tuyến';
      case 'profile': return 'Hồ sơ cá nhân';
      default: return 'Dashboard';
    }
  };

  const getPageDescription = () => {
    switch (activeTab) {
      case 'dashboard': return 'Tổng quan về hoạt động của bác sĩ';
      case 'schedule': return 'Xem lịch làm việc của bản thân';
      case 'appointments': return 'Kiểm tra các lịch hẹn đã được đặt với mình';
      case 'patients': return 'Xem thông tin chi tiết về bệnh nhân';
      case 'lab': return 'Xem kết quả xét nghiệm của bệnh nhân';
      case 'history': return 'Xem lại lịch sử điều trị của bệnh nhân';
      case 'treatment': return 'Tạo quy trình khám bệnh cho bệnh nhân';
      case 'consultation': return 'Thực hiện tư vấn trực tuyến';
      case 'profile': return 'Thông tin cá nhân của bác sĩ';
      default: return 'Dashboard';
    }
  };

  const DashboardOverview = () => (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số bệnh nhân"
              value={stats.totalPatients}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Lịch hẹn hôm nay"
              value={stats.todayAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Kết quả xét nghiệm chờ"
              value={stats.pendingLabResults}
              prefix={<ExperimentOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Điều trị đang hoạt động"
              value={stats.activeTreatments}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Lịch hẹn gần đây" size="small">
            <Table
              dataSource={[
                { key: '1', patient: 'Nguyễn Văn A', time: '09:00', status: 'Scheduled' },
                { key: '2', patient: 'Trần Thị B', time: '10:30', status: 'InProgress' },
                { key: '3', patient: 'Lê Văn C', time: '14:00', status: 'Completed' },
                { key: '4', patient: 'Phạm Thị D', time: '16:30', status: 'Scheduled' },
              ]}
              columns={[
                { title: 'Bệnh nhân', dataIndex: 'patient', key: 'patient' },
                { title: 'Thời gian', dataIndex: 'time', key: 'time' },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => {
                    const statusConfig = {
                      Scheduled: { color: 'blue', text: 'Đã lên lịch', icon: <ClockCircleOutlined /> },
                      InProgress: { color: 'orange', text: 'Đang khám', icon: <ClockCircleOutlined /> },
                      Completed: { color: 'green', text: 'Hoàn thành', icon: <CheckCircleOutlined /> },
                    };
                    const config = statusConfig[status] || { color: 'default', text: status, icon: null };
                    return (
                      <Tag color={config.color} icon={config.icon}>
                        {config.text}
                      </Tag>
                    );
                  }
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Kết quả xét nghiệm cần chú ý" size="small">
            <Table
              dataSource={[
                { key: '1', patient: 'Nguyễn Văn A', test: 'CD4 Count', result: 'Abnormal', priority: 'High' },
                { key: '2', patient: 'Trần Thị B', test: 'Viral Load', result: 'Critical', priority: 'High' },
                { key: '3', patient: 'Lê Văn C', test: 'Liver Function', result: 'Normal', priority: 'Low' },
              ]}
              columns={[
                { title: 'Bệnh nhân', dataIndex: 'patient', key: 'patient' },
                { title: 'Xét nghiệm', dataIndex: 'test', key: 'test' },
                {
                  title: 'Kết quả',
                  dataIndex: 'result',
                  key: 'result',
                  render: (result) => {
                    const color = result === 'Normal' ? 'green' : result === 'Abnormal' ? 'orange' : 'red';
                    return <Tag color={color}>{result}</Tag>;
                  }
                },
                {
                  title: 'Ưu tiên',
                  dataIndex: 'priority',
                  key: 'priority',
                  render: (priority) => {
                    const color = priority === 'High' ? 'red' : 'green';
                    const icon = priority === 'High' ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />;
                    return <Tag color={color} icon={icon}>{priority}</Tag>;
                  }
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Hoạt động gần đây" size="small">
            <div style={{ padding: '16px 0' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div>
                    <Text strong>Khám bệnh nhân Nguyễn Văn A</Text>
                    <br />
                    <Text type="secondary">Cập nhật hồ sơ bệnh án</Text>
                  </div>
                  <Text type="secondary">2 giờ trước</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div>
                    <Text strong>Tạo phác đồ điều trị mới</Text>
                    <br />
                    <Text type="secondary">Bệnh nhân Trần Thị B</Text>
                  </div>
                  <Text type="secondary">4 giờ trước</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div>
                    <Text strong>Xem kết quả xét nghiệm</Text>
                    <br />
                    <Text type="secondary">Bệnh nhân Lê Văn C</Text>
                  </div>
                  <Text type="secondary">6 giờ trước</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <div>
                    <Text strong>Tư vấn trực tuyến</Text>
                    <br />
                    <Text type="secondary">Bệnh nhân Phạm Thị D</Text>
                  </div>
                  <Text type="secondary">1 ngày trước</Text>
                </div>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <Layout className="min-h-screen">
      <Sider width={220} className="fixed left-0 h-screen overflow-y-auto bg-white shadow-sm" theme="light">
        <DoctorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </Sider>
      <Layout className="ml-[10px]">
        <DoctorHeader />
        <Content className="bg-gray-50 p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Title level={2} className="!mb-0">{getPageTitle()}</Title>
            </div>
            <Text type="secondary">
              {getPageDescription()}
            </Text>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            {activeTab === 'dashboard' && <DashboardOverview />}
            {activeTab === 'schedule' && <DoctorSchedule />}
            {activeTab === 'appointments' && <DoctorAppointments />}
            {activeTab === 'patients' && <PatientProfiles />}
            {activeTab === 'lab' && <LabResults />}
            {activeTab === 'history' && <MedicalHistory />}
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
