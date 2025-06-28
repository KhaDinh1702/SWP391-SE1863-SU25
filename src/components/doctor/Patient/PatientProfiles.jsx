import { useState, useEffect } from 'react';
import { Table, Spin, Alert, Typography, Avatar, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { appointmentService } from '../../../services/appointmentService';
import { doctorService } from '../../../services/doctorService';
import { patientService } from '../../../services/patientService';
import moment from 'moment';

const { Title } = Typography;
const { Search } = Input;

const PatientProfiles = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    }
  ];

  return (
    <div>
        <Title level={4}>Danh sách Bệnh nhân</Title>
        <Search
            placeholder="Tìm kiếm bệnh nhân theo tên, địa chỉ hoặc người liên hệ"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: 16, maxWidth: 400 }}
            enterButton
        />
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
    </div>
  );
};

export default PatientProfiles; 