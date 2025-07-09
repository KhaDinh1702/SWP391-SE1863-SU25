import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { authService } from './authService';

class SignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  // Wait for SignalR connection to be fully established
  async waitForConnection(maxRetries = 10, delay = 100) {
    for (let i = 0; i < maxRetries; i++) {
      const currentState = this.connection.state;
      
      if (currentState === 'Connected') {
        return true;
      }
      
      if (currentState === 'Disconnected' && i > 2) {
        console.error('❌ Connection failed');
        return false;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    return false;
  }

  // Check if backend server is running
  async checkBackendHealth() {
    try {
      const response = await fetch('https://localhost:7040', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Khởi tạo kết nối SignalR
  async startConnection() {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        console.warn('No authenticated user found');
        return false;
      }

      // Check if backend is running first
      const backendHealthy = await this.checkBackendHealth();
      if (!backendHealthy) {
        console.warn('⚠️ Backend server may not be accessible');
      }

      // Thử kết nối với WebSocket trước
      this.connection = new HubConnectionBuilder()
        .withUrl('https://localhost:7040/reminderHub', {
          accessTokenFactory: () => authService.getCurrentUser()?.token,
          skipNegotiation: true,
          transport: 1 // WebSockets only
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();

      // Xử lý các sự kiện kết nối
      this.connection.onreconnecting(() => this.isConnected = false);
      this.connection.onreconnected(() => this.isConnected = true);
      this.connection.onclose(() => this.isConnected = false);

      await this.connection.start();
      
      const connectionReady = await this.waitForConnection();
      
      if (connectionReady && this.connection.state === 'Connected') {
        this.isConnected = true;
        console.log('✅ SignalR Connected successfully!');

        // Join user group để nhận notifications riêng
        try {
          await this.joinUserGroup(currentUser.userId);
        } catch (groupError) {
          console.error('❌ Failed to join user group:', groupError);
        }
      } else {
        this.isConnected = false;
        throw new Error(`SignalR connection failed. State: ${this.connection.state}`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ SignalR Connection Error:', error.message);
      
      // Fallback: thử kết nối với tất cả transport methods
      try {
        this.connection = new HubConnectionBuilder()
          .withUrl('https://localhost:7040/reminderHub', {
            accessTokenFactory: () => authService.getCurrentUser()?.token
          })
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Error)
          .build();

        await this.connection.start();
        const connectionReady = await this.waitForConnection();
        
        if (connectionReady && this.connection.state === 'Connected') {
          this.isConnected = true;
          console.log('✅ SignalR Connected with fallback!');
          
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            try {
              await this.joinUserGroup(currentUser.userId);
            } catch (groupError) {
              console.error('❌ Failed to join user group:', groupError);
            }
          }
          
          return true;
        }
      } catch (fallbackError) {
        console.error('❌ All SignalR connection attempts failed');
        this.isConnected = false;
        return false;
      }
    }
  }

  // Tham gia group theo userId
  async joinUserGroup(userId) {
    if (!this.connection || this.connection.state !== 'Connected' || !this.isConnected) {
      return false;
    }

    try {
      await this.connection.invoke('JoinUserGroup', userId.toString());
      console.log(`✅ Joined user group: ${userId}`);
      return true;
    } catch (error) {
      console.error('❌ Error joining user group:', error.message);
      return false;
    }
  }

  // Đăng ký lắng nghe notification mới
  onNewNotification(callback) {
    if (this.connection) {
      this.connection.on('ReceiveNotification', callback);
      this.connection.on('ReceiveReminder', callback); // Cũng lắng nghe medication reminders
      this.connection.on('ReceiveAppointmentReminder', callback); // Lắng nghe appointment reminders
    }
  }

  // Đăng ký lắng nghe medication reminder
  onMedicationReminder(callback) {
    if (this.connection) {
      this.connection.on('ReceiveReminder', callback); // Backend gửi với tên này
      this.connection.on('ReceiveMedicationReminder', callback);
      this.connection.on('MedicationReminder', callback); // Alternative name
      this.connection.on('SendReminderToUser', callback); // Possible backend method
    }
  }

  // Đăng ký lắng nghe appointment reminder
  onAppointmentReminder(callback) {
    if (this.connection) {
      this.connection.on('ReceiveAppointmentReminder', callback); // Backend gửi với tên này
      this.connection.on('AppointmentReminder', callback); // Alternative name
    }
  }

  // Đăng ký lắng nghe treatment update
  onTreatmentUpdate(callback) {
    if (this.connection) {
      this.connection.on('ReceiveTreatmentUpdate', callback);
      this.connection.on('TreatmentUpdate', callback); // Alternative name
    }
  }

  // Gửi mark notification as read
  async markAsRead(notificationId) {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.invoke('MarkNotificationAsRead', notificationId);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  }

  // Ngắt kết nối
  async stopConnection() {
    if (this.connection) {
      try {
        await this.connection.stop();
        this.isConnected = false;
        console.log('SignalR connection stopped');
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      }
    }
  }

  // Kiểm tra trạng thái kết nối
  getConnectionState() {
    return this.connection?.state || 'Disconnected';
  }

  // Test connection bằng cách kiểm tra state
  async testConnection() {
    if (!this.connection) {
      console.log('❌ No connection object exists');
      return false;
    }

    const state = this.connection.state;
    const isReady = state === 'Connected' && this.isConnected;
    
    if (isReady) {
      console.log('✅ Connection is healthy and ready');
    } else {
      console.log('⚠️ Connection is not ready:', { state, isConnected: this.isConnected });
    }
    
    return isReady;
  }

  // Lắng nghe tất cả events để debug
  onAllEvents(callback) {
    if (this.connection) {
      const eventNames = [
        'ReceiveNotification',
        'ReceiveReminder',
        'ReceiveAppointmentReminder',
        'ReceiveMedicationReminder',
        'MedicationReminder',
        'SendReminderToUser',
        'AppointmentReminder',
        'ReceiveTreatmentUpdate',
        'TreatmentUpdate'
      ];

      eventNames.forEach(eventName => {
        this.connection.on(eventName, (data) => {
          callback({ eventName, data });
        });
      });
    }
  }

  // Test medication reminder system
  async testMedicationReminders() {
    if (!this.connection || !this.isConnected) {
      console.log('❌ No active SignalR connection for testing');
      return false;
    }

    const testCallback = (reminder) => {
      console.log('🔔 Received medication reminder:', {
        stageName: reminder.stageName,
        medicine: reminder.medicine,
        reminderDateTime: reminder.reminderDateTime
      });
    };

    this.onMedicationReminder(testCallback);
    this.onNewNotification(testCallback);
    
    console.log('✅ Medication reminder listeners set up');
    return true;
  }

  // Comprehensive test function to monitor all SignalR activity
  async testAllSignalRActivity() {
    if (!this.connection || !this.isConnected) {
      console.log('❌ No active SignalR connection for monitoring');
      return false;
    }

    this.onAllEvents((eventData) => {
      console.log('📨 SignalR Event:', eventData.eventName, eventData.data);
      
      // Show browser notification if possible
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(`SignalR: ${eventData.eventName}`, {
          body: `Data: ${JSON.stringify(eventData.data).substring(0, 100)}...`,
          icon: '/favicon.ico'
        });
      }
    });

    // Request notification permission
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    
    console.log('✅ SignalR monitoring active');
    return true;
  }
}

export const signalRService = new SignalRService();

// For debugging purposes - make signalRService available globally
if (typeof window !== 'undefined') {
  window.signalRService = signalRService;
  window.testMedicationReminders = async () => {
    return await signalRService.testMedicationReminders();
  };
  window.monitorSignalR = async () => {
    return await signalRService.testAllSignalRActivity();
  };
}
