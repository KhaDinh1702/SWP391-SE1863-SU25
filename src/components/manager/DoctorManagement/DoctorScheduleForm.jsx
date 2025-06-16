import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, TimePicker, Button, message, Modal } from 'antd';
import { doctorService } from '../../../services/doctorService';
import dayjs from 'dayjs';
import axios from 'axios';

const { TextArea } = Input;

const DoctorScheduleForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchDoctors();
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

      const scheduleData = {
        doctorId: values.doctorId,
        appointmentId: "",
        startTime: startDateTime.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: endDateTime.format('YYYY-MM-DDTHH:mm:ss'),
        notes: values.notes || "",
        isAvailable: true
      };

      console.log('Creating schedule with data:', scheduleData);
      const response = await axios.post('http://localhost:5275/api/DoctorSchedule/create-doctor-schedule', scheduleData);
      console.log('Schedule created successfully:', response.data);
      message.success('Tạo lịch làm việc thành công');

      form.resetFields();
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Tạo lịch làm việc
      </Button>

      <Modal
        title="Tạo lịch làm việc cho bác sĩ"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
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
        >
          <Form.Item
            name="doctorId"
            label="Chọn bác sĩ"
            rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}
          >
            <Select placeholder="Chọn bác sĩ">
              {doctors.map(doctor => {
                console.log('Processing doctor:', doctor);
                return (
                  <Select.Option key={doctor.id} value={doctor.id}>
                    {doctor.fullName || doctor.FullName || doctor.fullname || doctor.name || 'Không có tên'} - {doctor.specialization || doctor.Specialization || 'Chưa cập nhật chuyên khoa'}
                  </Select.Option>
                );
              })}
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
    </>
  );
};

export default DoctorScheduleForm; 