import { Table, Tag, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const AppointmentHistory = ({ appointments, onExport }) => {
  const columns = [
    {
      title: 'Mã Cuộc Hẹn',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ngày Hẹn',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Bác Sĩ',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={
          status === 'completed' ? 'green' : 
          status === 'cancelled' ? 'red' : 'orange'
        }>
          {status === 'completed' ? 'Hoàn thành' : 
           status === 'cancelled' ? 'Đã hủy' : 'Đang chờ'}
        </Tag>
      )
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={onExport}
        >
          Xuất Excel
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={appointments} 
        rowKey="id"
      />
    </div>
  );
};

export default AppointmentHistory;