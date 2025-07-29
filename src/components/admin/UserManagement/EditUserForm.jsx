import React, { useState } from 'react';
import { Form, Input, Select, Button, message, Upload, Avatar } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const roleMap = {
  Patient: 0,
  Staff: 1,
  Doctor: 2,
  Manager: 3,
  Admin: 4,
};

const EditUserForm = ({ user, onSave, onCancel, loading }) => {
  console.log('EditUserForm user:', user); // Debug log
  console.log('EditUserForm user.fullName:', user.fullName);
  console.log('EditUserForm user fields:', Object.keys(user)); // See all available fields
  console.log('EditUserForm all user values:', user); // See all values
  console.log('EditUserForm user.patient:', user.patient); // Check patient object
  console.log('EditUserForm user.doctor:', user.doctor); // Check doctor object
  console.log('EditUserForm user.userId:', user.userId);
  console.log('EditUserForm user.id:', user.id);
  console.log('EditUserForm user.userID:', user.userID);
  console.log('EditUserForm user.UserId:', user.UserId);
  console.log('EditUserForm FINAL ID to use:', user.id || user.userId || user.userID || user.UserId);
  
  // Try to get fullName from nested objects
  const getFullName = () => {
    if (user.fullName) return user.fullName;
    if (user.patient?.fullName) return user.patient.fullName;
    if (user.doctor?.fullName) return user.doctor.fullName;
    if (user.patient?.name) return user.patient.name;
    if (user.doctor?.name) return user.doctor.name;
    if (user.name) return user.name;
    return '';
  };
  
  console.log('EditUserForm calculated fullName:', getFullName());
  
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async (values) => {
    // Try multiple possible ID field names, prioritize 'id' since that's the primary key in User entity
    const userIdValue = user.id || user.userId || user.userID || user.UserId;
    console.log('EditUserForm - user object:', user);
    console.log('EditUserForm - userIdValue:', userIdValue, typeof userIdValue);
    console.log('EditUserForm - form values:', values);
    
    if (!userIdValue || userIdValue === '00000000-0000-0000-0000-000000000000') {
      console.error('Invalid or missing UserId:', userIdValue);
      message.error('Không tìm thấy UserId hợp lệ!');
      return;
    }
    
    try {
      // Create the data object with the correct field names
      const formData = { 
        ...values, 
        UserId: userIdValue,  // Backend expects UserId
        userId: userIdValue,  // Include both for compatibility
        id: userIdValue
      };
      
      console.log('EditUserForm - final formData:', formData);
      
      // Add avatar file if selected
      if (fileList.length > 0) {
        formData.avatarPicture = fileList[0].originFileObj;
      }
      
      await onSave(formData);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('Cập nhật thất bại: ' + error.message);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ có thể upload file ảnh!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
      return false;
    }
    return false; // Prevent auto upload
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: typeof user.role === 'string' ? roleMap[user.role] : user.role,
        fullName: getFullName(), // Use the helper function
      }}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="username"
        label="Tên đăng nhập"
        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
      >
        <Input disabled />
      </Form.Item>

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
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="role"
        label="Vai trò"
        rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
      >
        <Select>
          <Option value={0}>Patient</Option>
          <Option value={1}>Staff</Option>
          <Option value={2}>Doctor</Option>
          <Option value={3}>Manager</Option>
          <Option value={4}>Admin</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="fullName"
        label="Họ tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Ảnh đại diện"
      >
        <div style={{ marginBottom: 16 }}>
          <Avatar 
            size={64} 
            src={user.profilePictureURL || user.avatarUrl} 
            icon={<UserOutlined />}
            style={{ objectFit: 'cover' }}
          />
          <span style={{ marginLeft: 12, color: '#666' }}>Ảnh hiện tại</span>
        </div>
        <Upload
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={beforeUpload}
          accept="image/*"
          maxCount={1}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Thay đổi ảnh đại diện</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="password"
        label="Mật khẩu mới"
        rules={[
          { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
        ]}
      >
        <Input.Password placeholder="Để trống nếu không muốn thay đổi" />
      </Form.Item>

      <Form.Item className="mb-0 text-right">
        <Button onClick={onCancel} className="mr-2">
          Hủy
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export default EditUserForm;