const API_BASE_URL = 'http://localhost:5275/api';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      const data = await response.json();

      // Giả sử server trả về token, username, role, userId
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userId', data.userId);

      return data;
    } catch (error) {
      console.error('Login error:', error);
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
    return {
      token,
      username: localStorage.getItem('username'),
      role: localStorage.getItem('role'),
      userId: localStorage.getItem('userId'),
    };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  }
};

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy danh sách người dùng');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch users failed:', error);
      throw error;
    }
  },
};

export const doctorService = {
  getAllDoctors: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy danh sách bác sĩ');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch doctors failed:', error);
      throw error;
    }
  },

  deleteDoctor: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Xoá bác sĩ thất bại');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete doctor error:', error);
      throw error;
    }
  },
};
