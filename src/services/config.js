// API Configuration
const getApiBaseUrl = () => {
  // Use environment variable if available
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Auto-detect based on environment
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  
  if (isDevelopment) {
    return 'https://localhost:7040/api';
  } else if (isProduction) {
    return 'https://your-production-api.com/api';
  }
  
  // Fallback
  return 'https://localhost:7040/api';
};

export const API_BASE_URL = getApiBaseUrl();

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