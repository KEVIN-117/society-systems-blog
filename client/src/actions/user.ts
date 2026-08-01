import { apiClient } from '@/datasource/remote/axios';
import { UserProfile, UpdateProfileInput, UpdatePasswordInput } from '@/model/user.schema';

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/users/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileInput): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>('/users/me', data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<any[]> => {
    const formData = new FormData();
    formData.append('files', file);

    // El interceptor/axios lo enviará al endpoint BFF en nextjs
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Strapi upload retorna un arreglo de archivos
    return response.data;
  },

  updatePassword: async (data: UpdatePasswordInput): Promise<UserProfile> => {
    const response = await apiClient.post<UserProfile>('/users/me/password', data);
    return response.data;
  }
};
