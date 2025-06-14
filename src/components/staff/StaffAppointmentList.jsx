import { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, Modal, message } from 'antd';
import { appointmentService } from '../../services/appointmentService';

const StaffAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getAllAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      message.error(err.message || 'Lỗi khi tải lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = (record) => {
    Modal.confirm({
      title: 'Xác nhận lịch hẹn',
      content: 'Bạn có chắc chắn muốn xác nhận lịch hẹn này?',
      onOk: async () => {
        try {
          await appointmentService.staffManageAppointment({
            appointmentId: record.id || record.Id,
            newStatus: 1, // 1 = Confirmed
          });
          message.success('Đã xác nhận lịch hẹn');
          fetchAppointments();
        } catch (err) {
          message.error(err.message || 'Lỗi khi xác nhận');
        }
      },
    });
  };

  const handleCancel = (record) => {
    Modal.confirm({
      title: 'Hủy lịch hẹn',
      content: 'Bạn có chắc chắn muốn hủy lịch hẹn này?',
      onOk: async () => {
        try {
          await appointmentService.staffManageAppointment({
            appointmentId: record.id || record.Id,
            newStatus: 3, // 3 = Cancelled
          });
          message.success('Đã hủy lịch hẹn');
          fetchAppointments();
        } catch (err) {
          message.error(err.message || 'Lỗi khi hủy');
        }
      },
    });
  };

  const handleReschedule = (record) => {
    message.info('Chức năng sắp xếp lại lịch hẹn đang phát triển');
  };

  const columns = [
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientFullName',
      key: 'patientFullName',
      render: (text, record) => text || record.PatientFullName || 'N/A',
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctorFullName',
      key: 'doctorFullName',
      render: (text, record) => text || record.DoctorFullName || 'N/A',
    },
    {
      title: 'Thời gian',
      dataIndex: 'appointmentStartDate',
      key: 'appointmentStartDate',
      render: (text, record) => new Date(text || record.AppointmentStartDate).toLocaleString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default', label = 'Không rõ';
        switch (status) {
          case 0:
          case 'Pending': color = 'orange'; label = 'Chờ xác nhận'; break;
          case 1:
          case 'Confirmed': color = 'green'; label = 'Đã xác nhận'; break;
          case 2:
          case 'Completed': color = 'blue'; label = 'Đã hoàn thành'; break;
          case 3:
          case 'Cancelled': color = 'red'; label = 'Đã hủy'; break;
          default: break;
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleConfirm(record)} size="small">Xác nhận</Button>
          <Button danger onClick={() => handleCancel(record)} size="small">Hủy</Button>
          <Button onClick={() => handleReschedule(record)} size="small">Sắp xếp lại</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={appointments}
      rowKey={record => record.id || record.Id}
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default StaffAppointmentList; 