import { API_BASE_URL, getAuthHeaders } from './config';

console.log('🔄 UserService module loaded with debug version');

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
      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add required fields
      formData.append('UserId', userData.id);
      
      // Add optional fields only if they have values
      if (userData.username) formData.append('Username', userData.username);
      if (userData.email) formData.append('Email', userData.email);
      if (userData.phoneNumber) formData.append('PhoneNumber', userData.phoneNumber);
      if (userData.role) formData.append('Role', userData.role);
      if (userData.fullName) formData.append('FullName', userData.fullName);
      if (userData.specialization) formData.append('Specialization', userData.specialization);
      if (userData.qualifications) formData.append('Qualifications', userData.qualifications);
      if (userData.experience) formData.append('Experience', userData.experience);
      if (userData.bio) formData.append('Bio', userData.bio);
      if (userData.address) formData.append('Address', userData.address);
      if (userData.gender) formData.append('Gender', userData.gender);
      
      // Add avatar file if provided
      if (userData.avatarPicture && userData.avatarPicture instanceof File) {
        formData.append('AvatarPicture', userData.avatarPicture);
      }

      const response = await fetch(`${API_BASE_URL}/User/admin/update-account`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Accept': 'application/json'
          // Don't set Content-Type for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Cập nhật người dùng thất bại';
        } catch (e) {
          errorMessage = errorText || 'Cập nhật người dùng thất bại';
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      return responseData;
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
    console.log('🚀 NEW VERSION OF CREATE USER FUNCTION CALLED 🚀');
    try {
      console.log('=== CREATE USER DEBUG START ===');
      console.log('Input userData:', userData);

      // Map role names to enum values that match backend
      const roleMap = {
        'Patient': 0,
        'Staff': 1,
        'Doctor': 2,
        'Manager': 3,
        'Admin': 4
      };

      // Create FormData since backend expects [FromForm]
      const formData = new FormData();
      
      // Add required fields
      formData.append('Username', userData.username || '');
      formData.append('Password', userData.password || '');
      formData.append('Email', userData.email || '');
      formData.append('Role', roleMap[userData.role] ?? 1); // Default to Staff
      
      // Add optional fields only if they have values
      if (userData.phoneNumber && userData.phoneNumber.trim()) {
        formData.append('PhoneNumber', userData.phoneNumber.trim());
      }
      if (userData.fullName && userData.fullName.trim()) {
        formData.append('FullName', userData.fullName.trim());
      }
      if (userData.specialization && userData.specialization.trim()) {
        formData.append('Specialization', userData.specialization.trim());
      }
      if (userData.qualifications && userData.qualifications.trim()) {
        formData.append('Qualifications', userData.qualifications.trim());
      }
      if (userData.experience && userData.experience.trim()) {
        formData.append('Experience', userData.experience.trim());
      }
      if (userData.bio && userData.bio.trim()) {
        formData.append('Bio', userData.bio.trim());
      }
      
      // Add avatar file if provided
      if (userData.avatarPicture && userData.avatarPicture instanceof File) {
        formData.append('AvatarPicture', userData.avatarPicture);
      }

      // Log all form data entries
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: "${value}"`);
      }

      // Get auth token
      const token = localStorage.getItem('token');
      console.log('Auth token exists:', !!token);
      console.log('Auth token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'null');

      const response = await fetch(`${API_BASE_URL}/User/admin/create-account`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json'
          // Don't set Content-Type - let browser handle it for FormData
        },
        body: formData,
      });

      console.log('Response received:');
      console.log('  Status:', response.status);
      console.log('  Status Text:', response.statusText);
      console.log('  Headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Parsed response data:', responseData);
      } catch (e) {
        console.log('Failed to parse JSON, treating as plain text');
        responseData = { message: responseText };
      }

      if (!response.ok) {
        console.log('Request failed with status:', response.status);
        
        if (response.status === 401) {
          throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
        }
        
        if (response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện thao tác này.');
        }
        
        if (response.status === 400) {
          if (responseData?.errors) {
            const errorMessages = Object.entries(responseData.errors)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('\n');
            throw new Error(`Lỗi validation:\n${errorMessages}`);
          }
          if (responseData?.message) {
            throw new Error(responseData.message);
          }
          throw new Error(`Dữ liệu không hợp lệ: ${responseText}`);
        }
        
        throw new Error(responseData?.message || responseText || 'Tạo tài khoản thất bại');
      }

      console.log('=== CREATE USER DEBUG END ===');
      return responseData;
    } catch (error) {
      console.error('=== CREATE USER ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  },
};