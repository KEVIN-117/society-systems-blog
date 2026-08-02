import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // El backend ya fue refactorizado para devolver author y avatar populados
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const meResponse = await fetch(`${STRAPI_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const meData = await meResponse.json();
    if (!meResponse.ok) {
      return NextResponse.json(meData, { status: meResponse.status });
    }

    const userUpdateRes = await fetch(`${STRAPI_URL}/api/users/${meData.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: body.username,
        email: body.email,
      }),
    });

    if (!userUpdateRes.ok) {
      const errorData = await userUpdateRes.json();
      return NextResponse.json(errorData, { status: userUpdateRes.status });
    }

    if (meData.author && meData.author.documentId) {
      const authorUpdatePayload: any = {
        name: body.name,
      };

      if (body.avatar !== undefined) {
        authorUpdatePayload.avatar = body.avatar;
      }

      const authorUpdateRes = await fetch(`${STRAPI_URL}/api/authors/${meData.author.documentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: authorUpdatePayload }),
      });

      if (!authorUpdateRes.ok) {
        const errorData = await authorUpdateRes.json();
        return NextResponse.json(errorData, { status: authorUpdateRes.status });
      }
    }

    const finalProfileRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const finalProfile = await finalProfileRes.json();

    return NextResponse.json(finalProfile);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
