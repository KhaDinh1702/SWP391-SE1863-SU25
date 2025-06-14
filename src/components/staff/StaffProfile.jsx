import { Card, Descriptions, Avatar, Button, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const StaffProfile = ({ staff }) => {
  return (
    <Card
      title="Hồ Sơ Nhân Viên"
      extra={<Button type="primary">Chỉnh sửa</Button>}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Avatar
          size={80}
          icon={<UserOutlined />}
          src={staff?.avatarUrl}
          alt="Staff Avatar"
        />
      </div>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Họ tên">{staff?.fullName || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Email">{staff?.email || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{staff?.phone || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Chức vụ">
          <Tag color="geekblue">Nhân viên</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tham gia">{staff?.joinedDate || 'N/A'}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default StaffProfile; 