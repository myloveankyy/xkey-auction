import axios from 'axios';

const API_URL = '/api/leads/';

// Create a new lead (public)
const createLead = async (leadData) => {
  const response = await axios.post(API_URL, leadData);
  return response.data;
};

// Get all leads (admin only)
const getAllLeads = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Update lead status (admin only)
const updateLeadStatus = async (leadId, statusData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + leadId, statusData, config);
  return response.data;
};

// Delete a lead (admin only)
const deleteLead = async (leadId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + leadId, config);
  return response.data;
};


const leadService = {
  createLead,
  getAllLeads,
  updateLeadStatus,
  deleteLead,
};

export default leadService;