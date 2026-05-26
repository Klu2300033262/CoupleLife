import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateProfile = async (token, data) => {
  const response = await axios.put(`${API_URL}/profile`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateSettings = async (token, data) => {
  const response = await axios.put(`${API_URL}/profile/settings`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getCompatibility = async (token) => {
  const response = await axios.get(`${API_URL}/profile/compatibility`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
