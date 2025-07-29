import { Card, Descriptions, Avatar, Tag, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';

const StaffProfile = ({ staff }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        
        if (userId) {
          const userResponse = await userService.getUserById(userId);
          setUserData(userResponse);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Sử dụng dữ liệu từ API hoặc fallback
  const displayData = userData || {
    username: localStorage.getItem('username') || 'staff1',
    role: localStorage.getItem('role') || 'Staff',
    email: 'Đang tải...',
    phoneNumber: 'Đang tải...',
    createdAt: new Date().toISOString(),
    isActive: true
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Convert role number to role name
  const getRoleName = (role) => {
    if (typeof role === 'string') return role; // If already string, return as is
    
    switch (role) {
      case 0:
      case '0':
        return 'Patient';
      case 1:
      case '1':
        return 'Doctor';
      case 2:
      case '2':
        return 'Staff';
      case 3:
      case '3':
        return 'Manager';
      case 4:
      case '4':
        return 'Admin';
      default:
        return 'Unknown';
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    const roleName = getRoleName(role);
    switch (roleName) {
      case 'Admin':
        return 'red';
      case 'Manager':
        return 'purple';
      case 'Doctor':
        return 'blue';
      case 'Staff':
        return 'green';
      case 'Patient':
        return 'orange';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải thông tin...</div>
      </div>
    );
  }

  return (
    <Card
      title="Hồ Sơ Nhân Viên"
      style={{ maxWidth: 800, margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Avatar
          size={100}
          icon={<UserOutlined />}
          src={displayData?.profilePictureURL}
          alt="Staff Avatar"
        />
      </div>
      <Descriptions 
        column={2} 
        bordered
        size="large"
        styles={{
          label: { 
            fontWeight: 'bold', 
            backgroundColor: '#fafafa',
            width: '30%'
          },
          content: {
            fontSize: '16px',
            padding: '12px 16px'
          }
        }}
      >
        <Descriptions.Item label="Email" span={2}>
          {displayData?.email || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {displayData?.phoneNumber || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Chức vụ">
          <Tag color={getRoleColor(displayData?.role)} style={{ fontSize: '14px', padding: '4px 8px' }}>
            {getRoleName(displayData?.role)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo" span={2}>
          {formatDate(displayData?.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái" span={2}>
          <Tag 
            color={displayData?.isActive !== false ? 'green' : 'red'} 
            style={{ fontSize: '14px', padding: '4px 8px' }}
          >
            {displayData?.isActive !== false ? 'Hoạt động' : 'Không hoạt động'}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default StaffProfile; 