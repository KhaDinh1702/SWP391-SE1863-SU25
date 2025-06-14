import { Card, Descriptions, Avatar, Button, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const ManagerProfile = ({ manager }) => {
  return (
    <Card
      title="Hồ Sơ Quản Lý"
      extra={<Button type="primary">Chỉnh sửa</Button>}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Avatar
          size={80}
          icon={<UserOutlined />}
          src={manager?.avatarUrl}
          alt="Manager Avatar"
        />
      </div>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Họ tên">{manager?.fullName || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Email">{manager?.email || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{manager?.phone || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Chức vụ">
          <Tag color="gold">Quản lý</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tham gia">{manager?.joinedDate || 'N/A'}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ManagerProfile; 