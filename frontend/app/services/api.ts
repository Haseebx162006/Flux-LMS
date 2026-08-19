import axios from 'axios';

// Dynamically resolve and normalize API Base URL to ensure /api suffix is always present
const getApiBaseUrl = () => {
    let rawUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    if (rawUrl) {
        rawUrl = rawUrl.trim().replace(/\/+$/, '');
        if (!rawUrl.endsWith('/api')) {
            rawUrl = `${rawUrl}/api`;
        }
        return rawUrl;
    }
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return '/api';
    }
    return "http://127.0.0.1:5000/api";
};

const api = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    config.baseURL = getApiBaseUrl();
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized API call (token expired/invalid):", error.config?.url);
      if (typeof window !== 'undefined') {
        // Purge expired token on 401 to prompt fresh authentication
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;