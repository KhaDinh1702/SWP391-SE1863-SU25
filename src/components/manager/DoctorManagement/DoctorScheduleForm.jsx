import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, TimePicker, Button, message, Modal, Space, Table, Tag, Tooltip } from 'antd';
import { doctorService } from '../../../services/doctorService';
import { appointmentService } from '../../../services/appointmentService';
import { doctorScheduleService } from '../../../services/doctorScheduleService';
import dayjs from 'dayjs';
import axios from 'axios';
import PropTypes from 'prop-types';

const { TextArea } = Input;

const DoctorScheduleForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isOverviewModalVisible, setIsOverviewModalVisible] = useState(false);
  const [isPaidAppointmentsModalVisible, setIsPaidAppointmentsModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [paidAppointments, setPaidAppointments] = useState([]);

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
    fetchSchedules();
  }, []);
  const fetchDoctors = async () => {
    try {
      const doctorsList = await doctorService.getAllDoctors();
      console.log('Fetched doctors:', doctorsList);
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      message.error('Không thể lấy danh sách bác sĩ');
    }
  };
  const fetchAppointments = async () => {
    try {
      const appointmentsList = await appointmentService.getAllAppointments();
      console.log('Fetched appointments:', appointmentsList);
      setAppointments(appointmentsList);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error('Không thể lấy danh sách cuộc hẹn');
    }
  };

  const fetchSchedules = async () => {
    try {
      const schedulesList = await doctorScheduleService.getAllDoctorSchedules();
      console.log('Fetched schedules:', schedulesList);
      setSchedules(schedulesList);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      message.error('Không thể lấy danh sách lịch làm việc');
    }
  };

  const fetchPaidAppointments = async () => {
    try {
      // Call a specific API endpoint for paid appointments
      const response = await axios.get('http://localhost:5275/api/Appointment/get-paid-appointments');
      const paidAppointments = response.data;
      
      console.log('Fetched paid appointments:', paidAppointments);
      setPaidAppointments(paidAppointments);
    } catch (error) {
      console.error('Error fetching paid appointments:', error);
      if (error.response?.status === 404) {
        // If endpoint doesn't exist, fallback to filtering all appointments
        console.log('Paid appointments endpoint not found, falling back to filtering all appointments...');
        await fetchPaidAppointmentsFallback();
      } else {
        message.error('Không thể lấy danh sách cuộc hẹn đã thanh toán');
      }
    }
  };

  const fetchPaidAppointmentsFallback = async () => {
    try {
      // Fallback: Filter from all appointments
      const allAppointments = await appointmentService.getAllAppointments();
      console.log('All appointments (fallback):', allAppointments);
      
      // Filter paid appointments
      const paid = allAppointments.filter(appointment => {
        // Check various possible payment status fields
        const paymentStatus = appointment.paymentStatus || 
                            appointment.PaymentStatus || 
                            appointment.payment?.status ||
                            appointment.Payment?.Status;
        
        const appointmentStatus = appointment.status || 
                                appointment.Status ||
                                appointment.appointmentStatus ||
                                appointment.AppointmentStatus;
        
        // Consider appointment as paid if:
        // 1. Payment status is completed/success
        // 2. Or appointment status indicates payment completion
        const isPaid = paymentStatus === 'Completed' || 
                      paymentStatus === 'Success' || 
                      paymentStatus === 'COMPLETED' ||
                      paymentStatus === 'SUCCESS' ||
                      paymentStatus === 'Paid' ||
                      paymentStatus === 'PAID' ||
                      appointmentStatus === 'Confirmed' ||
                      appointmentStatus === 'CONFIRMED' ||
                      appointmentStatus === 'Paid' ||
                      appointmentStatus === 'PAID';
        
        return isPaid;
      });
      
      console.log('Filtered paid appointments (fallback):', paid);
      setPaidAppointments(paid);
    } catch (error) {
      console.error('Error in fallback method:', error);
      message.error('Không thể lấy danh sách cuộc hẹn đã thanh toán');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const startDateTime = dayjs(values.startDate)
        .hour(dayjs(values.startTime).hour())
        .minute(dayjs(values.startTime).minute())
        .second(0)
        .millisecond(0);
      
      const endDateTime = dayjs(values.endDate)
        .hour(dayjs(values.endTime).hour())
        .minute(dayjs(values.endTime).minute())
        .second(0)
        .millisecond(0);

      // Create a single schedule without appointments (doctors work schedule)
      const scheduleData = {
        doctorId: values.doctorId,
        appointmentId: null,
        startTime: startDateTime.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: endDateTime.format('YYYY-MM-DDTHH:mm:ss'),
        notes: values.notes || "",
        isAvailable: true
      };

      console.log('Creating doctor schedule with data:', scheduleData);
      await axios.post('http://localhost:5275/api/DoctorSchedule/create-doctor-schedule', scheduleData);
      message.success('Tạo lịch làm việc thành công');

      form.resetFields();
      fetchSchedules(); // Refresh schedules list
      onSuccess();
    } catch (error) {
      console.error('Error creating schedule:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        message.error(error.response.data.message || 'Có lỗi xảy ra khi tạo lịch làm việc');
      } else {
        message.error('Có lỗi xảy ra khi tạo lịch làm việc');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      setUpdateLoading(true);

      const startDateTime = dayjs(values.startDate)
        .hour(dayjs(values.startTime).hour())
        .minute(dayjs(values.startTime).minute())
        .second(0)
        .millisecond(0);
      
      const endDateTime = dayjs(values.endDate)
        .hour(dayjs(values.endTime).hour())
        .minute(dayjs(values.endTime).minute())
        .second(0)
        .millisecond(0);

      // Update the doctor schedule
      const updateData = {
        id: selectedSchedule.id,
        doctorId: values.doctorId,
        appointmentId: null, // Doctor schedules don't have specific appointments
        startTime: startDateTime.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: endDateTime.format('YYYY-MM-DDTHH:mm:ss'),
        notes: values.notes || "",
        isAvailable: values.isAvailable
      };

      console.log('Updating doctor schedule with data:', updateData);
      await axios.put('http://localhost:5275/api/DoctorSchedule/update-doctor-schedule', updateData);
      message.success('Cập nhật lịch làm việc thành công');

      updateForm.resetFields();
      setIsUpdateModalVisible(false);
      setSelectedSchedule(null);
      fetchSchedules(); // Refresh schedules list
      onSuccess();
    } catch (error) {
      console.error('Error updating schedule:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        message.error(error.response.data.message || 'Có lỗi xảy ra khi cập nhật lịch làm việc');
      } else {
        message.error('Có lỗi xảy ra khi cập nhật lịch làm việc');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const showOverviewModal = () => {
    fetchSchedules(); // Refresh data
    setIsOverviewModalVisible(true);
  };

  const showPaidAppointmentsModal = () => {
    fetchPaidAppointments(); // Refresh data
    setIsPaidAppointmentsModalVisible(true);
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const showUpdateModal = () => {
    setIsUpdateModalVisible(true);
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    setSelectedSchedule(null);
  };

  const handleScheduleSelect = (scheduleId) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
      setSelectedSchedule(schedule);
      updateForm.setFieldsValue({
        doctorId: schedule.doctorId,
        startDate: dayjs(schedule.startTime),
        startTime: dayjs(schedule.startTime),
        endDate: dayjs(schedule.endTime),
        endTime: dayjs(schedule.endTime),
        notes: schedule.notes,
        isAvailable: schedule.isAvailable
      });
      showUpdateModal();
    }
  };

  return (
    <>
      <Space>
        <Button type="primary" onClick={showCreateModal}>
          Tạo lịch làm việc
        </Button>
        <Button type="default" onClick={showUpdateModal}>
          Cập nhật lịch làm việc
        </Button>
        <Button type="dashed" onClick={showOverviewModal}>
          Xem tổng quan
        </Button>
        <Button type="primary" ghost onClick={showPaidAppointmentsModal}>
          Cuộc hẹn đã thanh toán
        </Button>
      </Space>

      {/* Create Schedule Modal */}
      <Modal
        title="Tạo lịch làm việc cho bác sĩ"
        open={isCreateModalVisible}
        onCancel={handleCreateCancel}
        footer={null}
        width={600}
      >
        <div style={{ 
          background: '#e6f7ff', 
          border: '1px solid #91d5ff', 
          borderRadius: '6px', 
          padding: '12px', 
          marginBottom: '16px' 
        }}>
          <div style={{ fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }}>
            📋 Hướng dẫn tạo lịch làm việc
          </div>
          <div style={{ fontSize: '13px', color: '#0050b3' }}>
            • Tạo lịch làm việc cho bác sĩ trước khi bệnh nhân đặt lịch hẹn<br/>
            • Lịch hẹn của bệnh nhân sẽ được check trùng với lịch làm việc này<br/>
            • Chỉ những lịch hẹn trùng thời gian làm việc mới được phép khám
          </div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            startDate: dayjs(),
            endDate: dayjs(),
            startTime: dayjs().hour(8).minute(0),
            endTime: dayjs().hour(17).minute(0),
          }}
        >          <Form.Item
            name="doctorId"
            label="Chọn bác sĩ"
            rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}
          >
            <Select placeholder="Chọn bác sĩ">
              {doctors.map(doctor => (
                <Select.Option key={doctor.id} value={doctor.id}>
                  {doctor.fullName || doctor.FullName || doctor.fullname || doctor.name || 'Không có tên'} - {doctor.specialization || doctor.Specialization || 'Chưa cập nhật chuyên khoa'}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>              {appointments.map(appointment => {
                const appointmentDate = appointment.appointmentStartDate || 
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
                  }) : 'Chưa có ngày';
                
                const appointmentTitle = appointment.appointmentTitle || 
                                       appointment.AppointmentTitle ||
                                       appointment.title ||
                                       appointment.Title ||
                                       'Khám bệnh';
                
                const patientName = appointment.patientName || 
                                  appointment.PatientName ||
                                  appointment.patient?.fullName || 
                                  appointment.patient?.FullName ||
                                  appointment.patient?.name || 
                                  appointment.patient?.Name ||
                                  appointment.user?.fullName ||
                                  appointment.user?.FullName ||
                                  appointment.user?.name ||
                                  appointment.User?.fullName ||
                                  appointment.User?.FullName ||
                                  appointment.User?.name ||
                                  appointment.fullName ||
                                  appointment.FullName ||
                                  appointment.name ||
                                  'Bệnh nhân (ẩn danh)';
                
                return (
                  <Select.Option key={appointment.id} value={appointment.id}>
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        color: '#1890ff', 
                        fontSize: '14px',
                        marginBottom: '4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {appointmentTitle}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#333', 
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '2px'
                      }}>
                        <span style={{ marginRight: '4px' }}>👤</span>
                        <span style={{ 
                          flex: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {patientName}
                        </span>
                        {patientName === 'Bệnh nhân (ẩn danh)' && 
                          <span style={{ 
                            fontSize: '10px', 
                            color: '#ff7875', 
                            marginLeft: '4px',
                            flexShrink: 0
                          }}>
                            (ẩn danh)
                          </span>
                        }
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#666',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>📅 {appointmentDate}</span>
                        <span style={{ color: '#999' }}>
                          ID: {appointment.id.substring(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </Select.Option>
                );
              })}
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
          >
            <DatePicker 
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              disabledDate={current => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Giờ bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
          >
            <TimePicker 
              format="HH:mm"
              style={{ width: '100%' }}
              minuteStep={15}
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="Ngày kết thúc"
            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
          >
            <DatePicker 
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              disabledDate={current => {
                const startDate = form.getFieldValue('startDate');
                return current && (current < dayjs().startOf('day') || (startDate && current < startDate));
              }}
            />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="Giờ kết thúc"
            rules={[
              { required: true, message: 'Vui lòng chọn giờ kết thúc' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue('startTime') || value.isAfter(getFieldValue('startTime'))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Giờ kết thúc phải sau giờ bắt đầu'));
                },
              }),
            ]}
          >
            <TimePicker 
              format="HH:mm"
              style={{ width: '100%' }}
              minuteStep={15}
            />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea rows={4} placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Tạo lịch làm việc
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Schedule Modal */}
      <Modal
        title="Cập nhật lịch làm việc"
        open={isUpdateModalVisible}
        onCancel={handleUpdateCancel}
        footer={null}
        width={700}
      >
        {!selectedSchedule ? (
          <div>
            <Form.Item label="Chọn lịch làm việc để cập nhật">
              <Select
                placeholder="Chọn lịch làm việc"
                showSearch
                style={{ width: '100%' }}
                onChange={handleScheduleSelect}
                filterOption={(input, option) => {
                  const searchText = input.toLowerCase();
                  const scheduleData = schedules.find(s => s.id === option.value);
                  if (!scheduleData) return false;
                  
                  const doctorName = (doctors.find(d => d.id === scheduleData.doctorId)?.fullName || 
                                   doctors.find(d => d.id === scheduleData.doctorId)?.FullName || '').toLowerCase();
                  const notes = (scheduleData.notes || '').toLowerCase();
                  
                  return doctorName.includes(searchText) || notes.includes(searchText);
                }}
              >
                {schedules.map(schedule => {
                  const doctor = doctors.find(d => d.id === schedule.doctorId);
                  const doctorName = doctor?.fullName || doctor?.FullName || 'Bác sĩ không xác định';
                  const startTime = dayjs(schedule.startTime).format('DD/MM/YYYY HH:mm');
                  const endTime = dayjs(schedule.endTime).format('DD/MM/YYYY HH:mm');
                  
                  // Count schedules with same doctor and time
                  const sameTimeSchedules = schedules.filter(s => 
                    s.doctorId === schedule.doctorId &&
                    dayjs(s.startTime).isSame(dayjs(schedule.startTime), 'minute') &&
                    dayjs(s.endTime).isSame(dayjs(schedule.endTime), 'minute')
                  );
                  
                  return (
                    <Select.Option key={schedule.id} value={schedule.id}>
                      <div style={{ padding: '4px 0' }}>
                        <div style={{ 
                          fontWeight: 'bold', 
                          color: '#1890ff', 
                          marginBottom: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span>{doctorName}</span>
                          {sameTimeSchedules.length > 1 && (
                            <Tag size="small" color="orange">
                              {sameTimeSchedules.length} lịch cùng giờ
                            </Tag>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                          📅 {startTime} - {endTime}
                        </div>
                        <div style={{ fontSize: '11px', color: '#999' }}>
                          Trạng thái: {schedule.isAvailable ? '✅ Sẵn sàng' : '❌ Bận'}
                          {schedule.notes && ` | Ghi chú: ${schedule.notes}`}
                        </div>
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <div style={{ 
              background: '#fff7e6', 
              border: '1px solid #ffd591', 
              borderRadius: '6px', 
              padding: '12px', 
              marginTop: '12px' 
            }}>
              <div style={{ fontWeight: 'bold', color: '#d46b08', marginBottom: '4px' }}>
                💡 Mẹo:
              </div>
              <div style={{ fontSize: '13px', color: '#ad6800' }}>
                • Chọn một lịch làm việc từ danh sách trên để cập nhật<br/>
                • Các lịch có cùng thời gian sẽ được đánh dấu "X lịch cùng giờ"<br/>
                • Cập nhật thông tin ca làm việc của bác sĩ
              </div>
            </div>
          </div>
        ) : (
          <Form
            form={updateForm}
            layout="vertical"
            onFinish={handleUpdate}
          >
            <Form.Item
              name="doctorId"
              label="Chọn bác sĩ"
              rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}
            >
              <Select placeholder="Chọn bác sĩ">
                {doctors.map(doctor => (
                  <Select.Option key={doctor.id} value={doctor.id}>
                    {doctor.fullName || doctor.FullName || doctor.fullname || doctor.name || 'Không có tên'} - {doctor.specialization || doctor.Specialization || 'Chưa cập nhật chuyên khoa'}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
            >
              <DatePicker 
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                disabledDate={current => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item
              name="startTime"
              label="Giờ bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
            >
              <TimePicker 
                format="HH:mm"
                style={{ width: '100%' }}
                minuteStep={15}
              />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
            >
              <DatePicker 
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                disabledDate={current => {
                  const startDate = updateForm.getFieldValue('startDate');
                  return current && (current < dayjs().startOf('day') || (startDate && current < startDate));
                }}
              />
            </Form.Item>

            <Form.Item
              name="endTime"
              label="Giờ kết thúc"
              rules={[
                { required: true, message: 'Vui lòng chọn giờ kết thúc' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || !getFieldValue('startTime') || value.isAfter(getFieldValue('startTime'))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Giờ kết thúc phải sau giờ bắt đầu'));
                  },
                }),
              ]}
            >
              <TimePicker 
                format="HH:mm"
                style={{ width: '100%' }}
                minuteStep={15}
              />
            </Form.Item>

            <Form.Item
              name="isAvailable"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Select.Option value={true}>Sẵn sàng</Select.Option>
                <Select.Option value={false}>Bận</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="notes"
              label="Ghi chú"
            >
              <TextArea rows={4} placeholder="Nhập ghi chú (nếu có)" />
            </Form.Item>

            <Form.Item>
              <div style={{ 
                background: '#f6ffed', 
                border: '1px solid #b7eb8f', 
                borderRadius: '6px', 
                padding: '12px', 
                marginBottom: '16px' 
              }}>
                <div style={{ fontWeight: 'bold', color: '#389e0d', marginBottom: '4px' }}>
                  💡 Lưu ý khi cập nhật lịch làm việc:
                </div>
                <div style={{ fontSize: '13px', color: '#52c41a' }}>
                  • Cập nhật thời gian làm việc của bác sĩ<br/>
                  • Lịch hẹn của bệnh nhân sẽ được check với lịch làm việc này<br/>
                  • Thay đổi trạng thái "Sẵn sàng" hoặc "Bận" để quản lý ca làm việc
                </div>
              </div>
              <Space>
                <Button onClick={() => setSelectedSchedule(null)}>
                  Chọn lịch khác
                </Button>
                <Button type="primary" htmlType="submit" loading={updateLoading}>
                  Cập nhật lịch làm việc
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Overview Modal */}
      <Modal
        title="Tổng quan lịch làm việc bác sĩ"
        open={isOverviewModalVisible}
        onCancel={() => setIsOverviewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsOverviewModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={1200}
      >
        <div>
          <Table
            dataSource={schedules.map(schedule => {
              const doctor = doctors.find(d => d.id === schedule.doctorId);
              
              return {
                key: schedule.id,
                doctor: doctor?.fullName || doctor?.FullName || 'Bác sĩ không xác định',
                doctorSpecialization: doctor?.specialization || doctor?.Specialization || 'Chưa cập nhật',
                startTime: dayjs(schedule.startTime).format('DD/MM/YYYY HH:mm'),
                endTime: dayjs(schedule.endTime).format('DD/MM/YYYY HH:mm'),
                isAvailable: schedule.isAvailable,
                notes: schedule.notes
              };
            })}
            columns={[
              {
                title: 'Bác sĩ',
                dataIndex: 'doctor',
                key: 'doctor',
                render: (text, record) => (
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{text}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {record.doctorSpecialization}
                    </div>
                  </div>
                ),
                width: 200,
              },
              {
                title: 'Thời gian bắt đầu',
                dataIndex: 'startTime',
                key: 'startTime',
                render: (startTime) => (
                  <div style={{ fontSize: '13px' }}>
                    📅 {startTime}
                  </div>
                ),
                width: 160,
              },
              {
                title: 'Thời gian kết thúc',
                dataIndex: 'endTime',
                key: 'endTime',
                render: (endTime) => (
                  <div style={{ fontSize: '13px' }}>
                    ⏰ {endTime}
                  </div>
                ),
                width: 160,
              },
              {
                title: 'Trạng thái',
                dataIndex: 'isAvailable',
                key: 'isAvailable',
                render: (isAvailable) => (
                  <Tag color={isAvailable ? 'green' : 'red'}>
                    {isAvailable ? '✅ Sẵn sàng' : '❌ Bận'}
                  </Tag>
                ),
                width: 120,
              },
              {
                title: 'Ghi chú',
                dataIndex: 'notes',
                key: 'notes',
                render: (notes) => (
                  notes ? (
                    <Tooltip title={notes}>
                      <div style={{ 
                        maxWidth: '150px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {notes}
                      </div>
                    </Tooltip>
                  ) : <span style={{ color: '#ccc' }}>Không có</span>
                ),
                width: 150,
              }
            ]}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} lịch làm việc`,
            }}
            scroll={{ y: 400 }}
            size="small"
          />
        </div>
      </Modal>

      {/* Paid Appointments Modal */}
      <Modal
        title="Cuộc hẹn đã thanh toán"
        open={isPaidAppointmentsModalVisible}
        onCancel={() => setIsPaidAppointmentsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsPaidAppointmentsModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={1400}
      >
        <div>
          <div style={{ 
            background: '#e6f7ff', 
            border: '1px solid #91d5ff', 
            borderRadius: '6px', 
            padding: '12px', 
            marginBottom: '16px' 
          }}>
            <div style={{ fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }}>
              📋 Thông tin cuộc hẹn đã thanh toán
            </div>
            <div style={{ fontSize: '13px', color: '#0050b3' }}>
              • Danh sách tất cả các cuộc hẹn đã được thanh toán thành công<br/>
              • Kiểm tra cuộc hẹn có trùng với lịch làm việc của bác sĩ không<br/>
              • Chỉ những cuộc hẹn trong thời gian làm việc mới được phép khám
            </div>
          </div>
          
          <Table
            dataSource={paidAppointments.map(appointment => {
              const doctor = doctors.find(d => d.id === appointment.doctorId || d.id === appointment.DoctorId);
              
              const appointmentDate = appointment.appointmentStartDate || 
                                    appointment.AppointmentStartDate ||
                                    appointment.appointmentDate;
              
              return {
                key: appointment.id,
                appointmentId: appointment.id,
                appointmentTitle: appointment.appointmentTitle || 
                                appointment.AppointmentTitle ||
                                appointment.title ||
                                appointment.Title ||
                                'Khám bệnh',
                patientName: appointment.patientName || 
                           appointment.PatientName ||
                           appointment.patient?.fullName || 
                           appointment.patient?.FullName ||
                           appointment.user?.fullName ||
                           appointment.user?.FullName ||
                           appointment.fullName ||
                           appointment.FullName ||
                           'Bệnh nhân',
                doctorName: doctor?.fullName || doctor?.FullName || 'Chưa xác định bác sĩ',
                doctorSpecialization: doctor?.specialization || doctor?.Specialization || 'Chưa cập nhật',
                appointmentDate: appointmentDate ? dayjs(appointmentDate).format('DD/MM/YYYY HH:mm') : 'Chưa có ngày',
                appointmentTime: appointmentDate ? dayjs(appointmentDate).format('HH:mm') : '-',
                paymentStatus: appointment.paymentStatus || 
                             appointment.PaymentStatus || 
                             appointment.payment?.status ||
                             'Đã thanh toán',
                appointmentStatus: appointment.status || 
                                 appointment.Status ||
                                 appointment.appointmentStatus ||
                                 appointment.AppointmentStatus ||
                                 'Đã xác nhận',
                appointmentObject: appointment
              };
            })}
            columns={[
              {
                title: 'Thông tin cuộc hẹn',
                key: 'appointmentInfo',
                render: (text, record) => (
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }}>
                      {record.appointmentTitle}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                      👤 {record.patientName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#999' }}>
                      ID: {record.appointmentId.substring(0, 8)}...
                    </div>
                  </div>
                ),
                width: 200,
              },
              {
                title: 'Bác sĩ',
                key: 'doctor',
                render: (text, record) => (
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{record.doctorName}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {record.doctorSpecialization}
                    </div>
                  </div>
                ),
                width: 180,
              },
              {
                title: 'Thời gian hẹn',
                key: 'appointmentTime',
                render: (text, record) => (
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>
                      📅 {record.appointmentDate}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      ⏰ {record.appointmentTime}
                    </div>
                  </div>
                ),
                width: 150,
              },
              {
                title: 'Trạng thái thanh toán',
                dataIndex: 'paymentStatus',
                key: 'paymentStatus',
                render: (status) => (
                  <Tag color="green">
                    💳 {status || 'Đã thanh toán'}
                  </Tag>
                ),
                width: 130,
              },
              {
                title: 'Trạng thái cuộc hẹn',
                dataIndex: 'appointmentStatus',
                key: 'appointmentStatus',
                render: (status) => (
                  <Tag color="blue">
                    {status || 'Đã xác nhận'}
                  </Tag>
                ),
                width: 130,
              },
              {
                title: 'Lịch làm việc bác sĩ',
                key: 'schedule',
                render: (text, record) => {
                  // Check if this appointment time overlaps with any doctor schedule
                  const appointmentTime = dayjs(record.appointmentObject.appointmentStartDate);
                  const overlappingSchedule = schedules.find(schedule => {
                    const scheduleStart = dayjs(schedule.startTime);
                    const scheduleEnd = dayjs(schedule.endTime);
                    const sameDoctor = schedule.doctorId === (record.appointmentObject.doctorId || record.appointmentObject.DoctorId);
                    
                    return sameDoctor && 
                           appointmentTime.isAfter(scheduleStart) && 
                           appointmentTime.isBefore(scheduleEnd);
                  });
                  
                  return (
                    <div>
                      {overlappingSchedule ? (
                        <div>
                          <Tag color="green">✅ Trong lịch làm việc</Tag>
                          <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                            Ca: {dayjs(overlappingSchedule.startTime).format('HH:mm')} - {dayjs(overlappingSchedule.endTime).format('HH:mm')}
                          </div>
                        </div>
                      ) : (
                        <Tag color="red">❌ Ngoài lịch làm việc</Tag>
                      )}
                    </div>
                  );
                },
                width: 150,
              },
              {
                title: 'Thao tác',
                key: 'actions',
                render: (text, record) => (
                  <Space direction="vertical" size="small">
                    <Button 
                      size="small" 
                      type="default"
                      onClick={() => {
                        // Show appointment details
                        Modal.info({
                          title: 'Chi tiết cuộc hẹn',
                          content: (
                            <div>
                              <p><strong>Tiêu đề:</strong> {record.appointmentTitle}</p>
                              <p><strong>Bệnh nhân:</strong> {record.patientName}</p>
                              <p><strong>Bác sĩ:</strong> {record.doctorName}</p>
                              <p><strong>Thời gian:</strong> {record.appointmentDate}</p>
                              <p><strong>Trạng thái thanh toán:</strong> {record.paymentStatus}</p>
                              <p><strong>Trạng thái cuộc hẹn:</strong> {record.appointmentStatus}</p>
                            </div>
                          ),
                          width: 500,
                        });
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </Space>
                ),
                width: 120,
              }
            ]}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} cuộc hẹn đã thanh toán`,
            }}
            scroll={{ y: 400 }}
            size="small"
            summary={(pageData) => {
              const totalAppointments = pageData.length;
              const inWorkingHours = pageData.filter(item => {
                const appointmentTime = dayjs(item.appointmentObject.appointmentStartDate);
                return schedules.some(schedule => {
                  const scheduleStart = dayjs(schedule.startTime);
                  const scheduleEnd = dayjs(schedule.endTime);
                  const sameDoctor = schedule.doctorId === (item.appointmentObject.doctorId || item.appointmentObject.DoctorId);
                  
                  return sameDoctor && 
                         appointmentTime.isAfter(scheduleStart) && 
                         appointmentTime.isBefore(scheduleEnd);
                });
              }).length;
              const outsideWorkingHours = totalAppointments - inWorkingHours;
              
              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={7}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-around',
                      padding: '8px',
                      background: '#fafafa',
                      fontWeight: 'bold'
                    }}>
                      <span>Tổng: {totalAppointments} cuộc hẹn đã thanh toán</span>
                      <span style={{ color: '#52c41a' }}>Trong lịch làm việc: {inWorkingHours}</span>
                      <span style={{ color: '#ff7875' }}>Ngoài lịch làm việc: {outsideWorkingHours}</span>
                    </div>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
          />
        </div>
      </Modal>
    </>
  );
};

DoctorScheduleForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default DoctorScheduleForm;