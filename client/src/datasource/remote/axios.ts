import axios from 'axios';

// Cliente para conectarse al BFF (Next.js Route Handlers)
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Nota arquitectónica: Ya no usamos interceptores para inyectar el JWT desde js-cookie.
// Al apuntar a '/api' (mismo dominio), el navegador adjuntará automáticamente 
// la cookie httpOnly 'auth_token' en cada petición. El BFF se encargará de extraerla.
