import { ArticleResponse, ArticleListResponse, CreateArticleInput, CategoryListResponse } from '@/model/article.schema';
import axiosClient from "@/datasource/local/axios";

export async function getArticles(page = 1, pageSize = 10, filters?: { search?: string; category?: string }): Promise<ArticleListResponse> {
    let url = `/articles?page=${page}&pageSize=${pageSize}&sort=createdAt:desc&populate=*`;

    if (filters?.search) {
        url += `&filters[$or][0][title][$containsi]=${encodeURIComponent(filters.search)}`;
        url += `&filters[$or][1][description][$containsi]=${encodeURIComponent(filters.search)}`;
    }
    if (filters?.category) {
        url += `&filters[category][slug][$eq]=${encodeURIComponent(filters.category)}`;
    }

    const response = await axiosClient.get(url);
    return response.data;
}

export async function getMyArticles(page = 1, pageSize = 10, filters?: { search?: string; category?: string }): Promise<ArticleListResponse> {
    let url = `/articles/me?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc&populate=*`;

    if (filters?.search) {
        url += `&filters[$or][0][title][$containsi]=${encodeURIComponent(filters.search)}`;
        url += `&filters[$or][1][description][$containsi]=${encodeURIComponent(filters.search)}`;
    }
    if (filters?.category) {
        url += `&filters[category][slug][$eq]=${encodeURIComponent(filters.category)}`;
    }

    try {
        const response = await axiosClient.get(url);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            const fallbackUrl = url.replace('/articles/me', '/articles');
            const fallbackRes = await axiosClient.get(fallbackUrl);
            return fallbackRes.data;
        }
        throw error;
    }
}

export async function getCategories(): Promise<CategoryListResponse> {
    const response = await axiosClient.get('/categories?populate=*');
    return response.data;
}

export async function getArticleById(documentId: string): Promise<ArticleResponse> {
    const response = await axiosClient.get(`/articles/${documentId}?populate=*`);
    return response.data;
}

export async function getArticleBySlug(slug: string): Promise<ArticleResponse | null> {
    const response = await axiosClient.get(`/articles?filters[slug][$eq]=${slug}&populate=*`);
    const articles = response.data.data;
    if (articles && articles.length > 0) {
        return { data: articles[0], meta: {} };
    }
    return null;
}

export async function getRelatedArticles(categorySlug: string, currentDocumentId: string): Promise<ArticleListResponse> {
    const response = await axiosClient.get(`/articles?category=${categorySlug}&filters[documentId][$ne]=${currentDocumentId}&pageSize=3&populate=*`);
    return response.data;
}

export async function createArticle(data: CreateArticleInput): Promise<ArticleResponse> {
    const response = await axiosClient.post('/articles', data);
    return response.data;
}

export async function updateArticle(documentId: string, data: Partial<CreateArticleInput>): Promise<ArticleResponse> {
    const response = await axiosClient.put(`/articles/${documentId}`, data);
    return response.data;
}

export async function deleteArticle(documentId: string): Promise<ArticleResponse> {
    const response = await axiosClient.delete(`/articles/${documentId}`);
    return response.data;
}
