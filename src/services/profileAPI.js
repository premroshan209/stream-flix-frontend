import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const profileAPI = {
  createProfile: async (profileData) => {
    const response = await axios.post(`${API_BASE_URL}/users/profile`, profileData);
    return response.data;
  },

  updateProfile: async (profileId, profileData) => {
    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      if (key === 'preferences') {
        formData.append(key, JSON.stringify(profileData[key]));
      } else {
        formData.append(key, profileData[key]);
      }
    });

    const response = await axios.put(`${API_BASE_URL}/users/profile/${profileId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  deleteProfile: async (profileId) => {
    const response = await axios.delete(`${API_BASE_URL}/users/profile/${profileId}`);
    return response.data;
  },

  getWatchlist: async (profileId) => {
    const response = await axios.get(`${API_BASE_URL}/users/profile/${profileId}/watchlist`);
    return response.data;
  },

  getWatchHistory: async (profileId) => {
    const response = await axios.get(`${API_BASE_URL}/users/profile/${profileId}/history`);
    return response.data;
  }
};

export default profileAPI;
