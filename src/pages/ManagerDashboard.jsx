import { useState, useEffect } from 'react';
import { Layout, Spin, Typography, message, Card, Modal, Row, Col, Statistic, Table, Button, Space, Form, Input, Select, Calendar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  ProfileOutlined,
  CalendarOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined
} from '@ant-design/icons';

import ManagerSidebar from '../components/manager/ManagerSidebar';
import ManagerHeader from '../components/manager/ManagerHeader';
import DoctorList from '../components/manager/DoctorManagement/DoctorList';
import DoctorScheduleList from '../components/manager/DoctorManagement/DoctorScheduleList';
import ManagerProfile from '../components/manager/ManagerProfile';
import StatsCards from '../components/manager/DashboardStatus/StatsCards';
import ARVProtocols from '../components/manager/ARVProtocols';

import { userService } from "../services/userService";
import axios from "axios";
import { doctorService } from "../services/doctorService";
import { authService } from "../services/authService";
import hivLogo from '../assets/hiv.png';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalAppointments: 0,
    totalPatients: 0
  });

  // Manager info
  const [manager, setManager] = useState({
    fullName: 'Manager',
    email: 'manager@example.com',
    phone: '',
    role: 'Manager',
    joinedDate: '',
    avatarUrl: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const userData = await authService.getCurrentUser();
        if (userData.role !== 'Manager') {
          message.error('Bạn không có quyền truy cập trang này');
          navigate('/');
          return;
        }

        setUserRole(userData.role);
        setManager({
          ...manager,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          joinedDate: userData.createdAt,
          avatarUrl: userData.avatarUrl,
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        message.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'dashboard') {
          // Fetch stats
          const doctorData = await doctorService.getAllDoctors();
          // Get paid appointments from backend
          let paidAppointments = [];
          try {
            const res = await axios.get("https://localhost:7040/api/Appointment/get-paid-appointments");
            paidAppointments = Array.isArray(res.data) ? res.data : [];
          } catch (err) {
            console.error('Error fetching paid appointments from backend:', err);
            paidAppointments = [];
          }
          // Get all patients from backend
          let patients = [];
          try {
            const res = await axios.get("https://localhost:7040/api/Patient/get-list-patient");
            patients = Array.isArray(res.data) ? res.data : [];
          } catch (err) {
            console.error('Error fetching patients from backend:', err);
            patients = [];
          }
          setStats({
            totalDoctors: doctorData.length,
            totalAppointments: paidAppointments.length,
            totalPatients: patients.length
          });
        } else if (activeTab === 'doctors') {
          const doctorData = await doctorService.getAllDoctors();
          if (Array.isArray(doctorData)) {
            setDoctors(doctorData);
          } else {
            console.error('Invalid doctors data format:', doctorData);
            message.error('Dữ liệu bác sĩ không hợp lệ');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'dashboard' || activeTab === 'doctors') {
      fetchData();
    }
  }, [activeTab]);

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsEditModalVisible(true);
  };

  const handleSaveDoctor = async (updatedDoctor) => {
    try {
      setLoading(true);
      const mappedDoctor = {
        doctorId: updatedDoctor.doctorId,
        fullName: updatedDoctor.fullName ?? null,
        specialization: updatedDoctor.specialization ?? null,
        qualifications: updatedDoctor.qualifications ?? null,
        experience: updatedDoctor.experience ?? null,
        bio: updatedDoctor.bio ?? null,
        profilePictureURL: updatedDoctor.profilePictureURL ?? null,
        isActive: typeof updatedDoctor.isActive === 'boolean' ? updatedDoctor.isActive : null,
      };
      console.log('Mapped doctor for update:', mappedDoctor);
      await doctorService.updateDoctor(mappedDoctor);
      // Refetch lại danh sách bác sĩ từ backend
      const doctorData = await doctorService.getAllDoctors();
      setDoctors(doctorData);
      message.success('Cập nhật bác sĩ thành công');
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('ManagerDashboard: Update doctor error:', error);
      message.error(`Cập nhật bác sĩ thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bác sĩ này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await doctorService.deleteDoctor(id);
          setDoctors(prev => prev.filter(doc => doc.id !== id));
          message.success('Xóa bác sĩ thành công');
        } catch (error) {
          message.error('Xóa bác sĩ thất bại');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Tổng quan';
      case 'doctors':
        return 'Quản lý Bác sĩ';
      case 'schedules':
        return 'Quản lý Lịch làm việc';
      case 'profile':
        return 'Hồ sơ cá nhân';
      case 'arvProtocols':
        return 'Quản lý phác đồ ARV';
      default:
        return 'Dashboard';
    }
  };

  const getPageIcon = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOutlined className="text-2xl text-blue-600" />;
      case 'doctors':
        return <TeamOutlined className="text-2xl text-green-600" />;
      case 'schedules':
        return <CalendarOutlined className="text-2xl text-orange-600" />;
      case 'profile':
        return <ProfileOutlined className="text-2xl text-purple-600" />;
      case 'arvProtocols':
        return <ProfileOutlined className="text-2xl text-pink-600" />;
      default:
        return <DashboardOutlined className="text-2xl text-blue-600" />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StatsCards stats={stats} />;
      case 'doctors':
        return <DoctorList doctors={doctors} onEdit={handleEditDoctor} onDelete={handleDeleteDoctor} onSave={handleSaveDoctor} isLoading={loading} />;
      case 'schedules':
        return <DoctorScheduleList />;
      case 'profile':
        return <ManagerProfile manager={manager} />;
      case 'arvProtocols':
        return <ARVProtocols />;
      default:
        return <StatsCards stats={stats} />;
    }
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        width={200}
        className="fixed left-0 h-screen overflow-y-auto bg-white shadow-sm"
        theme="light"
      >
        <div className="p-4 flex items-center gap-2">
          <img src={hivLogo} alt="Manager Logo" className="w-8 h-8 rounded-lg object-cover" />
          <span className="text-lg font-semibold">Manager Panel</span>
        </div>
        
        <div className="px-4 pb-1 text-gray-400 text-sm">MENU CHÍNH</div>
        
        <ManagerSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      </Sider>

      <Layout className="ml-[10px]">
        <ManagerHeader manager={manager} />
        <Content className="bg-gray-50 p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              {getPageIcon()}
              <Title level={2} className="!mb-0">{getPageTitle()}</Title>
            </div>
            <Text type="secondary">
              {activeTab === 'dashboard' && 'Tổng quan về hoạt động của phòng khám'}
              {activeTab === 'doctors' && 'Quản lý thông tin và lịch làm việc của bác sĩ'}
              {activeTab === 'schedules' && 'Xem và quản lý lịch làm việc của bác sĩ'}
              {activeTab === 'profile' && 'Thông tin cá nhân của quản lý'}
            </Text>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spin size="large" />
              </div>
            ) : (
              <>
                {/* Custom dashboard card styling for dashboard tab, without revenue */}
                {activeTab === 'dashboard' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center py-6 border-0" style={{ borderColor: 'transparent' }}>
                      <TeamOutlined style={{ fontSize: 36, color: '#22c55e' }} />
                      <div className="mt-2 text-lg text-gray-500">Tổng số bác sĩ</div>
                      <div className="mt-1 text-2xl font-bold text-green-600">{stats.totalDoctors}</div>
                    </Card>
                    <Card className="rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center py-6 border-0" style={{ borderColor: 'transparent' }}>
                      <CalendarOutlined style={{ fontSize: 36, color: '#2563eb' }} />
                      <div className="mt-2 text-lg text-gray-500">Tổng số lịch hẹn</div>
                      <div className="mt-1 text-2xl font-bold text-blue-600">{stats.totalAppointments}</div>
                    </Card>
                    <Card className="rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center py-6 border-0" style={{ borderColor: 'transparent' }}>
                      <ProfileOutlined style={{ fontSize: 36, color: '#a21caf' }} />
                      <div className="mt-2 text-lg text-gray-500">Tổng số bệnh nhân</div>
                      <div className="mt-1 text-2xl font-bold text-purple-600">{stats.totalPatients}</div>
                    </Card>
                  </div>
                ) : (
                  renderContent()
                )}
              </>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerDashboard; 