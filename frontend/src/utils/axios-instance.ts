import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:2000',
  timeout: 5000,
});
