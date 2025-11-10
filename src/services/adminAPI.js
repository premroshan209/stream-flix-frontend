import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const adminAPI = {
  getDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  getAnalytics: async (period = '30') => {
    const response = await axios.get(`${API_BASE_URL}/admin/analytics?period=${period}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  getVideos: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(`${API_BASE_URL}/admin/videos?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  deleteVideo: async (videoId) => {
    const response = await axios.delete(`${API_BASE_URL}/admin/videos/${videoId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await axios.put(
      `${API_BASE_URL}/admin/users/${userId}/status`, 
      { status },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  },

  uploadVideo: async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/videos/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      timeout: 600000 // 10 minutes
    });
    return response.data;
  }
};

export default adminAPI;
