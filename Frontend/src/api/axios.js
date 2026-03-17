import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
// - If VITE_API_URL is set (frontend deployed separately), use absolute backend origin.
// - If not set (frontend + backend same origin), use relative "/api".
const baseURL = rawApiUrl ? new URL('/api', rawApiUrl).toString().replace(/\/$/, '') : '/api';

const api = axios.create({
    baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
