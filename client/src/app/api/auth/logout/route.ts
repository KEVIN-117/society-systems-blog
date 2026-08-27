import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (token) {
      try {
        await fetch(`${STRAPI_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (e) {
        console.error("Error logging out from Strapi:", e);
      }
    }

    const res = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

    if (token) {
      res.cookies.delete('auth_token');
    }

    return res;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
