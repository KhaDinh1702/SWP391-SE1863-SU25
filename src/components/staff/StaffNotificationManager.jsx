import React, { useState, useEffect } from 'react';
import { Card, Input, Button, List, message, Select, Spin, Modal } from 'antd';
import { BellOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { notificationService } from '../../services/notificationService';
import { patientService } from '../../services/patientService';
import { getAuthHeaders } from '../../services/config';

const { TextArea } = Input;
const { Option } = Select;

const StaffNotificationManager = () => {
  const [patients, setPatients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationType, setNotificationType] = useState('general');
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [treatmentStages, setTreatmentStages] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedTreatmentStage, setSelectedTreatmentStage] = useState(null);
  // Thêm các state cho lặp lại thông báo thuốc
  const [repeatType, setRepeatType] = useState('none'); // none, daily, weekly, custom
  const [repeatDays, setRepeatDays] = useState([]); // Các ngày trong tuần
  const [reminderTimes, setReminderTimes] = useState(['']); // Nhiều giờ nhắc trong ngày
  const [endDate, setEndDate] = useState(''); // Ngày kết thúc lặp lại

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
    fetchTreatmentStages();
  }, []);

  useEffect(() => {
    // Chỉ fetch notifications khi đã có patients
    if (patients.length > 0) {
      fetchNotifications();
    }
  }, [patients]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAllPatients();
      setPatients(data);
    } catch (error) {
      message.error('Không thể tải danh sách bệnh nhân');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`https://localhost:7040/api/Appointment/get-paid-appointments`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const appointments = await response.json();
        setAppointments(appointments || []);
      } else {
        console.warn('Could not fetch appointments:', response.status);
        setAppointments([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải appointments:', error);
      setAppointments([]);
    }
  };

  const fetchTreatmentStages = async () => {
    try {
      const response = await fetch(`https://localhost:7040/api/TreatmentStage/get-list-treatment-stage`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const stages = await response.json();
        setTreatmentStages(stages || []);
      } else {
        console.warn('Could not fetch treatment stages:', response.status);
        setTreatmentStages([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải treatment stages:', error);
      setTreatmentStages([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      // Backend không có endpoint lấy tất cả notifications
      // Thay vào đó, lấy notifications từ tất cả patients
      const allNotifications = [];
      
      for (const patient of patients) {
        try {
          const patientNotifications = await notificationService.getNotificationsByPatientId(
            patient.patientId || patient.id
          );
          
          // Thêm tên patient vào mỗi notification
          const notificationsWithPatientName = patientNotifications.map(notification => ({
            ...notification,
            patientName: patient.fullName,
            patientEmail: patient.email
          }));
          
          allNotifications.push(...notificationsWithPatientName);
        } catch (error) {
          console.error(`Lỗi khi tải thông báo cho patient ${patient.fullName}:`, error);
        }
      }
      
      // Sắp xếp theo thời gian tạo (mới nhất trước)
      allNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error);
      message.error('Không thể tải danh sách thông báo');
    }
  };

  const handleCreateNotification = async () => {
    if (!selectedPatient || !messageText.trim()) {
      message.error('Vui lòng chọn bệnh nhân và nhập nội dung thông báo');
      return;
    }
    
    // Validate for medicine reminder
    if (notificationType === 'medicine') {
      if (!medicineName.trim()) {
        message.error('Vui lòng nhập tên thuốc');
        return;
      }
      if (!selectedTreatmentStage) {
        message.error('Vui lòng chọn giai đoạn điều trị');
        return;
      }
      if (repeatType === 'none' && reminderTimes[0] === '') {
        message.error('Vui lòng chọn thời gian nhắc uống');
        return;
      }
      if (repeatType !== 'none') {
        if (reminderTimes.some(time => time === '')) {
          message.error('Vui lòng nhập đầy đủ thời gian nhắc uống');
          return;
        }
        if (repeatType === 'custom' && repeatDays.length === 0) {
          message.error('Vui lòng chọn ít nhất một ngày trong tuần');
          return;
        }
        if (!endDate) {
          message.error('Vui lòng chọn ngày kết thúc lặp lại');
          return;
        }
      }
    }
    
    // Validate for appointment notification
    if (notificationType === 'appointment') {
      if (!selectedAppointment) {
        message.error('Vui lòng chọn lịch hẹn');
        return;
      }
    }
    
    try {
      setLoading(true);
      
      let finalMessage = messageText;
      if (notificationType === 'medicine') {
        finalMessage = `Nhắc nhở uống thuốc: ${medicineName} - ${messageText}`;
        if (dosage.trim()) {
          finalMessage += ` - Liều: ${dosage}`;
        }
        
        // Xử lý tạo thông báo lặp lại
        if (repeatType === 'none') {
          // Tạo thông báo một lần
          finalMessage += ` - Thời gian: ${new Date(reminderTimes[0]).toLocaleString('vi-VN')}`;
          
          const notificationData = {
            patientId: selectedPatient,
            message: finalMessage,
            treatmentStageId: selectedTreatmentStage,
            appointmentId: null,
            scheduledTime: reminderTimes[0]
          };
          
          await notificationService.createNotification(notificationData);
        } else {
          // Tạo nhiều thông báo lặp lại
          const notifications = generateRepeatingNotifications(
            selectedPatient,
            medicineName,
            messageText,
            dosage,
            selectedTreatmentStage,
            repeatType,
            repeatDays,
            reminderTimes,
            endDate
          );
          
          // Tạo từng thông báo
          for (const notification of notifications) {
            await notificationService.createNotification(notification);
          }
          
          message.success(`Đã tạo ${notifications.length} thông báo nhắc uống thuốc`);
        }
      } else if (notificationType === 'appointment') {
        finalMessage = `Thông báo lịch hẹn: ${messageText}`;
      } else if (notificationType === 'general') {
        finalMessage = `Thông báo chung: ${messageText}`;
        
        // Tạo thông báo cho appointment và general
        const notificationData = {
          patientId: selectedPatient,
          message: finalMessage,
          treatmentStageId: selectedTreatmentStage || null,
          appointmentId: selectedAppointment || null
        };
        
        await notificationService.createNotification(notificationData);
      }
      
      // Chỉ hiển thị success message cho non-medicine hoặc medicine không lặp lại
      if (notificationType !== 'medicine' || repeatType === 'none') {
        message.success('Tạo thông báo thành công');
      }
      
      // Reset form
      setMessageText('');
      setSelectedPatient(null);
      setMedicineName('');
      setDosage('');
      setReminderTime('');
      setNotificationType('general');
      setSelectedAppointment(null);
      setSelectedTreatmentStage(null);
      // Reset các field mới
      setRepeatType('none');
      setRepeatDays([]);
      setReminderTimes(['']);
      setEndDate('');
      
      // Tải lại notifications
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      message.error('Không thể tạo thông báo. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm tạo thông báo lặp lại
  const generateRepeatingNotifications = (patientId, medicineName, messageText, dosage, treatmentStageId, repeatType, repeatDays, reminderTimes, endDate) => {
    const notifications = [];
    const startDate = new Date();
    const endDateTime = new Date(endDate);
    
    // Tạo danh sách ngày cần tạo thông báo
    const targetDays = repeatType === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : 
                      repeatType === 'weekly' ? [startDate.getDay()] : 
                      repeatDays;
    
    // Lặp từ ngày hiện tại đến ngày kết thúc
    for (let currentDate = new Date(startDate); currentDate <= endDateTime; currentDate.setDate(currentDate.getDate() + 1)) {
      const dayOfWeek = currentDate.getDay();
      
      // Kiểm tra xem ngày này có trong danh sách cần tạo thông báo không
      if (targetDays.includes(dayOfWeek)) {
        // Tạo thông báo cho từng giờ nhắc
        reminderTimes.forEach(time => {
          if (time) {
            const [hours, minutes] = time.split(':');
            const scheduledDateTime = new Date(currentDate);
            scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            // Chỉ tạo thông báo cho tương lai
            if (scheduledDateTime > startDate) {
              let finalMessage = `Nhắc nhở uống thuốc: ${medicineName} - ${messageText}`;
              if (dosage.trim()) {
                finalMessage += ` - Liều: ${dosage}`;
              }
              finalMessage += ` - Thời gian: ${scheduledDateTime.toLocaleString('vi-VN')}`;
              
              notifications.push({
                patientId: patientId,
                message: finalMessage,
                treatmentStageId: treatmentStageId,
                appointmentId: null,
                scheduledTime: scheduledDateTime.toISOString()
              });
            }
          }
        });
      }
    }
    
    return notifications;
  };

  // Hàm thêm/bớt thời gian nhắc
  const addReminderTime = () => {
    setReminderTimes([...reminderTimes, '']);
  };

  const removeReminderTime = (index) => {
    if (reminderTimes.length > 1) {
      setReminderTimes(reminderTimes.filter((_, i) => i !== index));
    }
  };

  const updateReminderTime = (index, value) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = value;
    setReminderTimes(newTimes);
  };

  // Hàm xử lý thay đổi ngày lặp lại
  const handleRepeatDaysChange = (day) => {
    if (repeatDays.includes(day)) {
      setRepeatDays(repeatDays.filter(d => d !== day));
    } else {
      setRepeatDays([...repeatDays, day]);
    }
  };

  return (
    <div className="p-6">
      {/* Thông báo hướng dẫn */}
      <Card className="mb-4 border-blue-200 bg-blue-50">
        <div className="flex items-center gap-2 text-blue-700">
          <BellOutlined />
          <div>
            <h4 className="font-medium mb-1">Hướng dẫn sử dụng:</h4>
            <p className="text-sm">
              Có 3 loại thông báo:
            </p>
            <ul className="text-sm mt-2 ml-4 list-disc">
              <li><strong>Thông báo chung:</strong> Chỉ cần chọn bệnh nhân và nhập nội dung</li>
              <li><strong>Thông báo lịch hẹn:</strong> Chọn lịch hẹn đã thanh toán + giai đoạn điều trị (tùy chọn)</li>
              <li><strong>Thông báo uống thuốc:</strong> Chọn giai đoạn điều trị + thông tin thuốc + lịch nhắc (có thể lặp lại hàng ngày/tuần)</li>
            </ul>
            <p className="text-sm mt-2">
              <strong>Trạng thái Backend:</strong> ✅ Tạo thông báo, ✅ Xem danh sách, ✅ Đánh dấu đã đọc
            </p>
          </div>
        </div>
      </Card>

      <Card 
        title={
          <div className="flex items-center gap-2">
            <BellOutlined />
            <span>Quản lý thông báo</span>
          </div>
        }
        className="mb-6"
      >
        <div className="space-y-4">
          {/* Chọn bệnh nhân */}
          <div>
            <label className="block text-sm font-medium mb-2">Chọn bệnh nhân:</label>
            <Select
              placeholder="Chọn bệnh nhân để gửi thông báo"
              value={selectedPatient || undefined}
              onChange={setSelectedPatient}
              className="w-full"
              showSearch
              filterOption={(input, option) => 
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              notFoundContent={loading ? <Spin size="small" /> : 'Không tìm thấy bệnh nhân'}
            >
              {patients.map(patient => {
                const patientId = patient.patientId || patient.id;
                const patientKey = patientId || patient.email || `patient-${Math.random()}`;
                return (
                  <Option key={patientKey} value={patientId}>
                    {patient.fullName} - {patient.email} - {patient.phoneNumber}
                  </Option>
                );
              })}
            </Select>
          </div>

          {/* Nội dung thông báo */}
          <div>
            <label className="block text-sm font-medium mb-2">Nội dung thông báo:</label>
            <TextArea
              placeholder="Nhập nội dung thông báo..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={4}
            />
          </div>

          {/* Chọn loại thông báo */}
          <div>
            <label className="block text-sm font-medium mb-2">Loại thông báo:</label>
            <Select
              value={notificationType}
              onChange={(value) => {
                setNotificationType(value);
                // Reset các field khi đổi loại thông báo
                setSelectedAppointment(null);
                setSelectedTreatmentStage(null);
                setMedicineName('');
                setDosage('');
                setReminderTime('');
                // Reset các field mới
                setRepeatType('none');
                setRepeatDays([]);
                setReminderTimes(['']);
                setEndDate('');
              }}
              className="w-full"
            >
              <Option value="general">Thông báo chung</Option>
              <Option value="appointment">Thông báo lịch hẹn</Option>
              <Option value="medicine">Thông báo uống thuốc</Option>
            </Select>
          </div>

          {/* Chọn Appointment (hiển thị khi chọn thông báo lịch hẹn) */}
          {notificationType === 'appointment' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Chọn lịch hẹn <span className="text-red-500">*</span>: {appointments.length > 0 ? `(${appointments.length} lịch hẹn)` : '(Không có dữ liệu)'}
              </label>
              <Select
                placeholder="Chọn lịch hẹn đã thanh toán"
                value={selectedAppointment || undefined}
                onChange={setSelectedAppointment}
                className="w-full"
                loading={loading}
                notFoundContent={loading ? <Spin size="small" /> : 'Không có lịch hẹn nào'}
              >
                {appointments.map((appointment, index) => {
                  // Backend trả về field "id" (không phải "appointmentId")
                  const appointmentId = appointment.id;
                  const appointmentTitle = appointment.appointmentTitle || 'Không có tiêu đề';
                  const appointmentDate = appointment.appointmentStartDate;
                  
                  if (!appointmentId) return null;
                  
                  return (
                    <Option 
                      key={`appointment-${appointmentId}-${index}`} 
                      value={appointmentId}
                    >
                      {appointmentTitle} - {appointmentDate ? new Date(appointmentDate).toLocaleString('vi-VN') : 'Không có ngày'}
                    </Option>
                  );
                })}
              </Select>
            </div>
          )}

          {/* Chọn Treatment Stage (hiển thị cho appointment và medicine) */}
          {(notificationType === 'appointment' || notificationType === 'medicine') && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Chọn giai đoạn điều trị {notificationType === 'medicine' ? <span className="text-red-500">*</span> : '(tùy chọn)'}: {treatmentStages.length > 0 ? `(${treatmentStages.length} giai đoạn)` : '(Không có dữ liệu)'}
              </label>
              <Select
                placeholder={notificationType === 'medicine' ? "Chọn giai đoạn điều trị" : "Chọn giai đoạn điều trị liên quan (không bắt buộc)"}
                value={selectedTreatmentStage || undefined}
                onChange={setSelectedTreatmentStage}
                className="w-full"
                allowClear={notificationType === 'appointment'}
                loading={loading}
                notFoundContent={loading ? <Spin size="small" /> : 'Không có giai đoạn điều trị nào'}
              >
                {treatmentStages.map((stage, index) => {
                  // Backend trả về field "id" (không phải "treatmentStageId")
                  const stageId = stage.id;
                  const stageName = stage.stageName || 'Không có tên';
                  const stageDescription = stage.description || 'Không có mô tả';
                  
                  if (!stageId) return null;
                  
                  return (
                    <Option 
                      key={`stage-${stageId}-${index}`} 
                      value={stageId}
                    >
                      {stageName} - {stageDescription}
                    </Option>
                  );
                })}
              </Select>
            </div>
          )}

          {/* Nếu là thông báo uống thuốc thì nhập thêm thông tin thuốc */}
          {notificationType === 'medicine' && (
            <div className="space-y-4">
              {/* Thông tin cơ bản về thuốc */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tên thuốc <span className="text-red-500">*</span>:</label>
                  <Input
                    placeholder="Tên thuốc"
                    value={medicineName}
                    onChange={e => setMedicineName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Liều lượng:</label>
                  <Input
                    placeholder="Liều lượng (tùy chọn)"
                    value={dosage}
                    onChange={e => setDosage(e.target.value)}
                  />
                </div>
              </div>

              {/* Chọn loại lặp lại */}
              <div>
                <label className="block text-sm font-medium mb-2">Loại lịch nhắc:</label>
                <Select
                  value={repeatType}
                  onChange={setRepeatType}
                  className="w-full"
                >
                  <Option value="none">Chỉ một lần</Option>
                  <Option value="daily">Hàng ngày</Option>
                  <Option value="weekly">Hàng tuần</Option>
                  <Option value="custom">Tùy chọn ngày trong tuần</Option>
                </Select>
              </div>

              {/* Thời gian nhắc */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Thời gian nhắc <span className="text-red-500">*</span>:
                </label>
                <div className="space-y-2">
                  {reminderTimes.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={time}
                        onChange={e => updateReminderTime(index, e.target.value)}
                        className="flex-1"
                      />
                      {reminderTimes.length > 1 && (
                        <Button
                          type="danger"
                          size="small"
                          onClick={() => removeReminderTime(index)}
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={addReminderTime}
                    className="w-full"
                  >
                    + Thêm giờ nhắc
                  </Button>
                </div>
              </div>

              {/* Chọn ngày trong tuần (chỉ hiển thị khi chọn custom) */}
              {repeatType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Chọn ngày trong tuần <span className="text-red-500">*</span>:
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
                      <Button
                        key={index}
                        type={repeatDays.includes(index) ? 'primary' : 'default'}
                        size="small"
                        onClick={() => handleRepeatDaysChange(index)}
                        className="text-center"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ngày kết thúc (chỉ hiển thị khi không phải "chỉ một lần") */}
              {repeatType !== 'none' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ngày kết thúc lặp lại <span className="text-red-500">*</span>:
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}
            </div>
          )}

          {/* Nút tạo thông báo */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateNotification}
            loading={loading}
            disabled={
              !selectedPatient ||
              !messageText.trim() ||
              (notificationType === 'medicine' && (
                !medicineName.trim() || 
                !selectedTreatmentStage ||
                reminderTimes.some(time => time === '') ||
                (repeatType !== 'none' && !endDate) ||
                (repeatType === 'custom' && repeatDays.length === 0)
              )) ||
              (notificationType === 'appointment' && !selectedAppointment)
            }
          >
            Tạo thông báo
          </Button>
        </div>
      </Card>

      {/* Danh sách thông báo đã tạo */}
      <Card 
        title="Danh sách thông báo đã tạo"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchNotifications}
            loading={loading}
            disabled={patients.length === 0}
          >
            Làm mới
          </Button>
        }
      >
        <List
          loading={loading}
          dataSource={notifications}
          locale={{ emptyText: 'Chưa có thông báo nào' }}
          renderItem={(notification, idx) => (
            <List.Item
              key={notification.notificationId || notification.id || idx}
            >
              <List.Item.Meta
                avatar={<BellOutlined className="text-blue-500" />}
                title={
                  <div className="flex justify-between items-center">
                    <span>{notification.patientName || `Bệnh nhân ID: ${notification.patientId}`}</span>
                    <span className="text-sm text-gray-500">
                      {notification.createdAt ? new Date(notification.createdAt).toLocaleString('vi-VN') : ''}
                    </span>
                  </div>
                }
                description={
                  <div>
                    <p className="mb-1">{notification.message}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>
                        Trạng thái: {notification.isSeen ? 
                          <span className="text-green-600">Đã xem</span> : 
                          <span className="text-orange-600">Chưa xem</span>
                        }
                      </span>
                      {notification.seenAt && (
                        <span>
                          Xem lúc: {new Date(notification.seenAt).toLocaleString('vi-VN')}
                        </span>
                      )}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default StaffNotificationManager;
