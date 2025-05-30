// src/services/api.js
const API_BASE_URL = 'http://localhost:5275/api'; // Adjust to your backend URL

export const authService = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      console.log(response)

      const data = await response.json();
      console.log(data)
      
      if (!response.ok) {
        // Handle backend validation errors
        if (response.status === 400 && data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          throw new Error(errorMessages.join('\n'));
        }
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token and user data if available
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        if (data.userId) {
          localStorage.setItem('userId', data.userId);
        }
        if (data.role) {
          localStorage.setItem('userRole', data.role);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  },

  getCurrentUser: () => {
    return {
      token: localStorage.getItem('authToken'),
      userId: localStorage.getItem('userId'),
      role: localStorage.getItem('userRole')
    };
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};