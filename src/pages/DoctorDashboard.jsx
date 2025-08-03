import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import TreatmentProtocol from '../components/doctor/Treatment/TreatmentProtocol';
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
        // Lấy thông tin user từ token
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setCurrentDoctor(null);
          return;
        }

        // Decode JWT để lấy thông tin user
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenPayload.userId || tokenPayload.sub || tokenPayload.nameid;

        if (!userId) {
          console.error('No user ID found in token');
          setCurrentDoctor(null);
          return;
        }

        // Lấy danh sách tất cả bác sĩ từ API
        const allDoctors = await doctorService.getAllDoctors();

        if (!allDoctors || allDoctors.length === 0) {
          console.error('No doctors found in API');
          setCurrentDoctor(null);
          return;
        }

        // Tìm bác sĩ có userId trùng với token
        const currentDoctor = allDoctors.find(doctor => doctor.userId === userId);

        if (currentDoctor) {
          const doctorData = {
            ...currentDoctor,
            doctorId: currentDoctor.id,
            id: currentDoctor.id
          };
          setCurrentDoctor(doctorData);
        } else {
          console.error('Current doctor not found in doctor list');
          setCurrentDoctor(null);
        }
      } catch (error) {
        console.error('Error fetching current doctor:', error);
        setCurrentDoctor(null);
      }
    };

    fetchCurrentDoctor();
  }, []);

  // Kiểm tra loại bác sĩ dựa trên specialization
  const getDoctorType = () => {
    if (!currentDoctor?.specialization) return 'general';
    
    const spec = currentDoctor.specialization.toLowerCase();
    if (spec.includes('xét nghiệm') || spec.includes('lab') || spec.includes('test')) {
      return 'lab';
    } else if (spec.includes('điều trị') || spec.includes('treatment')) {
      return 'treatment';
    } else if (spec.includes('tư vấn') || spec.includes('consultant') || spec.includes('consultation')) {
      return 'consultant';
    }
    return 'general';
  };

  // Lấy danh sách menu dựa trên loại bác sĩ
  const getAvailableTabs = () => {
    const doctorType = getDoctorType();
    
    if (doctorType === 'lab') {
      // Bác sĩ xét nghiệm: bỏ tab schedule và treatment
      return ['dashboard', 'patients', 'lab', 'profile'];
    } else {
      // Bác sĩ điều trị và tư vấn: có tất cả các tab
      return ['dashboard', 'schedule', 'patients', 'lab', 'treatment', 'profile'];
    }
  };

  // Lấy dữ liệu dashboard khi tab active và có currentDoctor
  useEffect(() => {
    if (activeTab === 'dashboard' && currentDoctor) {
      fetchDashboardData();
    }
  }, [activeTab, currentDoctor]);

  // Kiểm tra và chuyển về dashboard nếu tab hiện tại không khả dụng cho loại bác sĩ này
  useEffect(() => {
    if (!currentDoctor) return;
    
    const doctorType = getDoctorType();
    const availableTabs = getAvailableTabs();
    
    if (!availableTabs.includes(activeTab)) {
      console.log(`Tab ${activeTab} không khả dụng cho bác sĩ ${doctorType}, chuyển về dashboard`);
      setActiveTab('dashboard');
    }
  }, [activeTab, currentDoctor]);

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
      if (!currentDoctor) {
        return {
          totalPatients: 0,
          todayAppointments: 0,
          pendingLabResults: 0,
          activeTreatments: 0
        };
      }
      
      const doctorId = currentDoctor?.doctorId || currentDoctor?.id;
      
      // Lấy dữ liệu thống kê từ nhiều API
      const [patients, todayAppts, labResults, activeTreatments] = await Promise.allSettled([
        patientService.getAllPatients(),
        doctorId ? doctorService.getTodayAppointments(doctorId) : Promise.resolve([]),
        labResultService.getAllLabResults(),
        doctorId ? doctorService.getActiveTreatments(doctorId) : Promise.resolve([])
      ]);

      // Tính số lượng lab results cần chú ý (không có kết luận hoặc cần theo dõi)
      const pendingLabResults = labResults.status === 'fulfilled' && labResults.value ? 
        labResults.value.filter(lab => !lab.Conclusion || lab.Conclusion.toLowerCase().includes('cần theo dõi') || lab.Conclusion.toLowerCase().includes('bất thường')) : 
        [];

      const finalStats = {
        totalPatients: patients.status === 'fulfilled' ? patients.value?.length || 0 : 0,
        todayAppointments: todayAppts.status === 'fulfilled' ? todayAppts.value?.length || 0 : 0,
        pendingLabResults: pendingLabResults.length,
        activeTreatments: activeTreatments.status === 'fulfilled' ? activeTreatments.value?.length || 0 : 0
      };
      
      return finalStats;
    } catch (error) {
      console.error('Error fetching stats:', error);
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
      if (!currentDoctor || (!currentDoctor?.doctorId && !currentDoctor?.id)) {
        return [];
      }
      
      const doctorId = currentDoctor?.doctorId || currentDoctor?.id;
      
      try {
        // Thử API endpoint chuyên dụng trước
        const appointments = await doctorService.getTodayAppointments(doctorId);
        return appointments || [];
      } catch (apiError) {
        // Fallback: Lấy tất cả appointments và lọc
        const { appointmentService } = await import('../services/appointmentService');
        const allAppointments = await appointmentService.getAllAppointments();
        
        if (!allAppointments) return [];
        
        // Lấy ngày hôm nay theo múi giờ VN
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Lọc appointments của bác sĩ hôm nay
        const todayAppointments = allAppointments.filter(apt => {
          const appointmentDoctorId = apt.doctorId || apt.DoctorId;
          const appointmentDate = apt.appointmentStartDate || apt.AppointmentStartDate;
          
          if (!appointmentDate) return false;
          
          const aptDateStr = new Date(appointmentDate).toISOString().split('T')[0];
          const isToday = aptDateStr === todayStr;
          const isThisDoctor = appointmentDoctorId === doctorId;
          
          return isToday && isThisDoctor;
        });
        
        return todayAppointments || [];
      }
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
      case 'treatment': return 'Quy trình điều trị';
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
      case 'treatment': return 'Tạo quy trình khám bệnh cho bệnh nhân';
      case 'profile': return 'Thông tin cá nhân của bác sĩ';
      default: return 'Dashboard';
    }
  };

  // Filter patients based on search and filter criteria với useMemo để tối ưu
  const getFilteredPatients = useMemo(() => {
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
  }, [allPatients, searchPatient, filterGender]);

  // Memoize table columns để tránh re-render
  const patientColumns = useMemo(() => [
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
  ], []);

  // Memoize table data để tránh re-render
  const tableData = useMemo(() => {
    return getFilteredPatients.map((patient, index) => ({
      key: patient.patientId || index,
      patientId: patient.patientId,
      fullName: patient.fullName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      phoneNumber: patient.phoneNumber,
      email: patient.email,
      address: patient.address,
      isActive: patient.isActive
    }));
  }, [getFilteredPatients]);

  // Callback để handle search input change
  const handleSearchChange = useCallback((e) => {
    setSearchPatient(e.target.value);
  }, []);

  // Callback để handle gender filter change
  const handleGenderChange = useCallback((value) => {
    setFilterGender(value);
  }, []);

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
              })}`}
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
          {getDoctorType() !== 'lab' && (
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
          )}
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
          {getDoctorType() !== 'lab' && (
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
          )}
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
                {getDoctorType() !== 'lab' && (
                  <Col xs={24} sm={12} lg={6}>
                    <Button 
                      icon={<CalendarOutlined />} 
                      block
                      onClick={() => setActiveTab('schedule')}
                    >
                      Xem lịch làm việc
                    </Button>
                  </Col>
                )}
                <Col xs={24} sm={12} lg={6}>
                  <Button 
                    icon={<ExperimentOutlined />} 
                    block
                    onClick={() => setActiveTab('lab')}
                  >
                    Xem kết quả xét nghiệm
                  </Button>
                </Col>
                {getDoctorType() !== 'lab' && (
                  <Col xs={24} sm={12} lg={6}>
                    <Button 
                      icon={<FileTextOutlined />} 
                      block
                      onClick={() => setActiveTab('treatment')}
                    >
                      Tạo quy trình điều trị
                    </Button>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>
        </Row>




      </Spin>
    </div>
  );

  return (
    <Layout className="min-h-screen">
      <Sider width={220} className="fixed left-0 h-screen overflow-y-auto bg-white shadow-sm" theme="light">
        <DoctorSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          availableTabs={getAvailableTabs()}
        />
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
            {activeTab === 'schedule' && getDoctorType() !== 'lab' && <DoctorSchedule />}
            {activeTab === 'patients' && <PatientProfiles />}
            {activeTab === 'lab' && <LabResults />}
            {activeTab === 'treatment' && getDoctorType() !== 'lab' && <TreatmentProtocol />}
            {activeTab === 'profile' && <DoctorProfile />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorDashboard;
