import { API_BASE_URL, getAuthHeaders } from './config';

export const userService = {
  getAllUsers: async () => {
    try {
      const headers = getAuthHeaders();
      console.log('Auth headers:', headers);

      const response = await fetch(`${API_BASE_URL}/User/get-list-user`, {
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || 'Không thể lấy danh sách người dùng');
      }

      const data = await response.json();
      console.log('Received user data:', data);
      
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
      const roleMap = {
        0: 'Patient',
        1: 'Staff',
        2: 'Doctor',
        3: 'Manager',
        4: 'Admin'
      };

      const response = await fetch(`${API_BASE_URL}/User/admin/update-account`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId: userData.id,
          username: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          role: roleMap[userData.role] || userData.role,
          fullName: userData.fullName,
          address: userData.address,
          gender: userData.gender
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