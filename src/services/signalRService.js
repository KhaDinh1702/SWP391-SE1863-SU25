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
        console.log('✅ Connection is ready after', i * delay, 'ms');
        return true;
      }
      
      // Check for failed states
      if (currentState === 'Disconnected' && i > 2) {
        console.error('❌ Connection appears to have failed. State remains Disconnected');
        return false;
      }
      
      console.log(`⏳ Waiting for connection... (${i + 1}/${maxRetries}) State: ${currentState}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    const finalState = this.connection.state;
    console.warn('⚠️ Connection still not ready after', maxRetries * delay, 'ms. Final state:', finalState);
    
    // If it's still not connected, it's likely a connection failure
    return false;
  }

  // Check if backend server is running
  async checkBackendHealth() {
    try {
      console.log('🏥 Checking backend server health...');
      
      // Try to reach the base API first
      const response = await fetch('https://localhost:7040', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      // Any response means the server is running (404 is fine, means server is up)
      console.log('✅ Backend server is running (status:', response.status, ')');
      return true;
    } catch (error) {
      console.error('❌ Backend server health check failed:', error.message);
      
      // Try the simplest possible check - just reach the base URL
      try {
        console.log('🔄 Trying simpler connectivity check...');
        const altResponse = await fetch('https://localhost:7040', {
          method: 'HEAD', // Minimal request
          mode: 'no-cors' // This will at least tell us if the server is reachable
        });
        console.log('✅ Backend server is reachable');
        return true;
      } catch (altError) {
        console.error('❌ Backend server is not reachable:', altError.message);
        
        // One more try - check if SSL certificate issue
        try {
          console.log('🔄 Trying HTTP instead of HTTPS...');
          const httpResponse = await fetch('http://localhost:7040', {
            method: 'HEAD',
            mode: 'no-cors'
          });
          console.log('⚠️ Server reachable via HTTP but not HTTPS - SSL issue?');
          return true;
        } catch (httpError) {
          console.error('❌ Server not reachable via HTTP either');
          return false;
        }
      }
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

      console.log('🔗 Starting SignalR connection...');
      console.log('Current user:', { userId: currentUser.userId, hasToken: !!currentUser.token });

      // Check if backend is running first
      const backendHealthy = await this.checkBackendHealth();
      if (!backendHealthy) {
        console.warn('⚠️ Backend server may not be accessible, but attempting SignalR connection anyway...');
        // Don't return false here - let's try the connection anyway
      }

      // Thử kết nối với WebSocket trước
      this.connection = new HubConnectionBuilder()
        .withUrl('http://localhost:5275/reminderHub', {
          accessTokenFactory: () => {
            const token = authService.getCurrentUser()?.token;
            console.log('🔑 Providing token for SignalR:', token ? 'Token exists' : 'No token');
            return token;
          },
          skipNegotiation: true,
          transport: 1 // WebSockets only
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      // Xử lý các sự kiện kết nối trước khi start
      this.connection.onreconnecting((error) => {
        console.log('🔄 SignalR reconnecting...', error);
        this.isConnected = false;
      });

      this.connection.onreconnected((connectionId) => {
        console.log('✅ SignalR reconnected with connectionId:', connectionId);
        this.isConnected = true;
      });

      this.connection.onclose((error) => {
        console.log('🔌 SignalR connection closed', error);
        this.isConnected = false;
      });

      // Add connection state change handler for debugging
      this.connection.on('connectionStateChanged', (oldState, newState) => {
        console.log(`🔄 SignalR state changed: ${oldState} → ${newState}`);
      });

      console.log('⏳ Attempting to start SignalR connection...');

      await this.connection.start();
      console.log('📡 Connection start() completed. Current state:', this.connection.state);
      
      // Wait for connection to be fully established
      const connectionReady = await this.waitForConnection();
      
      if (connectionReady && this.connection.state === 'Connected') {
        this.isConnected = true;
        console.log('✅ SignalR Connected successfully! Connection state:', this.connection.state);

        // Join user group để nhận notifications riêng
        try {
          await this.joinUserGroup(currentUser.userId);
          console.log('✅ Successfully joined user group for user:', currentUser.userId);
        } catch (groupError) {
          console.error('❌ Failed to join user group:', groupError);
        }
      } else {
        this.isConnected = false;
        console.error('❌ Connection failed to establish. Final state:', this.connection.state);
        throw new Error(`SignalR connection failed. State: ${this.connection.state}`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ SignalR Connection Error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Fallback: thử kết nối với tất cả transport methods
      try {
        console.log('🔄 Trying fallback connection with all transports...');
        this.connection = new HubConnectionBuilder()
          .withUrl('https://localhost:7040/reminderHub', {
            accessTokenFactory: () => {
              const token = authService.getCurrentUser()?.token;
              console.log('🔑 Fallback - Providing token:', token ? 'Token exists' : 'No token');
              return token;
            }
            // Bỏ skipNegotiation để cho phép tất cả transport methods
          })
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Warning)
          .build();

        console.log('⏳ Attempting fallback connection...');
        await this.connection.start();
        console.log('📡 Fallback connection start() completed. Current state:', this.connection.state);
        
        // Wait for connection to be fully established
        const connectionReady = await this.waitForConnection();
        
        if (connectionReady && this.connection.state === 'Connected') {
          this.isConnected = true;
          console.log('✅ SignalR Connected successfully with fallback! Connection state:', this.connection.state);
          
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            try {
              await this.joinUserGroup(currentUser.userId);
              console.log('✅ Successfully joined user group with fallback connection');
            } catch (groupError) {
              console.error('❌ Failed to join user group with fallback connection:', groupError);
            }
          }
          
          return true;
        } else {
          this.isConnected = false;
          console.error('❌ Fallback connection failed to establish. Final state:', this.connection.state);
          throw new Error(`Fallback SignalR connection failed. State: ${this.connection.state}`);
        }
      } catch (fallbackError) {
        console.error('❌ SignalR Fallback Connection Error:', fallbackError);
        console.error('Fallback error details:', {
          message: fallbackError.message,
          stack: fallbackError.stack,
          name: fallbackError.name
        });
        
        // Final fallback: Try without authentication
        try {
          console.log('🔄 Trying final fallback without authentication...');
          this.connection = new HubConnectionBuilder()
            .withUrl('https://localhost:7040/reminderHub')
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Error)
            .build();

          await this.connection.start();
          console.log('📡 Final fallback connection start() completed. Current state:', this.connection.state);
          
          // Wait for connection to be fully established
          const connectionReady = await this.waitForConnection();
          
          if (connectionReady && this.connection.state === 'Connected') {
            this.isConnected = true;
            console.log('✅ SignalR Connected without auth! Connection state:', this.connection.state);
            
            // Note: Cannot join user group without authentication
            console.log('⚠️ Connected without authentication - cannot join user group');
            
            return true;
          } else {
            this.isConnected = false;
            console.error('❌ Final fallback connection failed to establish. Final state:', this.connection.state);
            throw new Error(`Final fallback SignalR connection failed. State: ${this.connection.state}`);
          }
        } catch (finalError) {
          console.error('❌ All SignalR connection attempts failed:', finalError);
          this.isConnected = false;
          return false;
        }
      }
    }
  }

  // Tham gia group theo userId
  async joinUserGroup(userId) {
    if (!this.connection) {
      console.error('❌ Cannot join user group: No connection');
      return false;
    }

    if (this.connection.state !== 'Connected') {
      console.error('❌ Cannot join user group: Connection not ready. State:', this.connection.state);
      return false;
    }

    if (!this.isConnected) {
      console.error('❌ Cannot join user group: Service not marked as connected');
      return false;
    }

    try {
      console.log('🔗 Joining user group for userId:', userId);
      await this.connection.invoke('JoinUserGroup', userId.toString());
      console.log(`✅ Successfully joined user group: ${userId}`);
      return true;
    } catch (error) {
      console.error('❌ Error joining user group:', error);
      console.error('Error details:', {
        message: error.message,
        connectionState: this.connection.state,
        isConnected: this.isConnected
      });
      return false;
    }
  }

  // Đăng ký lắng nghe notification mới
  onNewNotification(callback) {
    if (this.connection) {
      this.connection.on('ReceiveNotification', callback);
      this.connection.on('ReceiveReminder', callback); // Fallback
    }
  }

  // Đăng ký lắng nghe medication reminder
  onMedicationReminder(callback) {
    if (this.connection) {
      this.connection.on('ReceiveMedicationReminder', callback);
      this.connection.on('MedicationReminder', callback); // Alternative name
      this.connection.on('SendReminderToUser', callback); // Possible backend method
    }
  }

  // Đăng ký lắng nghe appointment reminder
  onAppointmentReminder(callback) {
    if (this.connection) {
      this.connection.on('ReceiveAppointmentReminder', callback);
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
    console.log('🔍 Testing SignalR connection...');
    
    if (!this.connection) {
      console.log('❌ No connection object exists');
      return false;
    }

    console.log('📊 Connection diagnostics:', {
      state: this.connection.state,
      isConnected: this.isConnected,
      connectionId: this.connection.connectionId,
      transport: this.connection.transport?.name,
      baseUrl: this.connection.baseUrl
    });

    try {
      const state = this.connection.state;
      const isReady = state === 'Connected' && this.isConnected;
      
      if (isReady) {
        console.log('✅ Connection is healthy and ready');
      } else {
        console.log('⚠️ Connection is not ready:', { state, isConnected: this.isConnected });
      }
      
      return isReady;
    } catch (error) {
      console.log('❌ SignalR connection test failed:', error);
      return false;
    }
  }

  // Lắng nghe tất cả events để debug
  onAllEvents(callback) {
    if (this.connection) {
      // Một số event names có thể có trong backend
      const eventNames = [
        'ReceiveNotification',
        'ReceiveReminder', 
        'ReceiveMedicationReminder',
        'MedicationReminder',
        'SendReminderToUser',
        'ReceiveAppointmentReminder',
        'AppointmentReminder',
        'ReceiveTreatmentUpdate',
        'TreatmentUpdate',
        'NotificationSent',
        'ReminderSent'
      ];

      eventNames.forEach(eventName => {
        this.connection.on(eventName, (data) => {
          console.log(`SignalR Event [${eventName}]:`, data);
          callback({ eventName, data });
        });
      });
    }
  }
}

export const signalRService = new SignalRService();
