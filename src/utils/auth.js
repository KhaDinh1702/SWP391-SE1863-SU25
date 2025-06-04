// src/utils/auth.js
export const getUser = () => {
  // Check both the API-style auth and local user storage
  const apiUser = {
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
    userId: localStorage.getItem("userId")
  };

  const localUser = JSON.parse(localStorage.getItem("user")) || null;

  // Prioritize API-style auth if token exists
  if (apiUser.token) {
    return apiUser;
  }
  
  // Fall back to local user storage
  return localUser;
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
  // Clear all possible authentication methods
  // API-style auth items
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  
  // Local user storage items
  localStorage.removeItem("user");
  localStorage.removeItem("users");
  
  // Clear any session storage if used
  sessionStorage.clear();
};