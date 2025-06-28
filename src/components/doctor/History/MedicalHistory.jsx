import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Space, Tag, Tooltip, Input, Select, DatePicker, message, Form } from 'antd';
import { EyeOutlined, ReloadOutlined, SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { medicalRecordService } from '../../../services';
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
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
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
    fetchMedicalRecords();
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

  const fetchMedicalRecords = async () => {
    setLoading(true);
    try {
      const data = await medicalRecordService.getAllMedicalRecords();
      console.log('Fetched medical records:', data);
      
      // Lọc chỉ các medical records của bác sĩ hiện tại
      const currentUser = authService.getCurrentUser();
      const doctorId = currentUser?.doctorId || currentUser?.id;
      
      const doctorRecords = data.filter(record => {
        const recordDoctorId = record.doctorId || record.DoctorId;
        return recordDoctorId === doctorId;
      });
      
      console.log('Filtered doctor records:', doctorRecords);
      setMedicalRecords(doctorRecords);
    } catch (error) {
      message.error('Không thể tải danh sách hồ sơ bệnh án');
      console.error('Error fetching medical records:', error);
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

      const recordData = {
        PatientId: values.patientId,
        DoctorId: doctorId,
        TreatmentStageId: values.treatmentStageId,
        ExaminationDate: values.examinationDate.toISOString(),
        Diagnosis: values.diagnosis,
        Symptoms: values.symptoms,
        Prescription: values.prescription,
        Notes: values.notes
      };

      console.log('Creating medical record with data:', recordData);
      
      await medicalRecordService.createMedicalRecord(recordData);
      message.success('Tạo hồ sơ bệnh án thành công!');
      
      // Reset form và đóng modal
      createForm.resetFields();
      setIsCreateModalVisible(false);
      
      // Refresh danh sách
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

  const filteredRecords = medicalRecords.filter(record => {
    const patientName = record.patient?.fullName || record.Patient?.FullName || '';
    const diagnosis = record.diagnosis || record.Diagnosis || '';
    
    const matchesSearch = patientName.toLowerCase().includes(searchText.toLowerCase()) ||
                         diagnosis.toLowerCase().includes(searchText.toLowerCase());
    // Tạm thời bỏ filter theo status vì backend chưa có
    return matchesSearch;
  });

  const columns = [
    {
      title: 'Tên bệnh nhân',
      dataIndex: ['patient', 'fullName'],
      key: 'patientName',
      render: (text, record) => {
        const patientName = record.patient?.fullName || record.Patient?.FullName || 'N/A';
        return <strong>{patientName}</strong>;
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
      render: () => (
        <Tag color="green">
          Hoạt động
        </Tag>
      ),
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
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
            >
              Tạo hồ sơ mới
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchMedicalRecords}
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
                <p><strong>Tên bệnh nhân:</strong> {selectedRecord.patient?.fullName || selectedRecord.Patient?.FullName || 'N/A'}</p>
                <p><strong>Ngày sinh:</strong> {selectedRecord.patient?.dateOfBirth ? new Date(selectedRecord.patient.dateOfBirth).toLocaleDateString('vi-VN') : (selectedRecord.Patient?.DateOfBirth ? new Date(selectedRecord.Patient.DateOfBirth).toLocaleDateString('vi-VN') : '-')}</p>
                <p><strong>Giới tính:</strong> {selectedRecord.patient?.gender || selectedRecord.Patient?.Gender || 'N/A'}</p>
                <p><strong>Số điện thoại:</strong> {selectedRecord.patient?.phoneNumber || selectedRecord.Patient?.PhoneNumber || 'N/A'}</p>
                <p><strong>Địa chỉ:</strong> {selectedRecord.patient?.address || selectedRecord.Patient?.Address || 'N/A'}</p>
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

      {/* Modal tạo medical record mới */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusOutlined style={{ color: '#1890ff' }} />
            <span>Tạo hồ sơ bệnh án mới</span>
          </div>
        }
        open={isCreateModalVisible}
        onCancel={handleCancelCreate}
        footer={null}
        width={900}
        destroyOnClose={true}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateRecord}
          autoComplete="off"
          initialValues={{
            examinationDate: null,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <Form.Item
              label="Bệnh nhân"
              name="patientId"
              rules={[{ required: true, message: 'Vui lòng chọn bệnh nhân!' }]}
            >
              <Select
                placeholder="Chọn bệnh nhân"
                showSearch
                loading={loadingPatients}
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {patients.map((patient) => (
                  <Option 
                    key={patient.id || patient.Id} 
                    value={patient.id || patient.Id}
                  >
                    {patient.fullName || patient.FullName} - {patient.phoneNumber || patient.PhoneNumber}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Giai đoạn điều trị"
              name="treatmentStageId"
              rules={[{ required: true, message: 'Vui lòng chọn giai đoạn điều trị!' }]}
            >
              <Select
                placeholder="Chọn giai đoạn điều trị"
                loading={loadingTreatmentStages}
              >
                {treatmentStages.map((stage) => (
                  <Option 
                    key={stage.id || stage.Id} 
                    value={stage.id || stage.Id}
                  >
                    {stage.stageName || stage.StageName || `Giai đoạn ${stage.stageOrder || stage.StageOrder || ''}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Ngày khám"
              name="examinationDate"
              rules={[{ required: true, message: 'Vui lòng chọn ngày khám!' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày khám"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Triệu chứng"
            name="symptoms"
            rules={[
              { required: true, message: 'Vui lòng nhập triệu chứng!' },
              { min: 10, message: 'Triệu chứng phải có ít nhất 10 ký tự!' }
            ]}
          >
            <TextArea 
              rows={3} 
              placeholder="Mô tả chi tiết triệu chứng của bệnh nhân..."
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Form.Item
            label="Chẩn đoán"
            name="diagnosis"
            rules={[
              { required: true, message: 'Vui lòng nhập chẩn đoán!' },
              { min: 5, message: 'Chẩn đoán phải có ít nhất 5 ký tự!' }
            ]}
          >
            <TextArea 
              rows={3} 
              placeholder="Nhập chẩn đoán bệnh chi tiết..."
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Form.Item
            label="Đơn thuốc"
            name="prescription"
            rules={[
              { min: 5, message: 'Đơn thuốc phải có ít nhất 5 ký tự!' }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Nhập đơn thuốc và hướng dẫn sử dụng (tùy chọn)..."
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Form.Item
            label="Ghi chú"
            name="notes"
          >
            <TextArea 
              rows={3} 
              placeholder="Ghi chú thêm về tình trạng bệnh nhân (tùy chọn)..."
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
            <Space>
              <Button onClick={handleCancelCreate} size="large">
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={createLoading}
                size="large"
                style={{ minWidth: '120px' }}
              >
                {createLoading ? 'Đang tạo...' : 'Tạo hồ sơ'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicalHistory; 