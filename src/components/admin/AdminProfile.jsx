import { Card, Descriptions, Avatar, Button, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const AdminProfile = ({ admin }) => {
  return (
    <Card
      title="Hồ Sơ Quản Trị"
      extra={<Button type="primary">Chỉnh sửa</Button>}
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
        <Descriptions.Item label="Họ tên">{admin?.fullName || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Email">{admin?.email || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{admin?.phone || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Chức vụ">
          <Tag color="red">Quản trị viên</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tham gia">{admin?.joinedDate || 'N/A'}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default AdminProfile;
