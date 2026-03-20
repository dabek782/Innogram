// authFetch.ts
"use client";
import axios from "axios";
import { authService } from "./authenticationService";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CORE_MICROSERVICE_URL,
});

api.interceptors.request.use((config) => {
  const token = authService.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await authService.refresh();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api.request(error.config);
      }
      authService.clearTokens();
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  },
);

export default api;
