import React, { createContext, useContext, useEffect, useState } from 'react';
import { signalRService } from '../services/signalRService';
import { authService } from '../services/authService';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      initializeSignalR();
    }

    return () => {
      signalRService.stopConnection();
    };
  }, []);

  const initializeSignalR = async () => {
    const connected = await signalRService.startConnection();
    setIsConnected(connected);

    if (connected) {
      // Test connection
      setTimeout(async () => {
        const testResult = await signalRService.testConnection();
        console.log('SignalR connection test result:', testResult);
      }, 1000);

      // Lắng nghe tất cả events để debug
      signalRService.onAllEvents(({ eventName, data }) => {
        console.log(`🔔 SignalR Event [${eventName}]:`, data);
        
        // Tự động tạo notification từ các events
        addNotification({
          id: `debug-${Date.now()}`,
          type: eventName.toLowerCase().includes('medication') ? 'medication' : 
                eventName.toLowerCase().includes('appointment') ? 'appointment' : 'general',
          title: `SignalR: ${eventName}`,
          message: typeof data === 'string' ? data : JSON.stringify(data),
          data: data,
          timestamp: new Date().toISOString(),
          isRead: false
        });
      });

      // Lắng nghe notification mới
      signalRService.onNewNotification((notification) => {
        console.log('New notification received:', notification);
        addNotification(notification);
      });

      // Lắng nghe medication reminder
      signalRService.onMedicationReminder((reminder) => {
        console.log('Medication reminder received:', reminder);
        addNotification({
          id: `med-${reminder.reminderId || Date.now()}`,
          type: 'medication',
          title: 'Nhắc nhở uống thuốc',
          message: `Đã đến giờ uống ${reminder.medicineName || 'thuốc'}`,
          data: reminder,
          timestamp: new Date().toISOString(),
          isRead: false
        });
      });

      // Lắng nghe appointment reminder
      signalRService.onAppointmentReminder((appointment) => {
        console.log('Appointment reminder received:', appointment);
        addNotification({
          id: `apt-${appointment.appointmentId || Date.now()}`,
          type: 'appointment',
          title: 'Nhắc nhở lịch hẹn',
          message: `Bạn có lịch hẹn với ${appointment.doctorName || 'bác sĩ'}`,
          data: appointment,
          timestamp: new Date().toISOString(),
          isRead: false
        });
      });

      // Lắng nghe treatment update
      signalRService.onTreatmentUpdate((update) => {
        console.log('Treatment update received:', update);
        addNotification({
          id: `treatment-${update.treatmentId || Date.now()}`,
          type: 'treatment',
          title: 'Cập nhật điều trị',
          message: update.message || 'Có cập nhật mới về phác đồ điều trị',
          data: update,
          timestamp: new Date().toISOString(),
          isRead: false
        });
      });
    } else {
      console.warn('SignalR connection failed, running in offline mode');
    }
  };

  const addNotification = (notification) => {
    console.log('➕ Adding new notification:', notification);
    
    setNotifications(prev => {
      const updated = [notification, ...prev];
      console.log('📝 Total notifications:', updated.length);
      return updated;
    });
    
    setUnreadCount(prev => {
      const newCount = prev + 1;
      console.log('📊 Unread count:', prev, '→', newCount);
      return newCount;
    });
    
    // Show browser notification nếu được phép
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }
  };

  const markAsRead = async (notificationId) => {
    console.log('🔄 Marking notification as read:', notificationId);
    
    // Gửi đến backend
    await signalRService.markAsRead(notificationId);
    
    // Cập nhật local state
    setNotifications(prev => {
      const updated = prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      );
      console.log('📝 Updated notifications:', updated.filter(n => n.id === notificationId));
      return updated;
    });
    
    setUnreadCount(prev => {
      const newCount = Math.max(0, prev - 1);
      console.log('📊 Unread count:', prev, '→', newCount);
      return newCount;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Method để test notifications (không cần backend)
  const addTestNotification = (type = 'medication') => {
    const testNotifications = {
      medication: {
        id: `test-med-${Date.now()}`,
        type: 'medication',
        title: 'Nhắc nhở uống thuốc (Test)',
        message: 'Đây là test notification cho medication reminder',
        data: { medicineName: 'Efavirenz', dosage: '1 viên' },
        timestamp: new Date().toISOString(),
        isRead: false
      },
      appointment: {
        id: `test-apt-${Date.now()}`,
        type: 'appointment',
        title: 'Nhắc nhở lịch hẹn (Test)',
        message: 'Bạn có lịch hẹn với bác sĩ vào lúc 2PM',
        data: { doctorName: 'BS. Nguyễn Văn A', time: '14:00' },
        timestamp: new Date().toISOString(),
        isRead: false
      },
      treatment: {
        id: `test-treatment-${Date.now()}`,
        type: 'treatment',
        title: 'Cập nhật điều trị (Test)',
        message: 'Có cập nhật mới về phác đồ điều trị của bạn',
        data: { treatmentStage: 'Giai đoạn 2' },
        timestamp: new Date().toISOString(),
        isRead: false
      }
    };
    
    addNotification(testNotifications[type]);
  };

  const value = {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    clearAll,
    addNotification,
    addTestNotification // Thêm method test
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
