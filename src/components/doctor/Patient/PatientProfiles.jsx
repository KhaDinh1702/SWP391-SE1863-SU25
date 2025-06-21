import { useState, useEffect } from 'react';
import { Table, Spin, Alert, Typography, Avatar, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { appointmentService } from '../../../services/appointmentService';
import { doctorService } from '../../../services/doctorService';
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

        const allDoctors = await doctorService.getAllDoctors();
        const currentDoctor = allDoctors.find(d => d.userId === userId);

        if (!currentDoctor) {
          setError('Không thể tìm thấy thông tin bác sĩ.');
          setLoading(false);
          return;
        }

        const doctorId = currentDoctor.id;
        const doctorAppointmentsResponse = await appointmentService.getAppointmentsByDoctor(doctorId);
        
        if (!doctorAppointmentsResponse || !Array.isArray(doctorAppointmentsResponse.appointments)) {
            setError('Định dạng dữ liệu lịch hẹn không hợp lệ.');
            setLoading(false);
            return;
        }

        const doctorAppointments = doctorAppointmentsResponse.appointments;

        // Use a Map to get unique patients from the appointments
        const patientMap = new Map();
        doctorAppointments.forEach(appointment => {
            if (appointment.patient && !patientMap.has(appointment.patient.id)) {
                patientMap.set(appointment.patient.id, appointment.patient);
            }
        });

        const uniquePatients = Array.from(patientMap.values());
        
        setPatients(uniquePatients);
        setFilteredPatients(uniquePatients);

      } catch (err) {
        setError('Lỗi khi tải danh sách bệnh nhân.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  const handleSearch = (value) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = patients.filter(p => 
        p.fullName.toLowerCase().includes(lowercasedValue) ||
        p.email.toLowerCase().includes(lowercasedValue)
    );
    setFilteredPatients(filtered);
  };
  
  const columns = [
    {
      title: 'Bệnh nhân',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (text) => moment(text).format('DD/MM/YYYY'),
    },
    {
        title: 'Giới tính',
        dataIndex: 'gender',
        key: 'gender',
        render: (gender) => gender === 0 ? 'Nam' : 'Nữ',
    }
  ];

  return (
    <div>
        <Title level={4}>Danh sách Bệnh nhân</Title>
        <Search
            placeholder="Tìm kiếm bệnh nhân theo tên hoặc email"
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
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </Spin>
    </div>
  );
};

export default PatientProfiles; 