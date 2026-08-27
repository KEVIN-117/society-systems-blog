import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiClient } from '@/datasource/remote/axios';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        const searchParams = request.nextUrl.searchParams;

        const queryString = searchParams.toString();

        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await apiClient.get(`/articles?${queryString}`, { headers });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data || 'Internal Server Error' },
            { status: error.response?.status || 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const response = await apiClient.post('/articles', { data: body }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data || 'Internal Server Error' },
            { status: error.response?.status || 500 }
        );
    }
}