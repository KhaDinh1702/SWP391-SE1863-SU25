import { API_BASE_URL, getAuthHeaders } from './config';

export const medicalRecordService = {
  // Lấy danh sách tất cả medical records
  getAllMedicalRecords: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/MedicalRecord/get-list-medical-record`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch medical records');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching medical records:', error);
      throw error;
    }
  },

  // Lấy medical record theo ID
  getMedicalRecordById: async (medicalRecordId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/MedicalRecord/get-by-id?medicalRecordId=${medicalRecordId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch medical record');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching medical record:', error);
      throw error;
    }
  }
}; 