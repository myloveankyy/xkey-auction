import axios from 'axios';

const API_URL = '/api/analytics/';

// Get key dashboard statistics
const getDashboardStats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'dashboard-stats', config);
  return response.data;
};

// Get vehicle count by status
const getVehiclesByStatus = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'vehicles-by-status', config);
  return response.data;
};

// Get lead count by status
const getLeadsByStatus = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'leads-by-status', config);
  return response.data;
};

// --- NEW: Get User Registration Trends ---
const getUserRegistrationTrends = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + 'user-registration-trends', config);
    return response.data;
};

// --- NEW: Get Vehicle Submission Trends ---
const getVehicleSubmissionTrends = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + 'vehicle-submission-trends', config);
    return response.data;
};

// --- NEW: Get Top Vehicles by Leads ---
const getTopVehiclesByLeads = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + 'top-vehicles-by-leads', config);
    return response.data;
};


const analyticsService = {
  getDashboardStats,
  getVehiclesByStatus,
  getLeadsByStatus,
  getUserRegistrationTrends, // --- NEW EXPORT ---
  getVehicleSubmissionTrends, // --- NEW EXPORT ---
  getTopVehiclesByLeads, // --- NEW EXPORT ---
};

export default analyticsService;