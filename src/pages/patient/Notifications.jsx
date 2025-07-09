import { useState, useEffect } from 'react';
import { FaBell, FaPills, FaCalendarAlt, FaClock, FaArrowLeft, FaWifi, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { authService } from "../../services/authService";
import { appointmentService } from "../../services/appointmentService";
import { patientTreatmentProtocolService } from "../../services/patientTreatmentProtocolService";
import { patientService } from "../../services/patientService";
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
  const navigate = useNavigate();
  
  // Sử dụng SignalR context
  const { notifications, unreadCount, isConnected, markAsRead, addTestNotification } = useNotification();

  useEffect(() => {
    fetchNotifications();
    
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

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

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

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
          
          if (reminderResponse.ok) {
            const remindersData = await reminderResponse.json();
            console.log(`📋 Found ${remindersData?.length || 0} medicine reminders`);
            
            treatmentReminders = (remindersData || []).map((reminder, index) => {
              // Tạo unique ID bằng cách kết hợp stageId, protocolId và reminderDateTime
              const uniqueId = `${reminder.stageId || 'unknown'}-${reminder.patientTreatmentProtocolId || 'no-protocol'}-${reminder.reminderDateTime || index}`;
              
              // Xử lý tên thuốc
              let medicineName = reminder.medicine || reminder.stageName || 'Điều trị HIV';
              if (reminder.medicine && reminder.stageName) {
                medicineName = `${reminder.medicine} (${reminder.stageName})`;
              }
              
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
                displayDescription: reminder.description || 'Nhắc nhở uống thuốc theo đúng lịch trình điều trị'
              };
            });
            
            // 🔥 Group reminders theo ngày và chỉ lấy 7 ngày tiếp theo
            const groupedByDate = {};
            const now = new Date();
            const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            
            treatmentReminders.forEach(reminder => {
              const reminderDate = new Date(reminder.reminderTime);
              
              // Chỉ lấy reminders trong 7 ngày tới
              if (reminderDate >= now && reminderDate <= next7Days) {
                const dateKey = reminderDate.toDateString(); // Tue Jul 02 2025
                
                if (!groupedByDate[dateKey]) {
                  groupedByDate[dateKey] = {
                    date: dateKey,
                    dateObj: reminderDate,
                    reminders: []
                  };
                }
                groupedByDate[dateKey].reminders.push(reminder);
              }
            });
            
            // Chuyển thành array và sort theo ngày
            const dailyReminders = Object.values(groupedByDate)
              .sort((a, b) => a.dateObj - b.dateObj)
              .map(day => ({
                ...day,
                // Chỉ lấy reminder sớm nhất trong ngày để hiển thị
                primaryReminder: day.reminders.sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime))[0],
                totalCount: day.reminders.length
              }));
            
            console.log(`📅 Processed ${dailyReminders.length} days of reminders`);
            
            // Sử dụng daily reminders thay vì tất cả reminders
            treatmentReminders = dailyReminders.map(day => ({
              ...day.primaryReminder,
              displayTitle: `${day.primaryReminder.displayTitle}${day.totalCount > 1 ? ` (+${day.totalCount - 1} lần khác)` : ''}`,
              dailyCount: day.totalCount,
              allRemindersInDay: day.reminders
            }));
            
            console.log(`✅ Processed ${treatmentReminders.length} treatment reminders`);
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
        
        // Nếu không có dữ liệu thực, dùng dữ liệu mẫu
        if (treatmentReminders.length === 0) {
          console.log('📋 Using sample reminder data');
          treatmentReminders = [
            {
              id: `sample-reminder-1-${Date.now()}`,
              medicineName: "Efavirenz + Tenofovir + Emtricitabine",
              reminderTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
              dosage: "Theo đơn thuốc của bác sĩ",
              note: "Giai đoạn điều trị HIV 1",
              stageInfo: "Giai đoạn 1",
              medicine: "Efavirenz + Tenofovir + Emtricitabine",
              displayTitle: "Efavirenz + Tenofovir + Emtricitabine - Giai đoạn 1",
              displayDescription: "Giai đoạn điều trị HIV 1"
            },
            {
              id: `sample-reminder-2-${Date.now() + 1}`, 
              medicineName: "Dolutegravir + Tenofovir alafenamide + Emtricitabine",
              reminderTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
              dosage: "Theo đơn thuốc của bác sĩ",
              note: "Điều trị ARV theo giai đoạn",
              stageInfo: "Giai đoạn 2",
              medicine: "Dolutegravir + Tenofovir alafenamide + Emtricitabine",
              displayTitle: "Dolutegravir + Tenofovir alafenamide + Emtricitabine - Giai đoạn 2",
              displayDescription: "Nhắc nhở uống thuốc theo đúng lịch trình điều trị"
            }
          ];
        }
        
        if (upcomingAppointments.length === 0) {
          console.log('📅 Using sample appointment data');
          upcomingAppointments = [
            {
              reason: "Khám định kỳ theo dõi HIV",
              appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              doctorName: "BS. Nguyễn Văn A", 
              location: "Phòng khám số 1 - Tầng 2",
              notes: "Reminder: Your appointment is scheduled for tomorrow at 9:00 AM."
            }
          ];
        }
        
        setReminders(treatmentReminders);
        setAppointments(upcomingAppointments);
        
        console.log(`✅ Notifications loaded successfully:`);
        console.log(`📋 Medicine reminders: ${treatmentReminders.length} items`);
        console.log(`📅 Upcoming appointments: ${upcomingAppointments.length} items`);
        
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Fallback to sample data on error
        setReminders([
          {
            medicineName: "Giai đoạn 1 - Điều trị HIV khởi đầu",
            reminderTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            dosage: "Theo đơn thuốc",
            note: "Giai đoạn 1 - Điều trị HIV khởi đầu"
          }
        ]);
        setAppointments([
          {
            reason: "Khám bệnh",
            appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            doctorName: "BS. Phạm Thanh Hiếu", 
            location: "Phòng khám",
            notes: "Reminder: Your appointment is scheduled for tomorrow at 9:00 AM."
          }
        ]);
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
            
            {/* Connection status indicator */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isConnected ? <FaWifi /> : <FaExclamationTriangle />}
              <span>{isConnected ? 'Kết nối' : 'Mất kết nối'}</span>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Xem các nhắc nhở uống thuốc và lịch hẹn sắp tới
            {isConnected && <span className="text-green-600"> • Cập nhật trực tiếp</span>}
          </p>
          
          {/* Debug info - chỉ hiển thị khi đang development */}
          {process.env.NODE_ENV === 'development' && (
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
                    <p className="text-gray-500">Không có nhắc nhở uống thuốc nào</p>
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
                        reminder.isRead ? 'opacity-60 bg-gray-50' : 'bg-white'
                      }`}
                      onClick={() => reminder.isRealTime && !reminder.isRead && handleMarkAsRead(reminder.id)}
                      title={reminder.isRead ? 'Đã đọc' : 'Click để đánh dấu đã đọc'}
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
                                {!reminder.isRealTime && reminder.isRead && (
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
                    {appointments.map((appointment, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-[#3B9AB8]/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaCalendarAlt className="text-[#3B9AB8]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800 mb-1">
                              {appointment.reason || appointment.title || 'Cuộc hẹn khám'}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                              <FaClock />
                              <span>{formatDate(appointment.appointmentDate || appointment.dateTime)}</span>
                            </div>
                            {appointment.doctorName && (
                              <p className="text-sm text-gray-600">Bác sĩ: {appointment.doctorName}</p>
                            )}
                            {appointment.location && (
                              <p className="text-sm text-gray-600">Địa điểm: {appointment.location}</p>
                            )}
                            {appointment.notes && (
                              <p className="text-sm text-gray-600 mt-1">Ghi chú: {appointment.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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
