import React, { useState, useEffect } from 'react';
import { Card, Input, Button, List, message, Select, Spin, Modal } from 'antd';
import { BellOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
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
  const [searchText, setSearchText] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [notificationType, setNotificationType] = useState('appointment');
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [treatmentStages, setTreatmentStages] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedTreatmentStage, setSelectedTreatmentStage] = useState(null);

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

  useEffect(() => {
    if (searchText) {
      const filtered = patients.filter(patient =>
        patient.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        patient.phoneNumber?.includes(searchText)
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchText, patients]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAllPatients();
      setPatients(data);
      setFilteredPatients(data);
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
      if (!medicineName.trim() || !reminderTime) {
        message.error('Vui lòng nhập tên thuốc và thời gian nhắc uống');
        return;
      }
      if (!selectedTreatmentStage) {
        message.error('Vui lòng chọn giai đoạn điều trị');
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
        finalMessage += ` - Thời gian: ${new Date(reminderTime).toLocaleString('vi-VN')}`;
      } else if (notificationType === 'appointment') {
        finalMessage = `Thông báo lịch hẹn: ${messageText}`;
      }
      
      // Gọi API create notification với format backend yêu cầu
      const notificationData = {
        patientId: selectedPatient,
        message: finalMessage,
        treatmentStageId: selectedTreatmentStage,
        appointmentId: selectedAppointment
        // Không gửi createdAt, để backend tự tạo với thời gian server
      };
      
      await notificationService.createNotification(notificationData);
      
      message.success('Tạo thông báo thành công');
      
      // Reset form
      setMessageText('');
      setSelectedPatient(null);
      setMedicineName('');
      setDosage('');
      setReminderTime('');
      setNotificationType('appointment');
      setSelectedAppointment(null);
      setSelectedTreatmentStage(null);
      
      // Tải lại notifications
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      message.error('Không thể tạo thông báo. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    // Backend không có endpoint delete notification
    message.warning('Tính năng xóa thông báo chưa được hỗ trợ bởi backend');
    
    // Tạm thời ẩn notification trong frontend
    Modal.confirm({
      title: 'Xác nhận ẩn thông báo',
      content: 'Backend chưa hỗ trợ xóa thông báo. Bạn có muốn ẩn thông báo này khỏi danh sách không?',
      onOk: () => {
        setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
        message.info('Đã ẩn thông báo khỏi danh sách');
      },
    });
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
              Có 2 loại thông báo:
            </p>
            <ul className="text-sm mt-2 ml-4 list-disc">
              <li><strong>Thông báo lịch hẹn:</strong> Chọn lịch hẹn đã thanh toán + giai đoạn điều trị (tùy chọn)</li>
              <li><strong>Thông báo uống thuốc:</strong> Chỉ chọn giai đoạn điều trị + thông tin thuốc</li>
            </ul>
            <p className="text-sm mt-2">
              <strong>Trạng thái Backend:</strong> ✅ Tạo thông báo, ✅ Xem danh sách, ✅ Đánh dấu đã đọc, ❌ Xóa thông báo (chưa hỗ trợ)
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
          {/* Tìm kiếm bệnh nhân */}
          <div>
            <label className="block text-sm font-medium mb-2">Tìm kiếm bệnh nhân:</label>
            <Input
              placeholder="Tìm theo tên, email hoặc số điện thoại"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="mb-2"
            />
          </div>

          {/* Chọn bệnh nhân */}
          <div>
            <label className="block text-sm font-medium mb-2">Chọn bệnh nhân:</label>
            <Select
              placeholder="Chọn bệnh nhân để gửi thông báo"
              value={selectedPatient || undefined}
              onChange={setSelectedPatient}
              className="w-full"
              showSearch
              filterOption={false}
              notFoundContent={loading ? <Spin size="small" /> : 'Không tìm thấy bệnh nhân'}
            >
              {filteredPatients.map(patient => {
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
              }}
              className="w-full"
            >
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
                      {appointmentTitle} - {appointmentDate ? new Date(appointmentDate).toLocaleDateString('vi-VN') : 'Không có ngày'}
                    </Option>
                  );
                })}
              </Select>
            </div>
          )}

          {/* Chọn Treatment Stage (hiển thị cho cả hai loại thông báo) */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div>
                <label className="block text-sm font-medium mb-2">Thời gian nhắc uống <span className="text-red-500">*</span>:</label>
                <Input
                  type="datetime-local"
                  value={reminderTime}
                  onChange={e => setReminderTime(e.target.value)}
                />
              </div>
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
              (notificationType === 'medicine' && (!medicineName.trim() || !reminderTime || !selectedTreatmentStage)) ||
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
              actions={[
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteNotification(notification.notificationId)}
                  title="Ẩn thông báo (Backend chưa hỗ trợ xóa)"
                >
                  Ẩn
                </Button>
              ]}
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
