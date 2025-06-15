import { API_BASE_URL } from './config';

export const authService = {
  login: async (credentials) => {
    try {
      console.log('Attempting login with:', { username: credentials.username });
      
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Username: credentials.username,
          Password: credentials.password
        }),
      });

      const responseData = await response.json().catch(() => null);
      console.log('Server response:', responseData);

      if (!response.ok) {
        if (response.status === 500) {
          console.error('Server error details:', responseData);
          throw new Error('Lỗi máy chủ. Vui lòng thử lại sau.');
        }
        if (response.status === 401) {
          throw new Error(responseData?.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
        }
        throw new Error(responseData?.message || 'Đăng nhập thất bại');
      }

      if (!responseData) {
        throw new Error('Không nhận được phản hồi từ máy chủ');
      }

      if (!responseData.success) {
        throw new Error(responseData.message || 'Đăng nhập thất bại');
      }

      // Store user data based on the backend response
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('username', responseData.username);
      localStorage.setItem('role', responseData.role);
      localStorage.setItem('userId', responseData.userId);

      // Store role-specific IDs
      if (responseData.role === 'Patient' && responseData.patientId) {
        localStorage.setItem('patientId', responseData.patientId);
      }
      if (responseData.role === 'Doctor' && responseData.doctorId) {
        localStorage.setItem('doctorId', responseData.doctorId);
      }

      return responseData;
    } catch (error) {
      console.error('Login error:', error);
      if (error.message === 'Failed to fetch') {
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.');
      }
      throw error;
    }
  },

  registerPatient: async (patientData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register-patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký thất bại');
      }

      return await response.json();
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const user = {
      token,
      username: localStorage.getItem('username'),
      role: localStorage.getItem('role'),
      userId: localStorage.getItem('userId'),
    };

    // Add role-specific IDs
    if (user.role === 'Patient') {
      user.patientId = localStorage.getItem('patientId');
    }
    if (user.role === 'Doctor') {
      user.doctorId = localStorage.getItem('doctorId');
    }

    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('patientId');
    localStorage.removeItem('doctorId');
  },
}; 