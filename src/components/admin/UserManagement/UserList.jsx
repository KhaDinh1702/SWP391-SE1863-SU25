import { Table, Button, Tag, Space, Popconfirm, Modal, Descriptions, Avatar } from 'antd';
import { EditOutlined, StopOutlined, CheckOutlined, UserAddOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import EditUserForm from './EditUserForm';
import CreateUserForm from './CreateUserForm';
import { useState } from 'react';

const UserList = ({ users = [], isLoading, onEditUser, onDeactivateUser }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  const getRoleText = (roleNumber) => {
    const roleMap = {
      0: 'Patient',
      1: 'Staff',
      2: 'Doctor',
      3: 'Manager',
      4: 'Admin'
    };
    return roleMap[roleNumber] || 'Unknown';
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user, userId: user.userId || user.id });
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const handleSave = async (values) => {
    setEditLoading(true);
    try {
      await onEditUser(values);
      setEditingUser(null);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalVisible(false);
    // Refresh the user list
    window.location.reload();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => text || record.username,
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 120,
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'profilePictureURL',
      key: 'avatar',
      width: 100,
      render: (url, record) => (
        <Avatar 
          size={40} 
          src={url || record.avatarUrl} 
          icon={<UserOutlined />}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role) => {
        const roleText = getRoleText(role);
        const color = {
          Admin: 'volcano',
          Manager: 'gold',
          Staff: 'geekblue',
          Doctor: 'green',
          Patient: 'purple',
        }[roleText] || 'default';
        return <Tag color={color}>{roleText}</Tag>;
      },
      filters: [
        { text: 'Admin', value: 4 },
        { text: 'Manager', value: 3 },
        { text: 'Staff', value: 1 },
        { text: 'Doctor', value: 2 },
        { text: 'Patient', value: 0 },
      ],
      onFilter: (value, record) => record.role === value,
      sorter: (a, b) => a.role - b.role,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive) =>
        isActive ? (
          <Tag color="green" icon={<CheckOutlined />}>
            Hoạt động
          </Tag>
        ) : (
          <Tag color="red" icon={<StopOutlined />}>
            Vô hiệu
          </Tag>
        ),
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Vô hiệu', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => setViewingUser(record)}
            size="small"
          />
          {/* Chỉ cho phép edit nếu không phải admin khác, hoặc là chính mình */}
          {(record.role !== 4 || record.username === localStorage.getItem('username')) && (
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          )}
          {record.isActive && record.username !== localStorage.getItem('username') && record.role !== 4 && (
            <Popconfirm
              title="Vô hiệu hóa người dùng này?"
              onConfirm={() => onDeactivateUser(record.id)}
              okText="Vô hiệu"
              cancelText="Hủy"
            >
              <Button icon={<StopOutlined />} danger size="small" />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setIsCreateModalVisible(true)}
          size="large"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
          style={{
            borderRadius: '8px',
            padding: '0 24px',
            height: '40px',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          <span>Tạo người dùng mới</span>
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={isLoading}
        rowKey="id"
        size="small"
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `Tổng ${total} người dùng`,
        }}
      />

      <Modal
        title="Chỉnh sửa người dùng"
        open={!!editingUser}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden
      >
        {editingUser && (
          <EditUserForm
            user={editingUser}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={editLoading}
          />
        )}
      </Modal>

      <Modal
        title="Tạo người dùng mới"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
        destroyOnHidden
        width={600}
      >
        <CreateUserForm onSuccess={handleCreateSuccess} />
      </Modal>

      <Modal
        title="Thông tin chi tiết người dùng"
        open={!!viewingUser}
        onCancel={() => setViewingUser(null)}
        footer={[
          <Button key="close" onClick={() => setViewingUser(null)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {viewingUser && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Avatar 
                size={80} 
                src={viewingUser.profilePictureURL || viewingUser.avatarUrl} 
                icon={<UserOutlined />}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="ID" span={2}>{viewingUser.id}</Descriptions.Item>
              <Descriptions.Item label="Tên đăng nhập">{viewingUser.username}</Descriptions.Item>
              <Descriptions.Item label="Họ tên">
                {viewingUser.fullName ||
                 viewingUser.patient?.fullName ||
                 viewingUser.doctor?.fullName ||
                 viewingUser.patient?.name ||
                 viewingUser.doctor?.name ||
                 viewingUser.name ||
                 viewingUser.username ||
                 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{viewingUser.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{viewingUser.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>{viewingUser.address || 'Chưa cập nhật'}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {viewingUser.gender === 'Male' ? 'Nam' : 
                 viewingUser.gender === 'Female' ? 'Nữ' : 
                 viewingUser.gender === 'Other' ? 'Khác' : 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">{getRoleText(viewingUser.role)}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {viewingUser.isActive ? (
                  <Tag color="green">Hoạt động</Tag>
                ) : (
                  <Tag color="red">Vô hiệu</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{formatDate(viewingUser.createdDate)}</Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">{formatDate(viewingUser.updatedDate)}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </>
  );
};

export default UserList;