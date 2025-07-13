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
  // State cho thời gian nhắc uống thuốc (chỉ một lần)
  const [reminderTimes, setReminderTimes] = useState(['']);

  useEffect(() => {
    fetchPatients();
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

  const fetchAppointments = async (patientId = null) => {
    try {
      if (!patientId) {
        setAppointments([]);
        return;
      }
      
      const response = await fetch(`https://localhost:7040/api/Appointment/get-paid-appointments`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const allAppointments = await response.json();
        // Lọc appointments theo patientId đã chọn
        const patientAppointments = allAppointments.filter(appointment => 
          appointment.patientId === patientId
        );
        setAppointments(patientAppointments || []);
      } else {
        console.warn('Could not fetch appointments:', response.status);
        setAppointments([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải appointments:', error);
      setAppointments([]);
    }
  };

  const fetchTreatmentStages = async (patientId = null) => {
    try {
      if (!patientId) {
        setTreatmentStages([]);
        return;
      }
      
      setLoading(true);
      
      // Thử lấy PatientTreatmentProtocol và filter treatment stages
      try {
        // Thử endpoint get-list-patient-treatment-protocol
        const protocolResponse = await fetch(`https://localhost:7040/api/PatientTreatmentProtocol/get-list-patient-treatment-protocol`, {
          headers: getAuthHeaders()
        });
        
        if (protocolResponse.ok) {
          const allProtocols = await protocolResponse.json();
          // Filter protocols theo patientId
          const patientProtocols = allProtocols.filter(p => 
            p.patientId === patientId || p.PatientId === patientId
          );
          
          if (patientProtocols && patientProtocols.length > 0) {
            // Lấy treatment stages dựa trên protocol IDs
            const allStagesResponse = await fetch(`https://localhost:7040/api/TreatmentStage/get-list-treatment-stage`, {
              headers: getAuthHeaders()
            });
            
            if (allStagesResponse.ok) {
              const allStages = await allStagesResponse.json();
              const protocolIds = patientProtocols.map(p => p.id || p.protocolId || p.patientTreatmentProtocolId);
              
              const patientStages = allStages.filter(stage =>
                protocolIds.includes(stage.patientTreatmentProtocolId)
              );
              
              setTreatmentStages(patientStages || []);
              return;
            }
          }
        }
      } catch (e) {
        console.log('Could not fetch patient treatment protocols');
      }
      
      // Nếu không tìm được protocol hoặc stages, hiển thị mảng rỗng
      // (bệnh nhân chưa có giai đoạn điều trị)
      setTreatmentStages([]);
      
    } catch (error) {
      console.error('Lỗi khi tải treatment stages:', error);
      setTreatmentStages([]);
    } finally {
      setLoading(false);
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
      if (reminderTimes[0] === '') {
        message.error('Vui lòng chọn thời gian nhắc uống');
        return;
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
        // Xác định thời gian nhắc uống thuốc (giờ:phút hôm nay hoặc ngày mai nếu đã qua)
        const [hour, minute] = reminderTimes[0].split(':');
        const now = new Date();
        let scheduledDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hour), parseInt(minute), 0, 0);
        if (scheduledDate <= now) {
          // Nếu thời gian đã qua, đặt cho ngày mai
          scheduledDate.setDate(scheduledDate.getDate() + 1);
        }
        finalMessage += ` - Thời gian: ${scheduledDate.toLocaleString('vi-VN')}`;
        const notificationData = {
          patientId: selectedPatient,
          message: finalMessage,
          treatmentStageId: selectedTreatmentStage,
          appointmentId: null,
          scheduledTime: scheduledDate.toISOString()
        };
        await notificationService.createNotification(notificationData);
      } else if (notificationType === 'appointment') {
        finalMessage = `Thông báo lịch hẹn: ${messageText}`;
        
        // Tạo thông báo cho appointment
        const notificationData = {
          patientId: selectedPatient,
          message: finalMessage,
          treatmentStageId: selectedTreatmentStage || null,
          appointmentId: selectedAppointment
        };
        
        await notificationService.createNotification(notificationData);
      } else if (notificationType === 'general') {
        finalMessage = `Thông báo chung: ${messageText}`;
        
        // Tạo thông báo cho general
        const notificationData = {
          patientId: selectedPatient,
          message: finalMessage,
          treatmentStageId: selectedTreatmentStage || null,
          appointmentId: selectedAppointment || null
        };
        
        await notificationService.createNotification(notificationData);
      }
      
      message.success('Tạo thông báo thành công');
      // Reset form
      setMessageText('');
      setSelectedPatient(null);
      setMedicineName('');
      setDosage('');
      setReminderTime('');
      setNotificationType('general');
      setSelectedAppointment(null);
      setSelectedTreatmentStage(null);
      setReminderTimes(['']);
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
  // Đã loại bỏ hàm tạo thông báo lặp lại vì chỉ hỗ trợ "một lần"

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
  // Đã loại bỏ hàm xử lý ngày lặp lại vì chỉ hỗ trợ "một lần"

  return (
    <div className="p-6">

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
              onChange={(value) => {
                setSelectedPatient(value);
                // Reset appointment và treatment stage khi đổi bệnh nhân
                setSelectedAppointment(null);
                setSelectedTreatmentStage(null);
                
                // Clear ngay lập tức để tránh hiển thị dữ liệu cũ
                setAppointments([]);
                setTreatmentStages([]);
                
                // Fetch dữ liệu của bệnh nhân mới
                if (value) {
                  // Luôn fetch treatment stages cho bệnh nhân được chọn
                  fetchTreatmentStages(value);
                  // Chỉ fetch appointments khi đang ở loại appointment
                  if (notificationType === 'appointment') {
                    fetchAppointments(value);
                  }
                }
              }}
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
                // Reset giờ nhắc
                setReminderTimes(['']);
                
                // Fetch dữ liệu theo loại thông báo và patient đã chọn
                if (selectedPatient) {
                  if (value === 'appointment') {
                    fetchAppointments(selectedPatient);
                    fetchTreatmentStages(selectedPatient);
                  } else if (value === 'medicine') {
                    fetchTreatmentStages(selectedPatient);
                    setAppointments([]);
                  } else {
                    setAppointments([]);
                    setTreatmentStages([]);
                  }
                } else {
                  setAppointments([]);
                  setTreatmentStages([]);
                }
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
                Chọn lịch hẹn <span className="text-red-500">*</span>: 
                {!selectedPatient ? 
                  '(Vui lòng chọn bệnh nhân trước)' : 
                  appointments.length > 0 ? `(${appointments.length} lịch hẹn)` : '(Không có lịch hẹn nào)'
                }
              </label>
              <Select
                placeholder={!selectedPatient ? "Vui lòng chọn bệnh nhân trước" : "Chọn lịch hẹn đã thanh toán"}
                value={selectedAppointment || undefined}
                onChange={setSelectedAppointment}
                className="w-full"
                loading={loading}
                disabled={!selectedPatient}
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
                Chọn giai đoạn điều trị {notificationType === 'medicine' ? <span className="text-red-500">*</span> : '(tùy chọn)'}: 
                {!selectedPatient ? 
                  '(Vui lòng chọn bệnh nhân trước)' : 
                  treatmentStages.length > 0 ? `(${treatmentStages.length} giai đoạn)` : '(Bệnh nhân chưa có giai đoạn điều trị)'
                }
              </label>
              {!selectedPatient && (
                <p className="text-xs text-gray-500 mb-2">
                   Chọn bệnh nhân trước để xem giai đoạn điều trị của họ
                </p>
              )}
              {selectedPatient && treatmentStages.length === 0 && (
                <p className="text-xs text-orange-600 mb-2">
                   Bệnh nhân này chưa có giai đoạn điều trị. Vui lòng tạo giai đoạn điều trị cho bệnh nhân trước.
                </p>
              )}
              <Select
                placeholder={!selectedPatient ? "Vui lòng chọn bệnh nhân trước" : notificationType === 'medicine' ? "Chọn giai đoạn điều trị" : "Chọn giai đoạn điều trị liên quan (không bắt buộc)"}
                value={selectedTreatmentStage || undefined}
                onChange={setSelectedTreatmentStage}
                className="w-full"
                allowClear={notificationType === 'appointment'}
                loading={loading}
                disabled={!selectedPatient}
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
              {/* Đã loại bỏ chọn ngày trong tuần */}

              {/* Ngày kết thúc (chỉ hiển thị khi không phải "chỉ một lần") */}
              {/* Đã loại bỏ chọn ngày kết thúc lặp lại */}
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
                reminderTimes.some(time => time === '')
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
