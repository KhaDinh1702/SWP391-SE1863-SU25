import axios from 'axios';
import { API_BASE_URL, getAuthHeaders } from './config';

class NotificationService {
  // Lấy thông tin user hiện tại từ localStorage
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Lấy token để authentication
  getAuthHeaders() {
    return getAuthHeaders();
  }

  // Lấy danh sách notifications của bệnh nhân
  async getNotificationsForPatient(patientId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/Notification/patient/${patientId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Đánh dấu thông báo đã xem
  async markNotificationAsSeen(notificationId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/Notification/mark-as-seen?notificationId=${notificationId}`, 
        {}, // Body rỗng
        {
          headers: this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking notification as seen:', error);
      throw error;
    }
  }

  // Đánh dấu nhiều thông báo đã xem
  async markMultipleNotificationsAsSeen(notificationIds) {
    try {
      const promises = notificationIds.map(id => this.markNotificationAsSeen(id));
      await Promise.all(promises);
      return { success: true, message: 'All notifications marked as seen' };
    } catch (error) {
      console.error('Error marking multiple notifications as seen:', error);
      throw error;
    }
  }

  // Tạo thông báo từ medicine reminder với khả năng lưu vào backend
  async createAndSaveMedicineReminderNotification(reminder, patientId) {
    const notification = this.createMedicineReminderNotification(reminder);
    
    // Tạo notification trong database (nếu backend hỗ trợ)
    try {
      // Giả định có endpoint để tạo notification
      await this.createNotificationInBackend({
        patientId: patientId,
        treatmentStageId: reminder.stageId,
        message: notification.title + ': ' + notification.message,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.log('Could not save notification to backend:', error.message);
      // Không throw error để app vẫn hoạt động bình thường
    }
    
    return notification;
  }

  // Tạo thông báo từ appointment với khả năng lưu vào backend
  async createAndSaveAppointmentNotification(appointment, patientId) {
    const notification = this.createAppointmentNotification(appointment);
    
    // Tạo notification trong database (nếu backend hỗ trợ)
    try {
      // Giả định có endpoint để tạo notification
      await this.createNotificationInBackend({
        patientId: patientId,
        appointmentId: appointment.appointmentId || appointment.id,
        message: notification.title + ': ' + notification.message,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.log('Could not save notification to backend:', error.message);
      // Không throw error để app vẫn hoạt động bình thường
    }
    
    return notification;
  }

  // Tạo notification trong backend (sử dụng endpoint đúng)
  async createNotificationInBackend(notificationData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/Notification/create-notification`, 
        notificationData,
        {
          headers: this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating notification in backend:', error);
      throw error;
    }
  }
  createMedicineReminderNotification(reminder) {
    return {
      id: `reminder-${reminder.id || Date.now()}`,
      type: 'medication',
      title: reminder.displayTitle || `${reminder.medicine || 'Thuốc điều trị'} - ${reminder.stageName || 'Nhắc uống thuốc'}`,
      message: reminder.displayDescription || 'Đã đến giờ uống thuốc theo lịch trình điều trị',
      timestamp: new Date(reminder.reminderTime || reminder.reminderDateTime).getTime(),
      isRead: false,
      data: {
        medicineName: reminder.medicine,
        reminderTime: reminder.reminderTime || reminder.reminderDateTime,
        dosage: reminder.dosage || "Theo đơn thuốc của bác sĩ",
        stageInfo: reminder.stageInfo,
        treatmentStageId: reminder.stageId,
        protocolId: reminder.protocolId
      },
      priority: this.calculatePriority(reminder.reminderTime || reminder.reminderDateTime),
      source: 'medicine_reminder'
    };
  }

  // Tạo thông báo mới từ appointment
  createAppointmentNotification(appointment) {
    return {
      id: `appointment-${appointment.appointmentId || appointment.id || Date.now()}`,
      type: 'appointment',
      title: appointment.reason || appointment.appointmentTitle || 'Lịch hẹn khám',
      message: `Bạn có lịch hẹn với ${appointment.doctorName || 'bác sĩ'} ${this.formatTimeUntilAppointment(appointment.appointmentDate)}`,
      timestamp: new Date(appointment.appointmentDate || appointment.appointmentStartDate).getTime(),
      isRead: false,
      data: {
        appointmentId: appointment.appointmentId || appointment.id,
        doctorName: appointment.doctorName,
        appointmentDate: appointment.appointmentDate || appointment.appointmentStartDate,
        location: appointment.location,
        reason: appointment.reason || appointment.appointmentTitle,
        onlineLink: appointment.onlineLink
      },
      priority: this.calculatePriority(appointment.appointmentDate || appointment.appointmentStartDate),
      source: 'appointment'
    };
  }

  // Lấy tất cả thông báo (cho Staff) - Sử dụng endpoint hiện có
  async getAllNotifications() {
    try {
      // Vì không có endpoint get-all, ta sẽ lấy thông báo của tất cả patients
      // Hoặc có thể bỏ qua function này vì backend không hỗ trợ
      console.log('getAllNotifications not supported by backend');
      return [];
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      return [];
    }
  }

  // Lấy thông báo theo patient ID (cho Staff)
  async getNotificationsByPatientId(patientId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/Notification/get-notification-by-patientId?patientId=${patientId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications by patient ID:', error);
      return [];
    }
  }

  // Tạo thông báo mới (cho Staff)
  async createNotification(notificationData) {
    try {
      // Gọi endpoint đúng với format backend yêu cầu
      const requestData = {
        patientId: notificationData.patientId,
        message: notificationData.message,
        treatmentStageId: notificationData.treatmentStageId || null,
        appointmentId: notificationData.appointmentId || null
        // Không gửi createdAt, để backend sử dụng DateTime.Now (server time)
      };

      const response = await axios.post(`${API_BASE_URL}/Notification/create-notification`, 
        requestData,
        {
          headers: this.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Xóa thông báo (cho Staff)
  async deleteNotification(notificationId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/Notification/delete/${notificationId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Tính toán độ ưu tiên dựa trên thời gian
  calculatePriority(dateTime) {
    if (!dateTime) return 'low';
    
    const now = new Date();
    const targetTime = new Date(dateTime);
    const diffHours = (targetTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours <= 1) return 'urgent';
    if (diffHours <= 6) return 'high';
    if (diffHours <= 24) return 'medium';
    return 'low';
  }

  // Format thời gian cho appointment
  formatTimeUntilAppointment(appointmentDate) {
    if (!appointmentDate) return '';
    
    const now = new Date();
    const appointment = new Date(appointmentDate);
    const diffTime = appointment.getTime() - now.getTime();
    const diffHours = Math.round(diffTime / (1000 * 60 * 60));
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours <= 0) return 'ngay bây giờ';
    if (diffHours === 1) return 'trong 1 giờ';
    if (diffHours < 24) return `trong ${diffHours} giờ`;
    if (diffDays === 1) return 'vào ngày mai';
    if (diffDays < 7) return `trong ${diffDays} ngày`;
    
    return `vào ${appointment.toLocaleDateString('vi-VN')}`;
  }

  // Lọc thông báo theo loại
  filterNotificationsByType(notifications, type) {
    return notifications.filter(notification => notification.type === type);
  }

  // Lọc thông báo chưa đọc
  getUnreadNotifications(notifications) {
    return notifications.filter(notification => !notification.isRead);
  }

  // Sắp xếp thông báo theo độ ưu tiên và thời gian
  sortNotifications(notifications) {
    const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
    
    return notifications.sort((a, b) => {
      // Sắp xếp theo độ ưu tiên trước
      const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Sau đó sắp xếp theo thời gian (sớm nhất trước)
      return a.timestamp - b.timestamp;
    });
  }

  // Merge notifications từ các nguồn khác nhau
  mergeNotifications(medicineReminders, appointments, realTimeNotifications = []) {
    const medicineNotifications = medicineReminders.map(reminder => 
      this.createMedicineReminderNotification(reminder)
    );
    
    const appointmentNotifications = appointments.map(appointment => 
      this.createAppointmentNotification(appointment)
    );
    
    // Merge tất cả và loại bỏ duplicate
    const allNotifications = [
      ...medicineNotifications,
      ...appointmentNotifications,
      ...realTimeNotifications
    ];
    
    // Loại bỏ duplicate dựa trên ID
    const uniqueNotifications = allNotifications.filter((notification, index, self) =>
      index === self.findIndex(n => n.id === notification.id)
    );
    
    return this.sortNotifications(uniqueNotifications);
  }

  // Tạo browser notification
  showBrowserNotification(notification) {
    if (Notification.permission === 'granted') {
      const browserNotif = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: `notification-${notification.id}`,
        requireInteraction: true
      });
      
      browserNotif.onclick = () => {
        window.focus();
        browserNotif.close();
      };
      
      // Tự động đóng sau 10 giây
      setTimeout(() => browserNotif.close(), 10000);
      
      return browserNotif;
    }
    return null;
  }

  // Request permission cho browser notifications
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }
}

export const notificationService = new NotificationService();
