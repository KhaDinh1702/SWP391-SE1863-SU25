import { API_BASE_URL, getAuthHeaders } from './config';

export const reportService = {
  // Lấy thống kê tổng quan
  async getOverallStatistics() {
    try {
      const endpoints = [
        { url: `${API_BASE_URL}/User/get-list-user`, key: 'users' },
        { url: `${API_BASE_URL}/Appointment/get-list-appointments`, key: 'appointments' },
        { url: `${API_BASE_URL}/Doctor/get-list-doctor`, key: 'doctors' },
        { url: `${API_BASE_URL}/Patient/get-list-patient`, key: 'patients' },
        { url: `${API_BASE_URL}/LabResult/get-list-lab-result`, key: 'labResults' },
        { url: `${API_BASE_URL}/MedicalRecord/get-list-medical-record`, key: 'medicalRecords' },
        { url: `${API_BASE_URL}/Blog/get-list-blog`, key: 'blogs' }
      ];

      const results = {};
      
      // Fetch data with error handling for each endpoint
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint.url, { headers: getAuthHeaders() });
          if (response.ok) {
            const data = await response.json();
            results[endpoint.key] = Array.isArray(data) ? data : [];
          } else {
            console.warn(`Failed to fetch ${endpoint.key}: ${response.status}`);
            results[endpoint.key] = [];
          }
        } catch (error) {
          console.warn(`Error fetching ${endpoint.key}:`, error);
          results[endpoint.key] = [];
        }
      }

      return results;
    } catch (error) {
      console.error('Error fetching overall statistics:', error);
      throw error;
    }
  },

  // Lấy thống kê người dùng
  async getUserStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/User/get-list-user`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const users = await response.json();
      
      const statistics = {
        total: users.length,
        active: users.filter(user => user.isActive).length,
        inactive: users.filter(user => !user.isActive).length,
        byRole: users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {}),
        byMonth: this.groupByMonth(users, 'createdAt')
      };

      return statistics;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  },

  // Lấy thống kê cuộc hẹn
  async getAppointmentStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/Appointment/get-list-appointments`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch appointments');
      
      const appointments = await response.json();
      
      const statistics = {
        total: appointments.length,
        paid: appointments.filter(apt => apt.isPaid).length,
        unpaid: appointments.filter(apt => !apt.isPaid).length,
        byStatus: appointments.reduce((acc, apt) => {
          acc[apt.status] = (acc[apt.status] || 0) + 1;
          return acc;
        }, {}),
        byMonth: this.groupByMonth(appointments, 'appointmentDate'),
        revenue: appointments
          .filter(apt => apt.isPaid)
          .reduce((sum, apt) => sum + (apt.price || 0), 0)
      };

      return statistics;
    } catch (error) {
      console.error('Error fetching appointment statistics:', error);
      throw error;
    }
  },

  // Lấy thống kê bác sĩ
  async getDoctorStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/Doctor/get-list-doctor`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch doctors');
      
      const doctors = await response.json();
      
      const statistics = {
        total: doctors.length,
        active: doctors.filter(doc => doc.isActive).length,
        inactive: doctors.filter(doc => !doc.isActive).length,
        bySpecialization: doctors.reduce((acc, doc) => {
          const spec = doc.specialization || 'Không xác định';
          acc[spec] = (acc[spec] || 0) + 1;
          return acc;
        }, {}),
        byExperience: doctors.reduce((acc, doc) => {
          const exp = doc.experience || 0;
          const range = this.getExperienceRange(exp);
          acc[range] = (acc[range] || 0) + 1;
          return acc;
        }, {})
      };

      return statistics;
    } catch (error) {
      console.error('Error fetching doctor statistics:', error);
      throw error;
    }
  },

  // Lấy thống kê bệnh nhân
  async getPatientStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/Patient/get-list-patient`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch patients');
      
      const patients = await response.json();
      
      const statistics = {
        total: patients.length,
        byGender: patients.reduce((acc, patient) => {
          acc[patient.gender] = (acc[patient.gender] || 0) + 1;
          return acc;
        }, {}),
        byAgeGroup: patients.reduce((acc, patient) => {
          const age = this.calculateAge(patient.dateOfBirth);
          const ageGroup = this.getAgeGroup(age);
          acc[ageGroup] = (acc[ageGroup] || 0) + 1;
          return acc;
        }, {}),
        byMonth: this.groupByMonth(patients, 'createdAt')
      };

      return statistics;
    } catch (error) {
      console.error('Error fetching patient statistics:', error);
      throw error;
    }
  },

  // Lấy thống kê kết quả xét nghiệm
  async getLabResultStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/LabResult/get-list-lab-result`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch lab results');
      
      const labResults = await response.json();
      
      const statistics = {
        total: labResults.length,
        byTestType: labResults.reduce((acc, result) => {
          const testType = result.testType || 'Không xác định';
          acc[testType] = (acc[testType] || 0) + 1;
          return acc;
        }, {}),
        byMonth: this.groupByMonth(labResults, 'testDate'),
        pending: labResults.filter(result => !result.isCompleted).length,
        completed: labResults.filter(result => result.isCompleted).length
      };

      return statistics;
    } catch (error) {
      console.error('Error fetching lab result statistics:', error);
      throw error;
    }
  },

  // Lấy thống kê hồ sơ y tế
  async getMedicalRecordStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/MedicalRecord/get-list-medical-record`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch medical records');
      
      const medicalRecords = await response.json();
      
      const statistics = {
        total: medicalRecords.length,
        byMonth: this.groupByMonth(medicalRecords, 'createdAt'),
        byDoctor: medicalRecords.reduce((acc, record) => {
          const doctorId = record.doctorId || 'Không xác định';
          acc[doctorId] = (acc[doctorId] || 0) + 1;
          return acc;
        }, {})
      };

      return statistics;
    } catch (error) {
      console.error('Error fetching medical record statistics:', error);
      throw error;
    }
  },

  // Lấy thống kê blog
  async getBlogStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/Blog/get-list-blog`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        console.warn(`Blog API returned ${response.status}, using empty data`);
        return {
          total: 0,
          byTag: {},
          byMonth: {}
        };
      }
      
      const blogs = await response.json();
      
      // Handle case where blogs might be null or undefined
      const validBlogs = Array.isArray(blogs) ? blogs : [];
      
      const statistics = {
        total: validBlogs.length,
        byTag: validBlogs.reduce((acc, blog) => {
          const tag = blog.tag || 'Không có tag';
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        }, {}),
        byMonth: this.groupByMonth(validBlogs, 'createdAt')
      };

      return statistics;
    } catch (error) {
      console.warn('Blog service not available, returning empty statistics');
      return {
        total: 0,
        byTag: {},
        byMonth: {}
      };
    }
  },

  // Helper methods
  groupByMonth(data, dateField) {
    if (!data || !Array.isArray(data)) return {};
    
    return data.reduce((acc, item) => {
      try {
        const date = new Date(item[dateField]);
        if (isNaN(date.getTime())) return acc; // Skip invalid dates
        
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthYear] = (acc[monthYear] || 0) + 1;
        return acc;
      } catch (error) {
        return acc; // Skip items with invalid date fields
      }
    }, {});
  },

  calculateAge(dateOfBirth) {
    if (!dateOfBirth) return 0;
    
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      
      if (isNaN(birthDate.getTime())) return 0;
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return Math.max(0, age);
    } catch (error) {
      return 0;
    }
  },

  getAgeGroup(age) {
    if (age < 18) return 'Dưới 18';
    if (age < 30) return '18-29';
    if (age < 45) return '30-44';
    if (age < 60) return '45-59';
    return 'Trên 60';
  },

  getExperienceRange(experience) {
    if (experience < 2) return 'Dưới 2 năm';
    if (experience < 5) return '2-5 năm';
    if (experience < 10) return '5-10 năm';
    return 'Trên 10 năm';
  }
};
