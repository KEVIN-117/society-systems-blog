"use client";

import Link from "next/link";
import { GlassButton } from "@/components/atoms/GlassButton";
import { Cpu, Mail, Lock } from "lucide-react";
import { useForm } from "@tanstack/react-form-nextjs";
import type { AnyFieldApi } from '@tanstack/react-form-nextjs';
import { loginSchema } from "@/model/auth.schema";
import { authService } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorFieldInfo } from "@/components/atoms/ErrorFieldInfo";

export function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            identifier: "",
            password: "",
        },
        validators: {
            onChange: loginSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                setError(null);
                await authService.login(value);
                router.push('/dashboard');
            } catch (err: any) {
                setError(err.response?.data?.error?.message || "Error al iniciar sesión. Verifica tus credenciales.");
            }
        },
    });

    return (
        <div className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md relative z-10">
            <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#72004c] to-[#006f87] p-[1px] mb-4">
                    <div className="w-full h-full rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <Cpu className="text-white w-6 h-6" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-white font-heading">Iniciar Sesión</h1>
                <p className="text-gray-400 text-sm mt-2 text-center">
                    Ingresa a la plataforma de la Sociedad Científica
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
            }} className="space-y-6">

                <div className="space-y-2">
                    <form.Field
                        name="identifier"
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
                                        className="w-full h-12 bg-white/5 border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-[#72004c]"
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor={field.name} className="text-gray-300">
                                        Contraseña
                                    </Label>
                                    <Link href="#" className="text-xs text-[#00b4db] hover:text-white transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                                <div className="relative mt-1">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10 pointer-events-none" />
                                    <Input
                                        type="password"
                                        id={field.name}
                                        name={field.name}
                                        className="w-full h-12 bg-white/5 border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-[#72004c]"
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
                            variant="primary"
                            className="w-full h-12 text-base font-semibold mt-4"
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? "Ingresando..." : "Ingresar"}
                        </GlassButton>
                    )}
                />
            </form>

            <div className="mt-8 text-center text-sm text-gray-400">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-white font-medium hover:text-[#00b4db] transition-colors">
                    Regístrate aquí
                </Link>
            </div>
        </div>
    );
}
