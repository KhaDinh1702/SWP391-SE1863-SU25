import { API_BASE_URL, getAuthHeaders } from './config';

export const patientTreatmentProtocolService = {
  // Lấy danh sách tất cả patient treatment protocols
  getAllPatientTreatmentProtocols: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/PatientTreatmentProtocol/get-list-patient-treatment-protocol`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient treatment protocols');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching patient treatment protocols:', error);
      throw error;
    }
  },

  // Lấy patient treatment protocol theo ID
  getPatientTreatmentProtocolById: async (patientTreatmentProtocolId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/PatientTreatmentProtocol/get-by-id?patientTreatmentProtocolId=${patientTreatmentProtocolId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient treatment protocol');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching patient treatment protocol:', error);
      throw error;
    }
  },

  // Tạo patient treatment protocol mới
  createPatientTreatmentProtocol: async (protocolData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/PatientTreatmentProtocol/create-patient-treatment-protocol`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(protocolData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create patient treatment protocol');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating patient treatment protocol:', error);
      throw error;
    }
  },

  // Cập nhật trạng thái quy trình điều trị
  updateTreatmentProtocolStatus: async (protocolId, status) => {
    try {
      // Map string status to enum value
      const statusMap = {
        'Active': 0,
        'Completed': 1,
        'Discontinued': 2
      };

      const requestData = {
        ProtocolId: protocolId,
        Status: statusMap[status] ?? 0
      };

      console.log('Updating protocol status with data:', requestData);

      const response = await fetch(`${API_BASE_URL}/PatientTreatmentProtocol/update-treatment-protocol-status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update treatment protocol status: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating treatment protocol status:', error);
      throw error;
    }
  }
}; 