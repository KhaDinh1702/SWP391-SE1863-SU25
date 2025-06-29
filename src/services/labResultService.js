import { API_BASE_URL, getAuthHeaders } from './config';

export const labResultService = {
  // Lấy danh sách tất cả lab results
  getAllLabResults: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/LabResult/get-list-lab-result`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching lab results:', error);
      throw error;
    }
  },

  // Lấy lab result theo ID
  getLabResultById: async (labResultId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/LabResult/get-by-id?labResultId=${labResultId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching lab result:', error);
      throw error;
    }
  },

  // Tạo lab result mới
  createLabResult: async (labResultData) => {
    try {
      console.log('Creating lab result with data:', labResultData);
      const formData = new FormData();
      formData.append('PatientId', labResultData.PatientId);
      if (labResultData.TreatmentStageId) formData.append('TreatmentStageId', labResultData.TreatmentStageId);
      if (labResultData.DoctorId) formData.append('DoctorId', labResultData.DoctorId);
      formData.append('TestName', labResultData.TestName);
      if (labResultData.TestType) formData.append('TestType', labResultData.TestType);
      formData.append('TestDate', labResultData.TestDate);
      if (labResultData.ResultSummary) formData.append('ResultSummary', labResultData.ResultSummary);
      if (labResultData.Conclusion) formData.append('Conclusion', labResultData.Conclusion);
      if (labResultData.Notes) formData.append('Notes', labResultData.Notes);
      // TODO: handle LabPictures if needed
      // Đổi tên trường file cho đúng chuẩn backend
      if (labResultData.LabResultPictures && Array.isArray(labResultData.LabResultPictures)) {
        labResultData.LabResultPictures.forEach((file) => {
          if (file) formData.append('LabResultPictures', file);
        });
      }
      const response = await fetch(`${API_BASE_URL}/LabResult/create-lab-result`, {
        method: 'POST',
        headers: { Authorization: getAuthHeaders().Authorization }, // Let browser set Content-Type for FormData
        body: formData
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response data:', errorData);
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Success response:', result);
      return result;
    } catch (error) {
      console.error('Error creating lab result:', error);
      throw error;
    }
  }
};