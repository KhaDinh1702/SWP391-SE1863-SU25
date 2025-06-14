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
    const response = await fetch(`${API_BASE_URL}/Appointment/staff-manages-appointment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Không thể cập nhật lịch hẹn');
    }
    return response.json();
  },
}; 