// export const getUser = () => {
//   const apiUser = {
//     token: localStorage.getItem("token"),
//     username: localStorage.getItem("username"),
//     role: localStorage.getItem("role"),
//     userId: localStorage.getItem("userId"),
//   };

//   const localUser = JSON.parse(localStorage.getItem("user")) || null;

//   if (apiUser.token) return apiUser;
//   return localUser;
// };

// export const login = (username, password) => {
//   const users = JSON.parse(localStorage.getItem("users")) || [];
//   const user = users.find(u => u.username === username && u.password === password);
//   if (user) {
//     localStorage.setItem("user", JSON.stringify(user));
//     return true;
//   }
//   return false;
// };

// export const register = (username, password) => {
//   const users = JSON.parse(localStorage.getItem("users")) || [];
//   if (users.some(u => u.username === username)) return false;
//   users.push({ username, password });
//   localStorage.setItem("users", JSON.stringify(users));
//   return true;
// };

// export const logout = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("username");
//   localStorage.removeItem("role");
//   localStorage.removeItem("userId");

//   localStorage.removeItem("user");
//   localStorage.removeItem("users");

//   sessionStorage.clear();
// };

// export function isAuthenticated() {
//   const user = getUser();
//   return !!(user && user.token);
// }

// export function getUserRole() {
//   const user = getUser();
//   return user && user.role ? user.role.toLowerCase() : null;
// }
