import axiosClient from "@/datasource/local/axios";
import { UserProfile, UpdateProfileInput, UpdatePasswordInput } from '@/model/user.schema';

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosClient.get<UserProfile>('/users/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileInput): Promise<UserProfile> => {
    const response = await axiosClient.put<UserProfile>('/users/me', data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<any[]> => {
    const formData = new FormData();
    formData.append('files', file);

    // El interceptor/axios lo enviará al endpoint BFF en nextjs
    const response = await axiosClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Strapi upload retorna un arreglo de archivos
    return response.data;
  },

  updatePassword: async (data: UpdatePasswordInput): Promise<UserProfile> => {
    const response = await axiosClient.post<UserProfile>('/users/me/password', data);
    return response.data;
  }
};
