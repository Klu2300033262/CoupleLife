import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const getHeaders = async () => {
  const user = auth?.currentUser;
  if (!user) {
    // During server-side rendering or when not logged in, abort the request.
    throw new Error('Not authenticated');
  }
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const generateCoupleKey = async () => {
  const response = await axios.post(`${API_URL}/couple/generate-key`, {}, { headers: await getHeaders() });
  return response.data;
};

export const linkPartner = async (inviteCode) => {
  const response = await axios.post(`${API_URL}/couple/link`, { invite_code: inviteCode }, { headers: await getHeaders() });
  return response.data;
};

export const updateAnniversary = async (data) => {
  const response = await axios.post(`${API_URL}/couple/update-anniversary`, data, { headers: await getHeaders() });
  return response.data;
};

export const unlinkPartner = async () => {
  const response = await axios.post(`${API_URL}/couple/unlink`, {}, { headers: await getHeaders() });
  return response.data;
};
