import { useState, useEffect, useCallback } from 'react';
import { FaBell, FaPills, FaCalendarAlt, FaClock, FaArrowLeft, FaWifi, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authService } from "../../services/authService";
import { appointmentService } from "../../services/appointmentService";
import { notificationService } from "../../services/notificationService";
import { useNotification } from '../../contexts/NotificationContext';

// Trang thông báo cho bệnh nhân
// Hiển thị nhắc nhở uống thuốc và lịch hẹn sắp tới
// Sử dụng API thực từ backend:
// - Nhắc uống thuốc: /api/Reminder/upcomingReminderForDrinkMedicine?userId={userId}
// - Lịch hẹn: appointmentService.getAllAppointments() -> filter theo patientId/userId -> lấy appointmentId
// - Fallback về dữ liệu mẫu nếu API không có dữ liệu

export default function Notifications() {
  const [appointments, setAppointments] = useState([]);
  const [backendNotifications, setBackendNotifications] = useState([]); // Thông báo từ backend
  const [loading, setLoading] = useState(true);
  const [signalRConnected, setSignalRConnected] = useState(false); // Trạng thái kết nối SignalR
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date()); // Thời gian cập nhật cuối cùng
  const [dateFilter, setDateFilter] = useState('today'); // Bộ lọc theo ngày: 'today', 'week', 'all'
  const [typeFilter, setTypeFilter] = useState('all'); // Bộ lọc theo loại: 'all', 'medicine', 'appointment', 'general'
  const navigate = useNavigate();
  
  // Sử dụng SignalR context
  const { notifications, unreadCount, isConnected, markAsRead, markAllAsRead } = useNotification();

  useEffect(() => {
    fetchNotifications();
    loadBackendNotifications();
    
    // Request notification permission
    if (Notification.permission === 'default') {
      notificationService.requestNotificationPermission();
    }
    
    // Set up interval để kiểm tra thông báo mới mỗi 10 giây (tăng tần suất)
    const notificationInterval = setInterval(() => {
      loadBackendNotifications();
    }, 10000); // 10 giây thay vì 30 giây
    
    // Set up SignalR connection để nhận thông báo real-time
    const setupSignalRConnection = () => {
      try {
        const connection = new window.signalR.HubConnectionBuilder()
          .withUrl('https://localhost:7040/reminderHub', {
            accessTokenFactory: () => authService.getCurrentUser()?.token
          })
          .build();

        connection.start()
          .then(() => {
            console.log('SignalR Connected to ReminderHub');
            setSignalRConnected(true); // Cập nhật trạng thái kết nối

            // Lắng nghe thông báo mới
            connection.on('ReceiveReminder', (data) => {
              console.log('Received new notification via SignalR:', data);
              setLastUpdateTime(new Date());
              // Reload backend notifications khi có thông báo mới
              loadBackendNotifications();
            });

            // Lắng nghe khi thông báo được đánh dấu đã xem
            connection.on('NotificationSeen', (data) => {
              console.log('Notification marked as seen via SignalR:', data);
              setLastUpdateTime(new Date());
              // Cập nhật local state
              setBackendNotifications(prev => 
                prev.map(notif => 
                  notif.notificationId === data.notificationId 
                    ? { ...notif, isSeen: true, seenAt: new Date().toISOString() }
                    : notif
                )
              );
            });

          })
          .catch(err => {
            console.log('SignalR Connection Error:', err);
            setSignalRConnected(false); // Cập nhật trạng thái kết nối
          });

        return connection;
      } catch (error) {
        console.log('SignalR not available:', error);
        return null;
      }
    };

    const signalRConnection = setupSignalRConnection();
    
    // Cleanup interval và SignalR connection khi component unmount
    return () => {
      clearInterval(notificationInterval);
      if (signalRConnection) {
        signalRConnection.stop();
      }
    };
  }, []);

  // Function để load notifications từ backend
  const loadBackendNotifications = async () => {
    const currentUser = authService.getCurrentUser();
    console.log('🔍 DEBUG loadBackendNotifications:');
    console.log('- currentUser:', currentUser);
    
    if (currentUser) {
      try {
        // Lấy thông tin user để có patientId
        const userResponse = await fetch(`https://localhost:7040/api/User/get-by-id?userId=${currentUser.userId}`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('- userResponse.ok:', userResponse.ok);
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          // Ưu tiên sử dụng patientId từ token trước
          let patientId = currentUser.patientId || userData.patientId || userData.patient?.id;
          
          // Nếu không tìm thấy patientId riêng, sử dụng userId làm fallback
          if (!patientId) {
            patientId = userData.id || currentUser.userId;
          }
          
          console.log('- userData:', userData);
          console.log('- userData.patientId:', userData.patientId);
          console.log('- currentUser.patientId:', currentUser.patientId);
          console.log('- Final patientId used:', patientId);
          
          if (patientId) {
            // Sử dụng API có sẵn: get-notification-by-patientId
            try {
              console.log('- Calling API with patientId:', patientId);
              console.log('- API URL:', `https://localhost:7040/api/Notification/get-notification-by-patientId?patientId=${patientId}`);
              
              const notifications = await notificationService.getNotificationsByPatientId(patientId);
              
              console.log('- notifications from API:', notifications);
              console.log('- API response type:', typeof notifications);
              console.log('- API response is array:', Array.isArray(notifications));
              
              // Sắp xếp theo thời gian tạo (mới nhất trước)
              const sortedNotifications = (notifications || []).sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
              );
              
              console.log('- sortedNotifications:', sortedNotifications);
              
              setBackendNotifications(sortedNotifications);
              setLastUpdateTime(new Date()); // Cập nhật thời gian load thành công
              
              // Hiển thị toast cho thông báo mới chưa xem (trong 5 phút gần đây)
              const newNotifications = sortedNotifications.filter(n => 
                !n.isSeen && 
                new Date(n.createdAt) > Date.now() - 5 * 60 * 1000
              );
              
              newNotifications.forEach(notification => {
                // Phát âm thanh thông báo
                try {
                  const audio = new Audio('/notification-sound.mp3');
                  audio.volume = 0.5;
                  audio.play().catch(e => console.log('Cannot play notification sound:', e));
                } catch (e) {
                  console.log('Audio not available:', e);
                }
                
                // Hiển thị browser notification
                if (Notification.permission === 'granted') {
                  const browserNotif = new Notification('🔔 Thông báo mới từ hệ thống!', {
                    body: notification.message,
                    icon: '/favicon.ico',
                    tag: `backend-${notification.notificationId}`,
                    requireInteraction: true
                  });
                  
                  browserNotif.onclick = () => {
                    window.focus();
                    handleMarkBackendNotificationAsSeen(notification.notificationId);
                    browserNotif.close();
                  };
                  
                  setTimeout(() => browserNotif.close(), 15000);
                }
                
                // Hiển thị toast notification trong app
                showBackendNotificationToast(notification);
              });
              
            } catch (error) {
              console.log('📨 Backend notifications not available:', error.message);
            }
          }
        }
      } catch (error) {
        console.error('Error loading backend notifications:', error);
      }
    }
  };

  // Function để tạo notification trong backend cho medicine reminder
  const createMedicineReminderNotification = async (reminder, patientId) => {
    try {
      // Tạo thông báo trong database với API đúng
      const notificationData = {
        patientId: patientId,
        treatmentStageId: reminder.stageId,
        message: `Nhắc nhở uống thuốc: ${reminder.medicine || reminder.stageName || 'Thuốc điều trị'} - ${reminder.displayDescription || 'Đã đến giờ uống thuốc'}`,
        // Không gửi createdAt, để backend tự set
        appointmentId: null // Rõ ràng set null cho appointmentId
      };

      const response = await fetch(`https://localhost:7040/api/Notification/create-notification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getCurrentUser()?.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationData)
      });

      if (response.ok) {
        const createdNotification = await response.json();
        return createdNotification;
      } else {
        console.error('Failed to create notification:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error creating notification in backend:', error);
      return null;
    }
  };

  // Function để tạo notification trong backend cho appointment
  const createAppointmentNotification = async (appointment, patientId) => {
    try {
      // Tạo thông báo trong database với API đúng
      const notificationData = {
        patientId: patientId,
        appointmentId: appointment.appointmentId || appointment.id,
        message: `Lịch hẹn sắp tới: ${appointment.reason || 'Cuộc hẹn khám'} với ${appointment.doctorName || 'bác sĩ'}`,
        // Không gửi createdAt, để backend tự set
        treatmentStageId: null // Rõ ràng set null cho treatmentStageId
      };

      const response = await fetch(`https://localhost:7040/api/Notification/create-notification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getCurrentUser()?.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationData)
      });

      if (response.ok) {
        const createdNotification = await response.json();
        return createdNotification;
      } else {
        console.error('Failed to create notification:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error creating notification in backend:', error);
      return null;
    }
  };

  // Function để đánh dấu notification từ backend đã xem
  const handleMarkBackendNotificationAsSeen = async (notificationId) => {
    try {
      await notificationService.markNotificationAsSeen(notificationId);
      
      // Cập nhật state local
      setBackendNotifications(prev => 
        prev.map(notif => 
          notif.notificationId === notificationId 
            ? { ...notif, isSeen: true, seenAt: new Date().toISOString() }
            : notif
        )
      );
      
    } catch (error) {
      console.error('Error marking backend notification as seen:', error);
    }
  };

  // Function để tạo notification cho reminder khi đến thời gian
  const handleReminderNotification = async (reminder, patientId) => {
    const now = new Date();
    const reminderTime = new Date(reminder.reminderTime || reminder.reminderDateTime);
    const timeDiff = reminderTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // Chỉ tạo notification nếu trong vòng 2 giờ tới
    if (hoursDiff >= 0 && hoursDiff <= 2) {
      const backendNotification = await createMedicineReminderNotification(reminder, patientId);
      
      if (backendNotification) {
        // Thêm vào danh sách backend notifications
        setBackendNotifications(prev => [backendNotification, ...prev]);
        
        // Hiển thị browser notification
        if (Notification.permission === 'granted') {
          notificationService.showBrowserNotification({
            title: `💊 Nhắc uống thuốc`,
            message: backendNotification.message,
            id: backendNotification.notificationId
          });
        }
      }
    }
  };

  // Function để tạo notification cho appointment khi đến thời gian
  const handleAppointmentNotification = async (appointment, patientId) => {
    const now = new Date();
    const appointmentTime = new Date(appointment.appointmentDate || appointment.appointmentStartDate);
    const timeDiff = appointmentTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // Chỉ tạo notification nếu trong vòng 24 giờ tới
    if (hoursDiff >= 0 && hoursDiff <= 24) {
      const backendNotification = await createAppointmentNotification(appointment, patientId);
      
      if (backendNotification) {
        // Thêm vào danh sách backend notifications
        setBackendNotifications(prev => [backendNotification, ...prev]);
        
        // Hiển thị browser notification
        if (Notification.permission === 'granted') {
          notificationService.showBrowserNotification({
            title: `📅 Lịch hẹn sắp tới`,
            message: backendNotification.message,
            id: backendNotification.notificationId
          });
        }
      }
    }
  };

  // Kết hợp real-time notifications với static data (chỉ giữ lại cho SignalR)
  useEffect(() => {
    // Filter real-time notifications by type
    const appointmentNotifications = notifications.filter(n => n.type === 'appointment');
    
    // Merge với dữ liệu hiện có cho appointments
    if (appointmentNotifications.length > 0) {
      const newAppointments = appointmentNotifications.map(notif => ({
        appointmentId: notif.id,
        reason: notif.data?.reason || notif.title,
        appointmentDate: notif.data?.appointmentDate || notif.timestamp,
        doctorName: notif.data?.doctorName || 'Bác sĩ',
        location: notif.data?.location || 'Phòng khám',
        notes: notif.message,
        isRealTime: true,
        isRead: notif.isRead
      }));
      
      setAppointments(prev => {
        const merged = [...newAppointments, ...prev.filter(a => !a.isRealTime)];
        return merged.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
      });
    }
  }, [notifications]);

  const handleMarkAsRead = useCallback(async (notificationId) => {
    await markAsRead(notificationId);
  }, [markAsRead]);

  const showBackendNotificationToast = useCallback((notification) => {
    // Tạo toast element cho backend notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-white border-l-4 border-green-500 rounded-lg shadow-lg p-4 max-w-sm transform translate-x-full transition-transform duration-300';
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            🔔
          </div>
        </div>
        <div class="flex-1">
          <h4 class="font-semibold text-gray-900 text-sm">Thông báo mới từ hệ thống!</h4>
          <p class="text-gray-600 text-sm mt-1">${notification.message}</p>
          <div class="mt-2 flex gap-2">
            <button onclick="this.closest('.fixed').remove(); window.markBackendAsSeen('${notification.notificationId}')" 
                    class="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
              Đã xem
            </button>
            <button onclick="this.closest('.fixed').remove()" 
                    class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">
              Đóng
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    
    // Auto remove after 15 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 15000);
    
    // Make markBackendAsSeen available globally for the toast
    window.markBackendAsSeen = (id) => handleMarkBackendNotificationAsSeen(id);
  }, [handleMarkBackendNotificationAsSeen]);

  const showToastNotification = useCallback((notification) => {
    // Tạo toast element
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-4 max-w-sm transform translate-x-full transition-transform duration-300';
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            💊
          </div>
        </div>
        <div class="flex-1">
          <h4 class="font-semibold text-gray-900 text-sm">${notification.title || 'Nhắc uống thuốc!'}</h4>
          <p class="text-gray-600 text-sm mt-1">${notification.message || 'Đã đến giờ uống thuốc'}</p>
          <div class="mt-2 flex gap-2">
            <button onclick="this.closest('.fixed').remove(); window.markAsRead('${notification.id}')" 
                    class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
              Đã uống
            </button>
            <button onclick="this.closest('.fixed').remove()" 
                    class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">
              Đóng
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    
    // Auto remove after 15 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 15000);
    
    // Make markAsRead available globally for the toast
    window.markAsRead = (id) => handleMarkAsRead(id);
  }, [handleMarkAsRead]);

  const fetchNotifications = async () => {
    setLoading(true);
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      try {
        // Lấy thông tin bệnh nhân để có patientId
        const userResponse = await fetch(`https://localhost:7040/api/User/get-by-id?userId=${currentUser.userId}`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!userResponse.ok) {
          throw new Error('Không thể lấy thông tin người dùng');
        }
        
        const userData = await userResponse.json();
        
        // Lấy lịch hẹn sắp tới từ API thật
        let upcomingAppointments = [];
        try {
          // Sử dụng getAllAppointments để lấy tất cả appointments
          const allAppointments = await appointmentService.getAllAppointments();
          console.log(`📅 Found ${allAppointments?.length || 0} total appointments`);
          
          // Filter appointments của user hiện tại với nhiều cách thử
          const userAppointments = (allAppointments || []).filter(apt => {
            // Thử match với nhiều field có thể có
            const isMatch = apt.patientId === currentUser.userId || 
                           apt.userId === currentUser.userId ||
                           apt.patientId === userData.patientId ||
                           apt.userId === userData.id ||
                           apt.patientId === userData.id ||
                           apt.userId === userData.patientId ||
                           // Thêm các cách match khác
                           String(apt.patientId) === String(currentUser.userId) ||
                           String(apt.userId) === String(currentUser.userId) ||
                           String(apt.patientId) === String(userData.id) ||
                           String(apt.userId) === String(userData.id);
                           
            return isMatch;
          });
          
          // Lọc lịch hẹn sắp tới (trong vòng 30 ngày)
          const now = new Date();
          const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          
          upcomingAppointments = userAppointments
            .filter(apt => {
              const aptDate = new Date(apt.appointmentDate || apt.appointmentStartDate);
              const isUpcoming = aptDate >= now && aptDate <= in30Days;
              return isUpcoming;
            })
            .sort((a, b) => new Date(a.appointmentDate || a.appointmentStartDate) - new Date(b.appointmentDate || b.appointmentStartDate))
            .map(appointment => ({
              reason: appointment.reason || appointment.appointmentTitle || appointment.title || 'Cuộc hẹn khám',
              appointmentDate: appointment.appointmentDate || appointment.appointmentStartDate,
              doctorName: appointment.doctorName || 
                         (appointment.doctor && typeof appointment.doctor === 'object' 
                           ? (appointment.doctor.fullName || appointment.doctor.name || `${appointment.doctor.firstName || ''} ${appointment.doctor.lastName || ''}`.trim())
                           : appointment.doctor) || 
                         'Bác sĩ',
              location: appointment.location || (appointment.onlineLink ? 'Khám online' : 'Phòng khám'),
              notes: appointment.notes || appointment.reminderMessage || 'Nhớ đến đúng giờ',
              appointmentId: appointment.appointmentId || appointment.id,
              onlineLink: appointment.onlineLink,
              status: appointment.status
            }));
            
        } catch (appointmentError) {
          console.error('Error fetching appointments:', appointmentError);
          
          // Fallback: thử gọi endpoint upcomingAppointment nếu getAllAppointments fail
          try {
            const appointmentResponse = await fetch(`https://localhost:7040/api/Appointment/upcomingAppointment?userId=${currentUser.userId}`, {
              headers: {
                'Authorization': `Bearer ${currentUser.token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (appointmentResponse.ok) {
              const appointmentsData = await appointmentResponse.json();
              
              upcomingAppointments = (appointmentsData || []).map(appointment => ({
                reason: appointment.appointmentTitle || 'Cuộc hẹn khám',
                appointmentDate: appointment.appointmentStartDate,
                doctorName: appointment.doctorName,
                location: appointment.onlineLink ? 'Khám online' : 'Phòng khám',
                notes: appointment.reminderMessage || 'Nhớ đến đúng giờ',
                appointmentId: appointment.appointmentId,
                onlineLink: appointment.onlineLink
              }));
            }
          } catch (fallbackError) {
            console.warn('Both appointment APIs failed:', fallbackError);
          }
        }
        
        setAppointments(upcomingAppointments);
        
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Nếu có lỗi, để trống
        setAppointments([]);
      }
    }
    setLoading(false);
  };

  // Function để lấy thời gian thực tế của thông báo (thời gian uống thuốc/hẹn)
  const getNotificationScheduleTime = (notification) => {
    const message = notification.message.toLowerCase();
    
    // Tìm thời gian trong message (format: thời gian: HH:MM:SS DD/MM/YYYY)
    const timeRegex = /thời gian:\s*(\d{1,2}):(\d{2}):(\d{2})\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
    const match = message.match(timeRegex);
    
    if (match) {
      const [, hours, minutes, seconds, day, month, year] = match;
      const scheduleTime = new Date(
        parseInt(year),
        parseInt(month) - 1, // Tháng bắt đầu từ 0
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      );
      return scheduleTime;
    }
    
    // Fallback về createdAt nếu không tìm thấy thời gian trong message
    return new Date(notification.createdAt);
  };

  // Function để lọc thông báo theo ngày dựa trên thời gian thực tế
  const filterNotificationsByDate = (notifications, filter) => {
    if (!notifications || notifications.length === 0) return [];
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    switch (filter) {
      case 'today':
        return notifications.filter(notification => {
          const scheduleTime = getNotificationScheduleTime(notification);
          const scheduleDate = new Date(scheduleTime.getFullYear(), scheduleTime.getMonth(), scheduleTime.getDate());
          return scheduleDate >= today && scheduleDate < tomorrow;
        });
      
      case 'week':
        return notifications.filter(notification => {
          const scheduleTime = getNotificationScheduleTime(notification);
          const scheduleDate = new Date(scheduleTime.getFullYear(), scheduleTime.getMonth(), scheduleTime.getDate());
          return scheduleDate >= weekStart && scheduleDate < tomorrow;
        });
      
      case 'all':
        return notifications;
      
      default:
        return notifications;
    }
  };

  // Function để lấy thông báo đã lọc (theo cả ngày và loại)
  const getFilteredNotifications = () => {
    let filtered = filterNotificationsByDate(backendNotifications, dateFilter);
    filtered = filterNotificationsByType(filtered, typeFilter);
    return filtered;
  };

  // Function để lấy số lượng thông báo chưa xem theo filter
  const getUnseenCount = (dateFilterParam, typeFilterParam) => {
    let filtered = filterNotificationsByDate(backendNotifications, dateFilterParam);
    filtered = filterNotificationsByType(filtered, typeFilterParam);
    return filtered.filter(n => !n.isSeen).length;
  };

  // Function để nhóm thông báo theo ngày dựa trên thời gian thực tế
  const groupNotificationsByDate = (notifications) => {
    const grouped = {};
    
    notifications.forEach(notification => {
      const scheduleTime = getNotificationScheduleTime(notification);
      const dateKey = scheduleTime.toLocaleDateString('vi-VN');
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(notification);
    });
    
    // Sắp xếp theo ngày mới nhất
    const sortedDates = Object.keys(grouped).sort((a, b) => {
      const dateA = new Date(a.split('/').reverse().join('-'));
      const dateB = new Date(b.split('/').reverse().join('-'));
      return dateB - dateA;
    });
    
    const result = {};
    sortedDates.forEach(date => {
      result[date] = grouped[date];
    });
    
    return result;
  };

  // Function để lấy tóm tắt thông báo theo ngày
  const getNotificationsSummary = () => {
    const grouped = groupNotificationsByDate(backendNotifications);
    return Object.entries(grouped).map(([date, notifications]) => ({
      date,
      total: notifications.length,
      unseen: notifications.filter(n => !n.isSeen).length,
      isToday: date === new Date().toLocaleDateString('vi-VN')
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffHours = Math.round(diffTime / (1000 * 60 * 60));
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // Nếu trong vòng 24 giờ tới, hiển thị "trong X giờ"
    if (diffHours >= 0 && diffHours < 24) {
      if (diffHours === 0) {
        const diffMinutes = Math.round(diffTime / (1000 * 60));
        if (diffMinutes <= 0) return 'Ngay bây giờ';
        return `Trong ${diffMinutes} phút`;
      }
      return `Trong ${diffHours} giờ`;
    }
    
    // Nếu trong vòng 7 ngày tới, hiển thị "trong X ngày"
    if (diffDays >= 1 && diffDays <= 7) {
      return `Trong ${diffDays} ngày`;
    }

    // Còn lại hiển thị ngày giờ đầy đủ
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUrgencyInfo = (dateString) => {
    if (!dateString) return { level: 'normal', color: 'bg-gray-500', text: 'Bình thường' };
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffHours = Math.round(diffTime / (1000 * 60 * 60));
    
    if (diffHours <= 1) {
      return { level: 'urgent', color: 'bg-red-500', text: 'Khẩn cấp' };
    } else if (diffHours <= 6) {
      return { level: 'important', color: 'bg-orange-500', text: 'Quan trọng' };
    } else if (diffHours <= 24) {
      return { level: 'normal', color: 'bg-[#3B9AB8]', text: 'Sắp tới' };
    } else {
      return { level: 'planned', color: 'bg-gray-500', text: 'Đã lên lịch' };
    }
  };

  // Hiển thị popup/toast khi có medication reminder mới
  useEffect(() => {
    const medicationNotifications = notifications.filter(n => 
      n.type === 'medication' && !n.isRead && n.timestamp > Date.now() - 60000 // Mới trong 1 phút
    );
    
    medicationNotifications.forEach(notification => {
      // Hiển thị browser notification
      if (Notification.permission === 'granted') {
        const browserNotif = new Notification('💊 Nhắc uống thuốc!', {
          body: `${notification.title || 'Đã đến giờ uống thuốc'}\n${notification.message || ''}`,
          icon: '/favicon.ico',
          tag: `medication-${notification.id}`, // Tránh duplicate
          requireInteraction: true // Yêu cầu user click để đóng
        });
        
        browserNotif.onclick = () => {
          window.focus();
          handleMarkAsRead(notification.id);
          browserNotif.close();
        };
        
        // Tự động đóng sau 10 giây
        setTimeout(() => browserNotif.close(), 10000);
      }
      
      // Hiển thị toast notification trong app
      showToastNotification(notification);
    });
  }, [notifications, handleMarkAsRead, showToastNotification]);

  // Function để phân tích message và trả về icon + title phù hợp
  const getNotificationDisplayInfo = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('nhắc nhở uống thuốc') || 
        lowerMessage.includes('nhắc uống thuốc') || 
        lowerMessage.includes('thuốc') ||
        lowerMessage.includes('medication') ||
        lowerMessage.includes('medicine')) {
      return {
        icon: <FaPills className="text-green-600" />,
        title: '💊 Nhắc nhở uống thuốc',
        bgColor: 'bg-green-100'
      };
    }
    
    if (lowerMessage.includes('lịch hẹn') || 
        lowerMessage.includes('cuộc hẹn') || 
        lowerMessage.includes('appointment') ||
        lowerMessage.includes('khám') ||
        lowerMessage.includes('tái khám')) {
      return {
        icon: <FaCalendarAlt className="text-blue-600" />,
        title: '📅 Thông báo lịch hẹn',
        bgColor: 'bg-blue-100'
      };
    }
    
    if (lowerMessage.includes('điều trị') || 
        lowerMessage.includes('treatment') ||
        lowerMessage.includes('protocol') ||
        lowerMessage.includes('arv')) {
      return {
        icon: <FaPills className="text-purple-600" />,
        title: '🩺 Thông báo điều trị',
        bgColor: 'bg-purple-100'
      };
    }
    
    if (lowerMessage.includes('xét nghiệm') || 
        lowerMessage.includes('test') ||
        lowerMessage.includes('lab') ||
        lowerMessage.includes('kết quả')) {
      return {
        icon: <FaCalendarAlt className="text-orange-600" />,
        title: '🔬 Thông báo xét nghiệm',
        bgColor: 'bg-orange-100'
      };
    }
    
    // Mặc định
    return {
      icon: <FaBell className="text-green-600" />,
      title: '🔔 Thông báo chung',
      bgColor: 'bg-green-100'
    };
  };

  // Function để lấy loại thông báo từ message
  const getNotificationTypeFromMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('nhắc nhở uống thuốc') || 
        lowerMessage.includes('nhắc uống thuốc') || 
        lowerMessage.includes('thuốc') ||
        lowerMessage.includes('medication') ||
        lowerMessage.includes('medicine')) {
      return 'medicine';
    }
    
    if (lowerMessage.includes('lịch hẹn') || 
        lowerMessage.includes('cuộc hẹn') || 
        lowerMessage.includes('appointment') ||
        lowerMessage.includes('khám') ||
        lowerMessage.includes('tái khám')) {
      return 'appointment';
    }
    
    return 'general';
  };

  // Function để lọc thông báo theo loại
  const filterNotificationsByType = (notifications, typeFilter) => {
    if (!notifications || notifications.length === 0) return [];
    
    if (typeFilter === 'all') return notifications;
    
    return notifications.filter(notification => {
      const notificationType = getNotificationTypeFromMessage(notification.message);
      return notificationType === typeFilter;
    });
  };

  // Debug function để xem thời gian lọc
  const debugNotificationTimes = () => {
    console.log('🕐 DEBUG: Notification times analysis');
    backendNotifications.forEach((notification, index) => {
      const createdTime = new Date(notification.createdAt);
      const scheduleTime = getNotificationScheduleTime(notification);
      const isToday = scheduleTime.toLocaleDateString('vi-VN') === new Date().toLocaleDateString('vi-VN');
      
      console.log(`${index + 1}. Notification:`, {
        message: notification.message.substring(0, 50) + '...',
        createdAt: createdTime.toLocaleString('vi-VN'),
        scheduleTime: scheduleTime.toLocaleString('vi-VN'),
        isToday,
        dateKey: scheduleTime.toLocaleDateString('vi-VN'),
        today: new Date().toLocaleDateString('vi-VN')
      });
    });
  };

  // Gọi debug khi có thay đổi
  useEffect(() => {
    if (backendNotifications.length > 0) {
      debugNotificationTimes();
    }
  }, [backendNotifications]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#3B9AB8] hover:text-[#2d7a94] mb-4"
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaBell className="text-[#3B9AB8] text-2xl" />
              <h1 className="text-3xl font-bold text-gray-800">Thông báo</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Mark All as Read Button */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                  title="Đánh dấu tất cả thông báo là đã đọc"
                >
                  <FaCheck className="text-sm" />
                  <span>Đánh dấu tất cả đã đọc</span>
                </button>
              )}
              
              {/* Connection status indicator */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                signalRConnected ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {signalRConnected ? <FaWifi /> : <FaExclamationTriangle />}
                <span>{signalRConnected ? 'Real-time' : 'Định kỳ'}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Xem thông báo từ nhân viên và lịch hẹn sắp tới. Sử dụng bộ lọc theo ngày để dễ quản lý thông báo.
            {signalRConnected && <span className="text-green-600"> • Kết nối real-time</span>}
            {!signalRConnected && <span className="text-orange-600"> • Chỉ cập nhật định kỳ</span>}
          </p>
          
          {/* Hiển thị thời gian cập nhật cuối */}
          <div className="mt-3 text-sm text-gray-500">
            Cập nhật lần cuối: {lastUpdateTime.toLocaleString('vi-VN')}
            {signalRConnected && (
              <span className="ml-2 text-green-600">
                • Đang lắng nghe thông báo mới
              </span>
            )}
          </div>
          
          {/* Success message when no unread notifications */}
          {unreadCount === 0 && notifications.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <FaCheck className="text-green-600" />
                <span className="font-medium">Tuyệt vời! Bạn đã đọc hết tất cả thông báo.</span>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B9AB8]"></div>
          </div>
        ) : (
          <div className="space-y-8">
          {/* Thông báo hệ thống từ Backend */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaBell className="text-green-600 text-xl" />
                  <h2 className="text-xl font-semibold text-gray-800">Thông báo từ nhân viên</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full">
                    {getFilteredNotifications().filter(n => !n.isSeen).length} chưa xem
                  </span>
                  <button
                    onClick={loadBackendNotifications}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                    title="Kiểm tra thông báo mới"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Làm mới
                  </button>
                </div>
              </div>
              
              {/* Bộ lọc theo ngày */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">🗓️ Lọc theo thời gian:</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDateFilter('today')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      dateFilter === 'today' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>📅 Hôm nay</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      dateFilter === 'today' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {getUnseenCount('today', typeFilter)}/{filterNotificationsByType(filterNotificationsByDate(backendNotifications, 'today'), typeFilter).length}
                    </span>
                  </button>
                  <button
                    onClick={() => setDateFilter('week')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      dateFilter === 'week' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>📅 Tuần này</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      dateFilter === 'week' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {getUnseenCount('week', typeFilter)}/{filterNotificationsByType(filterNotificationsByDate(backendNotifications, 'week'), typeFilter).length}
                    </span>
                  </button>
                  <button
                    onClick={() => setDateFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      dateFilter === 'all' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>📋 Tất cả</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      dateFilter === 'all' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {getUnseenCount('all', typeFilter)}/{filterNotificationsByType(backendNotifications, typeFilter).length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Bộ lọc theo loại */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">🏷️ Lọc theo loại thông báo:</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTypeFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      typeFilter === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>🔔 Tất cả</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      typeFilter === 'all' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {getUnseenCount(dateFilter, 'all')}/{filterNotificationsByDate(backendNotifications, dateFilter).length}
                    </span>
                  </button>
                  <button
                    onClick={() => setTypeFilter('medicine')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      typeFilter === 'medicine' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>💊 Uống thuốc</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      typeFilter === 'medicine' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {getUnseenCount(dateFilter, 'medicine')}/{filterNotificationsByType(filterNotificationsByDate(backendNotifications, dateFilter), 'medicine').length}
                    </span>
                  </button>
                  <button
                    onClick={() => setTypeFilter('appointment')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      typeFilter === 'appointment' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>📅 Lịch hẹn</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      typeFilter === 'appointment' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {getUnseenCount(dateFilter, 'appointment')}/{filterNotificationsByType(filterNotificationsByDate(backendNotifications, dateFilter), 'appointment').length}
                    </span>
                  </button>
                  <button
                    onClick={() => setTypeFilter('general')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      typeFilter === 'general' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>📢 Thông báo chung</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      typeFilter === 'general' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {getUnseenCount(dateFilter, 'general')}/{filterNotificationsByType(filterNotificationsByDate(backendNotifications, dateFilter), 'general').length}
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Hiển thị mô tả filter hiện tại */}
              <div className="mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div>
                    {dateFilter === 'today' && (
                      <span>📅 Thời gian: <strong>Hôm nay ({new Date().toLocaleDateString('vi-VN')})</strong></span>
                    )}
                    {dateFilter === 'week' && (
                      <span>📅 Thời gian: <strong>7 ngày qua</strong></span>
                    )}
                    {dateFilter === 'all' && (
                      <span>📅 Thời gian: <strong>Tất cả</strong></span>
                    )}
                  </div>
                  <div>
                    {typeFilter === 'all' && (
                      <span>🏷️ Loại: <strong>Tất cả thông báo</strong></span>
                    )}
                    {typeFilter === 'medicine' && (
                      <span>🏷️ Loại: <strong>Nhắc uống thuốc</strong></span>
                    )}
                    {typeFilter === 'appointment' && (
                      <span>🏷️ Loại: <strong>Lịch hẹn</strong></span>
                    )}
                    {typeFilter === 'general' && (
                      <span>🏷️ Loại: <strong>Thông báo chung</strong></span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tóm tắt thông báo theo ngày */}
              {dateFilter === 'all' && getNotificationsSummary().length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3">📊 Tóm tắt thông báo theo ngày:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {getNotificationsSummary().map(({ date, total, unseen, isToday }) => (
                      <div
                        key={date}
                        className={`p-3 rounded-lg border text-sm ${
                          isToday 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${
                            isToday ? 'text-green-700' : 'text-gray-700'
                          }`}>
                            {isToday ? '📅 Hôm nay' : date}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{total}</span>
                            {unseen > 0 && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {unseen}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6">
              {getFilteredNotifications().length === 0 ? (
                <div className="text-center py-8">
                  <FaBell className="text-gray-300 text-4xl mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">
                    Không có thông báo nào phù hợp với bộ lọc hiện tại
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>🗓️ Thời gian: {
                      dateFilter === 'today' ? 'Hôm nay' : 
                      dateFilter === 'week' ? 'Tuần này' : 'Tất cả'
                    }</p>
                    <p>🏷️ Loại: {
                      typeFilter === 'all' ? 'Tất cả' :
                      typeFilter === 'medicine' ? 'Uống thuốc' :
                      typeFilter === 'appointment' ? 'Lịch hẹn' : 'Thông báo chung'
                    }</p>
                    <p className="mt-2 text-blue-600">Thử thay đổi bộ lọc để xem thêm thông báo</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {getFilteredNotifications().map((notification) => {
                    const notificationType = getNotificationDisplayInfo(notification.message);
                    
                    return (
                    <div 
                      key={notification.notificationId} 
                      className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.isSeen ? 'border-green-200 bg-green-50 ring-2 ring-green-300 shadow-lg' : 'border-gray-200 bg-gray-50 opacity-70'
                      }`}
                      onClick={() => {
                        if (!notification.isSeen) {
                          handleMarkBackendNotificationAsSeen(notification.notificationId);
                        }
                      }}
                      title={notification.isSeen ? 'Đã xem' : 'Click để đánh dấu đã xem'}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          !notification.isSeen ? notificationType.bgColor : 'bg-gray-100'
                        }`}>
                          {!notification.isSeen ? notificationType.icon : 
                           <FaBell className="text-gray-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-gray-800 flex items-center gap-2">
                              {notificationType.title}
                              {!notification.isSeen && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded animate-pulse">
                                  Mới
                                </span>
                              )}
                              {notification.isSeen && (
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                  Đã xem
                                </span>
                              )}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <FaClock />
                            <span>Tạo: {new Date(notification.createdAt).toLocaleString('vi-VN')}</span>
                          </div>
                          
                          {/* Hiển thị thời gian thực tế nếu khác với thời gian tạo */}
                          {(() => {
                            const scheduleTime = getNotificationScheduleTime(notification);
                            const createdTime = new Date(notification.createdAt);
                            const timeDiff = Math.abs(scheduleTime.getTime() - createdTime.getTime());
                            
                            // Chỉ hiển thị nếu chênh lệch > 1 phút
                            if (timeDiff > 60000) {
                              return (
                                <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                                  <FaClock />
                                  <span className="font-medium">Thời gian: {scheduleTime.toLocaleString('vi-VN')}</span>
                                  <span className="text-xs text-gray-500">
                                    ({formatDate(scheduleTime)})
                                  </span>
                                </div>
                              );
                            }
                            return null;
                          })()}
                          
                          <p className={`text-sm text-gray-700 p-2 rounded border-l-4 ${
                            !notification.isSeen ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-400'
                          }`}>
                            {notification.message}
                          </p>
                          
                          {notification.seenAt && (
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <FaCheck className="text-green-500" />
                              Đã xem lúc: {new Date(notification.seenAt).toLocaleString('vi-VN')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
