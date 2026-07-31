import { apiClient } from '@/datasource/remote/axios';
import type { LoginInput, RegisterInput, AuthResponse } from '@/model/auth.schema';
import Cookies from 'js-cookie';

export const authService = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      if (response.data.jwt) {
        // Guardamos el token en cookies usando js-cookie para el cliente
        Cookies.set('auth_token', response.data.jwt, { path: '/' });
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      if (response.data.jwt) {
        Cookies.set('auth_token', response.data.jwt, { path: '/' });
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    Cookies.remove('auth_token', { path: '/' });
    window.location.href = '/login';
  }
};
