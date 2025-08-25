import axios from 'axios';

const API_URL = '/api/notifications/';

// Get user notifications
const getNotifications = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Mark a notification as read
const markAsRead = async (notificationId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + `${notificationId}/read`, {}, config);
  return response.data;
};

// Mark all notifications as read
const markAllAsRead = async (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(API_URL + 'mark-all-read', {}, config);
    return response.data;
};


const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};

export default notificationService;