import { useState, useEffect } from 'react';
import { Card, Spin, Alert, Typography, Button, Row, Col, Table, Tag } from 'antd';
import { LeftOutlined, RightOutlined, ReloadOutlined } from '@ant-design/icons';
import { doctorScheduleService } from '../../../services/doctorScheduleService';
import { doctorService } from '../../../services/doctorService';
import { appointmentService } from '../../../services/appointmentService';
import { patientService } from '../../../services/patientService';
import moment from 'moment';
import 'moment/locale/vi'; // Import Vietnamese locale for moment

const { Title, Text } = Typography;

const DoctorSchedule = () => {
  const [allSchedules, setAllSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState({}); // Cache patient info by patientId
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment());
  const [lastRefresh, setLastRefresh] = useState(null);
  const [currentDoctor, setCurrentDoctor] = useState(null); // Store current doctor info

  useEffect(() => {
    moment.locale('vi');
    fetchSchedules();
  }, []);

  // Auto refresh every 30 seconds to get latest schedule updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSchedules();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // LOGIC MỚI: CHỈ HIỂN THỊ LỊCH HẸN KHI ĐÃ CÓ LỊCH LÀM VIỆC
  // Bác sĩ phải được manager tạo lịch làm việc trước, sau đó mới có thể có lịch hẹn trong slot đó
  // Nếu không có lịch làm việc thì không hiển thị lịch hẹn, ngăn chặn việc bệnh nhân đặt lịch tùy ý

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      const allDoctors = await doctorService.getAllDoctors();
      const currentDoctorInfo = allDoctors.find(d => d.userId === userId);

      if (!currentDoctorInfo) {
        setError('Không thể tìm thấy thông tin bác sĩ.');
        setLoading(false);
        return;
      }

      setCurrentDoctor(currentDoctorInfo); // Store doctor info
      const doctorId = currentDoctorInfo.id;
      
      // Phân loại bác sĩ theo chuyên khoa
      const specialization = currentDoctorInfo.specialization?.toLowerCase() || '';
      const doctorType = {
        isTestDoctor: specialization.includes('xét nghiệm') || specialization.includes('test') || specialization.includes('lab'),
        isTreatmentDoctor: specialization.includes('điều trị') || specialization.includes('treatment') || specialization.includes('therapy'),
        isConsultantDoctor: specialization.includes('tư vấn') || specialization.includes('consultation') || specialization.includes('counseling'),
        specialization: currentDoctorInfo.specialization || 'Chưa xác định'
      };
      
      // Fetch both schedules and appointments
      const [allSchedulesResponse, allAppointmentsResponse] = await Promise.all([
        doctorScheduleService.getAllDoctorSchedules(),
        appointmentService.getAllAppointments()
      ]);
      
      // Lọc appointments theo chuyên khoa của bác sĩ
      let filteredAppointments = allAppointmentsResponse || [];
      
      // Lọc chỉ lấy các appointment đã xác nhận hoặc hoàn thành, dời lịch, check-in (status = 1, 3, 4, 5)
      filteredAppointments = filteredAppointments.filter(apt => {
        const status = apt.status !== undefined ? apt.status : apt.Status;
        const passesStatusFilter = status === 1 || status === 3 || status === 4 || status === 5;
        return passesStatusFilter;
      });
      
      // Chỉ lọc nếu bác sĩ có chuyên khoa cụ thể
      if (doctorType.isTestDoctor || doctorType.isTreatmentDoctor || doctorType.isConsultantDoctor) {
        filteredAppointments = filteredAppointments.filter(apt => {
          const title = (apt.appointmentTitle || apt.AppointmentTitle || '').toLowerCase();
          const notes = (apt.notes || apt.Notes || '').toLowerCase();
          
          // Lọc theo bác sĩ xét nghiệm
          if (doctorType.isTestDoctor) {
            return title.includes('xét nghiệm') || 
                   title.includes('test') || 
                   title.includes('lab') ||
                   notes.includes('xét nghiệm') || 
                   notes.includes('test') || 
                   notes.includes('lab') ||
                   apt.doctorId === doctorId;
          }
          
          // Lọc theo bác sĩ điều trị - RELAXED FILTERING
          if (doctorType.isTreatmentDoctor) {
            return title.includes('điều trị') || 
                   title.includes('treatment') || 
                   title.includes('therapy') ||
                   title.includes('chữa trị') ||
                   notes.includes('điều trị') || 
                   notes.includes('treatment') || 
                   notes.includes('therapy') ||
                   notes.includes('chữa trị') ||
                   apt.doctorId === doctorId ||
                   // Thêm logic: nếu không có title/notes cụ thể, cho phép tất cả appointments của bác sĩ này
                   (apt.doctorId === doctorId && (!title || !notes));
          }
          
          // Lọc theo bác sĩ tư vấn
          if (doctorType.isConsultantDoctor) {
            return title.includes('tư vấn') || 
                   title.includes('consultation') || 
                   title.includes('counseling') ||
                   title.includes('khám tư vấn') ||
                   notes.includes('tư vấn') || 
                   notes.includes('consultation') || 
                   notes.includes('counseling') ||
                   notes.includes('khám tư vấn') ||
                   apt.doctorId === doctorId;
          }
          
          return false;
        });
      }
      
      // Store filtered appointments for later reference
      setAppointments(filteredAppointments);
      
      // Debug log
      console.log('Chuyên khoa bác sĩ:', doctorType.specialization);
      console.log('Loại bác sĩ:', {
        isTestDoctor: doctorType.isTestDoctor,
        isTreatmentDoctor: doctorType.isTreatmentDoctor,
        isConsultantDoctor: doctorType.isConsultantDoctor
      });
      console.log('Tổng số appointments:', allAppointmentsResponse?.length || 0);
      console.log('Appointments sau khi lọc:', filteredAppointments.length);

      // Fetch all patients to create a mapping
      if (filteredAppointments && filteredAppointments.length > 0) {
        const uniquePatientIds = [...new Set(filteredAppointments.map(apt => apt.patientId).filter(Boolean))];
        
        try {
          // Fetch all patients at once
          const allPatientsResponse = await patientService.getAllPatients();
          
          if (allPatientsResponse && Array.isArray(allPatientsResponse)) {
            // Create mapping from patientId to patient info
            const patientMapping = {};
            allPatientsResponse.forEach(patient => {
              if (patient.id || patient.patientId) {
                const patientId = patient.id || patient.patientId;
                patientMapping[patientId] = patient;
              }
            });
            
            setPatients(patientMapping);
          }
        } catch (error) {
          console.error('Error fetching all patients:', error);
        }
      }

      if (allSchedulesResponse && Array.isArray(allSchedulesResponse)) {
          const doctorSchedules = allSchedulesResponse.filter(s => s.doctorId === doctorId);
          
          const expandedSchedules = [];
          doctorSchedules.forEach(schedule => {
              const start = moment(schedule.startTime);
              const end = moment(schedule.endTime);

              // Nếu start và end là cùng ngày, chỉ tạo 1 entry với thời gian chính xác
              if (start.isSame(end, 'day')) {
                  expandedSchedules.push({
                      ...schedule,
                      id: `${schedule.id}-${start.format('YYYY-MM-DD')}`,
                      originalId: schedule.id,
                      startTime: start.toDate(),
                      endTime: end.toDate(),
                  });
              } else {
                  // Nếu span nhiều ngày, tạo entry cho từng ngày
                  for (let m = start.clone(); m.isSameOrBefore(end, 'day'); m.add(1, 'day')) {
                      expandedSchedules.push({
                          ...schedule,
                          id: `${schedule.id}-${m.format('YYYY-MM-DD')}`,
                          originalId: schedule.id,
                          startTime: m.clone().set({
                              hour: start.hour(),
                              minute: start.minute(),
                          }).toDate(),
                          endTime: m.clone().set({
                              hour: end.hour(),
                              minute: end.minute(),
                          }).toDate(),
                      });
                  }
              }
          });

          setAllSchedules(expandedSchedules);
          setLastRefresh(moment());
      } else {
          setAllSchedules([]);
      }

    } catch (err) {
      setError('Lỗi khi tải lịch làm việc. Vui lòng thử lại.');
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const goToPreviousWeek = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'week'));
  };

  const goToNextWeek = () => {
    setCurrentDate(currentDate.clone().add(1, 'week'));
  };

  const handleRefresh = () => {
    fetchSchedules();
  };

  // Tạo khung giờ cố định: 8:00, 10:00, 12:00, 14:00, 16:00, mỗi khung 1 tiếng 30 phút
  const FIXED_TIME_SLOTS = [
    { hour: 8, minute: 0 },
    { hour: 10, minute: 0 },
    { hour: 12, minute: 0 },
    { hour: 14, minute: 0 },
    { hour: 16, minute: 0 },
  ];

  // Tạo khung giờ từ các mốc cố định, mỗi khung 1 tiếng 30 phút
  const generateTimeSlots = () => {
    return FIXED_TIME_SLOTS.map(slot => {
      const start = moment({ hour: slot.hour, minute: slot.minute });
      const end = start.clone().add(1, 'hour').add(30, 'minutes');
      return {
        time: start.format('HH:mm'),
        timeRange: `${start.format('HH:mm')} - ${end.format('HH:mm')}`,
        hour: slot.hour,
        minute: slot.minute,
        endHour: end.hour(),
        endMinute: end.minute(),
      };
    });
  };

  // Lấy các schedule trùng với khung giờ cố định (1 tiếng 30 phút)
  const getSchedulesForTimeSlot = (day, hour, minute) => {
    const slotStart = day.clone().set({ hour, minute, second: 0, millisecond: 0 });
    const slotEnd = slotStart.clone().add(1, 'hour').add(30, 'minutes');
    return allSchedules.filter(schedule => {
      const scheduleStart = moment(schedule.startTime);
      const scheduleEnd = moment(schedule.endTime);
      // Kiểm tra overlap giữa slot và schedule
      return (
        scheduleStart.isBefore(slotEnd) && scheduleEnd.isAfter(slotStart) &&
        scheduleStart.isSame(day, 'day')
      );
    });
  };

  // Legacy function for backward compatibility
  const getScheduleForTimeSlot = (day, hour, minute) => {
    const schedules = getSchedulesForTimeSlot(day, hour, minute);
    return schedules.length > 0 ? schedules[0] : null;
  };

  // Helper function to get appointment info
  const getAppointmentInfo = (appointmentId) => {
    return appointments.find(apt => apt.id === appointmentId || apt.appointmentId === appointmentId);
  };

  // Helper function to get patient display name
  const getPatientDisplayName = (appointmentInfo) => {
    if (!appointmentInfo) return 'Bệnh nhân';
    
    // Kiểm tra nếu là anonymous - kiểm tra tất cả các biến thể có thể
    const isAnonymous = appointmentInfo.isAnonymousAppointment || 
                       appointmentInfo.IsAnonymousAppointment || 
                       appointmentInfo.anonymous || 
                       appointmentInfo.Anonymous ||
                       appointmentInfo.isAnonymous ||
                       appointmentInfo.IsAnonymous;
    
    if (isAnonymous) {
      console.log('Anonymous appointment detected:', appointmentInfo);
      return 'Ẩn danh';
    }
    
    // Kiểm tra nếu đã có thông tin patient trong cache
    if (appointmentInfo.patientId && patients[appointmentInfo.patientId]) {
      const patientInfo = patients[appointmentInfo.patientId];
      
      // Thử các trường khác nhau cho tên
      const name = patientInfo.fullName || 
                   patientInfo.name || 
                   patientInfo.Name ||
                   patientInfo.FullName ||
                   (patientInfo.firstName && patientInfo.lastName ? `${patientInfo.firstName} ${patientInfo.lastName}` : null) ||
                   (patientInfo.FirstName && patientInfo.LastName ? `${patientInfo.FirstName} ${patientInfo.LastName}` : null);
      
      if (name) {
        return name;
      }
    }
    
    // Ưu tiên các trường tên có sẵn trong appointment
    const patientName = appointmentInfo.patientName || 
                       appointmentInfo.PatientName || 
                       appointmentInfo.patient?.name || 
                       appointmentInfo.patient?.fullName ||
                       appointmentInfo.patient?.firstName + ' ' + appointmentInfo.patient?.lastName ||
                       appointmentInfo.name ||
                       appointmentInfo.fullName ||
                       appointmentInfo.firstName + ' ' + appointmentInfo.lastName;
    
    // Nếu có tên thì trả về tên, không thì trả về "Bệnh nhân" thay vì ID
    return patientName || 'Bệnh nhân';
  };

  // Helper function to get doctor type info
  const getDoctorTypeInfo = (currentDoctor) => {
    const specialization = currentDoctor?.specialization?.toLowerCase() || '';
    
    if (specialization.includes('xét nghiệm') || specialization.includes('test') || specialization.includes('lab')) {
      return {
        type: 'test',
        title: 'Lịch làm việc xét nghiệm',
        appointmentType: 'xét nghiệm',
        description: 'Trang này chỉ hiển thị các lịch hẹn liên quan đến xét nghiệm. Chỉ những cuộc hẹn có tiêu đề hoặc ghi chú chứa từ khóa "xét nghiệm", "test", "lab" mới được hiển thị.'
      };
    }
    
    if (specialization.includes('điều trị') || specialization.includes('treatment') || specialization.includes('therapy')) {
      return {
        type: 'treatment',
        title: 'Lịch làm việc điều trị',
        appointmentType: 'điều trị',
        description: 'Trang này chỉ hiển thị các lịch hẹn liên quan đến điều trị. Chỉ những cuộc hẹn có tiêu đề hoặc ghi chú chứa từ khóa "điều trị", "treatment", "therapy", "chữa trị" mới được hiển thị.'
      };
    }
    
    if (specialization.includes('tư vấn') || specialization.includes('consultation') || specialization.includes('counseling')) {
      return {
        type: 'consultation',
        title: 'Lịch làm việc tư vấn',
        appointmentType: 'tư vấn',
        description: 'Trang này chỉ hiển thị các lịch hẹn liên quan đến tư vấn. Chỉ những cuộc hẹn có tiêu đề hoặc ghi chú chứa từ khóa "tư vấn", "consultation", "counseling", "khám tư vấn" mới được hiển thị.'
      };
    }
    
    return {
      type: 'general',
      title: 'Lịch làm việc của tôi',
      appointmentType: 'khám bệnh',
      description: 'Hiển thị tất cả các lịch hẹn của bạn.'
    };
  };

  const renderTimetableView = () => {
    const startOfWeek = currentDate.clone().startOf('isoWeek');
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.clone().add(i, 'days'));
    }

    const timeSlots = generateTimeSlots();

    const columns = [
      {
        title: 'Khung giờ',
        dataIndex: 'timeRange',
        key: 'time',
        width: 120,
        fixed: 'left',
        render: (text) => <Text strong>{text}</Text>
      },
      ...days.map(day => ({
        title: (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              {day.format('dddd')}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {day.format('DD/MM')}
            </div>
          </div>
        ),
        dataIndex: day.format('YYYY-MM-DD'),
        key: day.format('YYYY-MM-DD'),
        width: 120,
        align: 'center',
        render: (_, record) => {
          const schedules = getSchedulesForTimeSlot(day, record.hour, record.minute);
          
          // CHỈ HIỂN THỊ LỊCH HẸN KHI CÓ LỊCH LÀM VIỆC - LOGIC MỚI
          // Nếu không có lịch làm việc trong slot này, không hiển thị gì
          if (schedules.length === 0) {
            return (
              <div style={{ 
                padding: '4px',
                color: '#ccc',
                fontSize: '10px',
                textAlign: 'center',
                minHeight: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                -
              </div>
            );
          }

          // CHỈ TÌM APPOINTMENT KHI ĐÃ CÓ LỊCH LÀM VIỆC
          let appointmentInfo = null;
          if (appointments.length > 0 && schedules.length > 0) {
            appointmentInfo = appointments.find(apt => {
              const startDate = apt.appointmentStartDate || apt.AppointmentStartDate || apt.appointmentDate;
              if (!startDate) return false;
              const aptMoment = moment(startDate);
              // So khớp ngày
              if (!aptMoment.isSame(day, 'day')) return false;
              // So khớp giờ trong khung 1h30
              const slotStart = day.clone().set({ hour: record.hour, minute: record.minute, second: 0, millisecond: 0 });
              const slotEnd = slotStart.clone().add(1, 'hour').add(30, 'minutes');
              const isInSlot = aptMoment.isSameOrAfter(slotStart) && aptMoment.isBefore(slotEnd);
              
              return isInSlot;
            });
          }

          // Nếu có appointment trong slot này VÀ có lịch làm việc, hiển thị appointment
          if (appointmentInfo && schedules.length > 0) {
            const aptMoment = moment(appointmentInfo.appointmentStartDate || appointmentInfo.AppointmentStartDate || appointmentInfo.appointmentDate);
            const patientDisplayName = getPatientDisplayName(appointmentInfo);
            const isAnonymous = appointmentInfo.isAnonymousAppointment || appointmentInfo.IsAnonymousAppointment || appointmentInfo.anonymous || appointmentInfo.Anonymous;
            const isOnlineAppointment = appointmentInfo.appointmentType === 0 || appointmentInfo.AppointmentType === 0 || 
                                      appointmentInfo.appointmentType === 'Online' || appointmentInfo.AppointmentType === 'Online';
            const onlineLink = appointmentInfo.onlineLink || appointmentInfo.OnlineLink;
            // Lấy trạng thái
            const status = appointmentInfo.status !== undefined ? appointmentInfo.status : appointmentInfo.Status;
            let statusColor = 'default', statusLabel = '';
            switch (status) {
              case 2: statusColor = 'red'; statusLabel = 'Đã hủy'; break;
              case 3: statusColor = 'blue'; statusLabel = 'Hoàn thành'; break;
              case 4: statusColor = 'purple'; statusLabel = 'Dời lịch'; break;
              case 5: statusColor = 'cyan'; statusLabel = 'Đã check-in'; break;
              case 1: statusColor = 'green'; statusLabel = 'Đã xác nhận'; break;
              default: statusColor = 'orange'; statusLabel = 'Chờ duyệt';
            }
            return (
              <div style={{
                padding: '4px 6px',
                borderRadius: '4px',
                backgroundColor: isOnlineAppointment ? '#f6ffed' : '#fffbe6',
                border: isOnlineAppointment ? '1px solid #b7eb8f' : '1px solid #ffe58f',
                fontSize: '11px',
                textAlign: 'center',
                minHeight: '30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                color: isOnlineAppointment ? '#389e0d' : '#d48806',
                fontWeight: 'bold'
              }}
                title={`Cuộc hẹn ${doctorTypeInfo.appointmentType}: ${appointmentInfo.appointmentTitle || appointmentInfo.AppointmentTitle || doctorTypeInfo.appointmentType} - ${patientDisplayName} lúc ${aptMoment.format('HH:mm')}${isOnlineAppointment ? ' (Trực tuyến)' : ''}${isAnonymous ? ' (Ẩn danh)' : ''}`}
              >
                <span>{isOnlineAppointment ? '💻' : '📅'} {aptMoment.format('HH:mm')}</span>
                <span>{appointmentInfo.appointmentTitle || appointmentInfo.AppointmentTitle || doctorTypeInfo.appointmentType}</span>
                <span style={{ 
                  color: isAnonymous ? '#ff4d4f' : '#722ed1', 
                  fontWeight: 600, 
                  fontSize: '12px', 
                  marginTop: 2,
                  fontStyle: isAnonymous ? 'italic' : 'normal'
                }}>
                  {isAnonymous ? '🔒 ' : ''}{patientDisplayName}
                </span>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <Tag color={statusColor} style={{ marginTop: 2, fontWeight: 500, minWidth: 80, textAlign: 'center' }}>{statusLabel}</Tag>
                </div>
                {isOnlineAppointment && onlineLink && (
                  <a 
                    href={onlineLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#1890ff', 
                      fontSize: '10px', 
                      marginTop: 2,
                      textDecoration: 'underline'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    🔗 Tham gia cuộc họp
                  </a>
                )}
                {isOnlineAppointment && !onlineLink && (
                  <span style={{ 
                    color: '#ff4d4f', 
                    fontSize: '10px', 
                    marginTop: 2
                  }}>
                    Chưa có link
                  </span>
                )}
              </div>
            );
          }

          // Nếu chỉ có lịch làm việc nhưng chưa có appointment, hiển thị slot trống có thể đặt lịch
          if (schedules.length > 0 && !appointmentInfo) {
            const schedule = schedules[0];
            return (
              <div 
                style={{ 
                  padding: '4px 6px',
                  borderRadius: '4px',
                  backgroundColor: '#f0f8ff',
                  border: '1px dashed #1890ff',
                  fontSize: '11px',
                  textAlign: 'center',
                  minHeight: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  color: '#1890ff'
                }}
                title={`Lịch làm việc ${doctorTypeInfo.appointmentType} - Slot trống có thể nhận lịch hẹn`}
              >
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: '10px'
                }}>
                  Sẵn sàng tiếp nhận
                </div>
                <div style={{ 
                  fontSize: '9px'
                }}>
                  {doctorTypeInfo.appointmentType}
                </div>
                {schedule.notes && (
                  <div style={{ 
                    fontSize: '8px', 
                    color: '#666',
                    marginTop: '1px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {schedule.notes}
                  </div>
                )}
              </div>
            );
          }

          // Multiple schedules: chỉ hiển thị nếu có appointments và schedules
          if (schedules.length > 1) {
            const schedulesWithAppointments = schedules.filter(s => {
              // Kiểm tra xem có appointment nào match với schedule này không
              return appointments.some(apt => {
                const startDate = apt.appointmentStartDate || apt.AppointmentStartDate || apt.appointmentDate;
                if (!startDate) return false;
                const aptMoment = moment(startDate);
                if (!aptMoment.isSame(day, 'day')) return false;
                const slotStart = day.clone().set({ hour: record.hour, minute: record.minute, second: 0, millisecond: 0 });
                const slotEnd = slotStart.clone().add(1, 'hour').add(30, 'minutes');
                return aptMoment.isSameOrAfter(slotStart) && aptMoment.isBefore(slotEnd);
              });
            });
            
            return (
              <div 
                style={{ 
                  padding: '4px 6px',
                  borderRadius: '4px',
                  backgroundColor: schedulesWithAppointments.length > 0 ? '#fff2e8' : '#f0f8ff',
                  border: schedulesWithAppointments.length > 0 ? '1px solid #ffb366' : '1px dashed #1890ff',
                  fontSize: '10px',
                  textAlign: 'center',
                  minHeight: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
                title={`${schedules.length} lịch làm việc, ${schedulesWithAppointments.length} có lịch hẹn`}
              >
                <div style={{ fontWeight: 'bold', color: schedulesWithAppointments.length > 0 ? '#d46b08' : '#1890ff' }}>
                  {schedulesWithAppointments.length > 0 ? `${schedulesWithAppointments.length} lịch hẹn` : 'Sẵn sàng tiếp nhận'}
                </div>
                <div style={{ fontSize: '8px', color: '#666' }}>
                  {schedules.length} slot làm việc
                </div>
              </div>
            );
          }

          // Fallback - không nên đến đây với logic mới
          return (
            <div style={{ 
              padding: '4px',
              color: '#ccc',
              fontSize: '10px',
              textAlign: 'center',
              minHeight: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              -
            </div>
          );
        }
      }))
    ];

    return (
      <Table
        columns={columns}
        dataSource={timeSlots}
        rowKey="time"
        pagination={false}
        scroll={{ x: 1000 }}
        size="small"
        bordered
        style={{ backgroundColor: 'white' }}
        rowClassName={(record, index) => {
          // Tô màu nền khác nhau cho các hàng để dễ đọc
          return index % 2 === 0 ? 'even-row' : 'odd-row';
        }}
      />
    );
  };

  const startOfWeek = currentDate.clone().startOf('isoWeek').format('DD/MM');
  const endOfWeek = currentDate.clone().endOf('isoWeek').format('DD/MM/YYYY');
  
  // Get current doctor info from localStorage
  const getCurrentDoctorInfo = () => {
    return currentDoctor || { specialization: 'Chưa xác định' };
  };
  
  const doctorTypeInfo = getDoctorTypeInfo(getCurrentDoctorInfo());

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
            <Title level={4}>{doctorTypeInfo.title}</Title>
            <Text>Tuần: {startOfWeek} - {endOfWeek}</Text>
            {lastRefresh && (
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Cập nhật lần cuối: {lastRefresh.format('HH:mm:ss DD/MM/YYYY')}
                </Text>
              </div>
            )}
        </Col>
        <Col>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh} 
            loading={loading}
            style={{ marginRight: 8 }}
          >
            Làm mới
          </Button>
          <Button icon={<LeftOutlined />} onClick={goToPreviousWeek} style={{ marginRight: 8 }}>Tuần trước</Button>
          <Button icon={<RightOutlined />} onClick={goToNextWeek}>Tuần sau</Button>
        </Col>
      </Row>
      
      <div style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 16, 
                height: 16, 
                backgroundColor: '#e6f7ff', 
                border: '1px solid #91d5ff',
                borderRadius: 2 
              }}></div>
              <Text>Sẵn sàng tiếp nhận lịch {doctorTypeInfo.appointmentType}</Text>
            </div>
          </Col>
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 16, 
                height: 16, 
                backgroundColor: '#fffbe6', 
                border: '1px solid #ffe58f',
                borderRadius: 2 
              }}></div>
              <Text>Đã tiếp nhận lịch {doctorTypeInfo.appointmentType} (Trực tiếp)</Text>
            </div>
          </Col>
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 16, 
                height: 16, 
                backgroundColor: '#f6ffed', 
                border: '1px solid #b7eb8f',
                borderRadius: 2 
              }}></div>
              <Text>Đã tiếp nhận lịch {doctorTypeInfo.appointmentType} (Trực tuyến)</Text>
            </div>
          </Col>
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '14px' }}>🔒</span>
              <Text>Lịch hẹn ẩn danh</Text>
            </div>
          </Col>
        </Row>
      </div>
      
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Spin spinning={loading}>
        {renderTimetableView()}
      </Spin>

      <style>{`
        .even-row {
          background-color: #fafafa;
        }
        .odd-row {
          background-color: #ffffff;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #f0f2f5 !important;
        }
      `}</style>
    </div>
  );
};

export default DoctorSchedule;