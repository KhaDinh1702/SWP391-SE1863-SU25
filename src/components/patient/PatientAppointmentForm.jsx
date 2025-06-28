import React, { useEffect, useState } from "react";
import axios from "axios";
import { doctorService } from "../../services/doctorService";
import { appointmentService } from "../../services/appointmentService";
import { CalendarOutlined, UserOutlined, VideoCameraOutlined, EnvironmentOutlined, FileTextOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { FaClock } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, getAuthHeaders } from "../../services/config";

const PatientAppointmentForm = ({ patientId }) => {
  // Add debug log
  console.log('PatientAppointmentForm - patientId:', patientId);

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

  // Tạo danh sách time slots từ 8:00 đến 16:30, mỗi slot cách nhau 30 phút
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 16;
    const endMinute = 30;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Dừng lại ở 16:30
        if (hour === endHour && minute > endMinute) break;
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        slots.push({
          value: timeString,
          label: displayTime,
          display: hour < 12 ? `${displayTime} SA` : `${displayTime} CH`
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    appointmentType: 0,
    isAnonymousAppointment: false,
  });

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [payUrl, setPayUrl] = useState(null);
  const navigate = useNavigate();

  // Add validation for patientId
  useEffect(() => {
    if (!patientId) {
      console.error('Patient ID is missing');
      alert('Không tìm thấy thông tin bệnh nhân. Vui lòng đăng nhập lại.');
      return;
    }
  }, [patientId]);

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
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm riêng để xử lý chọn time slot
  const handleTimeSlotSelect = (timeValue) => {
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
    
    // Kiểm tra thời gian không được trong quá khứ (cho ngày hôm nay)
    if (appointmentDateTime < new Date()) {
      alert("Không thể đặt lịch hẹn trong quá khứ");
      setLoading(false);
      return;
    }
    
    console.log('Selected date and time:', formData.appointmentDate, formData.appointmentTime);
    console.log('Appointment DateTime (local):', appointmentDateTime);
    console.log('Local time string:', appointmentDateTime.toString());
    console.log('Appointment DateTime (ISO):', appointmentDateTime.toISOString());
    console.log('Local offset minutes:', appointmentDateTime.getTimezoneOffset());
    
    // Hiển thị thông tin debug cho user
    const debugInfo = `
Thời gian bạn chọn: ${formData.appointmentTime} ngày ${formData.appointmentDate}
Thời gian local: ${appointmentDateTime.toString()}
Thời gian sẽ gửi lên server (ISO): ${appointmentDateTime.toISOString()}
Múi giờ offset: ${appointmentDateTime.getTimezoneOffset()} phút
    `;
    console.log('Debug info:', debugInfo);
    const requestPayload = {
      patientId: patientId,
      doctorId: formData.doctorId || null,
      appointmentStartDate: `${formData.appointmentDate}T${formData.appointmentTime}:00`, // Gửi format YYYY-MM-DDTHH:MM:SS without timezone
      appointmentType: parseInt(formData.appointmentType),
      notes: formData.reason,
      isAnonymousAppointment: formData.isAnonymousAppointment,
      apointmentTitle: "Khám bệnh",
      status: 0,
      onlineLink: null,
      paymentMethod: 'momo',
    };
    
    console.log('Request payload with local datetime:', requestPayload);
    try {
      const res = await appointmentService.createAppointmentWithMomo(requestPayload);
      console.log("MoMo response:", res); // Debug log
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

              {/* Doctor Selection */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <UserOutlined className="mr-2 text-[#3B9AB8]" />
                  Chọn bác sĩ
                </label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors"
                  required
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.fullName} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              {/* Appointment Type */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <VideoCameraOutlined className="mr-2 text-[#3B9AB8]" />
                  Loại cuộc hẹn
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, appointmentType: 0 }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.appointmentType === 0
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
                    onClick={() => setFormData(prev => ({ ...prev, appointmentType: 1 }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.appointmentType === 1
                        ? 'border-[#3B9AB8] bg-blue-50 text-[#3B9AB8]'
                        : 'border-gray-200 hover:border-[#3B9AB8]'
                    }`}
                  >
                    <EnvironmentOutlined className="text-xl mb-2 text-[#3B9AB8]" />
                    <div className="font-medium">Tại phòng khám</div>
                    <div className="text-sm text-gray-500">Khám trực tiếp</div>
                  </button>
                </div>
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
                <label className="flex items-center text-gray-700 font-medium">
                  <FaClock className="mr-2 text-[#3B9AB8]" />
                  Chọn giờ khám
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => handleTimeSlotSelect(slot.value)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        formData.appointmentTime === slot.value
                          ? 'border-[#3B9AB8] bg-[#3B9AB8] text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-[#3B9AB8] hover:bg-blue-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{slot.label}</div>
                        <div className="text-xs opacity-75">
                          {slot.value < '12:00' ? 'Sáng' : 'Chiều'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  🕐 Giờ làm việc: 8:00 sáng - 4:30 chiều
                </p>
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