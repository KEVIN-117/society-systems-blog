import axiosClient from "@/datasource/local/axios";
import type { LoginInput, RegisterInput, AuthResponse } from '@/model/auth.schema';

export const authService = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    try {
      const response = await axiosClient.post<AuthResponse>('/auth/login', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    try {
      const response = await axiosClient.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axiosClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      window.location.href = '/';
    }
  }
};
