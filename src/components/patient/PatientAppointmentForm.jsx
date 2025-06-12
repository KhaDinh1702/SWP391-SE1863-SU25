import React, { useEffect, useState } from "react";
import axios from "axios";
import { doctorService } from "../../services/api";
import { CalendarOutlined, UserOutlined, VideoCameraOutlined, EnvironmentOutlined, FileTextOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const API_BASE_URL = 'http://localhost:5275/api';

const PatientAppointmentForm = ({ patientId }) => {
  // Add debug log
  console.log('PatientAppointmentForm - patientId:', patientId);

  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    reason: "",
    appointmentType: 0, // 0 for Online, 1 for Offline
    isAnonymousAppointment: false,
  });

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

    // Format the date to match the backend's expected format
    const appointmentDate = new Date(formData.appointmentDate).toISOString();

    const requestPayload = {
      patientId: patientId,
      doctorId: formData.doctorId || null,
      appointmentStartDate: appointmentDate,
      appointmentType: parseInt(formData.appointmentType),
      notes: formData.reason,
      isAnonymousAppointment: formData.isAnonymousAppointment,
      apointmentTitle: "Khám bệnh",
      status: 0,
      onlineLink: null
    };

    console.log('Sending request payload:', requestPayload);
    console.log('Request URL:', `${API_BASE_URL}/Appointment/patient-create-appointment?patientId=${patientId}`);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/Appointment/patient-create-appointment?patientId=${patientId}`,
        requestPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('Response:', res.data);
      alert("Đặt lịch thành công!");
      // Reset form
      setFormData({
        doctorId: "",
        appointmentDate: "",
        reason: "",
        appointmentType: 0,
        isAnonymousAppointment: false,
      });
    } catch (err) {
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        request: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers,
          data: err.config?.data
        }
      });
      alert("Lỗi: " + (err.response?.data?.message || "Không thể đặt lịch"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <h2 className="text-3xl font-bold text-white text-center">
              Đặt lịch hẹn khám bệnh
            </h2>
            <p className="mt-2 text-blue-100 text-center">
              Vui lòng điền đầy đủ thông tin bên dưới
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <EyeInvisibleOutlined className="text-xl text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Đặt lịch ẩn danh</h3>
                  <p className="text-sm text-gray-500">Thông tin của bạn sẽ được bảo mật</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAnonymousAppointment}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    isAnonymousAppointment: e.target.checked
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Doctor Selection */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <UserOutlined className="mr-2" />
                Chọn bác sĩ
              </label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                <VideoCameraOutlined className="mr-2" />
                Loại cuộc hẹn
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, appointmentType: 0 }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.appointmentType === 0
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <VideoCameraOutlined className="text-xl mb-2" />
                  <div className="font-medium">Trực tuyến</div>
                  <div className="text-sm text-gray-500">Khám qua video call</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, appointmentType: 1 }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.appointmentType === 1
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <EnvironmentOutlined className="text-xl mb-2" />
                  <div className="font-medium">Tại phòng khám</div>
                  <div className="text-sm text-gray-500">Khám trực tiếp</div>
                </button>
              </div>
            </div>

            {/* Date and Time */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <CalendarOutlined className="mr-2" />
                Ngày giờ hẹn
              </label>
              <input
                type="datetime-local"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <FileTextOutlined className="mr-2" />
                Lý do khám
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[120px]"
                placeholder="Mô tả triệu chứng hoặc lý do khám của bạn..."
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-lg text-white font-medium text-lg transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5'
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
        </div>
      </div>
    </div>
  );
};

export default PatientAppointmentForm;
