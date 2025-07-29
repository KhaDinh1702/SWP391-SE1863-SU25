import { Card, Descriptions, Avatar, Tag, Button } from 'antd';
import { UserOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const AdminProfile = ({ admin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

  console.log('Admin data in profile:', admin); // Debug log

  return (
    <Card
      title="Hồ Sơ Quản Trị"
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Avatar
          size={80}
          icon={<UserOutlined />}
          src={admin?.avatarUrl}
          alt="Admin Avatar"
        />
      </div>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Username">{admin?.username || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Password">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>
              {showPassword ? (admin?.password || 'N/A') : '••••••••'}
            </span>
            <Button
              type="text"
              size="small"
              icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={togglePasswordVisibility}
              style={{ padding: '2px 4px', minWidth: 'auto' }}
            />
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Email">{admin?.email || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Phone Number">{admin?.phoneNumber || admin?.phone || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Role">
          <Tag color={getRoleColor(admin?.role)}>{getRoleName(admin?.role)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {formatDate(admin?.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {formatDate(admin?.updatedAt)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default AdminProfile;
