import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { authService } from "../services/api";

// Component cho icon ẩn/hiện mật khẩu
function EyeIcon({ visible, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{
        cursor: "pointer",
        position: "absolute",
        right: 12,
        top: 10,
        fontWeight: "bold",
        color: "#444",
      }}
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

  const handleLogin = async () => {
    // 1. Reset lỗi cũ
    setError("");

    // 2. Kiểm tra bắt buộc nhập
    if (!username.trim() || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    try {
      // 3. Gọi API đăng nhập
      const data = await authService.login({ username, password });
      console.log("Login response:", data);

      // 4. Lưu thông tin vào localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);

      // 5. Chuyển hướng theo role
      switch (data.role) {
        case "Admin":
          navigate("/admin/dashboard");
          break;
        case "Doctor":
          navigate("/doctor/dashboard");
          break;
        case "Patient":
          navigate("/");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login error details:", err);
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Username input */}
        <input
          type="text"
          placeholder="Tên tài khoản đăng nhập"
          autoComplete="username"
          className="border px-3 py-2 w-full mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password input với EyeIcon để show/hide */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            autoComplete="current-password"
            className="border px-3 py-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <EyeIcon
            visible={showPassword}
            onClick={() => setShowPassword((v) => !v)}
          />
        </div>

        {/* Nút Đăng nhập */}
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
