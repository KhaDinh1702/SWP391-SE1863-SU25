import { API_BASE_URL, getAuthHeaders } from './config';

export const appointmentService = {
  // Get all appointments
  getAllAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/Appointment/get-list-appointment`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Không thể lấy danh sách lịch hẹn');
    return response.json();
  },

  // Staff manages appointment (confirm, cancel, reschedule)
  staffManageAppointment: async (data) => {
    console.log('Making request to:', `${API_BASE_URL}/Appointment/staff-manages-appointment`);
    console.log('With headers:', getAuthHeaders());
    
    const response = await fetch(`${API_BASE_URL}/Appointment/staff-manages-appointment`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Server response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.message || 'Không thể cập nhật lịch hẹn');
    }
    return response.json();
  },

  // Create appointment and initiate MoMo payment
  createAppointmentWithMomo: async (appointmentData) => {
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
    return response.json();
  },
};