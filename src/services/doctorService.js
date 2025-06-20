import { API_BASE_URL, getAuthHeaders } from './config';

export const doctorService = {
  getAllDoctors: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found');
        throw new Error('Vui lòng đăng nhập để xem danh sách bác sĩ');
      }

      console.log('Fetching doctors from:', `${API_BASE_URL}/Doctor/get-list-doctor`);
      const headers = getAuthHeaders();
      console.log('Auth headers:', headers);

      const response = await fetch(`${API_BASE_URL}/Doctor/get-list-doctor`, {
        method: 'GET',
        headers: headers
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.status === 401) {
        console.error('Authentication failed');
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      if (response.status === 403) {
        console.error('Access forbidden');
        throw new Error('Bạn không có quyền truy cập danh sách bác sĩ');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Không thể lấy danh sách bác sĩ' }));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Không thể lấy danh sách bác sĩ');
      }

      const text = await response.text();
      console.log('Raw response:', text);

      if (!text) {
        console.warn('Empty response from server');
        return [];
      }

      try {
        const data = JSON.parse(text);
        console.log('Parsed doctors data:', data);
        return Array.isArray(data) ? data : [];
      } catch (parseError) {
        console.error('Error parsing doctors data:', parseError);
        console.error('Raw response:', text);
        return [];
      }
    } catch (error) {
      console.error('Fetch doctors failed:', error);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
      }
      throw error;
    }
  },

  getDoctorById: async (id) => {
    try {
      if (!id) {
        console.warn('No doctor ID provided');
        return null;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để xem thông tin bác sĩ');
      }

      console.log('Fetching doctor with ID:', id);
      const response = await fetch(`${API_BASE_URL}/Doctor/get-by-id?doctorId=${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.status === 404) {
        console.warn(`Doctor with ID ${id} not found`);
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Không thể lấy thông tin bác sĩ' }));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Không thể lấy thông tin bác sĩ');
      }

      const data = await response.json();
      console.log('Doctor data:', data);
      return data;
    } catch (error) {
      console.error('Fetch doctor by ID failed:', error);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
      }
      throw error;
    }
  },

  createDoctor: async (doctorData) => {
    try {
      // Validate required fields
      if (!doctorData.fullName || !doctorData.email || !doctorData.phone || !doctorData.specialty) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      // Format the data according to the backend model
      const formattedData = {
        fullName: doctorData.fullName.trim(),
        email: doctorData.email.trim(),
        phone: doctorData.phone.trim(),
        specialization: doctorData.specialty.trim(),
        isActive: doctorData.status === 'active',
        qualifications: doctorData.qualification?.trim() || null,
        experience: doctorData.experience?.trim() || null,
        bio: doctorData.description?.trim() || null,
        profilePictureURL: null
      };

      console.log('Creating doctor with data:', formattedData);

      const response = await fetch(`${API_BASE_URL}/Doctor/create`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Thêm bác sĩ thất bại' }));
        throw new Error(errorData.message || 'Thêm bác sĩ thất bại');
      }

      const text = await response.text();
      if (!text) {
        return formattedData;
      }

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.warn('Server response was not JSON, returning created data');
        return formattedData;
      }
    } catch (error) {
      console.error('Create doctor failed:', error);
      throw error;
    }
  },

  updateDoctor: async (doctorData) => {
    try {
      if (!doctorData.doctorId) {
        throw new Error('Thiếu doctorId');
      }
      const formattedData = {
        doctorId: doctorData.doctorId,
        fullName: doctorData.fullName ?? null,
        specialization: doctorData.specialization ?? null,
        qualifications: doctorData.qualifications ?? null,
        experience: doctorData.experience ?? null,
        bio: doctorData.bio ?? null,
        profilePictureURL: doctorData.profilePictureURL ?? null,
        isActive: typeof doctorData.isActive === 'boolean' ? doctorData.isActive : null,
      };
      console.log('Updating doctor with data:', formattedData);
      const response = await fetch(`${API_BASE_URL}/Doctor/update-doctor`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Cập nhật bác sĩ thất bại' }));
        throw new Error(errorData.message || 'Cập nhật bác sĩ thất bại');
      }
      const result = await response.json();
      console.log('Update doctor response:', result);
      return result;
    } catch (error) {
      console.error('Update doctor failed:', error);
      throw error;
    }
  },

  deleteDoctor: async (id) => {
    try {
      if (!id) {
        throw new Error('ID bác sĩ không hợp lệ');
      }

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