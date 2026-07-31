import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, { message: "El usuario o email es requerido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export const registerSchema = z.object({
  username: z.string().min(3, { message: "El usuario debe tener al menos 3 caracteres" }),
  email: z.string().email({ message: "Debe ser un email válido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, { message: "La contraseña debe contener al menos una mayúscula, una minúscula y un número" }),

});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export interface AuthUser {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface AuthResponse {
  jwt: string;
  refreshToken?: string;
  user: AuthUser;
}
