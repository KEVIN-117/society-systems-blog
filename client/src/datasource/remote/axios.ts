import axios from 'axios';
import Cookies from 'js-cookie';

// Cliente para conectarse al BFF (Next.js Route Handlers)
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token guardado en las peticiones
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
