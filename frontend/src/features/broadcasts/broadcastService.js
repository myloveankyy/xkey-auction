import axios from 'axios';

const API_URL = '/api/broadcasts/';

// --- PUBLIC FUNCTION ---
// Get the single active broadcast
const getActiveBroadcast = async () => {
  const response = await axios.get(API_URL + 'active');
  return response.data;
};


// --- ADMIN FUNCTIONS ---
// Get all broadcasts
const getAllBroadcasts = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Create a new broadcast
const createBroadcast = async (broadcastData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, broadcastData, config);
  return response.data;
};

// Activate a broadcast
const activateBroadcast = async (broadcastId, token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + `${broadcastId}/activate`, {}, config);
    return response.data;
};

// Deactivate all broadcasts
const deactivateAllBroadcasts = async (token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + 'deactivate-all', {}, config);
    return response.data;
};

// Delete a broadcast
const deleteBroadcast = async (broadcastId, token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(API_URL + broadcastId, config);
    return response.data;
};

// --- NEW: Send broadcast to all users' bell icons ---
const sendBroadcastToAllUsers = async (broadcastId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL + `${broadcastId}/send-to-all`, {}, config);
    return response.data;
};


const broadcastService = {
  getActiveBroadcast,
  getAllBroadcasts,
  createBroadcast,
  activateBroadcast,
  deactivateAllBroadcasts,
  deleteBroadcast,
  sendBroadcastToAllUsers, // --- EXPORT NEW FUNCTION ---
};

export default broadcastService;