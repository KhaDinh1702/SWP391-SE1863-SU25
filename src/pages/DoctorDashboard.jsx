import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Tag, 
  Space, 
  message, 
  Spin, 
  Button, 
  Input, 
  Select, 
  Avatar,
  Alert
} from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  FileTextOutlined, 
  ExperimentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
  HeartOutlined
} from '@ant-design/icons';
import DoctorSidebar from '../components/doctor/DoctorSidebar';
import DoctorSchedule from '../components/doctor/Schedule/DoctorSchedule';
import PatientProfiles from '../components/doctor/Patient/PatientProfiles';
import LabResults from '../components/doctor/Lab/LabResults';
import MedicalHistory from '../components/doctor/History/MedicalHistory';
import TreatmentProtocol from '../components/doctor/Treatment/TreatmentProtocol';
import OnlineConsultation from '../components/doctor/Consultation/OnlineConsultation';
import DoctorProfile from '../components/doctor/Profile/DoctorProfile';
import { doctorService } from '../services/doctorService';
import { patientService } from '../services/patientService';
import { labResultService } from '../services/labResultService';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingLabResults: 0,
    activeTreatments: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [searchPatient, setSearchPatient] = useState('');
  const [filterGender, setFilterGender] = useState('all');

  // Lấy thông tin bác sĩ hiện tại
  useEffect(() => {
    const fetchCurrentDoctor = async () => {
      try {
        const doctor = await doctorService.getCurrentDoctor();
        setCurrentDoctor(doctor);
      } catch (error) {
        console.error('Error fetching current doctor:', error);
        // Fallback: sử dụng thông tin từ localStorage hoặc token
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        setCurrentDoctor(userInfo);
      }
    };

    fetchCurrentDoctor();
  }, []);

  // Lấy dữ liệu dashboard khi tab active
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {    
    setLoading(true);
    try {
      // Lấy tất cả dữ liệu song song
      const [statsData, appointmentsData, patientsData, labResultsData] = await Promise.allSettled([
        fetchStats(),
        fetchTodayAppointments(),
        fetchAllPatients(),
        fetchLabResults()
      ]);

      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
      }
      
      if (appointmentsData.status === 'fulfilled') {
        setTodayAppointments(appointmentsData.value);
      }

      if (patientsData.status === 'fulfilled') {
        setAllPatients(patientsData.value);
      }

      if (labResultsData.status === 'fulfilled') {
        setLabResults(labResultsData.value);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Lấy dữ liệu thống kê từ nhiều API
      const [patients, todayAppts, labResults, activeTreatments] = await Promise.allSettled([
        patientService.getAllPatients(), // Sử dụng patientService để lấy tất cả bệnh nhân
        currentDoctor?.doctorId ? doctorService.getTodayAppointments(currentDoctor.doctorId) : Promise.resolve([]),
        labResultService.getAllLabResults(), // Sử dụng labResultService để lấy tất cả kết quả xét nghiệm
        currentDoctor?.doctorId ? doctorService.getActiveTreatments(currentDoctor.doctorId) : Promise.resolve([])
      ]);

      // Tính số lượng lab results cần chú ý (không có kết luận hoặc cần theo dõi)
      const pendingLabResults = labResults.status === 'fulfilled' && labResults.value ? 
        labResults.value.filter(lab => !lab.Conclusion || lab.Conclusion.toLowerCase().includes('cần theo dõi') || lab.Conclusion.toLowerCase().includes('bất thường')) : 
        [];

      return {
        totalPatients: patients.status === 'fulfilled' ? patients.value?.length || 0 : 0,
        todayAppointments: todayAppts.status === 'fulfilled' ? todayAppts.value?.length || 0 : 0,
        pendingLabResults: pendingLabResults.length,
        activeTreatments: activeTreatments.status === 'fulfilled' ? activeTreatments.value?.length || 0 : 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback với dữ liệu mẫu
      return {
        totalPatients: 0,
        todayAppointments: 0,
        pendingLabResults: 0,
        activeTreatments: 0
      };
    }
  };

  const fetchTodayAppointments = async () => {
    try {
      if (!currentDoctor?.doctorId) return [];
      const appointments = await doctorService.getTodayAppointments(currentDoctor.doctorId);
      return appointments || [];
    } catch (error) {
      console.error('Error fetching today appointments:', error);
      return [];
    }
  };

  const fetchAllPatients = async () => {
    try {
      const patients = await patientService.getAllPatients();
      return patients || [];
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  };

  const fetchLabResults = async () => {
    try {
      const results = await labResultService.getAllLabResults();
      console.log('Lab results fetched:', results); // Debug log
      console.log('Sample lab result structure:', results?.[0]); // Debug log
      return results || [];
    } catch (error) {
      console.error('Error fetching lab results:', error);
      return [];
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Tổng quan';
      case 'schedule': return 'Lịch làm việc';
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
      case 'patients': return 'Xem thông tin chi tiết về bệnh nhân';
      case 'lab': return 'Xem kết quả xét nghiệm của bệnh nhân';
      case 'history': return 'Xem lại lịch sử điều trị của bệnh nhân';
      case 'treatment': return 'Tạo quy trình khám bệnh cho bệnh nhân';
      case 'consultation': return 'Thực hiện tư vấn trực tuyến';
      case 'profile': return 'Thông tin cá nhân của bác sĩ';
      default: return 'Dashboard';
    }
  };

  // Filter patients based on search and filter criteria
  const getFilteredPatients = () => {
    return allPatients.filter(patient => {
      const matchesSearch = !searchPatient || 
        patient.fullName?.toLowerCase().includes(searchPatient.toLowerCase()) ||
        patient.phoneNumber?.includes(searchPatient) ||
        patient.patientId?.toLowerCase().includes(searchPatient.toLowerCase());
      
      const matchesGender = filterGender === 'all' || 
        (filterGender === 'male' && patient.gender === 0) ||
        (filterGender === 'female' && patient.gender === 1);
      
      return matchesSearch && matchesGender;
    });
  };

  const DashboardOverview = () => (
    <div>
      <Spin spinning={loading}>
        {/* Welcome Banner */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Alert
              message={`Chào mừng, Dr. ${currentDoctor?.fullName || 'Bác sĩ'}`}
              description={`Hôm nay là ${new Date().toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}. Bạn có ${stats.todayAppointments} lịch hẹn hôm nay.`}
              type="info"
              showIcon
              icon={<HeartOutlined />}
              style={{ borderRadius: 8 }}
            />
          </Col>
        </Row>

        {/* Main Statistics */}
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

        {/* Quick Stats and Performance */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="Thao tác nhanh" size="small">
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} lg={6}>
                  <Button 
                    type="primary" 
                    icon={<UserOutlined />}
                    block
                    onClick={() => setActiveTab('patients')}
                  >
                    Xem bệnh nhân
                  </Button>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Button 
                    icon={<CalendarOutlined />} 
                    block
                    onClick={() => setActiveTab('schedule')}
                  >
                    Xem lịch làm việc
                  </Button>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Button 
                    icon={<ExperimentOutlined />} 
                    block
                    onClick={() => setActiveTab('lab')}
                  >
                    Xem kết quả xét nghiệm
                  </Button>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Button 
                    icon={<FileTextOutlined />} 
                    block
                    onClick={() => setActiveTab('treatment')}
                  >
                    Tạo quy trình điều trị
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card title="Lịch hẹn hôm nay" size="small">
              <Table
                dataSource={todayAppointments.map((apt, index) => ({
                  key: apt.appointmentId || index,
                  patient: apt.patientName || apt.patient?.fullName || 'N/A',
                  time: apt.appointmentTime || apt.time,
                  status: apt.appointmentStatus || apt.status || 'Scheduled'
                }))}
                columns={[
                  { title: 'Bệnh nhân', dataIndex: 'patient', key: 'patient' },
                  { 
                    title: 'Thời gian', 
                    dataIndex: 'time', 
                    key: 'time',
                    render: (time) => {
                      if (!time) return 'N/A';
                      try {
                        return new Date(time).toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        });
                      } catch {
                        return time;
                      }
                    }
                  },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'status',
                    key: 'status',
                    render: (status) => {
                      const statusConfig = {
                        Scheduled: { color: 'blue', text: 'Đã lên lịch', icon: <ClockCircleOutlined /> },
                        InProgress: { color: 'orange', text: 'Đang khám', icon: <ClockCircleOutlined /> },
                        Completed: { color: 'green', text: 'Hoàn thành', icon: <CheckCircleOutlined /> },
                        Cancelled: { color: 'red', text: 'Đã hủy', icon: <ExclamationCircleOutlined /> },
                        0: { color: 'blue', text: 'Đã lên lịch', icon: <ClockCircleOutlined /> },
                        1: { color: 'orange', text: 'Đang khám', icon: <ClockCircleOutlined /> },
                        2: { color: 'green', text: 'Hoàn thành', icon: <CheckCircleOutlined /> },
                        3: { color: 'red', text: 'Đã hủy', icon: <ExclamationCircleOutlined /> }
                      };
                      const config = statusConfig[status] || { color: 'default', text: status || 'N/A', icon: null };
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
            </Card>          </Col>
        </Row>        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card 
              title={`Danh sách bệnh nhân (${getFilteredPatients().length}/${allPatients.length})`} 
              size="small"
              extra={
                <Space>
                  <Input
                    placeholder="Tìm kiếm bệnh nhân..."
                    prefix={<SearchOutlined />}
                    value={searchPatient}
                    onChange={(e) => setSearchPatient(e.target.value)}
                    style={{ width: 200 }}
                    allowClear
                  />
                  <Select
                    value={filterGender}
                    onChange={setFilterGender}
                    style={{ width: 120 }}
                    placeholder="Giới tính"
                  >
                    <Select.Option value="all">Tất cả</Select.Option>
                    <Select.Option value="male">Nam</Select.Option>
                    <Select.Option value="female">Nữ</Select.Option>
                  </Select>
                </Space>
              }
            >
              <Table
                dataSource={getFilteredPatients().map((patient, index) => ({
                  key: patient.patientId || index,
                  patientId: patient.patientId,
                  fullName: patient.fullName,
                  dateOfBirth: patient.dateOfBirth,
                  gender: patient.gender,
                  phoneNumber: patient.phoneNumber,
                  email: patient.email,
                  address: patient.address,
                  isActive: patient.isActive
                }))}
                columns={[
                  { 
                    title: 'Mã BN', 
                    dataIndex: 'patientId', 
                    key: 'patientId',
                    width: 120,
                    render: (id) => <Text code>{id?.substring(0, 8)}...</Text>
                  },
                  { 
                    title: 'Họ và tên', 
                    dataIndex: 'fullName', 
                    key: 'fullName',
                    render: (name, record) => (
                      <Space>
                        <Avatar 
                          icon={<UserOutlined />} 
                          style={{ backgroundColor: record.gender === 0 ? '#1890ff' : '#f759ab' }}
                        />
                        <Text strong>{name || 'N/A'}</Text>
                      </Space>
                    )
                  },
                  {
                    title: 'Ngày sinh',
                    dataIndex: 'dateOfBirth',
                    key: 'dateOfBirth',
                    width: 120,
                    render: (date) => {
                      if (!date) return 'N/A';
                      try {
                        const birthDate = new Date(date);
                        const age = new Date().getFullYear() - birthDate.getFullYear();
                        return (
                          <div>
                            <div>{birthDate.toLocaleDateString('vi-VN')}</div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {age} tuổi
                            </Text>
                          </div>
                        );
                      } catch {
                        return date;
                      }
                    }
                  },
                  {
                    title: 'Giới tính',
                    dataIndex: 'gender',
                    key: 'gender',
                    width: 100,
                    render: (gender) => {
                      const genderText = gender === 0 ? 'Nam' : gender === 1 ? 'Nữ' : 'Khác';
                      const color = gender === 0 ? 'blue' : gender === 1 ? 'pink' : 'default';
                      return <Tag color={color}>{genderText}</Tag>;
                    }
                  },
                  { 
                    title: 'Liên hệ', 
                    dataIndex: 'phoneNumber', 
                    key: 'contact',
                    width: 150,
                    render: (phone, record) => (
                      <Space direction="vertical" size="small">
                        <Space size="small">
                          <PhoneOutlined />
                          <Text copyable={{ text: phone }}>{phone}</Text>
                        </Space>
                        {record.email && (
                          <Space size="small">
                            <MailOutlined />
                            <Text copyable={{ text: record.email }} style={{ fontSize: 12 }}>
                              {record.email}
                            </Text>
                          </Space>
                        )}
                      </Space>
                    )
                  },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'isActive',
                    key: 'isActive',
                    width: 120,
                    render: (isActive) => (
                      <Tag color={isActive ? 'green' : 'red'} icon={isActive ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}>
                        {isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </Tag>
                    )
                  }
                ]}
                pagination={{
                  pageSize: 8,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bệnh nhân`,
                  pageSizeOptions: ['5', '8', '10', '20']
                }}
                size="small"
                scroll={{ x: 1000 }}
              />
            </Card>
          </Col>
        </Row>


      </Spin>
    </div>
  );

  return (
    <Layout className="min-h-screen">
      <Sider width={220} className="fixed left-0 h-screen overflow-y-auto bg-white shadow-sm" theme="light">
        <DoctorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </Sider>
      <Layout className="ml-[10px]">
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
