import { API_BASE_URL, getAuthHeaders } from './config';

export const doctorScheduleService = {
  // Lấy danh sách tất cả lịch làm việc bác sĩ
  getAllDoctorSchedules: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/DoctorSchedule/get-list-doctor-schedule`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching doctor schedules:', error);
      throw error;
    }
  },

  // Lấy lịch làm việc bác sĩ theo ID
  getDoctorScheduleById: async (scheduleId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/DoctorSchedule/get-by-id?scheduleId=${scheduleId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching doctor schedule:', error);
      throw error;
    }
  },

  // Lấy lịch làm việc bác sĩ theo doctor ID
  getDoctorSchedulesByDoctorId: async (doctorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/DoctorSchedule/doctor-get-schedule-by-id?doctorId=${doctorId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching doctor schedules by doctor ID:', error);
      throw error;
    }
  },

  // Lấy lịch làm việc hôm nay của bác sĩ
  getTodayDoctorSchedulesByDoctorId: async (doctorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/DoctorSchedule/get-today-list-doctor-schedule-by-doctor-id?doctorId=${doctorId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching today doctor schedules:', error);
      throw error;
    }
  },

  // Tạo lịch làm việc bác sĩ mới
  createDoctorSchedule: async (scheduleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/DoctorSchedule/create-doctor-schedule`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(scheduleData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating doctor schedule:', error);
      throw error;
    }
  },

  // Kiểm tra lịch trùng lặp
  getDuplicatedDoctorSchedule: async (doctorId, startTime, endTime) => {
    try {
      const response = await fetch(`${API_BASE_URL}/DoctorSchedule/get-list-doctor-schedule-by-startdate-enddate?doctorId=${doctorId}&StartTime=${startTime}&EndTime=${endTime}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error checking duplicate schedule:', error);
      throw error;
    }
  }
};
