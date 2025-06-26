import React, { useState } from 'react';
import { Form, Input, Select, Button, message, Upload, Avatar } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditUserForm = ({ user, onSave, onCancel, loading }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async (values) => {
    try {
      const formData = { ...values, id: user.id };
      
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
        role: user.role,
        address: user.address,
        gender: user.gender,
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
        name="address"
        label="Địa chỉ"
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Giới tính"
      >
        <Select>
          <Option value="Male">Nam</Option>
          <Option value="Female">Nữ</Option>
          <Option value="Other">Khác</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="role"
        label="Vai trò"
        rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
      >
        <Select>
          <Option value="Patient">Patient</Option>
          <Option value="Staff">Staff</Option>
          <Option value="Doctor">Doctor</Option>
          <Option value="Manager">Manager</Option>
          <Option value="Admin">Admin</Option>
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