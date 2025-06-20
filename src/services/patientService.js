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
      const payload = {
        PatientId: patientData.id,
        FullName: patientData.fullName,
        Email: patientData.email,
        PhoneNumber: patientData.phoneNumber,
        Gender: patientData.gender,
        DateOfBirth: patientData.dateOfBirth,
        Address: patientData.address,
      };

      const response = await fetch(`${API_BASE_URL}/Patient/update-patient`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể cập nhật thông tin bệnh nhân');
      }
      
      return response.json();
    } catch (error) {
      console.error('Update patient failed:', error);
      throw error;
    }
  },
};
