import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, message } from 'antd';
import { doctorService } from '../../../services/doctorService';
import DoctorScheduleForm from './DoctorScheduleForm';
import dayjs from 'dayjs';

const DoctorScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState({});

  useEffect(() => {
    fetchSchedules();
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const doctorsList = await doctorService.getAllDoctors();
      const doctorsMap = {};
      doctorsList.forEach(doctor => {
        doctorsMap[doctor.id] = doctor;
      });
      setDoctors(doctorsMap);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      message.error('Không thể lấy danh sách bác sĩ');
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5275/api/DoctorSchedule/get-list-doctor-schedule', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể lấy danh sách lịch làm việc');
      }

      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      message.error('Không thể lấy danh sách lịch làm việc');
    } finally {
      setLoading(false);
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors[doctorId];
    if (!doctor) return 'Đang tải...';
    return doctor.fullName || doctor.FullName || doctor.fullname || doctor.name || 'Không có tên';
  };

  const getDoctorSpecialization = (doctorId) => {
    const doctor = doctors[doctorId];
    if (!doctor) return '';
    return doctor.specialization || doctor.Specialization || '';
  };

  const formatDateTime = (dateTimeStr) => {
    return dayjs(dateTimeStr).format('DD/MM/YYYY HH:mm');
  };

  const columns = [
    {
      title: 'Bác sĩ',
      dataIndex: 'doctorId',
      key: 'doctorId',
      render: (doctorId) => (
        <div>
          <div className="font-medium">{getDoctorName(doctorId)}</div>
          <div className="text-sm text-gray-500">{getDoctorSpecialization(doctorId)}</div>
        </div>
      ),
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (startTime) => formatDateTime(startTime),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (endTime) => formatDateTime(endTime),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable) => (
        <Tag color={isAvailable ? 'green' : 'red'}>
          {isAvailable ? 'Có sẵn' : 'Đã đặt'}
        </Tag>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes) => notes || 'Không có ghi chú',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý lịch làm việc bác sĩ</h2>
        <DoctorScheduleForm onSuccess={fetchSchedules} />
      </div>
      
      <Table
        columns={columns}
        dataSource={schedules}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} lịch làm việc`,
        }}
      />
    </div>
  );
};

export default DoctorScheduleList; 