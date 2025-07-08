import { API_BASE_URL, getAuthHeaders } from './config';

export const appointmentService = {
  // Get all appointments for viewing
  getAllAppointments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Appointment/get-list-appointments`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể lấy danh sách lịch hẹn');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  // Get appointment by ID for detailed view
  getAppointmentById: async (appointmentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Appointment/get-by-id?appointmentId=${appointmentId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể lấy thông tin lịch hẹn');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },

  // Get appointments by status for filtering
  getAppointmentsByStatus: async (status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Appointment/get-by-status?status=${status}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể lấy danh sách lịch hẹn theo trạng thái');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching appointments by status:', error);
      throw error;
    }
  },

  // Get appointments by date range for filtering
  getAppointmentsByDateRange: async (startDate, endDate) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Appointment/get-by-date-range?startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể lấy danh sách lịch hẹn theo khoảng thời gian');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching appointments by date range:', error);
      throw error;
    }
  },

  // Get appointments by doctor for filtering
  getAppointmentsByDoctor: async (doctorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Appointment/doctor-get-appointments?doctorId=${doctorId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể lấy danh sách lịch hẹn theo bác sĩ');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching appointments by doctor:', error);
      throw error;
    }
  },

  // Get appointments by patient for filtering
  getAppointmentsByPatient: async (patientId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Appointment/get-by-patient?patientId=${patientId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể lấy danh sách lịch hẹn theo bệnh nhân');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching appointments by patient:', error);
      throw error;
    }
  },

  // Create appointment and initiate MoMo payment (keeping existing functionality)
  createAppointmentWithMomo: async (appointmentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Appointment/create-and-initiate-payment`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể tạo lịch hẹn và thanh toán MoMo');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating appointment with MoMo:', error);
      throw error;
    }
  },

  // Update appointment online link
  updateAppointmentOnlineLink: async (appointmentId, onlineLink) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Appointment/update-appointment-online-link`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ AppointmentId: appointmentId, OnlineLink: onlineLink }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể cập nhật link trực tuyến');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating appointment online link:', error);
      throw error;
    }
  },

  // Reschedule appointment
  rescheduleAppointment: async (appointmentId, newStartDate, newEndDate) => {
    try {
      // Format datetime to local timezone string (YYYY-MM-DDTHH:mm:ss)
      const formatDateTimeLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      };

      const payload = { 
        Id: appointmentId, 
        NewAppointmentStartDate: formatDateTimeLocal(newStartDate),
        NewAppointmentEndDate: formatDateTimeLocal(newEndDate)
      };

      console.log('Reschedule payload:', payload); // Debug log
      
      const response = await fetch(`${API_BASE_URL}/Appointment/reschedule`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Reschedule error response:', errorData); // Debug log
        throw new Error(errorData.message || 'Không thể dời lịch cuộc hẹn');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  },
};