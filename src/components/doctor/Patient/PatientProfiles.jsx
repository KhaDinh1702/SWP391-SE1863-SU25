import { useState, useEffect } from 'react';
import { Table, Spin, Alert, Typography, Avatar, Input, Modal, Button, Form, DatePicker, Select, message, Space, Input as AntInput } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { appointmentService } from '../../../services/appointmentService';
import { doctorService } from '../../../services/doctorService';
import { patientService } from '../../../services/patientService';
import { medicalRecordService } from '../../../services/medicalRecordService';
import { treatmentStageService } from '../../../services/treatmentStageService';
import { authService } from '../../../services/authService';
import moment from 'moment';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = AntInput;

const PatientProfiles = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [treatmentStages, setTreatmentStages] = useState([]);
  const [loadingTreatmentStages, setLoadingTreatmentStages] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [allDoctors, setAllDoctors] = useState([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
          setLoading(false);
          return;
        }

        console.log('Fetching patient data for userId:', userId);

        // Get current doctor info
        const allDoctors = await doctorService.getAllDoctors();
        console.log('All doctors:', allDoctors);
        
        const currentDoctor = allDoctors.find(d => d.userId === userId);
        console.log('Current doctor:', currentDoctor);

        if (!currentDoctor) {
          setError('Không thể tìm thấy thông tin bác sĩ.');
          setLoading(false);
          return;
        }

        const doctorId = currentDoctor.id;
        console.log('Doctor ID:', doctorId);

        // Method 1: Try to get appointments by doctor
        let uniquePatients = [];
        try {
          const doctorAppointmentsResponse = await appointmentService.getAppointmentsByDoctor(doctorId);
          console.log('Doctor appointments response:', doctorAppointmentsResponse);
          
          if (doctorAppointmentsResponse && Array.isArray(doctorAppointmentsResponse.appointments)) {
            const doctorAppointments = doctorAppointmentsResponse.appointments;
            console.log('Doctor appointments:', doctorAppointments);

            // Extract patients from appointments
            const patientMap = new Map();
            doctorAppointments.forEach(appointment => {
              if (appointment.patient && !patientMap.has(appointment.patient.id)) {
                patientMap.set(appointment.patient.id, appointment.patient);
              }
            });
            uniquePatients = Array.from(patientMap.values());
            console.log('Patients from appointments method 1:', uniquePatients);
          }
        } catch (appointmentError) {
          console.log('Method 1 failed, trying method 2:', appointmentError.message);
        }

        // Method 2: If method 1 failed or returned no patients, try getting all appointments and filter
        if (uniquePatients.length === 0) {
          try {
            const allAppointments = await appointmentService.getAllAppointments();
            console.log('All appointments:', allAppointments);
            
            const allPatients = await patientService.getAllPatients();
            console.log('All patients:', allPatients);

            // Filter appointments for this doctor
            const doctorAppointments = allAppointments.filter(appointment => 
              (appointment.doctorId === doctorId || appointment.DoctorId === doctorId)
            );
            console.log('Filtered doctor appointments:', doctorAppointments);

            // Extract unique patient IDs from appointments
            const patientIds = new Set();
            doctorAppointments.forEach(appointment => {
              const patientId = appointment.patientId || appointment.PatientId;
              if (patientId) {
                patientIds.add(patientId);
              }
            });
            console.log('Patient IDs from appointments:', Array.from(patientIds));

            // Match patients with appointments and filter only active patients
            const patientMap = new Map();
            allPatients.forEach(patient => {
              if (patientIds.has(patient.id) && (patient.isActive !== false && patient.IsActive !== false)) {
                patientMap.set(patient.id, patient);
              }
            });
            uniquePatients = Array.from(patientMap.values());
            console.log('Patients from appointments method 2:', uniquePatients);
          } catch (fallbackError) {
            console.error('Method 2 also failed:', fallbackError);
          }
        }

        // Method 3: If still no patients, show all active patients (fallback)
        if (uniquePatients.length === 0) {
          try {
            console.log('No patients found from appointments, showing all active patients as fallback');
            const allPatients = await patientService.getAllPatients();
            // Filter only active patients
            uniquePatients = allPatients.filter(patient => 
              patient.isActive !== false && patient.IsActive !== false
            );
            console.log('All active patients as fallback:', uniquePatients);
          } catch (allPatientsError) {
            console.error('Method 3 also failed:', allPatientsError);
            setError('Không thể tải danh sách bệnh nhân. Vui lòng thử lại sau.');
            setLoading(false);
            return;
          }
        }

        console.log('Final patients list:', uniquePatients);
        if (uniquePatients.length > 0) {
          console.log('Sample patient data structure:', uniquePatients[0]);
          console.log('Patient properties:', Object.keys(uniquePatients[0]));
        }
        setPatients(uniquePatients);
        setFilteredPatients(uniquePatients);

      } catch (err) {
        console.error('Error in fetchPatientData:', err);
        setError('Lỗi khi tải danh sách bệnh nhân: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  useEffect(() => {
    fetchTreatmentStages();
  }, []);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchTreatmentStages = async () => {
    setLoadingTreatmentStages(true);
    try {
      const data = await treatmentStageService.getAllTreatmentStages();
      setTreatmentStages(data);
    } catch (error) {
      message.error('Không thể tải danh sách giai đoạn điều trị');
    } finally {
      setLoadingTreatmentStages(false);
    }
  };

  const fetchMedicalRecords = async () => {
    setLoadingRecords(true);
    try {
      const data = await medicalRecordService.getAllMedicalRecords();
      console.log('API response medical records:', data); // Log dữ liệu thực tế từ backend
      setMedicalRecords(data);
    } catch (error) {
      message.error('Không thể tải danh sách hồ sơ bệnh án');
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedPatient(null);
    setIsCreateModalVisible(true);
    createForm.resetFields();
  };

  const handleCreateRecord = async (values) => {
    setCreateLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      const doctorId = currentUser?.doctorId || currentUser?.id;
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
      fetchMedicalRecords(); // Refresh medical records list
    } catch (error) {
      message.error('Không thể tạo hồ sơ bệnh án: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSearch = (value) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = patients.filter(p => 
        (p.fullName || p.FullName || '').toLowerCase().includes(lowercasedValue) ||
        (p.address || p.Address || '').toLowerCase().includes(lowercasedValue) ||
        (p.contactPersonName || p.ContactPersonName || '').toLowerCase().includes(lowercasedValue)
    );
    setFilteredPatients(filtered);
  };
  
  const columns = [
    {
      title: 'Bệnh nhân',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => {
        console.log('Rendering patient:', record); // Debug log
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
            <span>{text || record.FullName || 'N/A'}</span>
          </div>
        );
      },
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (text, record) => {
        const date = text || record.DateOfBirth;
        return date ? moment(date).format('DD/MM/YYYY') : 'N/A';
      },
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender, record) => {
        console.log('Gender data:', { gender, recordGender: record.Gender, record }); // Debug log
        const genderValue = gender !== undefined ? gender : record.Gender;
        if (genderValue === 0 || genderValue === 'Male') return 'Nam';
        if (genderValue === 1 || genderValue === 'Female') return 'Nữ';
        if (genderValue === 2 || genderValue === 'Other') return 'Khác';
        return `N/A (${genderValue})`;
      },
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => {
        const address = text || record.Address;
        return address || 'N/A';
      },
    },
    {
      title: 'Người liên hệ',
      dataIndex: 'contactPersonName',
      key: 'contactPersonName',
      render: (text, record) => {
        console.log('Contact person data:', { text, recordContactPersonName: record.ContactPersonName, record }); // Debug log
        const contactName = text || record.ContactPersonName;
        return contactName || 'N/A';
      },
    },
    {
      title: 'SĐT người liên hệ',
      dataIndex: 'contactPersonPhone',
      key: 'contactPersonPhone',
      render: (text, record) => {
        console.log('Contact phone data:', { text, recordContactPersonPhone: record.ContactPersonPhone, record }); // Debug log
        const contactPhone = text || record.ContactPersonPhone;
        return contactPhone || 'N/A';
      },
    },
  ];

  const medicalRecordColumns = [
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientId',
      key: 'patientId',
      width: 150,
      render: (patientId) => {
        const patient = patients.find(p => (p.id || p.Id) === patientId);
        return patient ? (patient.fullName || patient.FullName) : 'N/A';
      },
    },
    {
      title: 'Ngày khám',
      dataIndex: 'examinationDate',
      key: 'examinationDate',
      width: 120,
      render: (date, record) => {
        const d = date || record.ExaminationDate;
        return d ? moment(d).format('DD/MM/YYYY') : '-';
      },
    },
    {
      title: 'Chẩn đoán',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      width: 200,
      ellipsis: true,
      render: (text, record) => text || record.Diagnosis || '-',
    },
    {
      title: 'Triệu chứng',
      dataIndex: 'symptoms',
      key: 'symptoms',
      width: 200,
      ellipsis: true,
      render: (text, record) => text || record.Symptoms || '-',
    },
    {
      title: 'Đơn thuốc',
      dataIndex: 'prescription',
      key: 'prescription',
      width: 200,
      ellipsis: true,
      render: (text, record) => text || record.Prescription || '-',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      width: 200,
      ellipsis: true,
      render: (text, record) => text || record.Notes || '-',
    },
  ];

  return (
    <div>
      <Title level={4}>Danh sách Bệnh nhân</Title>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm bệnh nhân theo tên, địa chỉ hoặc người liên hệ"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 400 }}
          enterButton
        />
      </div>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredPatients}
          rowKey={(record) => record.id || record.Id || Math.random()}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: 'Không có bệnh nhân nào'
          }}
        />
      </Spin>
      <Modal
        title={<span>Tạo hồ sơ bệnh án mới</span>}
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
        width={900}
        destroyOnClose={true}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateRecord}
          autoComplete="off"
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
              <Button onClick={() => setIsCreateModalVisible(false)} size="large">
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createLoading}
                size="large"
                style={{ minWidth: '120px' }}
              >
                {createLoading ? 'Đang tạo...' : 'Tạo hồ sơ bệnh án'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
      <div style={{ marginTop: 40 }}>
        <Title level={4}>Danh sách Hồ sơ bệnh án</Title>
        <Spin spinning={loadingRecords}>
          <Table
            columns={medicalRecordColumns}
            dataSource={medicalRecords}
            rowKey={record => record.id || record.Id || Math.random()}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: 'Không có hồ sơ bệnh án nào' }}
            scroll={{ x: 1200 }}
            size="middle"
          />
        </Spin>
      </div>
    </div>
  );
};

export default PatientProfiles;