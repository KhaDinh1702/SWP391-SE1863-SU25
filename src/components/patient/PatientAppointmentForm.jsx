import React, { useEffect, useState } from "react";
import axios from "axios";
import { doctorService } from "../../services/doctorService";
import { appointmentService } from "../../services/appointmentService";
import { CalendarOutlined, UserOutlined, VideoCameraOutlined, EnvironmentOutlined, FileTextOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { FaClock } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, getAuthHeaders } from "../../services/config";

const PatientAppointmentForm = ({ patientId }) => {
  // Helper function để tạo datetime với timezone Việt Nam
  const createAppointmentDateTime = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split('-');
    const [hours, minutes] = timeStr.split(':');
    
    // Tạo datetime object với local timezone (Việt Nam)
    const localDateTime = new Date(
      parseInt(year),
      parseInt(month) - 1, // JavaScript months are 0-indexed
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      0, // seconds
      0  // milliseconds
    );
    
    return localDateTime;
  };

  // Helper function để lấy ngày hiện tại theo định dạng YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Tạo danh sách time slots từ 8:00 đến 16:00, mỗi slot cách nhau 2 tiếng
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 16;
    
    // Tạo các khung giờ cách nhau 2 tiếng: 8:00, 10:00, 12:00, 14:00, 16:00
    for (let hour = startHour; hour <= endHour; hour += 2) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const displayTime = `${hour.toString().padStart(2, '0')}:00`;
      
      slots.push({
        value: timeString,
        label: displayTime,
        display: hour < 12 ? `${displayTime} SA` : `${displayTime} CH`
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Validation functions
  const isTimeSlotAvailable = (selectedDate, selectedTime) => {
    const selectedDateTime = createAppointmentDateTime(selectedDate, selectedTime);
    const now = new Date();
    
    // Kiểm tra không được đặt lịch sát giờ hiện tại (tối thiểu 1 giờ trước)
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    if (selectedDateTime < oneHourFromNow) {
      return {
        isValid: false,
        message: "Bạn phải đặt lịch hẹn trước ít nhất 1 giờ so với thời gian hiện tại."
      };
    }

    // Kiểm tra các cuộc hẹn đã có
    for (const appointment of existingAppointments) {
      // Chỉ kiểm tra các cuộc hẹn đang hoạt động (chưa bị hủy)
      if (appointment.status === 2) continue; // 2 = Cancelled
      
      const existingDateTime = new Date(appointment.appointmentStartDate);
      
      // Kiểm tra bằng timestamp để chắc chắn
      const selectedTimestamp = selectedDateTime.getTime();
      const existingTimestamp = existingDateTime.getTime();
      const timeDiffMinutes = Math.abs(selectedTimestamp - existingTimestamp) / (1000 * 60);
      
      // Nếu thời gian chênh lệch ít hơn 30 phút thì coi như cùng khung giờ
      if (timeDiffMinutes < 30) {
        return {
          isValid: false,
          message: `Khung giờ ${selectedTime} ngày ${new Date(selectedDate).toLocaleDateString('vi-VN')} đã được đặt lịch. Vui lòng chọn khung giờ khác.`
        };
      }
      
      // Kiểm tra khoảng cách 2 tiếng với các cuộc hẹn khác
      const timeDifference = Math.abs(selectedDateTime - existingDateTime);
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      
      if (hoursDifference < 2 && hoursDifference > 0) {
        const existingTimeStr = existingDateTime.toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        return {
          isValid: false,
          message: `Bạn đã có lịch hẹn vào ${existingTimeStr}. Các lịch hẹn phải cách nhau ít nhất 2 tiếng.`
        };
      }
    }

    return { isValid: true };
  };

  // Filter available time slots based on validation
  const getAvailableTimeSlots = () => {
    if (!formData.appointmentDate) return timeSlots;
    
    return timeSlots.map(slot => {
      const validation = isTimeSlotAvailable(formData.appointmentDate, slot.value);
      
      return {
        ...slot,
        isDisabled: !validation.isValid,
        disabledReason: validation.message
      };
    });
  };

  // Filter doctors based on appointment type
  const getFilteredDoctors = () => {
    if (formData.appointmentType === null || formData.appointmentType === undefined) {
      return doctors;
    }

    const specializationMap = {
      0: "Xét nghiệm",     // Testing
      1: "Điều trị",       // Treatment
      2: "Tư vấn"          // Consultation
    };

    const targetSpecialization = specializationMap[formData.appointmentType];
    
    if (!targetSpecialization) {
      return doctors;
    }

    return doctors.filter(doctor => 
      doctor.specialization && 
      doctor.specialization.toLowerCase().includes(targetSpecialization.toLowerCase())
    );
  };

  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    appointmentType: null, // Start with no appointment type selected
    meetingFormat: 1, // 0 = online, 1 = offline (default to offline)
    isAnonymousAppointment: false,
  });

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [payUrl, setPayUrl] = useState(null);
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const navigate = useNavigate();

  // Add validation for patientId
  useEffect(() => {
    if (!patientId) {
      console.error('Patient ID is missing');
      alert('Không tìm thấy thông tin bệnh nhân. Vui lòng đăng nhập lại.');
      return;
    }
    
    // Fetch existing appointments for validation
    const fetchExistingAppointments = async () => {
      setLoadingAppointments(true);
      try {
        // Use get-paid-appointments endpoint and filter by patientId
        const allAppointments = await appointmentService.getAllAppointments();
        
        // Filter appointments for this patient
        const patientAppointments = allAppointments.filter(app => app.patientId === patientId);
        
        setExistingAppointments(patientAppointments || []);
      } catch (error) {
        console.error("Error fetching existing appointments:", error);
        // Set empty array if method fails
        setExistingAppointments([]);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchExistingAppointments();
  }, [patientId]);

  // Function to refresh appointments data
  const refreshAppointments = async () => {
    if (!patientId) return;
    
    setLoadingAppointments(true);
    try {
      // Use get-paid-appointments endpoint and filter by patientId
      const allAppointments = await appointmentService.getAllAppointments();
      
      // Filter appointments for this patient
      const patientAppointments = allAppointments.filter(app => app.patientId === patientId);
      
      setExistingAppointments(patientAppointments || []);
    } catch (error) {
      console.error("Error refreshing appointments:", error);
      // Set empty array if method fails
      setExistingAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Fetch danh sách bác sĩ từ API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsList = await doctorService.getAllDoctors();
        setDoctors(doctorsList);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bác sĩ:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Kiểm tra nếu đang chọn ngày
    if (name === 'appointmentDate') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset giờ về 00:00:00
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        alert("Không thể chọn ngày trong quá khứ. Vui lòng chọn ngày từ hôm nay trở đi.");
        return; // Không cập nhật state nếu ngày không hợp lệ
      }
      
      // Reset thời gian khi thay đổi ngày để buộc người dùng chọn lại
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        appointmentTime: "", // Reset time selection
      }));
      
      // Refresh appointments data để có thông tin mới nhất
      refreshAppointments();
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm riêng để xử lý chọn time slot
  const handleTimeSlotSelect = (timeValue) => {
    if (!formData.appointmentDate) {
      alert("Vui lòng chọn ngày trước khi chọn giờ.");
      return;
    }

    const validation = isTimeSlotAvailable(formData.appointmentDate, timeValue);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      appointmentTime: timeValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!patientId) {
      alert('Không tìm thấy thông tin bệnh nhân. Vui lòng đăng nhập lại.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vui lòng đăng nhập để đặt lịch hẹn");
      return;
    }

    // Tạo datetime sử dụng helper function
    const appointmentDateTime = createAppointmentDateTime(formData.appointmentDate, formData.appointmentTime);
    
    // Validation cuối cùng trước khi gửi
    const finalValidation = isTimeSlotAvailable(formData.appointmentDate, formData.appointmentTime);
    if (!finalValidation.isValid) {
      alert(finalValidation.message);
      setLoading(false);
      return;
    }
    
    // Kiểm tra ngày không được trong quá khứ (so sánh từ đầu ngày)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset giờ về 00:00:00
    const selectedDate = new Date(appointmentDateTime);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert("Không thể đặt lịch hẹn cho ngày trong quá khứ");
      setLoading(false);
      return;
    }
    
    console.log('Selected date and time:', formData.appointmentDate, formData.appointmentTime);
    console.log('Appointment DateTime (local):', appointmentDateTime);
    console.log('Meeting Format:', formData.meetingFormat); // Debug meeting format
    console.log('Appointment Type:', formData.appointmentType); // Debug appointment type
    
    // Tính toán appointmentEndDate - mỗi cuộc hẹn kéo dài 1 tiếng 30 phút
    const endDateTime = new Date(appointmentDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 90); // Thêm 90 phút (1 tiếng 30)
    
    const appointmentEndDate = `${endDateTime.getFullYear()}-${String(endDateTime.getMonth() + 1).padStart(2, '0')}-${String(endDateTime.getDate()).padStart(2, '0')}T${String(endDateTime.getHours()).padStart(2, '0')}:${String(endDateTime.getMinutes()).padStart(2, '0')}:00`;
    
    console.log('Appointment Start DateTime:', `${formData.appointmentDate}T${formData.appointmentTime}:00`);
    console.log('Appointment End DateTime:', appointmentEndDate);
    
    // Determine appointment title based on type
    const getAppointmentTitle = (type) => {
      switch(type) {
        case 0: return "Xét nghiệm";
        case 1: return "Điều trị";
        case 2: return "Tư vấn";
        default: return "Khám bệnh";
      }
    };
    
    const requestPayload = {
      patientId: patientId,
      doctorId: formData.doctorId || null,
      appointmentStartDate: `${formData.appointmentDate}T${formData.appointmentTime}:00`, // Gửi format YYYY-MM-DDTHH:MM:SS without timezone
      appointmentEndDate: appointmentEndDate, // Thêm appointmentEndDate
      appointmentType: parseInt(formData.meetingFormat), // 0 = Online, 1 = Offline (backend expects this)
      notes: formData.reason,
      isAnonymousAppointment: formData.isAnonymousAppointment,
      apointmentTitle: getAppointmentTitle(parseInt(formData.appointmentType)), // Backend expects "ApointmentTitle"
      status: 0,
      onlineLink: formData.meetingFormat === 0 ? "TBD" : null, // Set placeholder for online meetings
      paymentMethod: 'momo',
    };
    
    console.log('Request payload:', requestPayload);
    console.log('Backend AppointmentType (0=Online, 1=Offline):', requestPayload.appointmentType);
    console.log('Frontend Service Type (0=Test, 1=Treatment, 2=Consultation):', parseInt(formData.appointmentType));
    console.log('Frontend Meeting Format (0=Online, 1=Offline):', parseInt(formData.meetingFormat));
    try {
      const res = await appointmentService.createAppointmentWithMomo(requestPayload);
      // Lấy link từ cả PaymentRedirectUrl (chữ hoa) và paymentRedirectUrl (chữ thường)
      const momoUrl = res?.PaymentRedirectUrl || res?.paymentRedirectUrl;
      if (momoUrl && typeof momoUrl === "string" && momoUrl.startsWith("http")) {
        window.location.href = `/momo-payment?payUrl=${encodeURIComponent(momoUrl)}`;
        return;
      }
      alert("Không thể tạo liên kết thanh toán MoMo. Vui lòng kiểm tra lại thông tin đặt lịch hoặc thử lại sau. Nếu sự cố tiếp tục, hãy liên hệ bộ phận hỗ trợ.");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message || "Không thể đặt lịch"));
    } finally {
      setLoading(false);
    }
  };

  // Debug meetingFormat changes
  useEffect(() => {
    console.log('📊 MeetingFormat changed to:', formData.meetingFormat);
    console.log('📊 Current formData:', formData);
  }, [formData.meetingFormat]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#3B9AB8] px-6 py-8">
            <h2 className="text-3xl font-bold text-white text-center">
              Đặt lịch hẹn khám bệnh
            </h2>
            <p className="mt-2 text-blue-100 text-center">
              Vui lòng điền đầy đủ thông tin bên dưới
            </p>
          </div>

          {/* Success message */}
          {success ? (
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <div className="text-3xl text-[#3B9AB8] font-bold mb-4">Đặt lịch thành công!</div>
              <div className="text-lg text-gray-700 mb-6">Cảm ơn bạn đã đặt lịch hẹn. Chuyển đến trang thanh toán MoMo:</div>
              {payUrl ? (
                <a
                  href={payUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-[#A50064] text-white rounded-full font-semibold shadow-lg hover:bg-[#82004b] transition-all text-lg"
                >
                  Thanh toán MoMo
                </a>
              ) : (
                <span className="text-red-500">Không tìm thấy link thanh toán MoMo. Vui lòng thử lại hoặc liên hệ hỗ trợ.</span>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <EyeInvisibleOutlined className="text-xl text-[#3B9AB8]" />
                  <div>
                    <h3 className="font-medium text-gray-900">Đặt lịch ẩn danh</h3>
                    <p className="text-sm text-gray-500">Thông tin của bạn sẽ được bảo mật</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="isAnonymousAppointment"
                  checked={formData.isAnonymousAppointment}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      isAnonymousAppointment: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 accent-[#3B9AB8]"
                />
              </div>

              {/* Appointment Type */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <VideoCameraOutlined className="mr-2 text-[#3B9AB8]" />
                  Loại cuộc hẹn
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      appointmentType: 0,
                      doctorId: "", // Reset doctor selection when appointment type changes
                      meetingFormat: 1 // Force offline for testing
                    }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.appointmentType === 0
                        ? 'border-[#3B9AB8] bg-blue-50 text-[#3B9AB8]'
                        : 'border-gray-200 hover:border-[#3B9AB8]'
                    }`}
                  >
                    <div className="text-2xl mb-2">🧪</div>
                    <div className="font-medium">Xét nghiệm</div>
                    <div className="text-sm text-gray-500">Làm các xét nghiệm cần thiết</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('💊 User clicked Treatment button');
                      console.log('Previous appointmentType:', formData.appointmentType);
                      console.log('Previous meetingFormat:', formData.meetingFormat);
                      setFormData(prev => ({ 
                        ...prev, 
                        appointmentType: 1,
                        doctorId: "", // Reset doctor selection when appointment type changes
                        // Only set meetingFormat to default if user is switching from testing (0)
                        meetingFormat: prev.appointmentType === 0 ? 1 : prev.meetingFormat
                      }));
                      console.log('Set appointmentType to 1 (Treatment)');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.appointmentType === 1
                        ? 'border-[#3B9AB8] bg-blue-50 text-[#3B9AB8]'
                        : 'border-gray-200 hover:border-[#3B9AB8]'
                    }`}
                  >
                    <div className="text-2xl mb-2">💊</div>
                    <div className="font-medium">Điều trị</div>
                    <div className="text-sm text-gray-500">Điều trị và chăm sóc</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('💬 User clicked Consultation button');
                      console.log('Previous appointmentType:', formData.appointmentType);
                      console.log('Previous meetingFormat:', formData.meetingFormat);
                      setFormData(prev => ({ 
                        ...prev, 
                        appointmentType: 2,
                        doctorId: "", // Reset doctor selection when appointment type changes
                        // Only set meetingFormat to default if user is switching from testing (0)
                        meetingFormat: prev.appointmentType === 0 ? 1 : prev.meetingFormat
                      }));
                      console.log('Set appointmentType to 2 (Consultation)');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.appointmentType === 2
                        ? 'border-[#3B9AB8] bg-blue-50 text-[#3B9AB8]'
                        : 'border-gray-200 hover:border-[#3B9AB8]'
                    }`}
                  >
                    <div className="text-2xl mb-2">💬</div>
                    <div className="font-medium">Tư vấn</div>
                    <div className="text-sm text-gray-500">Tư vấn và hướng dẫn</div>
                  </button>
                </div>
              </div>

              {/* Meeting Format - Only show if appointment type is selected and not testing */}
              {formData.appointmentType !== null && formData.appointmentType !== undefined && (
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <EnvironmentOutlined className="mr-2 text-[#3B9AB8]" />
                    Hình thức cuộc hẹn
                  </label>
                  {formData.appointmentType === 0 ? (
                    // For testing - only offline allowed
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <EnvironmentOutlined className="text-xl text-[#3B9AB8]" />
                        <div>
                          <div className="font-medium text-gray-900">Tại phòng khám</div>
                          <div className="text-sm text-gray-600">Xét nghiệm chỉ có thể thực hiện trực tiếp tại phòng khám</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // For treatment and consultation - both options available
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          console.log('🖥️ User clicked Online button');
                          console.log('Previous meetingFormat:', formData.meetingFormat);
                          setFormData(prev => ({ ...prev, meetingFormat: 0 }));
                          console.log('Setting meeting format to Online (0)');
                        }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.meetingFormat === 0
                            ? 'border-[#3B9AB8] bg-blue-50 text-[#3B9AB8]'
                            : 'border-gray-200 hover:border-[#3B9AB8]'
                        }`}
                      >
                        <VideoCameraOutlined className="text-xl mb-2 text-[#3B9AB8]" />
                        <div className="font-medium">Trực tuyến</div>
                        <div className="text-sm text-gray-500">Khám qua video call</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          console.log('🏥 User clicked Offline button');
                          console.log('Previous meetingFormat:', formData.meetingFormat);
                          setFormData(prev => ({ ...prev, meetingFormat: 1 }));
                          console.log('Setting meeting format to Offline (1)');
                        }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.meetingFormat === 1
                            ? 'border-[#3B9AB8] bg-blue-50 text-[#3B9AB8]'
                            : 'border-gray-200 hover:border-[#3B9AB8]'
                        }`}
                      >
                        <EnvironmentOutlined className="text-xl mb-2 text-[#3B9AB8]" />
                        <div className="font-medium">Tại phòng khám</div>
                        <div className="text-sm text-gray-500">Khám trực tiếp</div>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Doctor Selection */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <UserOutlined className="mr-2 text-[#3B9AB8]" />
                  Chọn bác sĩ
                </label>
                {formData.appointmentType !== null && formData.appointmentType !== undefined ? (
                  <>
                    <select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors"
                      required
                    >
                      <option value="">-- Chọn bác sĩ chuyên khoa phù hợp --</option>
                      {getFilteredDoctors().map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.fullName} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                    {getFilteredDoctors().length === 0 && (
                      <p className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
                        ⚠️ Hiện tại không có bác sĩ nào chuyên về {
                          formData.appointmentType === 0 ? 'Xét nghiệm' :
                          formData.appointmentType === 1 ? 'Điều trị' : 'Tư vấn'
                        }. Vui lòng chọn loại cuộc hẹn khác hoặc liên hệ trực tiếp với phòng khám.
                      </p>
                    )}
                    {getFilteredDoctors().length > 0 && (
                      <p className="text-sm text-green-600 bg-green-50 p-2 rounded-md">
                        ✓ Tìm thấy {getFilteredDoctors().length} bác sĩ chuyên về {
                          formData.appointmentType === 0 ? 'Xét nghiệm' :
                          formData.appointmentType === 1 ? 'Điều trị' : 'Tư vấn'
                        }
                      </p>
                    )}
                  </>
                ) : (
                  <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500">
                    Vui lòng chọn loại cuộc hẹn trước để xem danh sách bác sĩ phù hợp
                  </div>
                )}
              </div>

              {/* Appointment Date */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <CalendarOutlined className="mr-2 text-[#3B9AB8]" />
                  Chọn ngày
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  min={getTodayDate()}
                  max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Giới hạn 1 năm trong tương lai
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors"
                  required
                />
                <p className="text-sm text-gray-500">
                  ⚠️ Chỉ có thể đặt lịch từ ngày hôm nay ({new Date().toLocaleDateString('vi-VN')}) trở đi
                </p>
              </div>
              {/* Appointment Time */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-gray-700 font-medium">
                    <FaClock className="mr-2 text-[#3B9AB8]" />
                    Chọn giờ khám
                  </label>
                  <button
                    type="button"
                    onClick={refreshAppointments}
                    disabled={loadingAppointments}
                    className="text-sm text-[#3B9AB8] hover:text-[#2d7a94] disabled:opacity-50"
                  >
                    🔄 Làm mới
                  </button>
                </div>
                {loadingAppointments && (
                  <div className="text-sm text-gray-500 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3B9AB8] mr-2"></div>
                    Đang kiểm tra lịch hẹn hiện có...
                  </div>
                )}
                <div className="grid grid-cols-5 gap-3">
                  {getAvailableTimeSlots().map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => handleTimeSlotSelect(slot.value)}
                      disabled={slot.isDisabled || loadingAppointments}
                      title={slot.isDisabled ? slot.disabledReason : ''}
                      className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                        slot.isDisabled || loadingAppointments
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : formData.appointmentTime === slot.value
                          ? 'border-[#3B9AB8] bg-[#3B9AB8] text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-[#3B9AB8] hover:bg-blue-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-lg">{slot.label}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {slot.value < '12:00' ? 'Sáng' : 'Chiều'}
                        </div>
                        {slot.isDisabled && (
                          <div className="text-xs text-red-500 mt-1">
                            Không khả dụng
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="space-y-1 text-sm text-gray-500">
                  <p>🕐 Giờ làm việc: 8:00 sáng - 5:00 chiều</p>
                  <p>⏰ Phải đặt trước ít nhất 1 giờ</p>
                  <p>📅 Các khung giờ cách nhau 2 tiếng: 8:00, 10:00, 12:00, 14:00, 16:00</p>
                </div>
                {formData.appointmentTime && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                      ✓ Đã chọn: <span className="font-semibold">{formData.appointmentTime}</span>
                      {formData.appointmentTime < '12:00' ? ' (Buổi sáng)' : ' (Buổi chiều)'}
                    </p>
                  </div>
                )}
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <FileTextOutlined className="mr-2 text-[#3B9AB8]" />
                  Lý do khám
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors min-h-[120px]"
                  placeholder="Mô tả triệu chứng hoặc lý do khám của bạn..."
                  required
                />
              </div>

              {/* Payment Method - MoMo only */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  Phương thức thanh toán
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="momo"
                      checked={true}
                      readOnly
                      className="mr-2"
                    />
                    MoMo
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-lg text-white font-medium text-lg transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#3B9AB8] hover:bg-[#2d7a94] transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  'Đặt lịch hẹn'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAppointmentForm;