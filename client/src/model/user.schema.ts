import { z } from "zod";
import { AuthUser } from "./auth.schema";

export const updateProfileSchema = z.object({
  username: z.string().min(3, { message: "El usuario debe tener al menos 3 caracteres" }),
  email: z.string().email({ message: "Debe ser un email válido" }),
  // Campos del Author
  name: z.string().min(2, { message: "El nombre es requerido" }),
  avatar: z.number().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export interface UploadedFile {
  id: number;
  documentId: string;
  url: string;
  name: string;
}

export interface AuthorProfile {
  id: number;
  documentId: string;
  name: string;
  email: string;
  avatar: UploadedFile | null;
}

export interface UserProfile extends AuthUser {
  author?: AuthorProfile;
}

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "La contraseña actual es requerida" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  passwordConfirmation: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Las contraseñas no coinciden",
  path: ["passwordConfirmation"],
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;