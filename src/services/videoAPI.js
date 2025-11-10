import axios from 'axios';

// Use environment variable or fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

console.log('Video API Base URL:', API_BASE_URL); // Debug log

const videoAPI = {
  getVideos: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(`${API_BASE_URL}/videos?${queryString}`);
    return response.data;
  },

  getFeaturedVideos: async () => {
    const response = await axios.get(`${API_BASE_URL}/videos/featured`);
    return response.data;
  },

  getRecommendations: async (profileId) => {
    const response = await axios.get(`${API_BASE_URL}/videos/recommendations?profileId=${profileId}`);
    return response.data;
  },

  getVideoDetails: async (videoId) => {
    const response = await axios.get(`${API_BASE_URL}/videos/${videoId}`);
    return response.data;
  },

  updateWatchHistory: async (videoId, profileId, progress) => {
    const response = await axios.post(`${API_BASE_URL}/videos/${videoId}/watch`, {
      profileId,
      progress
    });
    return response.data;
  },

  toggleWatchlist: async (videoId, profileId) => {
    const response = await axios.post(`${API_BASE_URL}/videos/${videoId}/watchlist`, {
      profileId
    });
    return response.data;
  },

  searchVideos: async (query, filters = {}) => {
    const params = { search: query, ...filters };
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value && value !== '')
    ).toString();
    
    const response = await axios.get(`${API_BASE_URL}/videos?${queryString}`);
    return response.data;
  },

  getEpisodes: async (videoId, seasonNumber = null) => {
    const params = seasonNumber ? `?seasonNumber=${seasonNumber}` : '';
    const response = await axios.get(`${API_BASE_URL}/videos/${videoId}/episodes${params}`);
    return response.data;
  }
};

export default videoAPI;
