import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';

const { Option } = Select;

const EditUserForm = ({ user, onSave, onCancel, loading }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      await onSave({
        ...values,
        id: user.id,
      });
      form.resetFields();
    } catch (error) {
      message.error('Cập nhật thất bại: ' + error.message);
    }
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

export default EditUserForm; 