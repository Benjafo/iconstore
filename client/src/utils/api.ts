import axios from 'axios';
import { tokenManager } from './tokenManager';
import { store } from '@/store/store';
import { clearAuth, refreshToken } from '@/store/authSlice';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = tokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const resultAction = await store.dispatch(refreshToken());

        if (refreshToken.fulfilled.match(resultAction)) {
          const newToken = resultAction.payload.accessToken;
          tokenManager.setAccessToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          store.dispatch(clearAuth());
          window.location.href = '/login';
        }
      } catch (refreshError) {
        store.dispatch(clearAuth());
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
