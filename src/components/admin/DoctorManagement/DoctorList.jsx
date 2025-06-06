import { Table, Button, Space } from 'antd';

const DoctorList = ({ doctors, onEdit, onDelete, isLoading }) => {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Specialization', dataIndex: 'specialization', key: 'specialization' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => onEdit(record)}>Edit</Button>
          <Button danger onClick={() => onDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={doctors}
      loading={isLoading}
      rowKey="id"
    />
  );
};

export default DoctorList;