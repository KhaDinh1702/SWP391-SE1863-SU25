// API Configuration
export const API_BASE_URL = 'https://localhost:7040/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

// Helper function to check if API is available
export const checkApiAvailability = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response.ok;
  } catch (error) {
    console.error('API server is not available:', error);
    return false;
  }
}; 