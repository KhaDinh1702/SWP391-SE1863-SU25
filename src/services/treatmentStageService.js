import { API_BASE_URL, getAuthHeaders } from './config';

export const treatmentStageService = {
  // Lấy danh sách tất cả treatment stages
  getAllTreatmentStages: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/TreatmentStage/get-list-treatment-stage`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch treatment stages');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching treatment stages:', error);
      throw error;
    }
  },

  // Lấy treatment stage theo ID
  getTreatmentStageById: async (treatmentStageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/TreatmentStage/get-by-id?treatmentStageId=${treatmentStageId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch treatment stage');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching treatment stage:', error);
      throw error;
    }
  },

  // Tạo treatment stage mới
  createTreatmentStage: async (stageData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/TreatmentStage/create-treatment-stage-medical-record`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(stageData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create treatment stage');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating treatment stage:', error);
      throw error;
    }
  }
}; 