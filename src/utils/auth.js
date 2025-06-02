// src/utils/auth.js
export const getUser = () => {
  return JSON.parse(localStorage.getItem("user")) || null;
};

export const login = (username, password) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    return true;
  }
  return false;
};

export const register = (username, password) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const exists = users.some(u => u.username === username);
  if (exists) return false;
  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
};

export const logout = () => {
  // Xóa tất cả các item liên quan đến user
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("user"); // Nếu có
};
