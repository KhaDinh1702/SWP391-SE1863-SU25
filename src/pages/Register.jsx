// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar.jsx";
import { authService } from "../services/api.js";

function EyeIcon({ visible, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{ cursor: "pointer", position: "absolute", right: 12, top: 10, fontWeight: 'bold', color: '#444' }}
      tabIndex={0}
      aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
    >
      {visible ? "Ẩn" : "Hiện"}
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
    gender: 0, // Default to Male (0)
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "gender" ? parseInt(value) : value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (formData.password !== formData.confirmPassword) {
    setError("Mật khẩu xác nhận không khớp");
    return;
  }

  try {
    await authService.registerPatient({
      username: formData.username,
      password: formData.password,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender
    });
    
    setSuccess("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
    setTimeout(() => navigate("/login"), 2000);
  } catch (error) {
    setError(error.message || "Có lỗi xảy ra khi đăng ký");
  }
};

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-4">Đăng ký bệnh nhân</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              className="border px-3 py-2 w-full"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              className="border px-3 py-2 w-full"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border px-3 py-2 w-full"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Số điện thoại"
              className="border px-3 py-2 w-full"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              className="border px-3 py-2 w-full"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <EyeIcon visible={showPassword} onClick={() => setShowPassword(v => !v)} />
          </div>
          
          <div className="mb-3">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              className="border px-3 py-2 w-full"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ"
              className="border px-3 py-2 w-full"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">Ngày sinh</label>
            <input
              type="date"
              name="dateOfBirth"
              className="border px-3 py-2 w-full"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Giới tính</label>
            <select
              name="gender"
              className="border px-3 py-2 w-full"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value={0}>Nam</option>
              <option value={1}>Nữ</option>
              <option value={2}>Khác</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="bg-blue-700 text-white w-full py-2 rounded hover:bg-blue-800"
          >
            Đăng ký
          </button>
        </form>
        
        <p className="mt-4 text-center">
          Đã có tài khoản? <a href="/login" className="text-blue-600">Đăng nhập ngay</a>
        </p>
      </div>
    </div>
  );
}