import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const subscriptionAPI = {
  getPlans: async () => {
    const response = await axios.get(`${API_BASE_URL}/subscriptions/plans`);
    return response.data;
  },

  createOrder: async (planId) => {
    const response = await axios.post(`${API_BASE_URL}/subscriptions/create-order`, { planId });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await axios.post(`${API_BASE_URL}/subscriptions/verify-payment`, paymentData);
    return response.data;
  },

  cancelSubscription: async () => {
    const response = await axios.post(`${API_BASE_URL}/subscriptions/cancel`);
    return response.data;
  }
};

export default subscriptionAPI;
