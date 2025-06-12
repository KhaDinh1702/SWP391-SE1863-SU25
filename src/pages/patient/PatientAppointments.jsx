import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUserMd, FaHospital, FaTimes, FaCheck, FaSpinner, FaVideo } from 'react-icons/fa';
import { authService } from "../../services/authService";

export default function PatientAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed', 'cancelled'

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:5275/api/Appointment/get-list-appointment`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            errorData
          });
          throw new Error(errorData.message || `Failed to fetch appointments: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched appointments:', data); // Debug log
        
        // Filter appointments for the current patient
        const patientAppointments = data.filter(apt => 
          apt.patientId === currentUser.patientId || 
          apt.PatientId === currentUser.patientId
        );

        // Fetch doctor information for each appointment
        const appointmentsWithDoctorInfo = await Promise.all(
          patientAppointments.map(async (apt) => {
            try {
              const doctorId = apt.doctorId || apt.DoctorId;
              if (!doctorId) return apt;

              const allDoctorsResponse = await fetch('http://localhost:5275/api/Doctor/get-list-doctor', {
                headers: {
                  'Authorization': `Bearer ${currentUser.token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (!allDoctorsResponse.ok) {
                console.error('Error fetching doctors:', {
                  status: allDoctorsResponse.status,
                  statusText: allDoctorsResponse.statusText
                });
                return apt;
              }

              if (allDoctorsResponse.ok) {
                const allDoctors = await allDoctorsResponse.json();
                const doctor = allDoctors.find(d => 
                  d.id === doctorId || 
                  d.Id === doctorId
                );
                if (doctor) {
                  return {
                    ...apt,
                    doctorName: doctor.fullName || doctor.FullName,
                    doctorSpecialization: doctor.specialization || doctor.Specialization || 
                                        doctor.specializations || doctor.Specializations
                  };
                }
              }
              return apt;
            } catch (error) {
              console.error('Error fetching doctor info:', error);
              return apt;
            }
          })
        );

        setAppointments(appointmentsWithDoctorInfo);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      return;
    }

    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      const response = await fetch(`http://localhost:5275/api/Appointment/cancel-appointment/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to cancel appointment');
      }

      // Update local state
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId || apt.Id === appointmentId ? { ...apt, status: 3, Status: 3 } : apt
      ));
      alert('Hủy lịch hẹn thành công');
    } catch (err) {
      console.error('Error canceling appointment:', err);
      alert(err.message || 'Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusNum = parseInt(status);
    
    switch (statusNum) {
      case 0:
        return 'bg-yellow-100 text-yellow-800';
      case 1:
        return 'bg-blue-100 text-blue-800';
      case 2:
        return 'bg-green-100 text-green-800';
      case 3:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    const statusNum = parseInt(status);
    
    switch (statusNum) {
      case 0:
        return 'Chờ xác nhận';
      case 1:
        return 'Đã xác nhận';
      case 2:
        return 'Đã hoàn thành';
      case 3:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getStatusIcon = (status) => {
    const statusNum = parseInt(status);
    
    switch (statusNum) {
      case 0:
        return <FaClock className="text-yellow-600" />;
      case 1:
        return <FaClock className="text-blue-600" />;
      case 2:
        return <FaCheck className="text-green-600" />;
      case 3:
        return <FaTimes className="text-red-600" />;
      default:
        return <FaSpinner className="text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAppointments = appointments.filter(apt => {
    const status = parseInt(apt.status || apt.Status);
    switch (filter) {
      case 'upcoming':
        return status === 0 || status === 1;
      case 'completed':
        return status === 2;
      case 'cancelled':
        return status === 3;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          <p className="font-medium">Lỗi: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Lịch hẹn của tôi</h1>
              <p className="text-blue-100 mt-1">Quản lý và theo dõi các cuộc hẹn khám bệnh</p>
            </div>
            <button
              onClick={() => navigate('/appointment-booking')}
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <FaCalendarAlt />
              <span>Đặt lịch mới</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'upcoming', label: 'Sắp tới' },
              { id: 'completed', label: 'Đã hoàn thành' },
              { id: 'cancelled', label: 'Đã hủy' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-3 text-sm font-medium ${
                  filter === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Appointments List */}
        <div className="divide-y divide-gray-200">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lịch hẹn</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' 
                  ? 'Bạn chưa có lịch hẹn nào.'
                  : `Không có lịch hẹn ${filter === 'upcoming' ? 'sắp tới' : filter === 'completed' ? 'đã hoàn thành' : 'đã hủy'}.`}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/appointment-booking')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaCalendarAlt className="-ml-1 mr-2 h-5 w-5" />
                  Đặt lịch mới
                </button>
              </div>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div key={appointment.id || appointment.Id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${getStatusColor(appointment.status || appointment.Status)}`}>
                      {getStatusIcon(appointment.status || appointment.Status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {appointment.apointmentTitle || 'Khám bệnh'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(appointment.appointmentStartDate || appointment.AppointmentStartDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status || appointment.Status)}`}>
                      {getStatusText(appointment.status || appointment.Status)}
                    </span>
                    {(appointment.status === 0 || appointment.status === 1 || appointment.Status === 0 || appointment.Status === 1) && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id || appointment.Id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Hủy lịch
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaUserMd className="mr-2" />
                    <span>
                      Bác sĩ: {appointment.doctorName || appointment.DoctorName || 
                        (appointment.doctorId || appointment.DoctorId ? 'Đang tải thông tin...' : 'Chưa phân công')}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    {appointment.appointmentType === 0 || appointment.AppointmentType === 0 ? (
                      <FaVideo className="mr-2" />
                    ) : (
                      <FaHospital className="mr-2" />
                    )}
                    <span>
                      {appointment.appointmentType === 0 || appointment.AppointmentType === 0
                        ? 'Khám trực tuyến'
                        : 'Khám tại phòng khám'}
                    </span>
                  </div>
                </div>
                {appointment.doctorSpecialization && (
                  <div className="mt-2 text-sm text-gray-500">
                    <span>Chuyên khoa: {appointment.doctorSpecialization}</span>
                  </div>
                )}
                {appointment.notes || appointment.Notes ? (
                  <div className="mt-4 text-sm text-gray-500">
                    <p className="font-medium text-gray-700">Ghi chú:</p>
                    <p className="mt-1">{appointment.notes || appointment.Notes}</p>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 