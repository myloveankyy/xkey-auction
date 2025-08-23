import axios from 'axios';

const API_URL = '/api/vehicles';

// --- PUBLIC/GENERAL FUNCTIONS ---
const getVehicles = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getVehicleById = async (vehicleId) => {
  const response = await axios.get(`${API_URL}/${vehicleId}`);
  return response.data;
};


// --- SELLER FUNCTIONS ---
const createVehicle = async (vehicleData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
  const response = await axios.post(API_URL, vehicleData, config);
  return response.data;
};

const getMyListings = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/my-listings`, config);
  return response.data;
};


// --- ADMIN FUNCTIONS ---
const getAllVehiclesAsAdmin = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/admin/all`, config);
  return response.data;
};

const approveListing = async (vehicleId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/${vehicleId}/approve-listing`, {}, config);
  return response.data;
};

const rejectListing = async (vehicleId, rejectionData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/${vehicleId}/reject-listing`, rejectionData, config);
  return response.data;
};

// --- NEW: DELETE VEHICLE FUNCTION (ADMIN/OWNER) ---
const deleteVehicle = async (vehicleId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(`${API_URL}/${vehicleId}`, config);
  return response.data;
};


// --- NEGOTIATION FUNCTIONS ---
const submitNegotiationOffer = async (vehicleId, offerData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL}/${vehicleId}/negotiate`, offerData, config);
  return response.data;
};

const acceptOffer = async (vehicleId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL}/${vehicleId}/accept-offer`, {}, config);
  return response.data;
};


const vehicleService = {
  getVehicles,
  getVehicleById,
  createVehicle,
  getMyListings,
  getAllVehiclesAsAdmin,
  approveListing,
  rejectListing,
  submitNegotiationOffer,
  acceptOffer,
  // --- NEW EXPORT ---
  deleteVehicle,
};

export default vehicleService;