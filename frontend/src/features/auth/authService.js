import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/users/';

// Login user
const login = async (userData) => {
  // Make the POST request to the backend's login endpoint
  const response = await axios.post(API_URL + 'login', userData);

  // If the request is successful and we get data back
  if (response.data) {
    // Store the user's data (including the token) in the browser's local storage
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  // Simply remove the user's data from local storage
  localStorage.removeItem('user');
};

const authService = {
  login,
  logout,
};

export default authService;