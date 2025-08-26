// services/api.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

console.log("API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("API Request Interceptor - Token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response);
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      console.log("Unauthorized, removing token");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => {
    console.log("Register API call:", userData);
    return api.post("/auth/register", userData);
  },
  login: (credentials) => {
    console.log("Login API call:", credentials);
    return api.post("/auth/login", credentials);
  },
  getMe: () => {
    console.log("GetMe API call");
    return api.get("/auth/me");
  },
  socialLogin: (data) => api.post("/auth/social", data),
};

export const metricsAPI = {
  getAll: (params) => api.get("/metrics", { params }),
  getOne: (id) => api.get(`/metrics/${id}`),
  createOrUpdate: (data) => api.post("/metrics", data),
  update: (id, data) => api.put(`/metrics/${id}`, data),
  delete: (id) => api.delete(`/metrics/${id}`),
  getSummary: () => api.get("/metrics/summary"),
  exportData: () => api.get("/metrics/export/csv"),
  getMoodSummary: () => api.get("/metrics/ai/summary"),
  getMoodSummary: () => {
    console.log("Getting AI mood summary");
    return api.get("/metrics/ai/summary");
  },
};

export default api;
