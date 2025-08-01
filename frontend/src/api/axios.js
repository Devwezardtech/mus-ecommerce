import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // from Render env
  withCredentials: true,
});

export default api;