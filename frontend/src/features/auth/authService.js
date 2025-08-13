// frontend/src/features/auth/authService.js

import axios from 'axios';

// --- CHANGE: Simplify the API_URL ---
// This static path will work for both local development (via proxy)
// and for the live server (via Nginx).
const API_URL = '/api/users/';

// Register user
const register = async (userData) => {
  // This will now correctly call POST /api/users/register
  const response = await axios.post(API_URL + 'register', userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  // This will now correctly call POST /api/users/login
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;