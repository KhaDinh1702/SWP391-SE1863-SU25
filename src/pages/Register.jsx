import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar.jsx";
import { authService } from "../services/authService";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaVenusMars } from "react-icons/fa";
import { message } from "antd";

function EyeIcon({ visible, onClick }) {
  return (
    <span
      onClick={onClick}
      className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#3B9AB8] transition-colors"
      tabIndex={0}
      aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
    >
      {visible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
    </span>
  );
}

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    gender: 0,
    contactPersonName: "",
    contactPersonPhone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "gender" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Frontend validation
    if (!formData.username || formData.username.trim().length < 3) {
      message.error("Tên đăng nhập phải có ít nhất 3 ký tự");
      setLoading(false);
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      message.error("Mật khẩu phải có ít nhất 6 ký tự");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      message.error("Email không hợp lệ");
      setLoading(false);
      return;
    }

    if (!formData.fullName || formData.fullName.trim().length === 0) {
      message.error("Họ tên không được để trống");
      setLoading(false);
      return;
    }

    if (formData.fullName.length > 100) {
      message.error("Họ tên không được vượt quá 100 ký tự");
      setLoading(false);
      return;
    }

    if (!formData.dateOfBirth) {
      message.error("Vui lòng chọn ngày sinh");
      setLoading(false);
      return;
    }

    // Check if user is at least 1 year old
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 1 || birthDate > today) {
      message.error("Ngày sinh không hợp lệ");
      setLoading(false);
      return;
    }

    if (formData.phoneNumber && (formData.phoneNumber.length > 20 || !/^[0-9+\-\s()]+$/.test(formData.phoneNumber))) {
      message.error("Số điện thoại không hợp lệ (tối đa 20 ký tự)");
      setLoading(false);
      return;
    }

    if (!formData.contactPersonName || formData.contactPersonName.trim().length === 0) {
      message.error("Vui lòng nhập tên người liên hệ");
      setLoading(false);
      return;
    }

    if (!formData.contactPersonPhone || !/^[0-9+\-\s()]+$/.test(formData.contactPersonPhone)) {
      message.error("Số điện thoại người liên hệ không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      // Format the date to ISO string format
      const formattedData = {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        gender: formData.gender,
        contactPersonName: formData.contactPersonName,
        contactPersonPhone: formData.contactPersonPhone,
      };

      await authService.registerPatient(formattedData);

      message.success("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      message.error(error.message || "Có lỗi xảy ra khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B9AB8]/10 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] px-6 py-4">
              <h2 className="text-2xl font-bold text-white text-center">
                Đăng ký tài khoản bệnh nhân
              </h2>
            </div>

            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      placeholder="Tên đăng nhập"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Full Name */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Họ và tên"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Số điện thoại"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Mật khẩu"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <EyeIcon
                      visible={showPassword}
                      onClick={() => setShowPassword((v) => !v)}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Xác nhận mật khẩu"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="relative md:col-span-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      placeholder="Địa chỉ"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Contact Person Name */}
                  <div className="relative md:col-span-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="contactPersonName"
                      placeholder="Người liên hệ"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors"
                      value={formData.contactPersonName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Contact Person Phone */}
                  <div className="relative md:col-span-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="contactPersonPhone"
                      placeholder="Số điện thoại người liên hệ"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors"
                      value={formData.contactPersonPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaVenusMars className="text-gray-400" />
                    </div>
                    <select
                      name="gender"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B9AB8] focus:border-[#3B9AB8] transition-colors appearance-none"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value={0}>Nam</option>
                      <option value={1}>Nữ</option>
                      <option value={2}>Khác</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#3B9AB8] to-[#2D7A94] text-white py-3 rounded-lg font-medium hover:from-[#2D7A94] hover:to-[#3B9AB8] focus:outline-none focus:ring-2 focus:ring-[#3B9AB8] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Đang xử lý..." : "Đăng ký"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Đã có tài khoản?{" "}
                  <a
                    href="/login"
                    className="text-[#3B9AB8] hover:text-[#2D7A94] font-medium transition-colors"
                  >
                    Đăng nhập ngay
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}