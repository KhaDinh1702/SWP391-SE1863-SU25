import { useState, useEffect } from 'react';
import { Layout, Spin, Avatar, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DoctorList from '../components/admin/DoctorManagement/DoctorList';
import UserList from '../components/admin/UserManagement/UserList';
import AdminProfile from '../components/admin/AdminProfile';
import StatsCards from '../components/admin/DashboardStatus/StatsCards';

import { userService, doctorService, authService } from '../services/api';

const { Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('');

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
          activeAppointments: 0, // You'll need to implement this
          completedTreatments: 0, // You'll need to implement this
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
          setDoctors(doctorData);
        }
      } catch (error) {
        message.error('Lỗi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'users' || activeTab === 'doctors') {
      fetchData();
    }
  }, [activeTab]);

  const handleEditDoctor = (doctor) => {
    // Implement doctor edit functionality
    console.log('Edit doctor:', doctor);
  };

  const handleDeleteDoctor = async (id) => {
    try {
      setLoading(true);
      await doctorService.deleteDoctor(id);
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
      message.success('Xoá bác sĩ thành công');
    } catch (error) {
      message.error('Xoá bác sĩ thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (id) => {
    navigate(`/admin/users/${id}`);
  };

  const handleEditUser = async (user) => {
    try {
      setLoading(true);
      await userService.updateUser(user);
      message.success('Cập nhật người dùng thành công');
      // Refresh user list
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
      <div className="flex justify-center items-center h-screen">
        <Typography.Title level={2}>
          Bạn không có quyền truy cập trang này
        </Typography.Title>
      </div>
    );
  }

  return (
    <Layout className="min-h-screen">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Layout className="bg-gray-100">
        <AdminHeader onLogout={handleLogout} />

        <Content className="m-6 p-6 bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!m-0">
                {activeTab === 'dashboard'
                  ? 'Dashboard Tổng quan'
                  : activeTab === 'doctors'
                  ? 'Quản lý Bác sĩ'
                  : activeTab === 'users'
                  ? 'Quản lý Người dùng'
                  : 'Hồ sơ Admin'}
              </Title>
              <Text type="secondary">Chào mừng trở lại, {admin.fullName}!</Text>
            </div>
            <div className="flex items-center gap-4">
              <Avatar
                size={48}
                icon={<UserOutlined />}
                src={admin.avatarUrl || null}
              />
              <div className="hidden md:block">
                <Text strong>{admin.fullName}</Text>
                <br />
                <Text type="secondary">{admin.email}</Text>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <StatsCards stats={stats} />}
              {activeTab === 'doctors' && (
                <DoctorList
                  doctors={doctors}
                  onEdit={handleEditDoctor}
                  onDelete={handleDeleteDoctor}
                  isLoading={loading}
                />
              )}
              {activeTab === 'users' && (
                <UserList
                  users={users}
                  isLoading={loading}
                  onViewUser={handleViewUser}
                  onEditUser={handleEditUser}
                  onDeactivateUser={handleDeactivateUser}
                />
              )}
              {activeTab === 'profile' && <AdminProfile admin={admin} />}
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;