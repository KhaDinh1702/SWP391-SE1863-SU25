import React, { useEffect, useState } from 'react';
import { Table, Tag, message, Card, Row, Col, Select, DatePicker, Button, Space, Modal, Descriptions, Tooltip, Input } from 'antd';
import { EyeOutlined, ReloadOutlined, CalendarOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { patientService } from '../../services/patientService';
import MedicalRecordModal from './MedicalRecordModal';
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
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [dateRange, setDateRange] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editOnlineLinkModalVisible, setEditOnlineLinkModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [onlineLinkInput, setOnlineLinkInput] = useState('');
  
  // States for reschedule functionality
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [reschedulingAppointment, setReschedulingAppointment] = useState(null);
  const [newStartDate, setNewStartDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  
  // States for medical record modal
  const [medicalRecordModalVisible, setMedicalRecordModalVisible] = useState(false);
  const [selectedPatientForMedical, setSelectedPatientForMedical] = useState(null);

  // Generate fixed time slots (8h, 10h, 12h, 14h, 16h)
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 16;
    
    for (let hour = startHour; hour <= endHour; hour += 2) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const displayTime = `${hour.toString().padStart(2, '0')}:00`;
      
      slots.push({
        value: timeString,
        label: displayTime,
        display: hour < 12 ? `${displayTime} SA` : `${displayTime} CH`
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);
  useEffect(() => {
    applyFilters();
  }, [appointments, selectedDoctor, selectedStatus, dateRange]);

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

    // Filter by status
    if (selectedStatus !== null) {
      filtered = filtered.filter(appointment => {
        // Use PaymentStatus as the primary field name
        const appointmentStatus = appointment.PaymentStatus !== undefined ? appointment.PaymentStatus :
                                 appointment.paymentStatus !== undefined ? appointment.paymentStatus :
                                 appointment.status !== undefined ? appointment.status : 
                                 appointment.Status !== undefined ? appointment.Status : 0;
        return appointmentStatus === selectedStatus;
      });
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
    setSelectedStatus(null);
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

  const handleReschedule = (appointment) => {
    setReschedulingAppointment(appointment);
    setNewStartDate(null);
    setSelectedTimeSlot(null);
    setRescheduleModalVisible(true);
  };

  const handleViewMedicalRecord = (appointment) => {
    const patientId = appointment.patientId || appointment.PatientId;
    const patientName = getPatientName(appointment);
    setSelectedPatientForMedical({ id: patientId, name: patientName });
    setMedicalRecordModalVisible(true);
  };

  const handleConfirmReschedule = async () => {
    if (!reschedulingAppointment) return;
    
    try {
      const appointmentId = reschedulingAppointment.id || reschedulingAppointment.Id || reschedulingAppointment.appointmentId;
      
      if (!newStartDate || !selectedTimeSlot) {
        message.error('Vui lòng chọn ngày và khung giờ mới!');
        return;
      }
      
      // Create datetime from selected date and time slot
      const dateObj = new Date(newStartDate);
      const [hours, minutes] = selectedTimeSlot.split(':');
      const startDateTime = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        parseInt(hours),
        parseInt(minutes),
        0,
        0
      );
      
      // Check if selected time is in the past
      if (startDateTime < new Date()) {
        message.error('Không thể dời lịch về thời gian đã qua!');
        return;
      }
      
      // Automatically add 1 hour 30 minutes for end time
      const endDateTime = new Date(startDateTime.getTime() + 90 * 60000);
      
      // Check for slot conflicts with paid appointments only
      const conflictingAppointment = appointments.find(apt => {
        // Skip current appointment being rescheduled
        const currentAptId = reschedulingAppointment.id || reschedulingAppointment.Id || reschedulingAppointment.appointmentId;
        const aptId = apt.id || apt.Id || apt.appointmentId;
        if (aptId === currentAptId) return false;
        
        // Only check conflict with paid appointments (status = 1, 3, 4)
        const status = apt.PaymentStatus !== undefined ? apt.PaymentStatus :
                      apt.paymentStatus !== undefined ? apt.paymentStatus :
                      apt.status !== undefined ? apt.status : 
                      apt.Status !== undefined ? apt.Status : 0;
        if (status !== 1 && status !== 3 && status !== 4) return false;
        
        const aptStart = new Date(apt.appointmentStartDate || apt.AppointmentStartDate);
        const aptEnd = new Date(apt.appointmentEndDate || apt.AppointmentEndDate);
        
        // Check if time slots overlap
        return (startDateTime < aptEnd && endDateTime > aptStart);
      });
      
      if (conflictingAppointment) {
        const conflictPatient = patients.find(p => 
          (p.id || p.patientId) === (conflictingAppointment.patientId || conflictingAppointment.PatientId)
        );
        const patientName = conflictPatient ? `${conflictPatient.firstName} ${conflictPatient.lastName}` : 'N/A';
        message.error(`Khung giờ này đã có lịch hẹn khác (Bệnh nhân: ${patientName}). Vui lòng chọn khung giờ khác!`);
        return;
      }
      
      console.log('Reschedule debug:', {
        selectedDate: newStartDate,
        selectedTimeSlot,
        startDateTime,
        endDateTime,
        startDateTimeString: startDateTime.toString(),
        endDateTimeString: endDateTime.toString()
      });
      
      await appointmentService.rescheduleAppointment(
        appointmentId,
        startDateTime,
        endDateTime
      );
      
      message.success('Đã dời lịch cuộc hẹn thành công!');
      
      setRescheduleModalVisible(false);
      setReschedulingAppointment(null);
      setNewStartDate(null);
      setSelectedTimeSlot(null);
      
      // Refresh appointments list
      setTimeout(() => {
        fetchAppointments();
      }, 500);
      
    } catch (error) {
      console.error('Reschedule error:', error);
      message.error(error.message || 'Dời lịch cuộc hẹn thất bại!');
    }
  };

  // Status management functions
  const getAppointmentStatusLabel = (status) => {
    switch (status) {
      case 0: return 'Chờ thanh toán';
      case 1: return 'Đã thanh toán';
      case 2: return 'Đã hủy';
      case 3: return 'Hoàn thành';
      case 4: return 'Dời lịch';
      default: return 'Chờ thanh toán';
    }
  };

  const getAppointmentStatusColor = (status) => {
    switch (status) {
      case 0: return 'orange';   // Chờ thanh toán
      case 1: return 'green';    // Đã thanh toán
      case 2: return 'red';      // Đã hủy
      case 3: return 'blue';     // Hoàn thành
      case 4: return 'purple';   // Dời lịch
      default: return 'orange';
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
      title: 'Trạng thái',
      dataIndex: 'PaymentStatus',
      key: 'PaymentStatus',
      render: (status, record) => {
        // Use PaymentStatus as the primary field name
        const appointmentStatus = record.PaymentStatus !== undefined ? record.PaymentStatus :
                                 record.paymentStatus !== undefined ? record.paymentStatus :
                                 status !== undefined ? status : 
                                 record.Status !== undefined ? record.Status : 0;
        
        const color = getAppointmentStatusColor(appointmentStatus);
        const label = getAppointmentStatusLabel(appointmentStatus);
        return (
          <Tag color={color} style={{ fontWeight: 500 }}>
            {label}
          </Tag>
        );
      },
      width: 150,
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
            <Button
              type="default"
              onClick={() => handleReschedule(record)}
              size="small"
            >
              Dời lịch
            </Button>
          </Space>
        );
      },
      width: 300,
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
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>          
          <Col xs={24} sm={12} md={5}>
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
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Chọn trạng thái"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
            >
              <Option value={0}>Chờ thanh toán</Option>
              <Option value={1}>Đã thanh toán</Option>
              <Option value={2}>Đã hủy</Option>
              <Option value={3}>Hoàn thành</Option>
              <Option value={4}>Dời lịch</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={7}>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={setDateRange}
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} sm={12} md={3}>
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

      <Modal
        title="Dời lịch cuộc hẹn"
        open={rescheduleModalVisible}
        onCancel={() => setRescheduleModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setRescheduleModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmReschedule}>
            Xác nhận
          </Button>
        ]}
        width={700}
      >
        {reschedulingAppointment && (
          <div>
            <p><strong>Bệnh nhân:</strong> {getPatientName(reschedulingAppointment)}</p>
            <p><strong>Bác sĩ:</strong> {getDoctorName(reschedulingAppointment)}</p>
            <p><strong>Thời gian hiện tại:</strong> {formatDateTime(reschedulingAppointment.appointmentStartDate || reschedulingAppointment.AppointmentStartDate)}</p>
            
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                  Chọn ngày mới: <span style={{ color: 'red' }}>*</span>
                </div>
                <DatePicker
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày mới"
                  style={{ width: '100%' }}
                  value={newStartDate ? dayjs(newStartDate) : null}
                  onChange={(date) => {
                    setNewStartDate(date?.toDate());
                    setSelectedTimeSlot(null); // Reset time slot when date changes
                  }}
                  disabledDate={(current) => {
                    // Disable past dates
                    return current && current < dayjs().startOf('day');
                  }}
                />
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                  Chọn khung giờ: <span style={{ color: 'red' }}>*</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.value}
                      type={selectedTimeSlot === slot.value ? 'primary' : 'default'}
                      onClick={() => setSelectedTimeSlot(slot.value)}
                      disabled={!newStartDate}
                      style={{
                        height: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>{slot.label}</div>
                      <div style={{ fontSize: '12px', opacity: 0.7 }}>
                        {slot.value < '12:00' ? 'Sáng' : 'Chiều'}
                      </div>
                    </Button>
                  ))}
                </div>
                {!newStartDate && (
                  <div style={{ marginTop: 8, color: '#999', fontSize: '12px' }}>
                    Vui lòng chọn ngày trước khi chọn khung giờ
                  </div>
                )}
                {selectedTimeSlot && (
                  <div style={{ marginTop: 8, padding: '8px', backgroundColor: '#f0f8f0', border: '1px solid #b7eb8f', borderRadius: '4px' }}>
                    <div style={{ color: '#52c41a', fontSize: '14px' }}>
                      ✓ Đã chọn: <strong>{selectedTimeSlot}</strong> 
                      {selectedTimeSlot < '12:00' ? ' (Buổi sáng)' : ' (Buổi chiều)'}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                      Thời gian kết thúc sẽ tự động là: <strong>
                        {dayjs(`2000-01-01T${selectedTimeSlot}:00`).add(90, 'minute').format('HH:mm')}
                      </strong> (+ 1 giờ 30 phút)
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ padding: '12px', backgroundColor: '#f6f6f6', borderRadius: '4px', marginTop: '16px' }}>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  <strong>Lưu ý:</strong>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li>Chỉ có thể chọn các khung giờ cố định: 8:00, 10:00, 12:00, 14:00, 16:00</li>
                    <li>Mỗi cuộc hẹn kéo dài 1 giờ 30 phút</li>
                    <li>Các lịch hẹn phải cách nhau tối thiểu 2 tiếng</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffAppointmentList;