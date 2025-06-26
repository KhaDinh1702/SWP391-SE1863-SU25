import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { userService } from '../../../services/userService';

const { Option } = Select;

const CreateUserForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await userService.createUserByAdmin(values);
      message.success('Tạo tài khoản thành công!');
      onSuccess?.(); // callback để reload list
    } catch (error) {
      message.error(error.message || 'Tạo tài khoản thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish} className="mb-8">
      <Form.Item 
        name="username" 
        label="Tên đăng nhập" 
        rules={[
          { required: true, message: 'Vui lòng nhập tên đăng nhập' },
          { min: 3, max: 50, message: 'Tên đăng nhập phải có từ 3-50 ký tự' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item 
        name="fullName" 
        label="Họ tên" 
        rules={[
          { required: false, message: 'Vui lòng nhập họ tên' },
          { max: 100, message: 'Họ tên không được vượt quá 100 ký tự' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item 
        name="email" 
        label="Email" 
        rules={[
          { required: true, message: 'Vui lòng nhập email' },
          { type: 'email', message: 'Email không hợp lệ' },
          { max: 100, message: 'Email không được vượt quá 100 ký tự' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item 
        name="phoneNumber" 
        label="Số điện thoại"
        rules={[
          { max: 20, message: 'Số điện thoại không được vượt quá 20 ký tự' },
          { pattern: /^[0-9+\-\s()]+$/, message: 'Số điện thoại chỉ được chứa số, +, -, khoảng trắng và dấu ngoặc' }
        ]}
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
        name="password" 
        label="Mật khẩu" 
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu' },
          { min: 6, max: 255, message: 'Mật khẩu phải có từ 6-255 ký tự' }
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item 
        name="role" 
        label="Vai trò" 
        rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
      >
        <Select>
          <Option value="Admin">Admin</Option>
          <Option value="Manager">Quản lý</Option>
          <Option value="Doctor">Bác sĩ</Option>
          <Option value="Staff">Nhân viên</Option>
          <Option value="Patient">Bệnh nhân</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Tạo tài khoản
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateUserForm;
