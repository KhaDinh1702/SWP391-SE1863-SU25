import { API_BASE_URL, getAuthHeaders } from './config';

export const arvProtocolService = {
  // Lấy danh sách tất cả ARV protocols
  getAllARVProtocols: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ARVProtocol/get-list-arv-protocol`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching ARV protocols:', error);
      throw error;
    }
  },

  // Lấy ARV protocol theo ID
  getARVProtocolById: async (protocolId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ARVProtocol/get-by-id?protocolId=${protocolId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching ARV protocol:', error);
      throw error;
    }
  },

  // Lấy danh sách ARV protocols mặc định
  getDefaultARVProtocols: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ARVProtocol/get-default-arv-protocol`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching default ARV protocols:', error);
      throw error;
    }
  },

  // Tạo ARV protocol mới
  createARVProtocol: async (protocolData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ARVProtocol/manager-create-default-arv-protocol`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(protocolData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating ARV protocol:', error);
      throw error;
    }
  }
}; 