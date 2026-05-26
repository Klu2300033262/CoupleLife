import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const syncUserWithBackend = async (token, userData) => {
  const response = await axios.post(`${API_URL}/auth/sync`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getMe = async (token) => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const generateCoupleKey = async (token) => {
  const response = await axios.post(`${API_URL}/couple/generate-key`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const linkPartner = async (token, couple_key) => {
  const response = await axios.post(`${API_URL}/couple/link`, { couple_key }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateProfile = async (token, data) => {
  const response = await axios.put(`${API_URL}/auth/me`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateMood = async (token, data) => {
  const response = await axios.put(`${API_URL}/auth/mood`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
