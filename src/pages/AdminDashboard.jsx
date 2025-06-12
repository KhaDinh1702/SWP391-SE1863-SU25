import { useState, useEffect } from 'react';
import { Layout, Spin, Avatar, Typography, message, Card, Modal, Row, Col, Statistic, Table, Button, Space, Form, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, DashboardOutlined, TeamOutlined, UserSwitchOutlined, ProfileOutlined, MedicineBoxOutlined, CalendarOutlined } from '@ant-design/icons';

import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DoctorList from '../components/admin/DoctorManagement/DoctorList';
import UserList from '../components/admin/UserManagement/UserList';
import AdminProfile from '../components/admin/AdminProfile';
import StatsCards from '../components/admin/DashboardStatus/StatsCards';
import EditDoctorModal from '../components/admin/DoctorManagement/EditDoctorModal';
import DoctorForm from '../components/admin/DoctorManagement/DoctorForm';

import { userService } from "../services/userService";
import { doctorService } from "../services/doctorService";
import { authService } from "../services/authService";

const { Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Admin info
  const [admin, setAdmin] = useState({
    fullName: 'Admin hệ thống',
    email: 'admin@example.com',
    phone: '',
    role: 'Admin',
    joinedDate: '',
    avatarUrl: '',
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    activeAppointments: 0,
    completedTreatments: 0,
  });

  useEffect(() => {
    // Check authentication and role
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        navigate('/login');
        return;
      }
      
      const currentUser = authService.getCurrentUser();
      setUserRole(currentUser.role);
      
      if (currentUser.role !== 'Admin') {
        message.warning('Bạn không có quyền truy cập trang này');
        navigate('/');
      }
    };

    checkAuth();
    
    const fetchStatsAndAdmin = async () => {
      try {
        setLoading(true);
        
        // Fetch admin profile
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          const adminInfo = await userService.getUserById(currentUser.userId);
          setAdmin({
            ...admin,
            fullName: adminInfo.fullName || adminInfo.username,
            email: adminInfo.email,
            phone: adminInfo.phoneNumber,
            joinedDate: adminInfo.createdDate,
          });
        }

        // Fetch stats
        const userData = await userService.getAllUsers();
        const doctorData = await doctorService.getAllDoctors();
        
        setStats({
          totalUsers: userData.length,
          newUsers: userData.filter(u => 
            new Date(u.createdDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ).length,
          activeAppointments: 0,
          completedTreatments: 0,
        });
      } catch (error) {
        message.error('Lỗi tải dữ liệu thống kê/admin.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatsAndAdmin();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'users') {
          const userData = await userService.getAllUsers();
          setUsers(userData);
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
        message.error(error.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'users' || activeTab === 'doctors') {
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
      await doctorService.updateDoctor(updatedDoctor);
      setDoctors(prev => prev.map(doc => 
        doc.id === updatedDoctor.id ? updatedDoctor : doc
      ));
      message.success('Cập nhật bác sĩ thành công');
      setIsEditModalVisible(false);
    } catch (error) {
      message.error('Cập nhật bác sĩ thất bại');
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

  const handleViewUser = (id) => {
    navigate(`/admin/users/${id}`);
  };

  const handleEditUser = async (user) => {
    try {
      setLoading(true);
      await userService.updateUser(user);
      message.success('Cập nhật người dùng thành công');
      const userData = await userService.getAllUsers();
      setUsers(userData);
    } catch (error) {
      message.error('Cập nhật người dùng thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (id) => {
    try {
      setLoading(true);
      await userService.inactiveUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isActive: false } : u))
      );
      message.success('Vô hiệu hóa người dùng thành công');
    } catch (error) {
      message.error('Vô hiệu hóa người dùng thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (userRole && userRole !== 'Admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="shadow-lg border-0">
          <Typography.Title level={2} className="text-center text-gray-700">
            Bạn không có quyền truy cập trang này
          </Typography.Title>
        </Card>
      </div>
    );
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Tổng quan';
      case 'doctors':
        return 'Quản lý Bác sĩ';
      case 'users':
        return 'Quản lý Người dùng';
      case 'profile':
        return 'Hồ sơ Admin';
      default:
        return '';
    }
  };

  const getPageIcon = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOutlined className="text-2xl text-blue-600" />;
      case 'doctors':
        return <TeamOutlined className="text-2xl text-green-600" />;
      case 'users':
        return <UserSwitchOutlined className="text-2xl text-purple-600" />;
      case 'profile':
        return <ProfileOutlined className="text-2xl text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Layout className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <AdminHeader onLogout={handleLogout} />

        <Content className="m-6 p-6">
          <Card className="shadow-lg border-0 rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                {getPageIcon()}
                <div>
                  <Title level={4} className="!m-0 !text-xl sm:!text-2xl text-gray-800">
                    {getPageTitle()}
                  </Title>
                  <Text type="secondary" className="text-sm">
                    Chào mừng trở lại, {admin.fullName}!
                  </Text>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm">
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  src={admin.avatarUrl || null}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500"
                />
                <div>
                  <Text strong className="text-sm text-gray-800">
                    {admin.fullName}
                  </Text>
                  <br />
                  <Text type="secondary" className="text-xs">
                    {admin.email}
                  </Text>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Spin size="large" tip="Đang tải dữ liệu..." fullscreen />
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4">
                {activeTab === 'dashboard' && (
                  <div className="scale-95 sm:scale-100">
                    <StatsCards stats={stats} />
                  </div>
                )}
                {activeTab === 'doctors' && (
                  <div className="overflow-x-auto">
                    <DoctorList
                      doctors={doctors}
                      onEdit={handleEditDoctor}
                      onDelete={handleDeleteDoctor}
                      isLoading={loading}
                    />
                  </div>
                )}
                {activeTab === 'users' && (
                  <div className="overflow-x-auto">
                    <UserList
                      users={users}
                      isLoading={loading}
                      onViewUser={handleViewUser}
                      onEditUser={handleEditUser}
                      onDeactivateUser={handleDeactivateUser}
                    />
                  </div>
                )}
                {activeTab === 'profile' && <AdminProfile admin={admin} />}
              </div>
            )}
          </Card>
        </Content>
      </Layout>
      <EditDoctorModal
        visible={isEditModalVisible}
        doctor={selectedDoctor}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedDoctor(null);
        }}
        onSave={handleSaveDoctor}
      />
    </Layout>
  );
};

export default AdminDashboard;