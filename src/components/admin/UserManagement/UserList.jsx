import { Table, Button, Tag, Space, Popconfirm, message } from 'antd';
import { EyeOutlined, EditOutlined, StopOutlined, CheckOutlined } from '@ant-design/icons';

const UserList = ({ users = [], isLoading, onViewUser, onEditUser, onDeactivateUser }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => text || record.username,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
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
      render: (isActive) =>
        isActive ? (
          <Tag color="green" icon={<CheckOutlined />}>
            Hoạt động
          </Tag>
        ) : (
          <Tag color="red" icon={<StopOutlined />}>
            Đã vô hiệu
          </Tag>
        ),
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Vô hiệu', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => onViewUser(record.id)}
          >
            Chi tiết
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEditUser(record)}
          >
            Sửa
          </Button>
          {record.isActive && (
            <Popconfirm
              title="Bạn chắc chắn muốn vô hiệu hóa người dùng này?"
              onConfirm={() => onDeactivateUser(record.id)}
              okText="Vô hiệu"
              cancelText="Hủy"
            >
              <Button icon={<StopOutlined />} danger>
                Vô hiệu
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users || []}
      loading={isLoading}
      rowKey="id"
      scroll={{ x: 1300 }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: (total) => `Tổng ${total} người dùng`,
      }}
    />
  );
};

export default UserList;