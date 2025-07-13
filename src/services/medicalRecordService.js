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
  },

  // Tạo medical record mới
  createMedicalRecord: async (recordData) => {
    try {
      const formData = new FormData();
      
      // Thêm các fields vào FormData
      Object.keys(recordData).forEach(key => {
        if (recordData[key] !== null && recordData[key] !== undefined) {
          formData.append(key, recordData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/MedicalRecord/create-medical-record`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // KHÔNG thêm 'Content-Type' ở đây!
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to create medical record');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating medical record:', error);
      throw error;
    }
  },

  // Cập nhật medical record
  updateMedicalRecord: async (recordData) => {
    try {
      const formData = new FormData();
      
      // Thêm các fields vào FormData
      Object.keys(recordData).forEach(key => {
        if (recordData[key] !== null && recordData[key] !== undefined) {
          formData.append(key, recordData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/MedicalRecord/update-medical-record`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to update medical record');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating medical record:', error);
      throw error;
    }
  },

  // Lấy danh sách medical records theo patientId
  getListMedicalRecord: async (patientId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/MedicalRecord/get-list-medical-record?patientId=${patientId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to fetch medical records by patient');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching medical records by patient:', error);
      throw error;
    }
  }
};