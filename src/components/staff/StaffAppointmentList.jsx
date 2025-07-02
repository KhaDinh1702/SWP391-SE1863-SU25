import React, { useEffect, useState } from 'react';
import { Table, Tag, message, Card, Row, Col, Select, DatePicker, Button, Space, Modal, Descriptions, Tooltip, Input } from 'antd';
import { EyeOutlined, ReloadOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { patientService } from '../../services/patientService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const StaffAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [dateRange, setDateRange] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editOnlineLinkModalVisible, setEditOnlineLinkModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [onlineLinkInput, setOnlineLinkInput] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);
  useEffect(() => {
    applyFilters();
  }, [appointments, selectedDoctor, dateRange]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getAllAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      message.error('Không thể tải danh sách bác sĩ');
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await patientService.getAllPatients();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      message.error('Không thể tải danh sách bệnh nhân');
    }
  };
  const applyFilters = () => {
    let filtered = [...appointments];

    // Filter by doctor
    if (selectedDoctor) {
      filtered = filtered.filter(appointment => 
        appointment.doctorId === selectedDoctor || 
        appointment.DoctorId === selectedDoctor
      );
    }

    // Filter by date range
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      filtered = filtered.filter(appointment => {
        const appointmentDate = dayjs(appointment.appointmentStartDate || appointment.AppointmentStartDate);
        return appointmentDate.isAfter(startDate.startOf('day')) && 
               appointmentDate.isBefore(endDate.endOf('day'));
      });
    }

    setFilteredAppointments(filtered);
  };

  const handleRefresh = () => {
    fetchAppointments();
    fetchPatients();
    message.success('Đã làm mới dữ liệu');
  };
  const clearFilters = () => {
    setSelectedDoctor(null);
    setDateRange(null);
    message.info('Đã xóa tất cả bộ lọc');
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailModalVisible(true);
  };

  const handleEditOnlineLink = (appointment) => {
    setEditingAppointment(appointment);
    setOnlineLinkInput(appointment.onlineLink || appointment.OnlineLink || '');
    setEditOnlineLinkModalVisible(true);
  };

  const handleSaveOnlineLink = async () => {
    if (!editingAppointment) return;
    try {
      await appointmentService.updateAppointmentOnlineLink(editingAppointment.id || editingAppointment.Id || editingAppointment.appointmentId, onlineLinkInput);
      message.success('Cập nhật link trực tuyến thành công!');
      setEditOnlineLinkModalVisible(false);
      setEditingAppointment(null);
      setOnlineLinkInput('');
      fetchAppointments();
    } catch (error) {
      message.error(error.message || 'Cập nhật link trực tuyến thất bại!');
    }
  };

  const getDoctorName = (appointment) => {
    const doctorId = appointment.doctorId || appointment.DoctorId;
    const doctor = doctors.find(d => d.doctorId === doctorId || d.id === doctorId);
    return doctor?.fullName || appointment.doctorFullName || appointment.DoctorFullName || 'N/A';
  };

  const getPatientName = (appointment) => {
    const patientId = appointment.patientId || appointment.PatientId;
    const patient = patients.find(p => p.id === patientId);
    return patient?.fullName || appointment.patientFullName || appointment.PatientFullName || 'N/A';
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return dayjs(dateTime).format('DD/MM/YYYY HH:mm');
  };
  const getAppointmentTypeLabel = (type) => {
    switch (type) {
      case 1: return 'Offline';
      case 0: return 'Online';
      default: return 'Online';
    }
  };
  const columns = [
    {
      title: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          Bệnh nhân
        </span>
      ),
      dataIndex: 'patientFullName',
      key: 'patientFullName',
      render: (text, record) => (
        <span style={{ fontWeight: 500 }}>
          {getPatientName(record)}
        </span>
      ),
      width: 200,
    },
    {
      title: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          Bác sĩ
        </span>
      ),
      dataIndex: 'doctorFullName',
      key: 'doctorFullName',
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>
          {getDoctorName(record)}
        </span>
      ),
      width: 200,
    },
    {
      title: (
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Thời gian bắt đầu
        </span>
      ),
      dataIndex: 'appointmentStartDate',
      key: 'appointmentStartDate',
      render: (_, record) => formatDateTime(record.appointmentStartDate || record.AppointmentStartDate),
      sorter: (a, b) => {
        const dateA = dayjs(a.appointmentStartDate || a.AppointmentStartDate);
        const dateB = dayjs(b.appointmentStartDate || b.AppointmentStartDate);
        return dateA.isBefore(dateB) ? -1 : 1;
      },
      width: 180,
    },    {
      title: 'Loại',
      dataIndex: 'appointmentType',
      key: 'appointmentType',
      render: (type, record) => {
        const value = type || record.AppointmentType;
        const isOnline = value === 1 || String(value).toLowerCase() === 'online';
        return (
          <Tag color={isOnline ? 'green' : 'blue'}>
            {getAppointmentTypeLabel(value)}
          </Tag>
        );
      },
      width: 120,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      render: (text, record) => (
        <Tooltip title={text || record.Notes || 'Không có ghi chú'}>
          <span style={{ 
            display: 'block', 
            maxWidth: 150, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || record.Notes || 'Không có ghi chú'}
          </span>
        </Tooltip>
      ),
      width: 180,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        const appointmentType = record.appointmentType || record.AppointmentType;
        const isOnline = !(appointmentType === 1 || String(appointmentType).toLowerCase() === 'online');
        
        return (
          <Space>
            <Button 
              type="primary" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetails(record)} 
              size="small"
            >
              Xem chi tiết
            </Button>
            {isOnline && (
              <Button
                type="default"
                onClick={() => handleEditOnlineLink(record)}
                size="small"
              >
                link khám online
              </Button>
            )}
          </Space>
        );
      },
      width: 200,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>      <Card 
        title="Xem lịch hẹn" 
        style={{ marginBottom: 24 }}
        extra={
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={loading}
          >
            Làm mới
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Chọn bác sĩ"
              style={{ width: '100%' }}
              value={selectedDoctor}
              onChange={setSelectedDoctor}
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {doctors.map(doctor => (
                <Option key={doctor.doctorId || doctor.id} value={doctor.doctorId || doctor.id}>
                  {doctor.fullName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={setDateRange}
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Space>
              <Button onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredAppointments}
          rowKey={record => record.id || record.Id || record.appointmentId}
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} lịch hẹn`,
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      <Modal
        title="Chi tiết lịch hẹn"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedAppointment && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Bệnh nhân">
              {getPatientName(selectedAppointment)}
            </Descriptions.Item>
            <Descriptions.Item label="Bác sĩ">
              {getDoctorName(selectedAppointment)}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian bắt đầu">
              {formatDateTime(selectedAppointment.appointmentStartDate || selectedAppointment.AppointmentStartDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian kết thúc">
              {formatDateTime(selectedAppointment.appointmentEndDate || selectedAppointment.AppointmentEndDate)}
            </Descriptions.Item>            <Descriptions.Item label="Loại hẹn">
              {getAppointmentTypeLabel(selectedAppointment.appointmentType || selectedAppointment.AppointmentType)}
            </Descriptions.Item>
            <Descriptions.Item label="Tiêu đề" span={2}>
              {selectedAppointment.appointmentTitle || selectedAppointment.AppointmentTitle || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú" span={2}>
              {selectedAppointment.notes || selectedAppointment.Notes || 'Không có ghi chú'}
            </Descriptions.Item>
            {(selectedAppointment.onlineLink || selectedAppointment.OnlineLink) && (
              <Descriptions.Item label="Link trực tuyến" span={2}>
                <a 
                  href={selectedAppointment.onlineLink || selectedAppointment.OnlineLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {selectedAppointment.onlineLink || selectedAppointment.OnlineLink}
                </a>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="Cập nhật link trực tuyến"
        open={editOnlineLinkModalVisible}
        onCancel={() => setEditOnlineLinkModalVisible(false)}
        onOk={handleSaveOnlineLink}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Input
          value={onlineLinkInput}
          onChange={e => setOnlineLinkInput(e.target.value)}
          placeholder="Nhập link trực tuyến mới..."
        />
      </Modal>
    </div>
  );
};

export default StaffAppointmentList;