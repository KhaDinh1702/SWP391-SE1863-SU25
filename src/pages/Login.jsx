import { useState } from "react";
import { login } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar.jsx";
import { authService } from "../services/api.js";

//show/hide password
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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Kiểm tra username có phải email hoặc số điện thoại
  // function validateUsername(input) {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   const phoneRegex = /^\d{9,15}$/; // 9-15 số
  //   return emailRegex.test(input) || phoneRegex.test(input);
  // }

  const handleLogin = async () => {
  setError(""); // Clear error before new attempt

  // if (!validateUsername(username)) {
  //   setError("Vui lòng nhập email hoặc số điện thoại hợp lệ");
  //   return;
  // }

  // if (password.length < 6) {
  //   setError("Mật khẩu phải ít nhất 6 ký tự");
  //   return;
  // }

  try {
    const response = await authService.login({username, password}); // Gọi API và chờ phản hồi
    console.log(response);
    if (response.success) {
      // Lưu token và thông tin người dùng vào localStorage nếu cần
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.username);
      localStorage.setItem("role", response.role);
      localStorage.setItem("userId", response.userId);

      // Chuyển hướng đến trang chính
      navigate("/");
    } else {
      setError(response.message || "Tài khoản hoặc mật khẩu không đúng");
    }
  } catch (error) {
    setError("Đăng nhập thất bại. Vui lòng thử lại.");
    console.error(error);
  }
};


  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Email hoặc số điện thoại"
          className="border px-3 py-2 w-full mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            className="border px-3 py-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <EyeIcon visible={showPassword} onClick={() => setShowPassword((v) => !v)} />
        </div>
        <button
          onClick={handleLogin}
          className="bg-blue-700 text-white w-full py-2 rounded hover:bg-blue-800"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}
