// src/utils/auth.js

const USER_KEY = "user";

// Save user to localStorage
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Get user from localStorage
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  // console.log("getUser retrieved:", user);
  return user ? JSON.parse(user) : null;
};

// Get role of the logged-in user
export const getUserRole = () => {
  const user = getUser();
  return user ? user.role : null; // will now return "ADMIN", "MODERATOR", etc.
};


// Remove user (logout)
export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};
