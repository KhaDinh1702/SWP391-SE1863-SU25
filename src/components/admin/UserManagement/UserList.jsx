import { Table, Button, Tag, Space, Popconfirm, Modal, Descriptions } from 'antd';
import { EditOutlined, StopOutlined, CheckOutlined, UserAddOutlined, InfoCircleOutlined } from '@ant-design/icons';
import EditUserForm from './EditUserForm';
import CreateUserForm from './CreateUserForm';
import { useState } from 'react';

const UserList = ({ users = [], isLoading, onEditUser, onDeactivateUser }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  const handleEdit = (user) => {
    setEditingUser(user);
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
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (gender) => {
        const genderMap = {
          'Male': 'Nam',
          'Female': 'Nữ',
          'Other': 'Khác'
        };
        return genderMap[gender] || gender;
      }
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role) => {
        const color = {
          Admin: 'volcano',
          Manager: 'gold',
          Staff: 'geekblue',
          Doctor: 'green',
          Patient: 'purple',
        }[role] || 'default';
        return <Tag color={color}>{role}</Tag>;
      },
      filters: [
        { text: 'Admin', value: 'Admin' },
        { text: 'Doctor', value: 'Doctor' },
        { text: 'Patient', value: 'Patient' },
      ],
      onFilter: (value, record) => record.role === value,
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
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          {record.isActive && (
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
        >
          Tạo người dùng mới
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
        destroyOnClose
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
        destroyOnClose
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
          <Descriptions bordered column={2}>
            <Descriptions.Item label="ID" span={2}>{viewingUser.id}</Descriptions.Item>
            <Descriptions.Item label="Tên đăng nhập">{viewingUser.username}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{viewingUser.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{viewingUser.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{viewingUser.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>{viewingUser.address || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {viewingUser.gender === 'Male' ? 'Nam' : 
               viewingUser.gender === 'Female' ? 'Nữ' : 
               viewingUser.gender === 'Other' ? 'Khác' : 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">{viewingUser.role}</Descriptions.Item>
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
        )}
      </Modal>
    </>
  );
};

export default UserList;