import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUserMd, FaHospital, FaTimes, FaCheck, FaSpinner, FaVideo } from 'react-icons/fa';
import { authService } from '../services/api';

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
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        // Filter appointments for the current patient
        const patientAppointments = data.filter(apt => apt.PatientId === currentUser.patientId);
        setAppointments(patientAppointments);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const currentUser = authService.getCurrentUser();
      const response = await fetch(`http://localhost:5275/api/Appointment/cancel-appointment/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }

      // Update local state
      setAppointments(appointments.map(apt => 
        apt.Id === appointmentId ? { ...apt, Status: 'Cancelled' } : apt
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    // Convert status to string and handle null/undefined
    const statusStr = String(status || '').toLowerCase();
    
    switch (statusStr) {
      case 'scheduled':
      case '1':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
      case '2':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case '3':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    // Convert status to string and handle null/undefined
    const statusStr = String(status || '').toLowerCase();
    
    switch (statusStr) {
      case 'scheduled':
      case '1':
        return <FaClock className="text-blue-600" />;
      case 'completed':
      case '2':
        return <FaCheck className="text-green-600" />;
      case 'cancelled':
      case '3':
        return <FaTimes className="text-red-600" />;
      default:
        return <FaSpinner className="text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    // Convert status to string and handle null/undefined
    const statusStr = String(status || '').toLowerCase();
    
    switch (statusStr) {
      case 'scheduled':
      case '1':
        return 'Đã lên lịch';
      case 'completed':
      case '2':
        return 'Đã hoàn thành';
      case 'cancelled':
      case '3':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có ngày';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Chưa có giờ';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Giờ không hợp lệ';
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Giờ không hợp lệ';
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    const statusStr = String(apt.Status || '').toLowerCase();
    console.log('Filtering by status:', {
      appointmentStatus: statusStr,
      filter: filter.toLowerCase(),
      matches: statusStr === filter.toLowerCase()
    }); // Debug log
    return statusStr === filter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
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
              { id: 'scheduled', label: 'Đã lên lịch' },
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
            <div className="p-6 text-center text-gray-500">
              Không có lịch hẹn nào
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div key={appointment.Id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${getStatusColor(appointment.Status)}`}>
                        {getStatusIcon(appointment.Status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.AppointmentTitle || 'Chưa có tiêu đề'}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt />
                            <span>{formatDate(appointment.AppointmentStartDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaClock />
                            <span>{formatTime(appointment.AppointmentStartDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaUserMd />
                            <span>Bác sĩ: {appointment.DoctorID || 'Chưa phân công'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.Status)}`}>
                              {getStatusText(appointment.Status)}
                            </span>
                          </div>
                          {appointment.OnlineLink && (
                            <div className="flex items-center gap-1">
                              <FaVideo />
                              <a href={appointment.OnlineLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Link trực tuyến
                              </a>
                            </div>
                          )}
                        </div>
                        {appointment.Notes && (
                          <p className="mt-2 text-sm text-gray-600">
                            Ghi chú: {appointment.Notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {String(appointment.Status).toLowerCase() === 'scheduled' || appointment.Status === '1' ? (
                    <button
                      onClick={() => handleCancelAppointment(appointment.Id)}
                      className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Hủy lịch
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 