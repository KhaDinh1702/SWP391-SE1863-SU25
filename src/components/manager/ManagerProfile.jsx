import { Card, Form, Input, Button, Upload, message, Avatar } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

const ManagerProfile = ({ manager }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // TODO: Implement update profile functionality
      message.success('Cập nhật thông tin thành công');
    } catch (error) {
      message.error('Cập nhật thông tin thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Thông tin cá nhân" className="mb-6">
        <div className="flex items-center justify-center mb-8">
          <Avatar
            size={120}
            src={manager.avatarUrl}
            icon={<UserOutlined />}
            className="bg-blue-500"
          />
          <div className="ml-4">
            <h3 className="text-xl font-semibold">{manager.fullName}</h3>
            <p className="text-gray-500">{manager.role}</p>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            fullName: manager.fullName,
            email: manager.email,
            phone: manager.phone,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
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
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="avatar"
            label="Ảnh đại diện"
          >
            <Upload
              name="avatar"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Đổi mật khẩu" className="mb-6">
        <Form
          layout="vertical"
          onFinish={async (values) => {
            try {
              setLoading(true);
              // TODO: Implement change password functionality
              message.success('Đổi mật khẩu thành công');
            } catch (error) {
              message.error('Đổi mật khẩu thất bại');
            } finally {
              setLoading(false);
            }
          }}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ManagerProfile; 