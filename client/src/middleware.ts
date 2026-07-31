import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/profile'];
  // Rutas exclusivas para usuarios NO autenticados
  const authRoutes = ['/login', '/register'];

  const pathname = request.nextUrl.pathname;
  // Recuperar la cookie gestionada en el sistema
  const token = request.cookies.get('auth_token')?.value;

  // Si intenta acceder a ruta protegida y no hay token, redirigir a login
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si intenta acceder a login/registro y ya hay token, redirigir a dashboard
  if (authRoutes.some(route => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/register'],
};
