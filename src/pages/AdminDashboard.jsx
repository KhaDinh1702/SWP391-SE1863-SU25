import { useState, useEffect } from 'react';
import { Layout, Spin, Avatar, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DoctorList from '../components/admin/DoctorManagement/DoctorList';
import UserList from '../components/admin/UserManagement/UserList';
import AdminProfile from '../components/admin/AdminProfile';
import StatsCards from '../components/admin/DashboardStatus/StatsCards';

import { userService, doctorService } from '../services/api';

const { Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const stats = {
    totalUsers: 1245,
    newUsers: 12,
    activeAppointments: 56,
    completedTreatments: 342,
  };

  const admin = {
    fullName: 'Nguyễn Văn Quản Trị',
    email: 'admin@example.com',
    phone: '0901234567',
    role: 'Admin',
    joinedDate: '2024-01-15',
    avatarUrl: '',
  };

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
        console.error('Lỗi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'users' || activeTab === 'doctors') {
      fetchData();
    }
  }, [activeTab]);

  const handleEditDoctor = (doctor) => {
    console.log('Edit doctor:', doctor);
  };

  const handleDeleteDoctor = async (id) => {
    try {
      setLoading(true);
      await doctorService.deleteDoctor(id);
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error('Xoá bác sĩ thất bại:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

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
                <UserList users={users} isLoading={loading} />
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
