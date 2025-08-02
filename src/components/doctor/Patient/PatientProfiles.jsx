import { useState, useEffect } from 'react';
import { Table, Spin, Alert, Typography, Avatar, Input, Modal, Button, Form, DatePicker, Select, message, Space, Input as AntInput } from 'antd';
import { UserOutlined, EditOutlined, MedicineBoxOutlined } from '@ant-design/icons';
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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isPrescriptionModalVisible, setIsPrescriptionModalVisible] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loadingPrescription, setLoadingPrescription] = useState(false);

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

        // Get current doctor info
        const allDoctors = await doctorService.getAllDoctors();
        
        const currentDoctor = allDoctors.find(d => d.userId === userId);

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
    // Không load medical records ngay từ đầu, chỉ load khi user chọn patient
    // fetchMedicalRecords();
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

  const fetchMedicalRecordsForPatient = async (patientId) => {
    if (!patientId) {
      setMedicalRecords([]);
      return;
    }
    
    setLoadingRecords(true);
    try {
      // Kiểm tra xem service có method getListMedicalRecord không
      let data;
      if (medicalRecordService.getListMedicalRecord) {
        data = await medicalRecordService.getListMedicalRecord(patientId);
      } else {
        // Fallback: load tất cả rồi filter
        const allRecords = await medicalRecordService.getAllMedicalRecords();
        data = allRecords.filter(record => 
          (record.patientId === patientId || record.PatientId === patientId)
        );
      }
      console.log(`=== MEDICAL RECORDS DEBUG ===`);
      console.log(`Medical records for patient ${patientId}:`, data);
      if (data && data.length > 0) {
        console.log('Sample record structure:', data[0]);
        console.log('Sample record properties:', Object.keys(data[0]));
        console.log('Sample record ID:', data[0].id || data[0].Id);
      }
      console.log('=== END MEDICAL RECORDS DEBUG ===');
      setMedicalRecords(data);
    } catch (error) {
      console.error('Error fetching medical records for patient:', error);
      message.error('Không thể tải hồ sơ bệnh án của bệnh nhân này');
      setMedicalRecords([]);
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
      
      const recordData = {
        patientId: values.patientId,
        doctorId: doctorId,
        treatmentStageId: values.treatmentStageId,
        examinationDate: values.examinationDate ? values.examinationDate.toISOString() : null,
        diagnosis: values.diagnosis,
        symptoms: values.symptoms,
        prescriptionNote: values.prescriptionNote,
        notes: values.notes
      };

      await medicalRecordService.createMedicalRecord(recordData);
      message.success('Tạo hồ sơ bệnh án thành công!');
      createForm.resetFields();
      setIsCreateModalVisible(false);
      // Refresh medical records list for selected patient
      if (selectedPatient) {
        fetchMedicalRecordsForPatient(selectedPatient.id || selectedPatient.Id);
      }
    } catch (error) {
      message.error('Không thể tạo hồ sơ bệnh án: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setCreateLoading(false);
    }
  };

  const handleViewPrescription = async (record) => {
    setLoadingPrescription(true);
    setIsPrescriptionModalVisible(true);
    setSelectedPrescription(null);

    try {
      console.log('=== PRESCRIPTION DEBUG ===');
      console.log('Medical record:', record);
      console.log('Medical record ID:', record.id || record.Id);
      console.log('Looking for prescriptionId in record...');
      
      let prescriptionData = null;
      
      // Cách 1: Nếu medical record có prescriptionId, gọi API để lấy prescription chi tiết
      if (record.prescriptionId || record.PrescriptionId) {
        try {
          const prescriptionId = record.prescriptionId || record.PrescriptionId;
          console.log('Method 1: Found prescriptionId:', prescriptionId);
          
          const apiPrescription = await treatmentStageService.getPrescriptionById(prescriptionId);
          console.log('API prescription response (by prescriptionId):', apiPrescription);
          
          if (apiPrescription) {
            prescriptionData = {
              ...apiPrescription,
              medicalRecordInfo: {
                examinationDate: record.examinationDate,
                diagnosis: record.diagnosis,
                symptoms: record.symptoms,
                notes: record.notes
              },
              isFromAPI: true,
              method: 'prescriptionId'
            };
          }
        } catch (apiError) {
          console.log('Method 1 failed:', apiError.message);
        }
      }
      
      // Cách 2: Nếu không có prescriptionId, thử tìm prescription bằng medicalRecordId
      if (!prescriptionData && (record.id || record.Id)) {
        try {
          const medicalRecordId = record.id || record.Id;
          console.log('Method 2: Using medicalRecordId:', medicalRecordId);
          
          const apiPrescription = await treatmentStageService.getPrescriptionByMedicalRecordId(medicalRecordId);
          console.log('API prescription response (by medicalRecordId):', apiPrescription);
          
          if (apiPrescription) {
            prescriptionData = {
              ...apiPrescription,
              medicalRecordInfo: {
                examinationDate: record.examinationDate,
                diagnosis: record.diagnosis,
                symptoms: record.symptoms,
                notes: record.notes
              },
              isFromAPI: true,
              method: 'medicalRecordId'
            };
          }
        } catch (apiError) {
          console.log('Method 2 failed:', apiError.message);
        }
      }
      
      // Cách 3: Fallback - hiển thị thông tin từ medical record
      if (!prescriptionData) {
        console.log('Method 3: Using fallback data from medical record');
        const hasNote = record.prescriptionNote && record.prescriptionNote.trim() !== '';
        
        prescriptionData = {
          note: hasNote ? record.prescriptionNote : null,
          prescriptionNote: hasNote ? record.prescriptionNote : null,
          items: [],
          medicalRecordInfo: {
            examinationDate: record.examinationDate,
            diagnosis: record.diagnosis,
            symptoms: record.symptoms,
            notes: record.notes
          },
          isFromMedicalRecord: true,
          hasNote: hasNote,
          isEmpty: !hasNote
        };
      }
      
      console.log('Final prescription data:', prescriptionData);
      console.log('=== END DEBUG ===');
      
      setSelectedPrescription(prescriptionData);
      
    } catch (error) {
      console.error('Error viewing prescription:', error);
      message.error('Không thể tải thông tin đơn thuốc');
      setSelectedPrescription(null);
    } finally {
      setLoadingPrescription(false);
    }
  };

  const handleOpenEditModal = (record) => {
    console.log('=== EDIT MODAL DEBUG ===');
    console.log('Full record object:', record);
    console.log('Record properties:', Object.keys(record));
    console.log('Record.id:', record.id);
    console.log('Record.Id:', record.Id);
    console.log('Record ID final:', record.id || record.Id);
    console.log('Current selectedPatient:', selectedPatient);
    console.log('=== END EDIT MODAL DEBUG ===');
    
    // Validate record ID
    const recordId = record.id || record.Id;
    if (!recordId || recordId === '00000000-0000-0000-0000-000000000000') {
      message.error('ID hồ sơ bệnh án không hợp lệ: ' + recordId);
      return;
    }
    
    setSelectedRecord(record);
    setIsEditModalVisible(true);
    
    // Populate form with existing data
    editForm.setFieldsValue({
      dateOfVisit: record.examinationDate ? moment(record.examinationDate) : null,
      treatmentStageId: record.treatmentStageId || record.TreatmentStageId,
      diagnosis: record.diagnosis,
      symptoms: record.symptoms,
      prescriptionNote: record.prescriptionNote,
      notes: record.notes
    });
  };

  const handleUpdateRecord = async (values) => {
    if (!selectedRecord) {
      console.log('❌ No selectedRecord');
      return;
    }
    
    setEditLoading(true);
    try {
      console.log('=== UPDATE RECORD DEBUG ===');
      console.log('selectedRecord object:', selectedRecord);
      console.log('selectedRecord properties:', Object.keys(selectedRecord));
      console.log('selectedRecord.id:', selectedRecord.id);
      console.log('selectedRecord.Id:', selectedRecord.Id);
      
      const recordId = selectedRecord.id || selectedRecord.Id;
      console.log('Final recordId:', recordId);
      
      const currentUser = authService.getCurrentUser();
      const doctorId = currentUser?.doctorId || currentUser?.id;
      
      console.log('Update record data:', {
        selectedRecord,
        recordId,
        doctorId,
        selectedPatient,
        patientIdFromRecord: selectedRecord.patientId || selectedRecord.PatientId,
        patientIdFromSelected: selectedPatient?.id || selectedPatient?.Id,
        values
      });

      // Validate recordId
      if (!recordId || recordId === '00000000-0000-0000-0000-000000000000') {
        console.log('❌ Invalid record ID:', recordId);
        throw new Error('ID hồ sơ bệnh án không hợp lệ: ' + recordId);
      }
      
      const recordData = {
        MedicalRecordId: recordId,  // Backend expects MedicalRecordId
        PatientId: selectedRecord.patientId || selectedRecord.PatientId || selectedPatient?.id || selectedPatient?.Id,  // Backend expects PatientId
        DoctorId: doctorId,  // Backend expects DoctorId
        TreatmentStageId: values.treatmentStageId,  // Backend expects TreatmentStageId
        ExaminationDate: values.dateOfVisit ? values.dateOfVisit.toISOString() : null,  // Backend expects ExaminationDate
        Diagnosis: values.diagnosis,
        Symptoms: values.symptoms,
        PrescriptionNote: values.prescriptionNote,  // Backend expects PrescriptionNote
        Notes: values.notes
      };

      console.log('Sending record data:', recordData);
      
      await medicalRecordService.updateMedicalRecord(recordData);
      message.success('Cập nhật hồ sơ bệnh án thành công!');
      // Chỉ reset form và close modal sau khi update thành công
      editForm.resetFields();
      setIsEditModalVisible(false);
      setSelectedRecord(null);
      // Refresh medical records list for selected patient
      if (selectedPatient) {
        fetchMedicalRecordsForPatient(selectedPatient.id || selectedPatient.Id);
      }
    } catch (error) {
      console.error('Update error details:', error);
      message.error('Không thể cập nhật hồ sơ bệnh án: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setEditLoading(false);
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
      render: (date) => {
        return date ? moment(date).format('DD/MM/YYYY') : '-';
      },
    },
    {
      title: 'Chẩn đoán',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      width: 200,
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: 'Triệu chứng',
      dataIndex: 'symptoms',
      key: 'symptoms',
      width: 200,
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: 'Ghi chú đơn thuốc',
      dataIndex: 'prescriptionNote',
      key: 'prescriptionNote',
      width: 200,
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      width: 200,
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpenEditModal(record)}
            title="Chỉnh sửa hồ sơ bệnh án"
          >
            Sửa
          </Button>
          <Button
            type="default"
            icon={<MedicineBoxOutlined />}
            size="small"
            onClick={() => handleViewPrescription(record)}
            title="Xem đơn thuốc"
          >
            Đơn thuốc
          </Button>
        </Space>
      ),
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
          onRow={(record) => ({
            onClick: () => {
              console.log('Selected patient:', record);
              setSelectedPatient(record);
              fetchMedicalRecordsForPatient(record.id || record.Id);
            },
            style: {
              cursor: 'pointer',
              backgroundColor: selectedPatient?.id === record.id || selectedPatient?.Id === record.Id ? '#e6f7ff' : undefined
            }
          })}
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
            label="Ghi chú đơn thuốc"
            name="prescriptionNote"
            rules={[
              { min: 5, message: 'Ghi chú đơn thuốc phải có ít nhất 5 ký tự!' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập ghi chú về đơn thuốc và hướng dẫn sử dụng (tùy chọn)..."
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

      {/* Edit Medical Record Modal */}
      <Modal
        title="Chỉnh sửa hồ sơ bệnh án"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          // Không reset form và selectedRecord để giữ state
        }}
        footer={null}
        width={800}
        destroyOnClose={false}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateRecord}
          preserve={true}
        >
          <Form.Item
            name="dateOfVisit"
            label="Ngày khám"
            rules={[{ required: true, message: 'Vui lòng chọn ngày khám!' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="DD/MM/YYYY"
              placeholder="Chọn ngày khám"
            />
          </Form.Item>

          <Form.Item
            name="treatmentStageId"
            label="Giai đoạn điều trị"
            rules={[{ required: true, message: 'Vui lòng chọn giai đoạn điều trị!' }]}
          >
            <Select
              placeholder="Chọn giai đoạn điều trị"
              loading={loadingTreatmentStages}
              disabled={loadingTreatmentStages}
            >
              {treatmentStages.map((stage) => (
                <Option key={stage.id || stage.Id} value={stage.id || stage.Id}>
                  {stage.stageName || stage.StageName || `Giai đoạn ${stage.id || stage.Id}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="diagnosis"
            label="Chẩn đoán"
            rules={[{ required: true, message: 'Vui lòng nhập chẩn đoán!' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Nhập chẩn đoán chi tiết..."
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="symptoms"
            label="Triệu chứng"
          >
            <TextArea 
              rows={3} 
              placeholder="Nhập triệu chứng..."
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="prescriptionNote"
            label="Ghi chú đơn thuốc"
            rules={[{ required: true, message: 'Vui lòng nhập ghi chú đơn thuốc!' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Nhập ghi chú về đơn thuốc và phương pháp điều trị..."
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea 
              rows={2} 
              placeholder="Nhập ghi chú thêm (nếu có)..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => {
                editForm.resetFields();
              }} size="large">
                Xóa form
              </Button>
              <Button onClick={() => {
                setIsEditModalVisible(false);
                // Không reset form và selectedRecord để giữ state
              }} size="large">
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={editLoading}
                size="large"
                style={{ minWidth: '120px' }}
              >
                {editLoading ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      <div style={{ marginTop: 40 }}>
        <Title level={4}>
          Danh sách Hồ sơ bệnh án
          {selectedPatient && (
            <span style={{ color: '#1890ff', fontWeight: 'normal', fontSize: '16px' }}>
              {' - '}{selectedPatient.fullName || selectedPatient.FullName}
            </span>
          )}
        </Title>
        
        {!selectedPatient ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#999',
            border: '1px dashed #d9d9d9',
            borderRadius: '6px'
          }}>
            <p>Vui lòng chọn một bệnh nhân từ danh sách bên trên để xem hồ sơ bệnh án</p>
          </div>
        ) : (
          <Spin spinning={loadingRecords}>
            <Table
              columns={medicalRecordColumns}
              dataSource={medicalRecords}
              rowKey={record => record.id || record.Id || Math.random()}
              pagination={{ pageSize: 10 }}
              locale={{ emptyText: 'Bệnh nhân này chưa có hồ sơ bệnh án nào' }}
              scroll={{ x: 1200 }}
              size="middle"
            />
          </Spin>
        )}
      </div>

      {/* Prescription Modal */}
      <Modal
        title="Thông tin đơn thuốc"
        open={isPrescriptionModalVisible}
        onCancel={() => setIsPrescriptionModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsPrescriptionModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
        destroyOnClose={true}
      >
        <Spin spinning={loadingPrescription}>
          {selectedPrescription ? (
            <div>
              {/* Medical Record Info */}
              <div style={{ marginBottom: 20, padding: 16, backgroundColor: '#f0f2f5', borderRadius: 8 }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#1890ff' }}>Thông tin khám bệnh</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <strong>Ngày khám:</strong>
                    <div style={{ marginTop: 4 }}>
                      {selectedPrescription.medicalRecordInfo?.examinationDate 
                        ? moment(selectedPrescription.medicalRecordInfo.examinationDate).format('DD/MM/YYYY')
                        : 'N/A'
                      }
                    </div>
                  </div>
                  <div>
                    <strong>Chẩn đoán:</strong>
                    <div style={{ marginTop: 4 }}>
                      {selectedPrescription.medicalRecordInfo?.diagnosis || 'N/A'}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <strong>Triệu chứng:</strong>
                  <div style={{ marginTop: 4 }}>
                    {selectedPrescription.medicalRecordInfo?.symptoms || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Prescription Note */}
              {selectedPrescription.isEmpty ? (
                <div style={{ 
                  marginBottom: 20, 
                  padding: 20, 
                  backgroundColor: '#fff2f0', 
                  borderRadius: 8, 
                  border: '1px solid #ffccc7',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '48px', color: '#ff7875', marginBottom: 12 }}>💊</div>
                  <h4 style={{ margin: '0 0 8px 0', color: '#cf1322' }}>
                    Chưa có đơn thuốc
                  </h4>
                  <p style={{ margin: 0, color: '#8c8c8c' }}>
                    Bệnh nhân này chưa được kê đơn thuốc nào.<br/>
                    Bác sĩ có thể thêm đơn thuốc trong phần quản lý điều trị.
                  </p>
                </div>
              ) : (
                <div style={{ marginBottom: 20, padding: 16, backgroundColor: '#f6ffed', borderRadius: 8, border: '1px solid #b7eb8f' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#389e0d' }}>
                    Ghi chú đơn thuốc
                    {selectedPrescription.isFromAPI && (
                      <span style={{ marginLeft: 8, fontSize: '12px', color: '#52c41a', fontWeight: 'normal' }}>
                        (Từ cơ sở dữ liệu - {selectedPrescription.method})
                      </span>
                    )}
                    {selectedPrescription.isFromMedicalRecord && (
                      <span style={{ marginLeft: 8, fontSize: '12px', color: '#fa8c16', fontWeight: 'normal' }}>
                        (Từ hồ sơ bệnh án)
                      </span>
                    )}
                  </h4>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {selectedPrescription.prescriptionNote || selectedPrescription.note || 'Không có ghi chú đơn thuốc'}
                  </p>
                </div>
              )}

              {/* Prescription Items */}
              {selectedPrescription.items && selectedPrescription.items.length > 0 ? (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: '0 0 16px 0', color: '#1890ff' }}>Danh sách thuốc chi tiết</h4>
                  {selectedPrescription.items.map((item, index) => (
                    <div key={item.id || index} style={{ 
                      marginBottom: 16, 
                      padding: 16, 
                      border: '1px solid #d9d9d9', 
                      borderRadius: 8,
                      backgroundColor: '#fafafa'
                    }}>
                      <div style={{ marginBottom: 8 }}>
                        <strong style={{ color: '#1890ff' }}>Thuốc #{index + 1}</strong>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <strong>Tên thuốc:</strong>
                          <div style={{ marginTop: 4, padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 4 }}>
                            {item.drugName || 'Không có thông tin'}
                          </div>
                        </div>
                        <div>
                          <strong>Liều lượng:</strong>
                          <div style={{ marginTop: 4, padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 4 }}>
                            {item.frequency || 'Không có thông tin'}
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <strong>Tác dụng phụ:</strong>
                        <div style={{ marginTop: 4, padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 4 }}>
                          {item.dosage || 'Không có thông tin'}
                        </div>
                      </div>
                      {item.instructions && (
                        <div style={{ marginTop: 12 }}>
                          <strong>Hướng dẫn sử dụng:</strong>
                          <div style={{ marginTop: 4, padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 4 }}>
                            {item.instructions}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                !selectedPrescription.isEmpty && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '24px', 
                    color: '#666',
                    border: '1px dashed #d9d9d9',
                    borderRadius: '6px',
                    backgroundColor: '#fafafa'
                  }}>
                    <MedicineBoxOutlined style={{ fontSize: '36px', color: '#d9d9d9', marginBottom: '12px' }} />
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                      {selectedPrescription.isFromAPI 
                        ? 'Đơn thuốc này chưa có thông tin chi tiết về các loại thuốc'
                        : 'Thông tin chi tiết về từng loại thuốc sẽ được hiển thị khi có đơn thuốc chi tiết'
                      }
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                      {selectedPrescription.isFromMedicalRecord 
                        ? 'Hiện tại chỉ hiển thị ghi chú đơn thuốc từ hồ sơ bệnh án'
                        : 'Đơn thuốc từ cơ sở dữ liệu nhưng chưa có items'
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          ) : !loadingPrescription ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#999'
            }}>
              <MedicineBoxOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
              <p>Không thể tải thông tin đơn thuốc</p>
            </div>
          ) : null}
        </Spin>
      </Modal>
    </div>
  );
};

export default PatientProfiles;