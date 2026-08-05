"use client";

import Link from "next/link";
import { GlassButton } from "@/components/atoms/GlassButton";
import { Cpu, Mail, Lock, User } from "lucide-react";
import { useForm } from "@tanstack/react-form-nextjs";
import type { AnyFieldApi } from '@tanstack/react-form-nextjs';
import { registerSchema } from "@/model/auth.schema";
import { authService } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorFieldInfo } from "@/components/atoms/ErrorFieldInfo";

export function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
        validators: {
            onChange: registerSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                setError(null);
                await authService.register(value);
                router.push('/dashboard');
            } catch (err: any) {
                setError(err.response?.data?.error?.message || "Error al registrar la cuenta.");
            }
        },
    });

    return (
        <div className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md relative z-10 my-auto">
            <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006f87] to-[#72004c] p-[1px] mb-4">
                    <div className="w-full h-full rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <Cpu className="text-white w-6 h-6" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-white font-heading">Únete a SOCITEC</h1>
                <p className="text-gray-400 text-sm mt-2 text-center">
                    Crea tu cuenta para publicar artículos e investigaciones
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }} className="space-y-5">

                <div className="space-y-2">
                    <form.Field
                        name="username"
                        children={(field) => (
                            <>
                                <Label htmlFor={field.name} className="text-gray-300">
                                    Nombre de Usuario
                                </Label>
                                <div className="relative mt-1">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10 pointer-events-none" />
                                    <Input
                                        type="text"
                                        id={field.name}
                                        name={field.name}
                                        className="w-full h-12 bg-white/5 border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-[#006f87]"
                                        placeholder="ej. jperez"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={() => field.handleBlur()}
                                    />
                                </div>
                                <ErrorFieldInfo field={field} />
                            </>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <form.Field
                        name="email"
                        children={(field) => (
                            <>
                                <Label htmlFor={field.name} className="text-gray-300">
                                    Correo Electrónico
                                </Label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10 pointer-events-none" />
                                    <Input
                                        type="email"
                                        id={field.name}
                                        name={field.name}
                                        className="w-full h-12 bg-white/5 border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-[#006f87]"
                                        placeholder="usuario@uatf.edu.bo"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={() => field.handleBlur()}
                                    />
                                </div>
                                <ErrorFieldInfo field={field} />
                            </>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <form.Field
                        name="password"
                        children={(field) => (
                            <>
                                <Label htmlFor={field.name} className="text-gray-300">
                                    Contraseña
                                </Label>
                                <div className="relative mt-1">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10 pointer-events-none" />
                                    <Input
                                        type="password"
                                        id={field.name}
                                        name={field.name}
                                        className="w-full h-12 bg-white/5 border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-[#006f87]"
                                        placeholder="••••••••"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={() => field.handleBlur()}
                                    />
                                </div>
                                <ErrorFieldInfo field={field} />
                            </>
                        )}
                    />
                </div>

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <GlassButton
                            variant="secondary"
                            className="w-full h-12 text-base font-semibold mt-6"
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? "Registrando..." : "Registrarse"}
                        </GlassButton>
                    )}
                />
            </form>

            <div className="mt-8 text-center text-sm text-gray-400">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-white font-medium hover:text-[#72004c] transition-colors">
                    Inicia sesión
                </Link>
            </div>
        </div>
    );
}
