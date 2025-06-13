import { useState, useEffect } from 'react';
import { Layout, Input, Typography, message, Card, Row, Col, Avatar, Statistic, Button, Table, Modal, Form, Select, Tag, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  DashboardOutlined,
  UsergroupAddOutlined,
  LogoutOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  BarChartOutlined,
  StopOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { userService } from "../services/userService";
import { authService } from "../services/authService";

import UserList from '../components/admin/UserManagement/UserList';
import StatsCards from '../components/admin/DashboardStatus/StatsCards';
import ReportsGenerator from '../components/admin/DashboardStatus/ReportsGenerator';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminProfile from '../components/admin/AdminProfile';
import hivLogo from '../assets/hiv.png';

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const [adminData, setAdminData] = useState(null);

  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0
  });

  // Add function to calculate statistics
  const calculateStatistics = (users) => {
    console.log('Calculating statistics for users:', users);
    
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.isActive).length,
      inactiveUsers: users.filter(user => !user.isActive).length
    };

    console.log('Calculated statistics:', stats);
    setStatistics(stats);
  };

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Get user data from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.log('No userId found in localStorage');
          navigate('/login');
          return;
        }
        
        // Fetch admin data using the userId
        const adminData = await userService.getUserById(userId);
        console.log('Fetched admin data:', adminData);
        setAdminData(adminData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        message.error('Không thể tải thông tin admin');
      }
    };

    fetchAdminData();
  }, [navigate]);

  // Update useEffect to fetch data immediately and when activeTab changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        console.log('Fetched users:', data);
        setUsers(data);
        calculateStatistics(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        message.error('Lỗi khi tải danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // User management functions
  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditUser = async (values) => {
    try {
      await userService.updateUser(values);
      const updatedUsers = await userService.getAllUsers();
      setUsers(updatedUsers);
      calculateStatistics(updatedUsers);
    } catch (error) {
      throw error;
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await userService.inactiveUser(userId);
      const updatedUsers = await userService.getAllUsers();
      setUsers(updatedUsers);
      calculateStatistics(updatedUsers);
    } catch (error) {
      throw error;
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await userService.updateUser({
          id: editingUser.id,
          ...values
        });
        message.success('Cập nhật người dùng thành công');
      } else {
        // For new user, generate username from email
        const username = values.email.split('@')[0];
        await userService.createUserByAdmin({
          ...values,
          username: username
        });
        message.success('Thêm người dùng thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
      // Refresh the user list
      const newUsers = await userService.getAllUsers();
      setUsers(newUsers);
    } catch (error) {
      console.error('Error details:', error);
      message.error(error.message || 'Lỗi khi lưu thông tin người dùng');
    }
  };

  // If no admin data, show nothing (will redirect to login)
  if (!adminData) {
    return null;
  }

  return (
    <Layout className="min-h-screen">
      <Sider
        width={200}
        className="fixed left-0 h-screen overflow-y-auto bg-white shadow-sm"
        theme="light"
      >
        <div className="p-4 flex items-center gap-2">
          <img src={hivLogo} alt="Admin Logo" className="w-8 h-8 rounded-lg object-cover" />
          <span className="text-lg font-semibold">Admin Panel</span>
        </div>
        
        <div className="px-4 pb-1 text-gray-400 text-sm">MENU CHÍNH</div>
        
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      </Sider>

      <Layout className="ml-[10px] p-0">
        <Content className="bg-gray-50">
          {activeTab === 'users' && (
            <UserList
              users={users}
              isLoading={loading}
              onEditUser={handleEditUser}
              onDeactivateUser={handleDeactivateUser}
            />
          )}

          {activeTab === 'dashboard' && (
            <>
              <StatsCards stats={statistics} />
              <div className="mt-4">
                <ReportsGenerator data={users} />
              </div>
            </>
          )}

          {activeTab === 'profile' && (
            <div className="p-6">
              <AdminProfile admin={adminData} />
            </div>
          )}
        </Content>
      </Layout>

      {/* User Modal */}
      <Modal
        title={editingUser ? "Sửa Người dùng" : "Thêm Người dùng"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingUser(null);
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            gender: 'Male' // Set default gender
          }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select>
              <Select.Option value="Manager">Quản lý</Select.Option>
              <Select.Option value="Doctor">Bác sĩ</Select.Option>
              <Select.Option value="Patient">Bệnh nhân</Select.Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
              >
                <Select>
                  <Select.Option value="Male">Nam</Select.Option>
                  <Select.Option value="Female">Nữ</Select.Option>
                  <Select.Option value="Other">Khác</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              {!editingUser && (
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              )}
            </Col>
          </Row>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminDashboard;