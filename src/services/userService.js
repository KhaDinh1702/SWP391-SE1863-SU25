import { API_BASE_URL, getAuthHeaders } from './config';

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/User/get-list-user`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || 'Không thể lấy danh sách người dùng');
      }

      const data = await response.json();
      return data.map(u => ({ ...u, userId: u.userId || u.id }));
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
      const userId = userData.id || userData.UserId || userData.userId;
      const hasFileUpload = userData.avatarPicture && userData.avatarPicture instanceof File;
      
      if (hasFileUpload) {
        if (!userId) {
          throw new Error('UserId is required but not found in userData');
        }
        
        const userIdString = String(userId).trim();
        
        // Validate GUID format
        const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!guidRegex.test(userIdString)) {
          throw new Error(`Invalid GUID format: ${userIdString}`);
        }
        
        // Create FormData like labResultService does
        const formData = new FormData();
        formData.append('UserId', userIdString);
        
        if (userData.username) formData.append('Username', userData.username);
        if (userData.email) formData.append('Email', userData.email);
        if (userData.phoneNumber) formData.append('PhoneNumber', userData.phoneNumber);
        if (userData.fullName) formData.append('FullName', userData.fullName);
        
        // Handle Role
        if (userData.role !== undefined && userData.role !== null) {
          const roleMap = { Patient: 0, Staff: 1, Doctor: 2, Manager: 3, Admin: 4 };
          let roleValue;
          if (typeof userData.role === 'string') {
            roleValue = roleMap[userData.role];
          } else {
            roleValue = parseInt(userData.role);
          }
          formData.append('Role', roleValue);
        }
        
        if (userData.password && userData.password.trim()) {
          formData.append('Password', userData.password.trim());
        }
        
        formData.append('AvatarPicture', userData.avatarPicture);

        // Use the exact same approach as labResultService
        const response = await fetch(`${API_BASE_URL}/User/admin/update-account`, {
          method: 'PUT',
          headers: { 
            Authorization: getAuthHeaders().Authorization 
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

        return await response.json();
      } else {
        // No file upload - use URL-encoded form data
        if (!userId) {
          throw new Error('UserId is required but not found in userData');
        }
        
        const requestBody = {
          UserId: userId,
          Username: userData.username || null,
          Email: userData.email || null,
          PhoneNumber: userData.phoneNumber || null,
          FullName: userData.fullName || null
        };
        
        // Handle Role
        if (userData.role !== undefined && userData.role !== null) {
          const roleMap = { Patient: 0, Staff: 1, Doctor: 2, Manager: 3, Admin: 4 };
          let roleValue;
          if (typeof userData.role === 'string') {
            roleValue = roleMap[userData.role];
          } else {
            roleValue = parseInt(userData.role);
          }
          requestBody.Role = roleValue;
        }
        
        if (userData.password && userData.password.trim()) {
          requestBody.Password = userData.password.trim();
        }

        const params = new URLSearchParams();
        params.append('UserId', String(userId));
        if (requestBody.Username) params.append('Username', requestBody.Username);
        if (requestBody.Email) params.append('Email', requestBody.Email);
        if (requestBody.PhoneNumber) params.append('PhoneNumber', requestBody.PhoneNumber);
        if (requestBody.Role !== undefined) params.append('Role', String(requestBody.Role));
        if (requestBody.FullName) params.append('FullName', requestBody.FullName);
        if (requestBody.Password) params.append('Password', requestBody.Password);

        const response = await fetch(`${API_BASE_URL}/User/admin/update-account`, {
          method: 'PUT',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: params,
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

        return await response.json();
      }
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

      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/User/admin/create-account`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json'
        },
        body: formData,
      });

      const responseText = await response.text();
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { message: responseText };
      }

      if (!response.ok) {
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

      return responseData;
    } catch (error) {
      console.error('Create user failed:', error);
      throw error;
    }
  },
};