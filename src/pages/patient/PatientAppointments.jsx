import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUserMd, FaHospital, FaTimes, FaCheck, FaSpinner, FaVideo } from 'react-icons/fa';
import { authService } from "../../services/authService";
import { doctorService } from "../../services/doctorService";

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

        console.log('Attempting to fetch appointments from:', `http://localhost:5275/api/Appointment/get-list-appointments`);
        console.log('With token:', currentUser.token ? 'Present' : 'Missing');
        
        const response = await fetch(`http://localhost:5275/api/Appointment/get-list-appointments`, {
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
        console.log('Raw appointment data:', data); // Debug log
        console.log('Current user:', currentUser); // Debug current user
        
        // Test hiển thị thời gian của một appointment để debug
        if (data && data.length > 0) {
          const sampleAppointment = data[0];
          console.log('=== DATETIME DEBUG ===');
          console.log('Sample appointment:', sampleAppointment);
          console.log('AppointmentStartDate raw:', sampleAppointment.appointmentStartDate || sampleAppointment.AppointmentStartDate);
          if (sampleAppointment.appointmentStartDate || sampleAppointment.AppointmentStartDate) {
            const dateStr = sampleAppointment.appointmentStartDate || sampleAppointment.AppointmentStartDate;
            const parsedDate = new Date(dateStr);
            console.log('Parsed Date object:', parsedDate);
            console.log('Local time string:', parsedDate.toString());
            console.log('UTC time string:', parsedDate.toUTCString());
            console.log('ISO string:', parsedDate.toISOString());
            console.log('Vietnam locale string:', parsedDate.toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'}));
          }
          console.log('=== END DATETIME DEBUG ===');
        }
        
        // Get patient ID from different possible sources
        const patientId = currentUser.patientId || currentUser.userId || currentUser.id;
        console.log('Looking for patient appointments with ID:', patientId);
        
        // Filter appointments for the current patient and only show paid appointments
        const patientAppointments = data.filter(apt => {
          const aptPatientId = apt.patientId || apt.PatientId;
          const paymentStatus = apt.paymentStatus || apt.PaymentStatus;
          const isPatientMatch = aptPatientId === patientId;
          const isPaid = paymentStatus === 1; // PaymentStatus.Paid = 1
          
          console.log('Checking appointment:', {
            appointmentId: apt.id,
            aptPatientId,
            currentPatientId: patientId,
            paymentStatus,
            isPatientMatch,
            isPaid,
            finalMatch: isPatientMatch && isPaid
          });
          
          return isPatientMatch && isPaid;
        });

        console.log('Filtered patient appointments:', patientAppointments);

        // Fetch doctor information for each appointment
        const appointmentsWithDoctorInfo = await Promise.all(
          patientAppointments.map(async (apt) => {
            try {
              // Extract doctor ID with proper casing
              const doctorId = apt.doctorId || apt.DoctorId || apt.doctor?.id || apt.Doctor?.Id;
              console.log('Processing appointment:', {
                appointmentId: apt.id || apt.Id,
                doctorId: doctorId,
                rawDoctorData: apt.doctor || apt.Doctor
              });

              if (!doctorId) {
                console.warn('No doctor ID found for appointment:', apt);
                return {
                  ...apt,
                  doctorName: 'Không có thông tin',
                  doctorSpecialization: 'Không có thông tin'
                };
              }

              // Try to get individual doctor info
              try {
                const doctorInfo = await doctorService.getDoctorById(doctorId);
                console.log('Fetched doctor data:', doctorInfo);
                
                if (doctorInfo) {
                  return {
                    ...apt,
                    doctorName: doctorInfo.fullName || 'Không có thông tin',
                    doctorSpecialization: doctorInfo.specialization || 'Chưa cập nhật',
                    doctorId: doctorId
                  };
                }
              } catch (doctorError) {
                console.warn(`Could not fetch doctor info for ID ${doctorId}:`, doctorError);
                // Return appointment without doctor info if fetch fails
                return {
                  ...apt,
                  doctorName: 'Không có thông tin',
                  doctorSpecialization: 'Không có thông tin'
                };
              }
              return apt;
            } catch (error) {
              console.error('Error processing appointment:', error);
              return apt;
            }
          })
        );

        console.log('Processed appointments:', appointmentsWithDoctorInfo);
        setAppointments(appointmentsWithDoctorInfo);
        
        if (appointmentsWithDoctorInfo.length === 0) {
          console.log('No appointments found for patient ID:', patientId);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(`Lỗi khi tải danh sách lịch hẹn: ${err.message}`);
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
        return 'bg-[#FFF8E1] text-[#C46547]'; // Chờ xác nhận - orange
      case 1:
        return 'bg-[#E3F6FB] text-[#3B9AB8]'; // Đã xác nhận - primary
      case 2:
        return 'bg-[#E6F9F0] text-[#2D7A94]'; // Đã hoàn thành - secondary
      case 3:
        return 'bg-[#FDE8E8] text-[#E53935]'; // Đã hủy - red
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
        return <FaClock className="text-[#C46547]" />;
      case 1:
        return <FaClock className="text-[#3B9AB8]" />;
      case 2:
        return <FaCheck className="text-[#2D7A94]" />;
      case 3:
        return <FaTimes className="text-[#E53935]" />;
      default:
        return <FaSpinner className="text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không có thông tin';
    
    try {
      // Parse the date string
      const date = new Date(dateString);
      
      // Kiểm tra nếu date không hợp lệ
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateString);
        return 'Ngày không hợp lệ';
      }
      
      console.log('Original date string:', dateString);
      console.log('Parsed date object:', date);
      console.log('UTC time:', date.toUTCString());
      console.log('Local time string:', date.toString());
      
      // Nếu đây là UTC time (có 'Z' hoặc timezone), chuyển đổi về local time
      let displayDate = date;
      
      // Kiểm tra nếu dateString có 'Z' (UTC) hoặc có timezone offset
      if (dateString.includes('Z') || dateString.match(/[+-]\d{2}:\d{2}$/)) {
        // Đây là UTC time, cần chuyển về local time
        console.log('Detected UTC time, converting to local time');
        
        // Tạo local datetime từ UTC, bù trừ timezone offset
        const utcTime = date.getTime();
        const localOffset = date.getTimezoneOffset() * 60000; // Convert to milliseconds
        const vietnamOffset = 7 * 60 * 60000; // Vietnam is UTC+7
        
        displayDate = new Date(utcTime + localOffset + vietnamOffset);
        console.log('Converted to Vietnam time:', displayDate);
      } else {
        // Đây có thể là local time rồi
        console.log('Treating as local time');
      }
      
      const formatted = displayDate.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      console.log('Formatted result:', formatted);
      return formatted;
      
    } catch (error) {
      console.error('Error formatting date:', error, 'Original dateString:', dateString);
      return 'Lỗi định dạng ngày';
    }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-[#3B9AB8]/10 to-white min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Lịch hẹn đã thanh toán</h1>
              <p className="text-[#BEE6F5] mt-1">Quản lý và theo dõi các cuộc hẹn khám bệnh đã thanh toán</p>
            </div>
            <button
              onClick={() => navigate('/appointment-booking')}
              className="bg-[#3B9AB8] text-white px-4 py-2 rounded-md hover:bg-[#2D7A94] transition-colors flex items-center gap-2 shadow"
            >
              <FaCalendarAlt />
              <span>Đặt lịch mới</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-[#3B9AB8]/30">
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
                className={`px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                  filter === tab.id
                    ? 'border-b-2 border-[#3B9AB8] text-[#3B9AB8] bg-[#3B9AB8]/10'
                    : 'text-gray-500 hover:text-[#3B9AB8] hover:border-[#3B9AB8]/40'
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lịch hẹn đã thanh toán</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' 
                  ? 'Bạn chưa có lịch hẹn đã thanh toán nào. Chỉ những lịch hẹn đã thanh toán mới được hiển thị.'
                  : `Không có lịch hẹn đã thanh toán ${filter === 'upcoming' ? 'sắp tới' : filter === 'completed' ? 'đã hoàn thành' : 'đã hủy'}.`}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/appointment-booking')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#3B9AB8] hover:bg-[#2D7A94] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B9AB8]"
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
                        <div>
                          <div>Gốc: {appointment.appointmentStartDate || appointment.AppointmentStartDate}</div>
                          <div>Hiển thị: {formatDate(appointment.appointmentStartDate || appointment.AppointmentStartDate)}</div>
                        </div>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status || appointment.Status)}`}>
                      {getStatusText(appointment.status || appointment.Status)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                  <div className="flex items-center text-sm">
                    <FaCheck className="mr-2 text-green-500" />
                    <span className="text-green-600 font-medium">Đã thanh toán</span>
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