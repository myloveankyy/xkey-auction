import axios from 'axios';

const API_URL = '/api/hero-images/';

// Get all hero images (Public)
const getHeroImages = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create a new hero image (Admin)
const createHeroImage = async (imageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axios.post(API_URL, imageData, config);
  return response.data;
};

// Delete a hero image (Admin)
const deleteHeroImage = async (imageId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + imageId, config);
  return response.data;
};

const heroImageService = {
  getHeroImages,
  createHeroImage,
  deleteHeroImage,
};

export default heroImageService;