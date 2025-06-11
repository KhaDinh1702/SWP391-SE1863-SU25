import { Table, Button, Space, Image } from 'antd';

const DoctorList = ({ doctors, onEdit, onDelete, isLoading }) => {
  const columns = [
    { 
      title: 'Profile Picture',
      dataIndex: 'profilePictureURL',
      key: 'profilePictureURL',
      render: (url) => url ? <Image src={url} width={50} height={50} style={{ objectFit: 'cover' }} /> : 'No image'
    },
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Specializations', dataIndex: 'specializations', key: 'specializations' },
    { title: 'Qualification', dataIndex: 'qualification', key: 'qualification' },
    { 
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      render: (exp) => `${exp} years`
    },
    {
      title: 'Bio',
      dataIndex: 'bio',
      key: 'bio',
      ellipsis: true,
      width: 200
    },
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
      scroll={{ x: true }}
    />
  );
};

export default DoctorList;