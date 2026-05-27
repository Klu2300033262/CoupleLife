import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const createDiary = async (token, diaryData) => {
  const response = await axios.post(`${API_URL}/diaries`, diaryData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getDiaries = async (token) => {
  const response = await axios.get(`${API_URL}/diaries`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getDiaryById = async (token, id) => {
  const response = await axios.get(`${API_URL}/diaries/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateDiary = async (token, id, diaryData) => {
  const response = await axios.put(`${API_URL}/diaries/${id}`, diaryData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteDiary = async (token, id) => {
  const response = await axios.delete(`${API_URL}/diaries/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addComment = async (token, diaryId, comment) => {
  const response = await axios.post(`${API_URL}/diaries/${diaryId}/comments`, { comment }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const toggleReaction = async (token, diaryId, reaction) => {
  const response = await axios.post(`${API_URL}/diaries/${diaryId}/reactions`, { reaction }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
