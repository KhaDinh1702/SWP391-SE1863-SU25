import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Space, Tag, Tooltip, Input, Select, DatePicker, message, Form } from 'antd';
import { EyeOutlined, ReloadOutlined, SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { patientTreatmentProtocolService } from '../../../services/patientTreatmentProtocolService';
import { authService } from '../../../services/authService';
import { patientService } from '../../../services/patientService';
import { treatmentStageService } from '../../../services/treatmentStageService';

const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

const MedicalHistory = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [createForm] = Form.useForm();
  const [createLoading, setCreateLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [treatmentStages, setTreatmentStages] = useState([]);
  const [loadingTreatmentStages, setLoadingTreatmentStages] = useState(false);

  useEffect(() => {
    // Lấy thông tin bác sĩ hiện tại
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentDoctor(user);
    }
    fetchPatientTreatmentProtocols();
    fetchPatients();
    fetchTreatmentStages();
  }, []);

  const fetchTreatmentStages = async () => {
    setLoadingTreatmentStages(true);
    try {
      const data = await treatmentStageService.getAllTreatmentStages();
      console.log('Fetched treatment stages:', data);
      setTreatmentStages(data);
    } catch (error) {
      console.error('Error fetching treatment stages:', error);
      message.error('Không thể tải danh sách giai đoạn điều trị');
    } finally {
      setLoadingTreatmentStages(false);
    }
  };

  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const data = await patientService.getAllPatients();
      console.log('Fetched patients:', data);
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      message.error('Không thể tải danh sách bệnh nhân');
    } finally {
      setLoadingPatients(false);
    }
  };

  // Thay fetchMedicalRecords bằng fetchPatientTreatmentProtocols
  // Chỉ lấy các protocol có status đúng bằng 'Completed'
  const fetchPatientTreatmentProtocols = async () => {
    setLoading(true);
    try {
      const data = await patientTreatmentProtocolService.getAllPatientTreatmentProtocols();
      // Log dữ liệu trả về để kiểm tra status thực tế
      console.log('API data:', data);
      data.forEach((item, idx) => console.log(`Record ${idx}: status=`, item.status || item.Status));
      // Lọc các trạng thái hoàn thành: status === 2
      const completedProtocols = data.filter(protocol => {
        const status = protocol.status || protocol.Status;
        return status === 2;
      });
      setMedicalRecords(completedProtocols);
    } catch (error) {
      message.error('Không thể tải danh sách phác đồ điều trị');
      console.error('Error fetching patient treatment protocols:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = async (recordId) => {
    try {
      const record = await medicalRecordService.getMedicalRecordById(recordId);
      console.log('Selected record:', record);
      setSelectedRecord(record);
      setIsModalVisible(true);
    } catch (error) {
      message.error('Không thể xem chi tiết hồ sơ');
      console.error('Error fetching record details:', error);
    }
  };

  const handleCreateRecord = async (values) => {
    setCreateLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      const doctorId = currentUser?.doctorId || currentUser?.id;

      // Đảm bảo gửi đúng key cho backend (PascalCase)
      const formData = new FormData();
      formData.append('PatientId', values.patientId);
      formData.append('DoctorId', doctorId);
      formData.append('TreatmentStageId', values.treatmentStageId);
      if (values.examinationDate) {
        formData.append('ExaminationDate', values.examinationDate.toISOString());
      }
      formData.append('Diagnosis', values.diagnosis);
      formData.append('Symptoms', values.symptoms);
      formData.append('Prescription', values.prescription);
      formData.append('Notes', values.notes);

      await medicalRecordService.createMedicalRecord(formData);
      message.success('Tạo hồ sơ bệnh án thành công!');
      createForm.resetFields();
      setIsCreateModalVisible(false);
      fetchMedicalRecords();
    } catch (error) {
      message.error('Không thể tạo hồ sơ bệnh án: ' + (error.message || 'Lỗi không xác định'));
      console.error('Error creating medical record:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCancelCreate = () => {
    createForm.resetFields();
    setIsCreateModalVisible(false);
  };

  const getStatusColor = (status) => {
    // Tạm thời return default color vì backend chưa có status field
    return 'green';
  };

  const getStatusText = (status) => {
    // Tạm thời return 'Hoạt động' vì backend chưa có status field
    return 'Hoạt động';
  };

  const getPatientName = (record) => {
    // Ưu tiên lấy từ record.patient hoặc record.Patient
    let name = record.patient?.fullName || record.Patient?.FullName;
    if (!name && record.patientId) {
      // Tìm trong danh sách patients
      const found = patients.find(p => (p.id || p.Id) === (record.patientId || record.PatientId));
      if (found) name = found.fullName || found.FullName;
    }
    return name || 'N/A';
  };

  const isCompleted = (record) => {
    // Có thể là 'Completed', 2, hoặc backend quy định khác
    const status = record.status || record.Status;
    return status === 'Completed' || status === 2;
  };

  const filteredRecords = medicalRecords.filter(record => {
    if (!isCompleted(record)) return false;
    const patientName = getPatientName(record);
    const diagnosis = record.diagnosis || record.Diagnosis || '';
    const matchesSearch = patientName.toLowerCase().includes(searchText.toLowerCase()) ||
                         diagnosis.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    {
      title: 'Tên bệnh nhân',
      dataIndex: ['patient', 'fullName'],
      key: 'patientName',
      render: (_text, record) => {
        return <strong>{getPatientName(record)}</strong>;
      },
    },
    {
      title: 'Chẩn đoán',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      ellipsis: true,
      render: (text, record) => {
        const diagnosis = record.diagnosis || record.Diagnosis || 'Chưa có chẩn đoán';
        return (
          <Tooltip title={diagnosis}>
            <span>{diagnosis}</span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Triệu chứng',
      dataIndex: 'symptoms',
      key: 'symptoms',
      ellipsis: true,
      render: (text, record) => {
        const symptoms = record.symptoms || record.Symptoms || 'Chưa có triệu chứng';
        return (
          <Tooltip title={symptoms}>
            <span>{symptoms}</span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Ngày khám',
      dataIndex: 'examinationDate',
      key: 'examinationDate',
      render: (date, record) => {
        const examDate = record.examinationDate || record.ExaminationDate;
        return examDate ? new Date(examDate).toLocaleDateString('vi-VN') : '-';
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => {
        const status = record.status || record.Status;
        let color = 'default';
        let text = 'Không rõ';
        if (status === 2) {
          color = 'green';
          text = 'Hoàn thành';
        } else if (status === 1) {
          color = 'blue';
          text = 'Đang điều trị';
        } else if (status === 0) {
          color = 'orange';
          text = 'Khởi tạo';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewRecord(record.id || record.Id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Lịch sử khám bệnh"
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchPatientTreatmentProtocols}
              loading={loading}
            >
              Làm mới
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Search
              placeholder="Tìm kiếm theo tên bệnh nhân hoặc chẩn đoán"
              allowClear
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredRecords}
          rowKey={(record) => record.id || record.Id}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} hồ sơ`,
          }}
        />
      </Card>

      <Modal
        title="Chi tiết hồ sơ bệnh án"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedRecord(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsModalVisible(false);
            setSelectedRecord(null);
          }}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedRecord && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p><strong>Tên bệnh nhân:</strong> {getPatientName(selectedRecord)}</p>
                <p><strong>Ngày sinh:</strong> {selectedRecord.patient?.dateOfBirth ? new Date(selectedRecord.patient.dateOfBirth).toLocaleDateString('vi-VN') : (selectedRecord.Patient?.DateOfBirth ? new Date(selectedRecord.Patient.DateOfBirth).toLocaleDateString('vi-VN') : (patients.find(p => (p.id || p.Id) === (selectedRecord.patientId || selectedRecord.PatientId))?.dateOfBirth ? new Date(patients.find(p => (p.id || p.Id) === (selectedRecord.patientId || selectedRecord.PatientId)).dateOfBirth).toLocaleDateString('vi-VN') : '-'))}</p>
                <p><strong>Giới tính:</strong> {selectedRecord.patient?.gender || selectedRecord.Patient?.Gender || (patients.find(p => (p.id || p.Id) === (selectedRecord.patientId || selectedRecord.PatientId))?.gender) || 'N/A'}</p>
                <p><strong>Số điện thoại:</strong> {selectedRecord.patient?.phoneNumber || selectedRecord.Patient?.PhoneNumber || (patients.find(p => (p.id || p.Id) === (selectedRecord.patientId || selectedRecord.PatientId))?.phoneNumber) || 'N/A'}</p>
                <p><strong>Địa chỉ:</strong> {selectedRecord.patient?.address || selectedRecord.Patient?.Address || (patients.find(p => (p.id || p.Id) === (selectedRecord.patientId || selectedRecord.PatientId))?.address) || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Bác sĩ điều trị:</strong> {selectedRecord.doctor?.fullName || selectedRecord.Doctor?.FullName || currentDoctor?.fullName || 'N/A'}</p>
                <p><strong>Ngày khám:</strong> {selectedRecord.examinationDate ? new Date(selectedRecord.examinationDate).toLocaleDateString('vi-VN') : (selectedRecord.ExaminationDate ? new Date(selectedRecord.ExaminationDate).toLocaleDateString('vi-VN') : '-')}</p>
                <p><strong>Trạng thái:</strong> 
                  <Tag color="green" style={{ marginLeft: 8 }}>
                    Hoạt động
                  </Tag>
                </p>
              </div>
            </div>
            
            <div style={{ marginTop: 16 }}>
              <p><strong>Triệu chứng:</strong></p>
              <p style={{ padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                {selectedRecord.symptoms || selectedRecord.Symptoms || 'Chưa có triệu chứng'}
              </p>
            </div>

            <div style={{ marginTop: 16 }}>
              <p><strong>Chẩn đoán:</strong></p>
              <p style={{ padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                {selectedRecord.diagnosis || selectedRecord.Diagnosis || 'Chưa có chẩn đoán'}
              </p>
            </div>

            <div style={{ marginTop: 16 }}>
              <p><strong>Đơn thuốc:</strong></p>
              <p style={{ padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                {selectedRecord.prescription || selectedRecord.Prescription || 'Chưa có đơn thuốc'}
              </p>
            </div>

            <div style={{ marginTop: 16 }}>
              <p><strong>Ghi chú:</strong></p>
              <p style={{ padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                {selectedRecord.notes || selectedRecord.Notes || 'Không có ghi chú'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MedicalHistory;