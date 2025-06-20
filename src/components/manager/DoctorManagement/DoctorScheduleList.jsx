import React, { useState, useEffect } from 'react';
import { Table, Tag, message } from 'antd';
import { doctorService } from '../../../services/doctorService';
import { appointmentService } from '../../../services/appointmentService';
import DoctorScheduleForm from './DoctorScheduleForm';
import dayjs from 'dayjs';

const DoctorScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState({});
  const [appointments, setAppointments] = useState({});

  useEffect(() => {
    fetchSchedules();
    fetchDoctors();
    fetchAppointments();
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
  const fetchAppointments = async () => {
    try {
      const appointmentsList = await appointmentService.getAllAppointments();
      console.log('Fetched appointments for list:', appointmentsList);
      console.log('Sample appointment structure for list:', appointmentsList[0]);
      const appointmentsMap = {};
      appointmentsList.forEach(appointment => {
        appointmentsMap[appointment.id] = appointment;
      });
      setAppointments(appointmentsMap);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error('Không thể lấy danh sách cuộc hẹn');
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
  const getAppointmentInfo = (appointmentId) => {
    if (!appointmentId) return null;
    const appointment = appointments[appointmentId];
    if (!appointment) return { loading: true };
    
    return {
      patientName: appointment.patientName || 
                  appointment.PatientName ||
                  appointment.patient?.fullName || 
                  appointment.patient?.name || 
                  'Chưa có tên',
      appointmentDate: appointment.appointmentStartDate || 
                      appointment.AppointmentStartDate ||
                      appointment.appointmentDate ? 
                      new Date(appointment.appointmentStartDate || 
                              appointment.AppointmentStartDate || 
                              appointment.appointmentDate).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Chưa có ngày'
    };
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
    },    {
      title: 'Cuộc hẹn',
      dataIndex: 'appointmentId',
      key: 'appointmentId',
      render: (appointmentId) => {
        const appointmentInfo = getAppointmentInfo(appointmentId);
        
        if (!appointmentId) {
          return <div className="text-gray-400 text-sm">Không có cuộc hẹn</div>;
        }
        
        if (appointmentInfo?.loading) {
          return <div className="text-gray-500 text-sm">Đang tải...</div>;
        }
        
        return (
          <div className="text-sm">
            <div className="font-medium text-blue-600">
              {appointmentInfo.patientName}
            </div>
            <div className="text-gray-500">
              📅 {appointmentInfo.appointmentDate}
            </div>
            <div className="text-gray-400 text-xs">
              ID: {appointmentId.substring(0, 8)}...
            </div>
          </div>
        );
      },
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
        <DoctorScheduleForm onSuccess={() => {
          fetchSchedules();
          fetchAppointments();
        }} />
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