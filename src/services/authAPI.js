import axios from 'axios';

// Use environment variable or fallback to local
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

console.log('API Base URL:', API_BASE_URL); // Debug log

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Set auth token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Set token if it exists on app load
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

const authAPI = {
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  login: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, userData);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  getMe: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    setAuthToken(token);
    const response = await axios.get(`${API_BASE_URL}/users/me`);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/auth/verify-email/${token}`);
    return response.data;
  }
};

export default authAPI;
