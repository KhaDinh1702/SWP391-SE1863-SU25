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
      console.log('Login response:', data); // Debug log

      // Store user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userId', data.userId);
      
      // If user is a patient, store patientId
      if (data.role === 'Patient' && data.patientId) {
        localStorage.setItem('patientId', data.patientId);
      }

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
    
    const user = {
      token,
      username: localStorage.getItem('username'),
      role: localStorage.getItem('role'),
      userId: localStorage.getItem('userId'),
    };

    // Add patientId if user is a patient
    if (user.role === 'Patient') {
      user.patientId = localStorage.getItem('patientId');
    }

    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('patientId'); // Clear patientId on logout
  },
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export const userService = {
  getAllUsers: async () => {
    try {
      const headers = getAuthHeaders();
      console.log('Auth headers:', headers); // Debug log

      const response = await fetch(`${API_BASE_URL}/User/get-list-user`, {
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData); // Debug log
        throw new Error(errorData.message || 'Không thể lấy danh sách người dùng');
      }

      const data = await response.json();
      console.log('Received user data:', data); // Debug log
      
      return data.map(user => ({
        ...user,
        key: user.id,
        isActive: user.isActive ?? true,
      }));
    } catch (error) {
      console.error('Fetch users failed:', error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/User/get-by-id?userId=${userId}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Không thể lấy thông tin người dùng');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch user by ID failed:', error);
      throw error;
    }
  },

  updateUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/User/admin/update-account`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId: userData.id,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          role: userData.role,
          address: userData.address,
          gender: userData.gender,
          password: userData.password || undefined // Only send if provided
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Cập nhật người dùng thất bại');
      }

      return await response.json();
    } catch (error) {
      console.error('Update user failed:', error);
      throw error;
    }
  },

  inactiveUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/User/admin/inactive-account?UserId=${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Vô hiệu hóa tài khoản thất bại');
      }

      return await response.json();
    } catch (error) {
      console.error('Inactive user failed:', error);
      throw error;
    }
  },

  createUserByAdmin: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/User/admin/create-account`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          password: userData.password,
          role: userData.role,
          fullName: userData.fullName,
          address: userData.address,
          gender: userData.gender
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Tạo tài khoản thất bại');
      }

      return await response.json();
    } catch (error) {
      console.error('Create user failed:', error);
      throw error;
    }
  },
};

export const doctorService = {
  getAllDoctors: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Doctor/get-list-doctor`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Không thể lấy danh sách bác sĩ' }));
        throw new Error(errorData.message || 'Không thể lấy danh sách bác sĩ');
      }

      const text = await response.text();
      if (!text) {
        console.warn('Empty response from server');
        return [];
      }

      try {
        const data = JSON.parse(text);
        console.log('Fetched doctors:', data);
        return Array.isArray(data) ? data : [];
      } catch (parseError) {
        console.error('Error parsing doctors data:', parseError);
        console.error('Raw response:', text);
        return [];
      }
    } catch (error) {
      console.error('Fetch doctors failed:', error);
      throw error;
    }
  },

  updateDoctor: async (doctorData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Doctor/update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          doctorId: doctorData.id,
          fullName: doctorData.fullName,
          specializations: doctorData.specializations,
          qualification: doctorData.qualification,
          experience: doctorData.experience,
          bio: doctorData.bio,
          profilePictureURL: doctorData.profilePictureURL
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Cập nhật bác sĩ thất bại' }));
        throw new Error(errorData.message || 'Cập nhật bác sĩ thất bại');
      }

      const text = await response.text();
      if (!text) {
        return doctorData; // Return the updated data if server doesn't return anything
      }

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.warn('Server response was not JSON, returning updated data');
        return doctorData;
      }
    } catch (error) {
      console.error('Update doctor failed:', error);
      throw error;
    }
  },

  deleteDoctor: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Doctor/delete-doctor?doctorId=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Xóa bác sĩ thất bại' }));
        throw new Error(errorData.message || 'Xóa bác sĩ thất bại');
      }

      return true;
    } catch (error) {
      console.error('Delete doctor failed:', error);
      throw error;
    }
  }
};
