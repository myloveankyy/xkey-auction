import axios from 'axios';

const API_URL = '/api/users';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + '/register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + '/login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  sessionStorage.removeItem('adminPinAuthenticated');
};

// Create a new admin user (Admin only)
const createAdmin = async (adminData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + '/create-admin', adminData, config);
  return response.data;
};

// Get all users (Admin only)
const getAllUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Delete a user (Admin only)
const deleteUser = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/${userId}`, config);
  return response.data;
};

// --- NEW: Send a direct notification (Admin only) ---
const sendDirectNotification = async (notificationData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    // notificationData should be an object: { recipientId, message }
    const response = await axios.post(API_URL + '/send-notification', notificationData, config);
    return response.data;
};

const authService = {
  register,
  login,
  logout,
  createAdmin,
  getAllUsers,
  deleteUser,
  sendDirectNotification, // --- EXPORT NEW FUNCTION ---
};

export default authService;