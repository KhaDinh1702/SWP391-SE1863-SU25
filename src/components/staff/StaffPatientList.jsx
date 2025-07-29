import React, { useEffect, useState } from 'react';
import { Table, Tag, message, Card, Row, Col, Button, Space, Modal, Descriptions, Avatar, Input, Tooltip, Alert } from 'antd';
import { EyeOutlined, ReloadOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import dayjs from 'dayjs';

const { Search } = Input;

// Staff Patient List Component
const StaffPatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    
    // First try to get patients directly from the patient API
    try {
      const data = await patientService.getAllPatients();
      const patientList = Array.isArray(data) ? data : (data?.patients || []);
      if (patientList.length > 0) {
        setPatients(patientList);
        setFilteredPatients(patientList);
        message.success(`Đã tải ${patientList.length} bệnh nhân`);
        setLoading(false);
        return;
      }
    } catch (patientApiError) {
      console.log('Direct patient API failed, trying to get patients from appointments:', patientApiError.message);
      message.warning('API bệnh nhân không khả dụng. Đang tải dữ liệu từ lịch hẹn...', 3);
    }
    
    // Fallback: try to get patients from appointments
    try {
      const appointmentsData = await appointmentService.getAllAppointments();
      const appointments = Array.isArray(appointmentsData) ? appointmentsData : (appointmentsData?.appointments || []);
      
      if (!appointments || appointments.length === 0) {
        setError('Không tìm thấy lịch hẹn nào. Danh sách bệnh nhân sẽ trống cho đến khi có lịch hẹn được tạo.');
        setPatients([]);
        setFilteredPatients([]);
        setLoading(false);
        return;
      }
      
      // Extract unique patients from appointments
      const patientMap = new Map();
      appointments.forEach(appointment => {
        // Handle different possible patient data structures
        const patient = appointment.patient || appointment.Patient || {
          id: appointment.patientId || appointment.PatientId,
          fullName: appointment.patientFullName || appointment.PatientFullName,
          email: appointment.patientEmail || appointment.PatientEmail,
          phoneNumber: appointment.patientPhoneNumber || appointment.PatientPhoneNumber,
          gender: appointment.patientGender || appointment.PatientGender,
          dateOfBirth: appointment.patientDateOfBirth || appointment.PatientDateOfBirth,
          address: appointment.patientAddress || appointment.PatientAddress,
          createdDate: appointment.createdDate || appointment.CreatedDate
        };
        
        // Only add if we have at least an ID and name
        if (patient.id && (patient.fullName || patient.FullName)) {
          const patientId = patient.id;
          
          // If patient already exists, merge the data (keep the most complete record)
          if (patientMap.has(patientId)) {
            const existingPatient = patientMap.get(patientId);
            const mergedPatient = {
              ...existingPatient,
              ...patient,
              // Prefer non-null values
              fullName: patient.fullName || patient.FullName || existingPatient.fullName || existingPatient.FullName,
              email: patient.email || patient.Email || existingPatient.email || existingPatient.Email,
              phoneNumber: patient.phoneNumber || patient.PhoneNumber || existingPatient.phoneNumber || existingPatient.PhoneNumber,
              address: patient.address || patient.Address || existingPatient.address || existingPatient.Address
            };
            patientMap.set(patientId, mergedPatient);
          } else {
            patientMap.set(patientId, patient);
          }
        }
      });
      
      const uniquePatients = Array.from(patientMap.values());
      
      if (uniquePatients.length === 0) {
        setError('Không tìm thấy thông tin bệnh nhân nào trong các lịch hẹn hiện có.');
        message.warning('Không tìm thấy thông tin bệnh nhân nào');
      } else {
        message.success(`Đã tải ${uniquePatients.length} bệnh nhân từ lịch hẹn`);
      }
      
      setPatients(uniquePatients);
      setFilteredPatients(uniquePatients);
      
    } catch (error) {
      console.error('Error fetching patients:', error);
      const errorMessage = error.message || 'Không thể tải danh sách bệnh nhân';
      setError(`Lỗi: ${errorMessage}`);
      message.error(errorMessage);
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchPatients();
    message.success('Đã làm mới dữ liệu');
  };

  const handleSearch = (value) => {
    if (!value.trim()) {
      setFilteredPatients(patients);
      return;
    }
    
    const lowercasedValue = value.toLowerCase();
    const filtered = patients.filter(patient => 
      (patient.fullName || patient.FullName || '').toLowerCase().includes(lowercasedValue) ||
      (patient.email || patient.Email || '').toLowerCase().includes(lowercasedValue) ||
      (patient.phoneNumber || patient.PhoneNumber || '').toLowerCase().includes(lowercasedValue)
    );
    setFilteredPatients(filtered);
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setDetailModalVisible(true);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return dayjs(date).format('DD/MM/YYYY');
  };

  const getGenderText = (gender) => {
    if (gender === 0 || gender === 'Male') return 'Nam';
    if (gender === 1 || gender === 'Female') return 'Nữ';
    return 'N/A';
  };

  const getGenderColor = (gender) => {
    if (gender === 0 || gender === 'Male') return 'blue';
    if (gender === 1 || gender === 'Female') return 'pink';
    return 'default';
  };

  const columns = [
    {
      title: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          Bệnh nhân
        </span>
      ),
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            icon={<UserOutlined />} 
            style={{ marginRight: 12, backgroundColor: '#1890ff' }} 
          />
          <span style={{ fontWeight: 500 }}>
            {text || record.FullName || 'N/A'}
          </span>
        </div>
      ),
      width: 250,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => (
        <span>{text || record.Email || 'N/A'}</span>
      ),
      width: 200,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text, record) => (
        <span>{text || record.PhoneNumber || 'N/A'}</span>
      ),
      width: 150,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (text, record) => formatDate(text || record.DateOfBirth),
      sorter: (a, b) => {
        const dateA = dayjs(a.dateOfBirth || a.DateOfBirth);
        const dateB = dayjs(b.dateOfBirth || b.DateOfBirth);
        return dateA.isBefore(dateB) ? -1 : 1;
      },
      width: 120,
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender, record) => {
        const genderValue = gender !== undefined ? gender : record.Gender;
        return (
          <Tag color={getGenderColor(genderValue)}>
            {getGenderText(genderValue)}
          </Tag>
        );
      },
      filters: [
        { text: 'Nam', value: 0 },
        { text: 'Nữ', value: 1 },
      ],
      onFilter: (value, record) => {
        const gender = record.gender !== undefined ? record.gender : record.Gender;
        return gender === value;
      },
      width: 100,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => (
        <Tooltip title={text || record.Address || 'Chưa có địa chỉ'}>
          <span style={{ 
            display: 'block', 
            maxWidth: 150, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || record.Address || 'Chưa có địa chỉ'}
          </span>
        </Tooltip>
      ),
      width: 180,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetails(record)} 
            size="small"
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
      width: 150,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title="Danh sách bệnh nhân" 
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
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              enterButton={<SearchOutlined />}
              allowClear
            />
          </Col>
        </Row>

        {error && (
          <Alert 
            message="Thông báo" 
            description={error} 
            type="warning" 
            showIcon 
            style={{ marginBottom: 16 }} 
          />
        )}

        <Table
          columns={columns}
          dataSource={filteredPatients}
          rowKey={record => record.id || record.Id || record.patientId}
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} bệnh nhân`,
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      <Modal
        title="Chi tiết bệnh nhân"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedPatient && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Họ và tên">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ marginRight: 12, backgroundColor: '#1890ff' }} 
                />
                <span style={{ fontWeight: 500 }}>
                  {selectedPatient.fullName || selectedPatient.FullName || 'N/A'}
                </span>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedPatient.email || selectedPatient.Email || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedPatient.phoneNumber || selectedPatient.PhoneNumber || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {formatDate(selectedPatient.dateOfBirth || selectedPatient.DateOfBirth)}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              <Tag color={getGenderColor(selectedPatient.gender || selectedPatient.Gender)}>
                {getGenderText(selectedPatient.gender || selectedPatient.Gender)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>
              {selectedPatient.address || selectedPatient.Address || 'Chưa có địa chỉ'}
            </Descriptions.Item>
            {(selectedPatient.createdDate || selectedPatient.CreatedDate) && (
              <Descriptions.Item label="Ngày tạo hồ sơ" span={2}>
                {formatDate(selectedPatient.createdDate || selectedPatient.CreatedDate)}
              </Descriptions.Item>
            )}
          </Descriptions>        )}
      </Modal>
    </div>
  );
};

export default StaffPatientList;
