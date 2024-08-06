import axios from 'axios';
import { refreshAccessToken } from './authServices'; // Your token refresh function

const apiClient = axios.create({
  baseURL: 'https://freshcart-api-4ftp.onrender.com/api/v1',
  withCredentials: true
});

apiClient.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

