import { Table, Tag, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const UserList = ({ users, loading, onSearch, onViewProfile }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai Trò',
      dataIndex: 'role',
      key: 'role',
      render: role => <Tag color={role === 'Admin' ? 'red' : 'blue'}>{role}</Tag>
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => onViewProfile(record.id)}>
          Xem Hồ Sơ
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm người dùng..."
          prefix={<SearchOutlined />}
          onChange={e => onSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <Table 
        columns={columns} 
        dataSource={users} 
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default UserList;