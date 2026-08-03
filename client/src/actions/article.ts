import { apiClient } from '@/datasource/remote/axios';
import { ArticleResponse, ArticleListResponse, CreateArticleInput, CategoryListResponse } from '@/model/article.schema';

export const articleService = {

    getArticles: async (page = 1, pageSize = 10, filters?: { search?: string; category?: string }): Promise<ArticleListResponse> => {
        const response = await apiClient.get<ArticleListResponse>('/articles', {
            params: { page, pageSize, ...filters }
        });
        return response.data;
    },


    getMyArticles: async (page = 1, pageSize = 10, filters?: { search?: string; category?: string }): Promise<ArticleListResponse> => {
        const response = await apiClient.get<ArticleListResponse>('/articles/me', {
            params: { page, pageSize, ...filters }
        });
        return response.data;
    },

    getArticleById: async (documentId: string): Promise<ArticleResponse> => {
        const response = await apiClient.get<ArticleResponse>(`/articles/${documentId}`);
        return response.data;
    },

    createArticle: async (data: CreateArticleInput): Promise<ArticleResponse> => {
        const response = await apiClient.post<ArticleResponse>('/articles', data);
        return response.data;
    },

    updateArticle: async (documentId: string, data: Partial<CreateArticleInput>): Promise<ArticleResponse> => {
        const response = await apiClient.put<ArticleResponse>(`/articles/${documentId}`, data);
        return response.data;
    },

    deleteArticle: async (documentId: string): Promise<ArticleResponse> => {
        const response = await apiClient.delete<ArticleResponse>(`/articles/${documentId}`);
        return response.data;
    },

    getCategories: async (): Promise<CategoryListResponse> => {
        const response = await apiClient.get<CategoryListResponse>('/categories');
        return response.data;
    }
};
