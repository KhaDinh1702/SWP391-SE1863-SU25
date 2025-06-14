import { useEffect, useState } from 'react';
import { Table, Tag, message } from 'antd';

const StaffDoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5275/api/DoctorSchedule/get-list-doctor-schedule', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Không thể lấy lịch làm việc bác sĩ');
      const data = await response.json();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      message.error(err.message || 'Lỗi khi tải lịch làm việc');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Bác sĩ',
      dataIndex: 'doctorName',
      key: 'doctorName',
      render: (text, record) => text || record.doctorName || record.Doctor?.fullName || 'N/A',
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text, record) => new Date(text || record.startTime || record.StartTime).toLocaleString('vi-VN'),
    },
    {
      title: 'Kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text, record) => new Date(text || record.endTime || record.EndTime).toLocaleString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable) => (
        <Tag color={isAvailable ? 'green' : 'red'}>
          {isAvailable ? 'Trống' : 'Không trống'}
        </Tag>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={schedules}
      rowKey={record => record.id || record.Id}
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default StaffDoctorSchedule; 