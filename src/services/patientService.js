import { API_BASE_URL, getAuthHeaders } from './config';

export const patientService = {
  getAllPatients: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Patient/get-list-patient`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách bệnh nhân');
      }
      
      return response.json();
    } catch (error) {
      console.error('Get patients failed:', error);
      throw error;
    }
  },

  getPatientById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Patient/get-by-id?patientId=${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Không thể lấy thông tin bệnh nhân');
      }
      
      return response.json();
    } catch (error) {
      console.error('Get patient by ID failed:', error);
      throw error;
    }
  },

  updatePatient: async (patientData) => {
    try {
      // Create FormData for file upload support
      const formData = new FormData();
      
      // Add all the patient data to FormData
      formData.append('PatientId', patientData.patientId);
      if (patientData.fullName) formData.append('FullName', patientData.fullName);
      if (patientData.email) formData.append('Email', patientData.email);
      if (patientData.phoneNumber) formData.append('PhoneNumber', patientData.phoneNumber);
      if (patientData.dateOfBirth) formData.append('DateOfBirth', patientData.dateOfBirth);
      if (patientData.gender !== undefined) formData.append('Gender', patientData.gender);
      if (patientData.address) formData.append('Address', patientData.address);
      
      // Add avatar file if provided
      if (patientData.avatarPicture) {
        formData.append('AvatarPicture', patientData.avatarPicture);
      }

      const response = await fetch(`${API_BASE_URL}/Patient/patient-update-profile`, {
        method: 'PUT',
        headers: {
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Không thể cập nhật thông tin bệnh nhân';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.Message || errorMessage;
        } catch {
          // If not JSON, use the text as error message
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      return {
        success: true,
        message: result.Message || 'Cập nhật thành công',
        data: result
      };
    } catch (error) {
      console.error('Update patient failed:', error);
      return {
        success: false,
        message: error.message || 'Có lỗi xảy ra khi cập nhật thông tin'
      };
    }
  },
};
