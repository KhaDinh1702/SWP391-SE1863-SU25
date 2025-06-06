import { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useNavigate } from 'react-router-dom';

import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DoctorList from '../components/admin/DoctorManagement/DoctorList';
import UserList from '../components/admin/UserManagement/UserList';
import AdminProfile from '../components/admin/AdminProfile';
import StatsCards from '../components/admin/DashboardStatus/StatsCards';

import { userService, doctorService } from '../services/api';

const { Content } = Layout;

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

  // Giả định admin info, có thể lấy từ API nếu cần
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

    // Chỉ gọi fetch khi tab users hoặc doctors active
    if (activeTab === 'users' || activeTab === 'doctors') {
      fetchData();
    }
  }, [activeTab]);

  const handleEditDoctor = (doctor) => {
    console.log('Edit doctor:', doctor);
    // Có thể điều hướng đến form chỉnh sửa hoặc mở modal
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
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Layout>
        <AdminHeader onLogout={handleLogout} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {activeTab === 'dashboard' && <StatsCards stats={stats} />}
          {activeTab === 'doctors' && (
            <DoctorList
              doctors={doctors}
              onEdit={handleEditDoctor}
              onDelete={handleDeleteDoctor}
              isLoading={loading}
            />
          )}
          {activeTab === 'users' && <UserList users={users} isLoading={loading} />}
          {activeTab === 'profile' && <AdminProfile admin={admin} />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
