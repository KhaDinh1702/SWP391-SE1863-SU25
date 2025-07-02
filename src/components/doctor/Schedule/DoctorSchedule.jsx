import { useState, useEffect } from 'react';
import { Card, Spin, Alert, Typography, Button, Row, Col, Table } from 'antd';
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
      const currentDoctor = allDoctors.find(d => d.userId === userId);

      if (!currentDoctor) {
        setError('Không thể tìm thấy thông tin bác sĩ.');
        setLoading(false);
        return;
      }

      const doctorId = currentDoctor.id;
      
      // Fetch both schedules and appointments
      const [allSchedulesResponse, allAppointmentsResponse] = await Promise.all([
        doctorScheduleService.getAllDoctorSchedules(),
        appointmentService.getAllAppointments()
      ]);
      
      // Store appointments for later reference
      setAppointments(allAppointmentsResponse || []);

      // Fetch all patients to create a mapping
      if (allAppointmentsResponse && allAppointmentsResponse.length > 0) {
        const uniquePatientIds = [...new Set(allAppointmentsResponse.map(apt => apt.patientId).filter(Boolean))];
        
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
    
    // Kiểm tra nếu là anonymous
    if (appointmentInfo.isAnonymousAppointment || appointmentInfo.anonymous) {
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
          // Tìm appointment thực sự nằm trong khung giờ này
          let appointmentInfo = null;
          if (appointments.length > 0) {
            appointmentInfo = appointments.find(apt => {
              const startDate = apt.appointmentStartDate || apt.AppointmentStartDate || apt.appointmentDate;
              if (!startDate) return false;
              const aptMoment = moment(startDate);
              // So khớp ngày
              if (!aptMoment.isSame(day, 'day')) return false;
              // So khớp giờ trong khung 1h30
              const slotStart = day.clone().set({ hour: record.hour, minute: record.minute, second: 0, millisecond: 0 });
              const slotEnd = slotStart.clone().add(1, 'hour').add(30, 'minutes');
              return aptMoment.isSameOrAfter(slotStart) && aptMoment.isBefore(slotEnd);
            });
          }
          if (schedules.length === 0 && !appointmentInfo) {
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

          // Nếu có appointment trong slot này, ưu tiên hiển thị appointment
          if (appointmentInfo) {
            const aptMoment = moment(appointmentInfo.appointmentStartDate || appointmentInfo.AppointmentStartDate || appointmentInfo.appointmentDate);
            const patientDisplayName = getPatientDisplayName(appointmentInfo);
            const isOnlineAppointment = appointmentInfo.appointmentType === 0 || appointmentInfo.AppointmentType === 0 || 
                                      appointmentInfo.appointmentType === 'Online' || appointmentInfo.AppointmentType === 'Online';
            const onlineLink = appointmentInfo.onlineLink || appointmentInfo.OnlineLink;
            
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
                title={`Cuộc hẹn: ${appointmentInfo.appointmentTitle || appointmentInfo.AppointmentTitle || 'Khám bệnh'} - ${patientDisplayName} lúc ${aptMoment.format('HH:mm')}${isOnlineAppointment ? ' (Trực tuyến)' : ''}`}
              >
                <span>{isOnlineAppointment ? '💻' : '📅'} {aptMoment.format('HH:mm')}</span>
                <span>{appointmentInfo.appointmentTitle || appointmentInfo.AppointmentTitle || 'Khám bệnh'}</span>
                <span style={{ color: '#722ed1', fontWeight: 600, fontSize: '12px', marginTop: 2 }}>
                  {patientDisplayName}
                </span>
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

          // Nếu chỉ có một lịch trình, sử dụng logic hiển thị gốc
          if (schedules.length === 1) {
            const schedule = schedules[0];
            const appointmentInfo = schedule.appointmentId ? getAppointmentInfo(schedule.appointmentId) : null;
            
            let showAppointment = false;
            let appointmentTime = null;
            let isOnlineAppointment = false;
            let onlineLink = null;
            
            if (appointmentInfo) {
              // Kiểm tra xem appointment có nằm trong ngày và khung giờ hiện tại không
              const appointmentDate = appointmentInfo.startTime;
              const isCorrectDay = appointmentDate.isSame(day, 'day');
              
              if (isCorrectDay) {
                const appointmentHour = appointmentDate.hour();
                const appointmentMinute = appointmentDate.minute();
                const appointmentSlotMinutes = appointmentHour * 60 + appointmentMinute;
                const currentSlotMinutes = record.hour * 60 + record.minute;
                const nextSlotMinutes = currentSlotMinutes + 30;
                
                // Kiểm tra xem appointment có nằm trong slot hiện tại không
                showAppointment = appointmentSlotMinutes >= currentSlotMinutes && appointmentSlotMinutes < nextSlotMinutes;
                appointmentTime = appointmentDate.format('HH:mm');
                isOnlineAppointment = appointmentInfo.appointmentType === 0 || appointmentInfo.AppointmentType === 0 || 
                                appointmentInfo.appointmentType === 'Online' || appointmentInfo.AppointmentType === 'Online';
                onlineLink = appointmentInfo.onlineLink || appointmentInfo.OnlineLink;
              }
            }
            
            return (
              <div 
                style={{ 
                  padding: '4px 6px',
                  borderRadius: '4px',
                  backgroundColor: schedule.isAvailable ? '#e6f7ff' : (showAppointment && isOnlineAppointment ? '#f6ffed' : '#fffbe6'),
                  border: schedule.isAvailable ? '1px solid #91d5ff' : (showAppointment && isOnlineAppointment ? '1px solid #b7eb8f' : '1px solid #ffe58f'),
                  fontSize: '11px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  minHeight: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
                title={`Lịch ID: ${schedule.originalId || schedule.id}${showAppointment ? '\nCuộc hẹn: ' + appointmentInfo.title + ' - ' + getPatientDisplayName(appointmentInfo) + ' lúc ' + appointmentTime + (isOnlineAppointment ? ' (Trực tuyến)' : '') : ''}`}
              >
                <div style={{ 
                  fontWeight: 'bold', 
                  color: schedule.isAvailable ? '#1890ff' : (showAppointment && isOnlineAppointment ? '#389e0d' : '#d48806'),
                  marginBottom: '1px'
                }}>
                  {schedule.isAvailable ? 'Sẵn sàng' : 'Đã tiếp nhận lịch hẹn'}
                </div>
                {showAppointment && (
                  <div style={{ 
                    fontSize: '9px', 
                    color: '#52c41a',
                    fontWeight: 'bold'
                  }}>
                    {isOnlineAppointment ? '💻' : '📅'} {appointmentTime}
                  </div>
                )}
                {showAppointment && isOnlineAppointment && onlineLink && (
                  <a 
                    href={onlineLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#1890ff', 
                      fontSize: '8px', 
                      marginTop: 2,
                      textDecoration: 'underline'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    🔗 Tham gia
                  </a>
                )}
                {showAppointment && isOnlineAppointment && !onlineLink && (
                  <div style={{ 
                    fontSize: '8px', 
                    color: '#ff4d4f',
                    marginTop: 2
                  }}>
                    Chưa có link
                  </div>
                )}
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

          // Multiple schedules: show summary view
          const appointmentCount = schedules.filter(s => s.appointmentId).length;
          const availableCount = schedules.filter(s => s.isAvailable).length;
          const busyCount = schedules.length - availableCount;
          
          return (
            <div 
              style={{ 
                padding: '2px 4px',
                borderRadius: '4px',
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f',
                fontSize: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                minHeight: '30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              title={`Tổng cộng: ${schedules.length} lịch làm việc\n${availableCount} sẵn sàng, ${busyCount} bận\n${appointmentCount} cuộc hẹn đã đặt`}
            >
              <div style={{ 
                fontWeight: 'bold', 
                color: '#389e0d',
                fontSize: '9px'
              }}>
                {schedules.length} lịch
              </div>
              {appointmentCount > 0 && (
                <div style={{ 
                  fontSize: '8px', 
                  color: '#1890ff',
                  fontWeight: 'bold'
                }}>
                  📅 {appointmentCount} hẹn
                </div>
              )}
              <div style={{ 
                fontSize: '8px', 
                color: availableCount > 0 ? '#52c41a' : '#ff4d4f'
              }}>
                {availableCount > 0 ? `${availableCount} sẵn sàng` : 'Đã đầy'}
              </div>
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

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
            <Title level={4}>Lịch làm việc của tôi</Title>
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
              <Text>Sẵn sàng tiếp nhận lịch hẹn</Text>
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
              <Text>Đã tiếp nhận lịch hẹn (Trực tiếp)</Text>
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
              <Text>Đã tiếp nhận lịch hẹn (Trực tuyến)</Text>
            </div>
          </Col>
        </Row>
      </div>
      
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Spin spinning={loading}>
        {renderTimetableView()}
      </Spin>

      <style jsx>{`
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