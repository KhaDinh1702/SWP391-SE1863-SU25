import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { userService } from '../../../services/api';

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
      message.error('Tạo tài khoản thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish} className="mb-8">
      <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Số điện thoại">
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
        <Select>
          <Option value="Doctor">Bác sĩ</Option>
          <Option value="Staff">Nhân viên</Option>
          <Option value="Manager">Quản lý</Option>
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
