import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  message, 
  Descriptions, 
  Image, 
  Space, 
  Button, 
  Tooltip, 
  Modal,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Tag
} from 'antd';
import { 
  FileTextOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { medicalRecordService } from '../../services/medicalRecordService';
import { patientService } from '../../services/patientService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const StaffMedicalRecordView = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  // Filter states
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchMedicalRecords();
    fetchPatients();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [medicalRecords, selectedPatient, dateRange, searchText]);

  const fetchMedicalRecords = async () => {
    setLoading(true);
    try {
      console.log('Đang gọi API medical records...');
      const data = await medicalRecordService.getAllMedicalRecords();
      console.log('Medical Records API Response:', data); // Debug log
      
      // Xử lý nhiều cấu trúc dữ liệu có thể
      let recordsArray = [];
      if (Array.isArray(data)) {
        recordsArray = data;
      } else if (data && Array.isArray(data.data)) {
        recordsArray = data.data;
      } else if (data && Array.isArray(data.result)) {
        recordsArray = data.result;
      } else if (data && Array.isArray(data.medicalRecords)) {
        recordsArray = data.medicalRecords;
      }
      
      console.log('Records Array:', recordsArray); // Debug log
      console.log('Records Count:', recordsArray.length); // Debug log
      
      setMedicalRecords(recordsArray);
      
      if (recordsArray.length === 0) {
        message.info('Không có hồ sơ bệnh án nào trong hệ thống');
      } else {
        message.success(`Đã tải ${recordsArray.length} hồ sơ bệnh án`);
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
      message.error('Không thể tải danh sách hồ sơ bệnh án: ' + error.message);
      // Set empty array on error
      setMedicalRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await patientService.getAllPatients();
      console.log('Patients API Response:', data); // Debug log
      const patientsArray = Array.isArray(data) ? data : [];
      setPatients(patientsArray);
    } catch (error) {
      console.error('Error fetching patients:', error);
      message.error('Không thể tải danh sách bệnh nhân: ' + error.message);
    }
  };

  const applyFilters = () => {
    let filtered = [...medicalRecords];

    // Filter by patient
    if (selectedPatient) {
      filtered = filtered.filter(record => 
        (record.patientId === selectedPatient) || 
        (record.PatientId === selectedPatient)
      );
    }

    // Filter by date range
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      filtered = filtered.filter(record => {
        const recordDate = dayjs(record.examinationDate || record.createdDate || record.CreatedDate);
        return recordDate.isAfter(startDate.startOf('day')) && 
               recordDate.isBefore(endDate.endOf('day'));
      });
    }

    // Filter by search text (diagnosis, symptoms, prescription, notes)
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(record => {
        const diagnosis = (record.diagnosis || record.Diagnosis || '').toLowerCase();
        const symptoms = (record.symptoms || record.Symptoms || '').toLowerCase();
        const prescription = (record.prescription || record.Prescription || '').toLowerCase();
        const notes = (record.notes || record.Notes || '').toLowerCase();
        
        return diagnosis.includes(searchLower) || 
               symptoms.includes(searchLower) || 
               prescription.includes(searchLower) ||
               notes.includes(searchLower);
      });
    }

    setFilteredRecords(filtered);
  };

  const handleRefresh = () => {
    fetchMedicalRecords();
    fetchPatients();
    message.success('Đã làm mới dữ liệu');
  };

  const clearFilters = () => {
    setSelectedPatient(null);
    setDateRange(null);
    setSearchText('');
    message.info('Đã xóa tất cả bộ lọc');
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const getPatientName = (record) => {
    const patientId = record.patientId || record.PatientId;
    const patient = patients.find(p => p.id === patientId);
    return patient?.fullName || `Bệnh nhân #${patientId}`;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return dayjs(dateTime).format('DD/MM/YYYY HH:mm');
  };

  const columns = [
    {
      title: (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          Bệnh nhân
        </span>
      ),
      dataIndex: 'patientId',
      key: 'patientId',
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>
          {getPatientName(record)}
        </span>
      ),
      width: 200,
    },
    {
      title: (
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Ngày khám
        </span>
      ),
      dataIndex: 'examinationDate',
      key: 'examinationDate',
      render: (text, record) => formatDateTime(text || record.examinationDate || record.createdDate || record.CreatedDate),
      sorter: (a, b) => {
        const dateA = dayjs(a.examinationDate || a.createdDate || a.CreatedDate);
        const dateB = dayjs(b.examinationDate || b.createdDate || b.CreatedDate);
        return dateA.isBefore(dateB) ? -1 : 1;
      },
      width: 150,
    },
    {
      title: (
        <span>
          <MedicineBoxOutlined style={{ marginRight: 8 }} />
          Chẩn đoán
        </span>
      ),
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      render: (text, record) => (
        <Tooltip title={text || record.Diagnosis || 'Chưa có chẩn đoán'}>
          <span style={{ 
            display: 'block', 
            maxWidth: 250, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || record.Diagnosis || 'Chưa có chẩn đoán'}
          </span>
        </Tooltip>
      ),
      width: 270,
    },
    {
      title: 'Triệu chứng',
      dataIndex: 'symptoms',
      key: 'symptoms',
      render: (text, record) => (
        <Tooltip title={text || record.Symptoms || 'Chưa có triệu chứng'}>
          <span style={{ 
            display: 'block', 
            maxWidth: 200, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || record.Symptoms || 'Chưa có triệu chứng'}
          </span>
        </Tooltip>
      ),
      width: 220,
    },
    {
      title: 'Đơn thuốc',
      dataIndex: 'prescription',
      key: 'prescription',
      render: (text, record) => (
        <Tooltip title={text || record.Prescription || 'Chưa có đơn thuốc'}>
          <span style={{ 
            display: 'block', 
            maxWidth: 180, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || record.Prescription || 'Chưa có đơn thuốc'}
          </span>
        </Tooltip>
      ),
      width: 200,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewDetail(record)}
          size="small"
        >
          Xem chi tiết
        </Button>
      ),
      width: 120,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title={
          <Space>
            <FileTextOutlined />
            Quản lý hồ sơ bệnh án
          </Space>
        } 
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
        {/* Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Chọn bệnh nhân"
              style={{ width: '100%' }}
              value={selectedPatient}
              onChange={setSelectedPatient}
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {patients.map(patient => (
                <Option key={patient.id} value={patient.id}>
                  {patient.fullName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={setDateRange}
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo chẩn đoán, triệu chứng, đơn thuốc, ghi chú..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={setSearchText}
              enterButton={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button 
              onClick={clearFilters}
              style={{ width: '100%' }}
            >
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f0f2f5' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <strong>Debug Info:</strong> 
              Medical Records: {medicalRecords.length} | 
              Filtered Records: {filteredRecords.length} | 
              Patients: {patients.length} | 
              Loading: {loading ? 'Yes' : 'No'}
            </div>
          </Card>
        )}

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredRecords}
          loading={loading}
          rowKey={(record) => record.id || record.Id || record.medicalRecordId || Math.random()}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} bản ghi`,
          }}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: loading ? 'Đang tải...' : 'Không có dữ liệu hồ sơ bệnh án'
          }}
          size="middle"
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            Chi tiết hồ sơ bệnh án - {selectedRecord && getPatientName(selectedRecord)}
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={900}
        footer={null}
        destroyOnClose
      >
        {selectedRecord && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <Descriptions
              bordered
              column={1}
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="Bệnh nhân">
                <strong>{getPatientName(selectedRecord)}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày khám">
                {formatDateTime(selectedRecord.examinationDate || selectedRecord.createdDate || selectedRecord.CreatedDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Chẩn đoán">
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {selectedRecord.diagnosis || selectedRecord.Diagnosis || 'Chưa có chẩn đoán'}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Triệu chứng">
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {selectedRecord.symptoms || selectedRecord.Symptoms || 'Chưa có triệu chứng'}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Đơn thuốc">
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {selectedRecord.prescription || selectedRecord.Prescription || 'Chưa có đơn thuốc'}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {selectedRecord.notes || selectedRecord.Notes || 'Không có ghi chú'}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffMedicalRecordView;
