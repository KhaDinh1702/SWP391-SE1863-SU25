import React, { useEffect, useState } from 'react';
import { Descriptions, Spin, Button } from 'antd';
import { userService } from '../../../services/api';

const UserProfile = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await userService.getUserById(userId);
      setUser(res);
    };
    fetchUser();
  }, [userId]);

  if (!user) return <Spin tip="Đang tải thông tin..." />;

  return (
    <div>
      <Descriptions title="Thông tin người dùng" bordered column={1}>
        <Descriptions.Item label="Họ tên">{user.fullName}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="SĐT">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="Vai trò">{user.role}</Descriptions.Item>
        <Descriptions.Item label="Ngày tham gia">{user.joinedDate}</Descriptions.Item>
      </Descriptions>
      <div className="text-right mt-4">
        <Button onClick={onClose}>Đóng</Button>
      </div>
    </div>
  );
};

export default UserProfile;
