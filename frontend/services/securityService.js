import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const getAuditLogs = async (token) => {
  const response = await axios.get(`${API_URL}/security/audit-logs`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteAccount = async (token) => {
  const response = await axios.post(`${API_URL}/security/delete-account`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const logSecurityAction = async (token, action, detail) => {
  const response = await axios.post(`${API_URL}/security/log-action`, { action, detail }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
