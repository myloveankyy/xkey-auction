// frontend/src/features/vehicles/vehicleService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/vehicles/';

// --- Get user token from localStorage ---
// A helper function to avoid repeating this logic.
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.token) {
    throw new Error('Not authorized, no token');
  }
  return user.token;
};

// --- Get all vehicles (Public) ---
const getVehicles = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// --- Get a single vehicle by ID (Public) ---
const getVehicleById = async (vehicleId) => {
  const response = await axios.get(API_URL + vehicleId);
  return response.data;
};

// --- Create a new vehicle (Protected) ---
const createVehicle = async (vehicleData) => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, vehicleData, config);
  return response.data;
};

// --- Update a vehicle (Protected) ---
// We will build the component for this next.
const updateVehicle = async (vehicleId, vehicleData) => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + vehicleId, vehicleData, config);
  return response.data;
};

// --- ADDED: Delete a vehicle (Protected) ---
const deleteVehicle = async (vehicleId) => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + vehicleId, config);
  return response.data;
};

const vehicleService = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle, // <-- ADDED for future use
  deleteVehicle, // <-- ADDED
};

export default vehicleService;