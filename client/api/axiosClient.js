import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Something went wrong';

    if (error?.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }

    return Promise.reject({
      ...error,
      message,
    });
  }
);

export default axiosClient;