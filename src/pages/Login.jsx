import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { authService } from "../services/authService";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaSpinner, FaSignInAlt } from "react-icons/fa";

function EyeIcon({ visible, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#3B9AB8] focus:outline-none transition-colors duration-300"
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
    </button>
  );
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username.trim() || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      setIsLoading(false);
      return;
    }

    try {
      const data = await authService.login({ username, password });
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);

      if (data.role === "Patient" && data.patientId) {
        localStorage.setItem("patientId", data.patientId);
      }
      if (data.role === "Doctor" && data.doctorId) {
        localStorage.setItem("doctorId", data.doctorId);
      }

      const role = data.role;
      console.log("User role:", role);
      console.log("User data:", data);

      switch (role) {
        case "Admin":
          navigate("/admin/dashboard");
          break;
        case "Doctor":
          if (!data.doctorId) {
            throw new Error("Không tìm thấy thông tin bác sĩ. Vui lòng liên hệ quản trị viên.");
          }
          navigate("/doctor/dashboard");
          break;
        case "Manager":
          navigate("/manager/dashboard");
          break;
        case "Staff":
          navigate("/staff/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E63946]/10 to-white">
      <Navbar />
      
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        {/* Image Section - Left Side */}
        <div className="hidden md:block w-full md:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#E63946]/90 to-[#A8DADC]/90"></div>
          <img 
            src="https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg"
            alt="Medical illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center p-12 text-white">
            <div className="max-w-md transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-4xl font-bold mb-6 leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-white to-[#F1FAEE]">
                CHÀO MỪNG ĐẾN VỚI 
              </h2>
              <p className="text-xl mb-8 text-[#F1FAEE]">
                HỆ THỐNG CHĂM SÓC SỨC KHỎE HIV
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-1 bg-[#E63946]"></div>
                <span className="text-[#F1FAEE]">Đăng nhập để tiếp tục</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section - Right Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#E63946] to-[#A8DADC] bg-clip-text text-transparent">
                Đăng nhập
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Vui lòng nhập thông tin tài khoản của bạn
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent transition-all duration-300"
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent transition-all duration-300"
                    placeholder="Nhập mật khẩu"
                  />
                  <EyeIcon
                    visible={showPassword}
                    onClick={() => setShowPassword((v) => !v)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#E63946] focus:ring-[#E63946] border-gray-300 rounded transition-colors duration-300"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium text-[#E63946] hover:text-[#A8DADC] transition-colors duration-300"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#E63946] to-[#A8DADC] hover:from-[#A8DADC] hover:to-[#E63946] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E63946] transition-all duration-300 transform hover:-translate-y-0.5 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="-ml-1 mr-3 h-5 w-5" />
                      Đăng nhập
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-[#E63946] hover:text-[#A8DADC] transition-colors duration-300"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}