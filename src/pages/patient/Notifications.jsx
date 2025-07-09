import { useState, useEffect, useCallback } from 'react';
import { FaBell, FaPills, FaCalendarAlt, FaClock, FaArrowLeft, FaWifi, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { authService } from "../../services/authService";
import { appointmentService } from "../../services/appointmentService";
import { useNotification } from '../../contexts/NotificationContext';

// Trang thông báo cho bệnh nhân
// Hiển thị nhắc nhở uống thuốc và lịch hẹn sắp tới
// Sử dụng API thực từ backend:
// - Nhắc uống thuốc: /api/Reminder/upcomingReminderForDrinkMedicine?userId={userId}
// - Lịch hẹn: appointmentService.getAllAppointments() -> filter theo patientId/userId -> lấy appointmentId
// - Fallback về dữ liệu mẫu nếu API không có dữ liệu

export default function Notifications() {
  const [reminders, setReminders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readReminders, setReadReminders] = useState(new Set()); // Track locally read reminders
  const [readAppointments, setReadAppointments] = useState(new Set()); // Track locally read appointments
  const [selectedDate, setSelectedDate] = useState(() => {
    // Mặc định là 7 ngày tới
    return '';
  });
  const [allReminders, setAllReminders] = useState([]); // Lưu tất cả reminders từ API
  const navigate = useNavigate();
  
  // Sử dụng SignalR context
  const { notifications, unreadCount, isConnected, markAsRead, markAllAsRead, addTestNotification } = useNotification();

  useEffect(() => {
    fetchNotifications();
    
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Effect để re-filter reminders khi selectedDate thay đổi
  useEffect(() => {
    if (allReminders.length > 0) {
      filterRemindersByDate();
    }
  }, [selectedDate, allReminders]);

  // Function để filter reminders theo ngày được chọn
  const filterRemindersByDate = () => {
    let filteredReminders = [];
    
    if (selectedDate) {
      // Nếu có chọn ngày cụ thể, chỉ hiển thị reminders của ngày đó
      const selectedDateObj = new Date(selectedDate);
      const startOfDay = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), selectedDateObj.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      
      filteredReminders = allReminders.filter(reminder => {
        const reminderDate = new Date(reminder.reminderTime);
        return reminderDate >= startOfDay && reminderDate < endOfDay;
      });
      
      console.log(`📅 Filtered ${filteredReminders.length} reminders for selected date: ${selectedDate}`);
    } else {
      // Nếu không chọn ngày, hiển thị 7 ngày tới (mặc định)
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      filteredReminders = allReminders.filter(reminder => {
        const reminderDate = new Date(reminder.reminderTime);
        return reminderDate >= today && reminderDate < in7Days;
      });
      
      console.log(`📅 Filtered ${filteredReminders.length} reminders for next 7 days`);
    }
    
    // Sắp xếp theo thời gian
    filteredReminders.sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime));
    setReminders(filteredReminders);
  };

  // Handler để xử lý thay đổi ngày
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Handler để reset về hiển thị 7 ngày tới
  const handleResetToWeekView = () => {
    setSelectedDate('');
  };

  // Kết hợp real-time notifications với static data
  useEffect(() => {
    // Filter real-time notifications by type
    const medicationNotifications = notifications.filter(n => n.type === 'medication');
    const appointmentNotifications = notifications.filter(n => n.type === 'appointment');
    
    // Merge với dữ liệu hiện có
    if (medicationNotifications.length > 0) {
      const newReminders = medicationNotifications.map(notif => ({
        id: notif.id,
        medicineName: notif.data?.medicineName || notif.title,
        reminderTime: notif.data?.reminderTime || notif.timestamp,
        dosage: notif.data?.dosage || "Theo đơn thuốc của bác sĩ",
        note: notif.message,
        displayTitle: notif.title,
        displayDescription: notif.message,
        isRealTime: true,
        isRead: notif.isRead
      }));
      
      setReminders(prev => {
        // Merge và remove duplicates
        const merged = [...newReminders, ...prev.filter(r => !r.isRealTime)];
        return merged.sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime));
      });
    }

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

  const handleMarkReminderAsRead = (reminderId) => {
    setReadReminders(prev => new Set([...prev, reminderId]));
  };

  const handleMarkAppointmentAsRead = (appointmentId) => {
    setReadAppointments(prev => new Set([...prev, appointmentId]));
  };

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
        console.log(`Starting to fetch notifications for user: ${currentUser.userId}`);
        
        // Lấy nhắc nhở uống thuốc từ API thật
        let treatmentReminders = [];
        try {
          const reminderResponse = await fetch(`https://localhost:7040/api/Reminder/upcomingReminderForDrinkMedicine?userId=${currentUser.userId}`, {
            headers: {
              'Authorization': `Bearer ${currentUser.token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`📞 API Call: https://localhost:7040/api/Reminder/upcomingReminderForDrinkMedicine?userId=${currentUser.userId}`);
          console.log(`📞 API Response Status: ${reminderResponse.status} ${reminderResponse.statusText}`);
          
          if (reminderResponse.ok) {
            const remindersData = await reminderResponse.json();
            console.log(`📋 API trả về ${remindersData?.length || 0} medicine reminders from API`);
            console.log('🔍 Raw reminder data (FULL):', JSON.stringify(remindersData, null, 2));
            
            treatmentReminders = (remindersData || []).map((reminder, index) => {
              // Tạo unique ID bằng cách kết hợp stageId, protocolId và reminderDateTime
              const uniqueId = `${reminder.stageId || 'unknown'}-${reminder.patientTreatmentProtocolId || 'no-protocol'}-${reminder.reminderDateTime || index}`;
              
              // Xử lý tên thuốc
              let medicineName = reminder.medicine || reminder.stageName || 'Điều trị HIV';
              if (reminder.medicine && reminder.stageName) {
                medicineName = `${reminder.medicine} (${reminder.stageName})`;
              }
              
              console.log(`📍 Processing reminder ${index + 1}:`, {
                reminderDateTime: reminder.reminderDateTime,
                medicine: reminder.medicine,
                stageName: reminder.stageName,
                parsed: reminder.reminderDateTime ? new Date(reminder.reminderDateTime) : null
              });
              
              return {
                id: uniqueId,
                medicineName: medicineName,
                reminderTime: reminder.reminderDateTime,
                dosage: "Theo đơn thuốc của bác sĩ",
                note: reminder.description || 'Giai đoạn điều trị',
                stageInfo: `Giai đoạn ${reminder.stageNumber || 1}`,
                stageId: reminder.stageId,
                protocolId: reminder.patientTreatmentProtocolId,
                medicine: reminder.medicine, // Lưu riêng field medicine
                // Thêm thông tin để hiển thị
                displayTitle: reminder.medicine ? 
                  `${reminder.medicine} - ${reminder.stageName || `Giai đoạn ${reminder.stageNumber || 1}`}` :
                  `${reminder.stageName || 'Điều trị HIV'} - Giai đoạn ${reminder.stageNumber || 1}`,
                displayDescription: reminder.description || 'Nhắc nhở uống thuốc theo đúng lịch trình điều trị',
                // Debug info
                originalData: reminder
              };
            });
            
            console.log(`� Processed ${treatmentReminders.length} reminders before date filter`);
            
            // Lưu tất cả reminders từ API để có thể filter sau
            setAllReminders(treatmentReminders);
            // Không cần filter ở đây, sẽ được filter trong useEffect
            
            console.log(`✅ Stored ${treatmentReminders.length} treatment reminders from API`);
          } else {
            console.error(`❌ API Error: ${reminderResponse.status} ${reminderResponse.statusText}`);
            const errorText = await reminderResponse.text();
            console.error(`❌ API Error Response:`, errorText);
          }
        } catch (reminderError) {
          console.error('Error fetching medicine reminders:', reminderError);
        }
        
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
          
          console.log(`📋 Found ${userAppointments.length} appointments for current user`);
          
          // Nếu không có appointments nào match, log để debug
          if (userAppointments.length === 0) {
            console.log('⚠️ No appointments matched current user');
          }
          
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
            
          console.log(`✅ Found ${upcomingAppointments.length} upcoming appointments`);
          
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
              console.log(`📅 Fallback: Found ${appointmentsData?.length || 0} appointments`);
              
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
        
        // Debug trước khi set state
        console.log('🔧 Setting reminders state with data:', treatmentReminders);
        console.log('🔧 Setting appointments state with data:', upcomingAppointments);
        
        setReminders(treatmentReminders);
        setAppointments(upcomingAppointments);
        
        console.log(`✅ Notifications loaded successfully:`);
        console.log(`📋 Medicine reminders: ${treatmentReminders.length} items`);
        console.log(`📅 Upcoming appointments: ${upcomingAppointments.length} items`);
        
        // Debug sau khi set state (sẽ hiển thị trong render tiếp theo)
        setTimeout(() => {
          console.log('🔍 Current reminders state after setState:', treatmentReminders);
          console.log('🔍 Current appointments state after setState:', upcomingAppointments);
        }, 100);
        
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Nếu có lỗi, để trống
        setReminders([]);
        setAppointments([]);
      }
    }
    setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Debug log ở đầu render */}
      {console.log('🎯 RENDER DEBUG:', {
        remindersLength: reminders.length,
        appointmentsLength: appointments.length,
        remindersData: reminders,
        appointmentsData: appointments,
        loading: loading,
        currentUserExists: !!authService.getCurrentUser(),
        currentUserId: authService.getCurrentUser()?.userId
      })}
      
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
                isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {isConnected ? <FaWifi /> : <FaExclamationTriangle />}
                <span>{isConnected ? 'Kết nối' : 'Mất kết nối'}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Xem các nhắc nhở uống thuốc trong 7 ngày tới và lịch hẹn sắp tới
            {isConnected && <span className="text-green-600"> • Cập nhật trực tiếp</span>}
          </p>
          
          {/* Success message when no unread notifications */}
          {unreadCount === 0 && notifications.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <FaCheck className="text-green-600" />
                <span className="font-medium">Tuyệt vời! Bạn đã đọc hết tất cả thông báo.</span>
              </div>
            </div>
          )}
          
          {/* Debug info - chỉ hiển thị khi đang development */}
          {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
              <p><strong>Debug Info:</strong></p>
              <p>SignalR Connected: {isConnected ? '✅' : '❌'}</p>
              <p>Real-time Notifications: {notifications.length}</p>
              <p>Unread Count: {unreadCount}</p>
              <p>Read Notifications: {notifications.filter(n => n.isRead).length}</p>
              <p>Unread Notifications: {notifications.filter(n => !n.isRead).length}</p>
              <p>Backend Hub: /reminderHub</p>
              
              {/* Test buttons */}
              <div className="mt-3 space-x-2">
                <button 
                  onClick={() => addTestNotification('medication')}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                >
                  Test Medication
                </button>
                <button 
                  onClick={() => addTestNotification('appointment')}
                  className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                >
                  Test Appointment
                </button>
                <button 
                  onClick={() => addTestNotification('treatment')}
                  className="px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                >
                  Test Treatment
                </button>
              </div>
              
              {/* Mark all as read button */}
              <div className="mt-2">
                <button 
                  onClick={() => {
                    notifications.forEach(notif => {
                      if (!notif.isRead) {
                        handleMarkAsRead(notif.id);
                      }
                    });
                  }}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                >
                  Mark All as Read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Date Filter Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-[#3B9AB8] text-lg" />
              <h3 className="text-lg font-semibold text-gray-800">Lọc nhắc nhở theo ngày</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="dateFilter" className="text-sm font-medium text-gray-600">
                  Chọn ngày:
                </label>
                <input
                  id="dateFilter"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]} // Không cho chọn ngày quá khứ
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B9AB8] focus:border-transparent text-sm"
                />
              </div>
              
              <button
                onClick={handleResetToWeekView}
                className="px-4 py-2 bg-[#3B9AB8] text-white rounded-lg hover:bg-[#2d7a94] transition-colors duration-200 text-sm font-medium"
              >
                Xem 7 ngày tới
              </button>
            </div>
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            {selectedDate ? (
              <span>Hiển thị nhắc nhở cho ngày: <strong>{new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
            ) : (
              <span>Hiển thị nhắc nhở trong <strong>7 ngày tới</strong></span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B9AB8]"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Nhắc uống thuốc */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaPills className="text-[#3B9AB8] text-xl" />
                    <h2 className="text-xl font-semibold text-gray-800">Nhắc uống thuốc</h2>
                  </div>
                  {reminders.length > 0 && (
                    <span className="bg-[#3B9AB8] text-white text-sm px-3 py-1 rounded-full">
                      {reminders.length} nhắc nhở
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                {reminders.length === 0 ? (
                  <div className="text-center py-8">
                    <FaPills className="text-gray-300 text-4xl mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">
                      {selectedDate 
                        ? `Không có nhắc nhở uống thuốc nào cho ngày ${new Date(selectedDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
                        : 'Không có nhắc nhở uống thuốc nào trong 7 ngày tới'
                      }
                    </p>
                    <p className="text-sm text-gray-400">
                      {selectedDate 
                        ? 'Hãy chọn ngày khác hoặc xem 7 ngày tới để tìm nhắc nhở'
                        : 'Hãy kiểm tra lại lịch điều trị của bạn'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reminders.map((reminder, index) => {
                      const urgency = getUrgencyInfo(reminder.reminderTime || reminder.dateTime);
                      return (
                      <div key={reminder.id || index} className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        urgency.level === 'urgent' ? 'border-red-200 bg-red-50' : 
                        urgency.level === 'important' ? 'border-orange-200 bg-orange-50' : 
                        'border-gray-200'
                      } ${
                        reminder.isRealTime && !reminder.isRead ? 'ring-2 ring-blue-300' : ''
                      } ${
                        reminder.isRead || readReminders.has(reminder.id) ? 'opacity-60 bg-gray-50' : 'bg-white'
                      }`}
                      onClick={() => {
                        // Đánh dấu đã đọc cho tất cả loại reminders
                        if (reminder.isRealTime && !reminder.isRead) {
                          handleMarkAsRead(reminder.id);
                        } else if (!readReminders.has(reminder.id)) {
                          handleMarkReminderAsRead(reminder.id);
                        }
                      }}
                      title={reminder.isRead || readReminders.has(reminder.id) ? 'Đã đọc' : 'Click để đánh dấu đã đọc'}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            urgency.level === 'urgent' ? 'bg-red-100' :
                            urgency.level === 'important' ? 'bg-orange-100' :
                            'bg-[#3B9AB8]/20'
                          }`}>
                            <FaPills className={`text-lg ${
                              urgency.level === 'urgent' ? 'text-red-600' :
                              urgency.level === 'important' ? 'text-orange-600' :
                              'text-[#3B9AB8]'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                                {reminder.displayTitle || reminder.medicineName || 'Nhắc uống thuốc'}
                                {reminder.isRealTime && (
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    reminder.isRead ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {reminder.isRead ? 'Đã đọc' : 'Mới'}
                                  </span>
                                )}
                                {(!reminder.isRealTime && readReminders.has(reminder.id)) && (
                                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                    Đã đọc
                                  </span>
                                )}
                                {(!reminder.isRealTime && reminder.isRead) && (
                                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                    Đã đọc
                                  </span>
                                )}
                              </h3>
                              <div className="flex gap-2 ml-2">
                                <span className={`${urgency.color} text-white text-xs px-2 py-1 rounded-full flex-shrink-0`}>
                                  {urgency.text}
                                </span>
                                {reminder.stageInfo && (
                                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex-shrink-0">
                                    {reminder.stageInfo}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                              <FaClock className={urgency.level === 'urgent' ? 'text-red-500' : urgency.level === 'important' ? 'text-orange-500' : 'text-[#3B9AB8]'} />
                              <span className="font-medium">{formatDate(reminder.reminderTime || reminder.dateTime)}</span>
                            </div>
                            
                            {reminder.displayDescription && (
                              <p className={`text-sm text-gray-700 mb-2 p-2 rounded border-l-4 ${
                                urgency.level === 'urgent' ? 'bg-red-50 border-red-500' :
                                urgency.level === 'important' ? 'bg-orange-50 border-orange-500' :
                                'bg-blue-50 border-[#3B9AB8]'
                              }`}>
                                {reminder.displayDescription}
                              </p>
                            )}
                            
                            {/* Hiển thị thông tin về số lần uống trong ngày */}
                            {reminder.dailyCount && reminder.dailyCount > 1 && (
                              <div className="mb-2">
                                <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                                  📋 Có {reminder.dailyCount} lần uống thuốc trong ngày này
                                </p>
                              </div>
                            )}
                            
                            <div className="flex flex-col gap-1">
                              {reminder.medicine && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium text-gray-700">💊 Thuốc:</span> {reminder.medicine}
                                </p>
                              )}
                              {reminder.dosage && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium text-gray-700">� Liều lượng:</span> {reminder.dosage}
                                </p>
                              )}
                              {reminder.note && reminder.note !== reminder.displayDescription && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium text-gray-700">📝 Ghi chú:</span> {reminder.note}
                                </p>
                              )}
                              {reminder.dailyCount && reminder.dailyCount > 1 && (
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium text-gray-700">⏰ Lịch uống:</span> Xem chi tiết {reminder.dailyCount} lần trong ngày
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Lịch hẹn sắp tới */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-[#3B9AB8] text-xl" />
                    <h2 className="text-xl font-semibold text-gray-800">Lịch hẹn sắp tới</h2>
                  </div>
                  {appointments.length > 0 && (
                    <span className="bg-[#3B9AB8] text-white text-sm px-3 py-1 rounded-full">
                      {appointments.length} lịch hẹn
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <FaCalendarAlt className="text-gray-300 text-4xl mx-auto mb-4" />
                    <p className="text-gray-500">Không có lịch hẹn nào sắp tới</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment, index) => {
                      const appointmentId = appointment.appointmentId || appointment.id || `appointment-${index}`;
                      const isRead = appointment.isRead || readAppointments.has(appointmentId);
                      return (
                      <div 
                        key={appointmentId} 
                        className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          appointment.isRealTime && !appointment.isRead ? 'ring-2 ring-green-300 border-green-200' : 'border-gray-200'
                        } ${
                          isRead ? 'opacity-60 bg-gray-50' : 'bg-white'
                        }`}
                        onClick={() => {
                          // Đánh dấu đã đọc cho appointments
                          if (appointment.isRealTime && !appointment.isRead) {
                            handleMarkAsRead(appointment.appointmentId || appointment.id);
                          } else if (!readAppointments.has(appointmentId)) {
                            handleMarkAppointmentAsRead(appointmentId);
                          }
                        }}
                        title={isRead ? 'Đã xem' : 'Click để đánh dấu đã xem'}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-[#3B9AB8]/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaCalendarAlt className="text-[#3B9AB8]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-medium text-gray-800 flex items-center gap-2">
                                {appointment.reason || appointment.title || 'Cuộc hẹn khám'}
                                {appointment.isRealTime && (
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    appointment.isRead ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'
                                  }`}>
                                    {appointment.isRead ? 'Đã xem' : 'Mới'}
                                  </span>
                                )}
                                {(!appointment.isRealTime && readAppointments.has(appointmentId)) && (
                                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                    Đã xem
                                  </span>
                                )}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                              <FaClock />
                              <span className="font-medium">{formatDate(appointment.appointmentDate || appointment.dateTime)}</span>
                            </div>
                            {appointment.doctorName && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium text-gray-700">👨‍⚕️ Bác sĩ:</span> {appointment.doctorName}
                              </p>
                            )}
                            {appointment.location && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium text-gray-700">📍 Địa điểm:</span> {appointment.location}
                              </p>
                            )}
                            {appointment.notes && (
                              <p className="text-sm text-gray-600 mt-1 p-2 rounded border-l-4 bg-blue-50 border-[#3B9AB8]">
                                <span className="font-medium text-gray-700">📝 Ghi chú:</span> {appointment.notes}
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
