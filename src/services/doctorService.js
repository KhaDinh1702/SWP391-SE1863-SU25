import { API_BASE_URL, getAuthHeaders } from './config';

export const doctorService = {
  getAllDoctors: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Doctor/get-list-doctor`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Không thể lấy danh sách bác sĩ' }));
        throw new Error(errorData.message || 'Không thể lấy danh sách bác sĩ');
      }

      const text = await response.text();
      if (!text) {
        console.warn('Empty response from server');
        return [];
      }

      try {
        const data = JSON.parse(text);
        console.log('Fetched doctors:', data);
        return Array.isArray(data) ? data : [];
      } catch (parseError) {
        console.error('Error parsing doctors data:', parseError);
        console.error('Raw response:', text);
        return [];
      }
    } catch (error) {
      console.error('Fetch doctors failed:', error);
      throw error;
    }
  },

  updateDoctor: async (doctorData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Doctor/update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          doctorId: doctorData.id,
          fullName: doctorData.fullName,
          specializations: doctorData.specializations,
          qualification: doctorData.qualification,
          experience: doctorData.experience,
          bio: doctorData.bio,
          profilePictureURL: doctorData.profilePictureURL
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Cập nhật bác sĩ thất bại' }));
        throw new Error(errorData.message || 'Cập nhật bác sĩ thất bại');
      }

      const text = await response.text();
      if (!text) {
        return doctorData;
      }

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.warn('Server response was not JSON, returning updated data');
        return doctorData;
      }
    } catch (error) {
      console.error('Update doctor failed:', error);
      throw error;
    }
  },

  deleteDoctor: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Doctor/delete-doctor?doctorId=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Xóa bác sĩ thất bại' }));
        throw new Error(errorData.message || 'Xóa bác sĩ thất bại');
      }

      return true;
    } catch (error) {
      console.error('Delete doctor failed:', error);
      throw error;
    }
  }
}; 