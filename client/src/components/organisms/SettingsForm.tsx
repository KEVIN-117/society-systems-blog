"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form-nextjs";
import type { AnyFieldApi } from '@tanstack/react-form-nextjs';
import { updatePasswordSchema, updateProfileSchema, type UserProfile } from "@/model/user.schema";
import { userService } from "@/actions/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loader } from "../atoms/Loader";

function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <>
                    {field.state.meta.errors.map((error, index) => (
                        <span key={index} className="text-red-500 text-xs mt-1 block">{error.message}</span>
                    ))}
                </>
            ) : null}
        </>
    )
}

export function SettingsForm({ initialData }: { initialData: UserProfile }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(
        initialData.author?.avatar?.url
            ? (initialData.author.avatar.url.startsWith('http') ? initialData.author.avatar.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${initialData.author.avatar.url}`)
            : null
    );
    const [avatarId, setAvatarId] = useState<number | null>(initialData.author?.avatar?.id || null);

    const form = useForm({
        defaultValues: {
            username: initialData.username || "",
            email: initialData.email || "",
            name: initialData.author?.name || "",
            avatar: initialData.author?.avatar?.id || null,
        },
        validators: {
            onChange: updateProfileSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                setIsSubmitting(true);
                // Asegurarnos de mandar el ID correcto del avatar si cambió
                const payload = {
                    ...value,
                    avatar: avatarId
                };
                await userService.updateProfile(payload);
                toast({
                    title: "Perfil actualizado",
                    description: "Tu información ha sido guardada exitosamente.",
                });
            } catch (err: any) {
                toast({
                    variant: "destructive",
                    title: "Error al actualizar",
                    description: err.response?.data?.error?.message || "Ocurrió un error inesperado.",
                });
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const passwordForm = useForm({
        defaultValues: {
            currentPassword: "",
            password: "",
            passwordConfirmation: "",
        },
        validators: {
            onChange: updatePasswordSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await userService.updatePassword(value);
                toast({
                    title: "Contraseña actualizada",
                    description: "Tu contraseña ha sido guardada exitosamente.",
                });
            } catch (err: any) {
                toast({
                    variant: "destructive",
                    title: "Error al actualizar",
                    description: err.response?.data?.error?.message || "Ocurrió un error inesperado.",
                });
            }
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const uploadedFiles = await userService.uploadAvatar(file);
            if (uploadedFiles && uploadedFiles.length > 0) {
                const uploadedFile = uploadedFiles[0];
                setAvatarId(uploadedFile.id);
                // Previsualizar la imagen (Strapi usualmente devuelve URLs relativas)
                const fileUrl = uploadedFile.url.startsWith('http')
                    ? uploadedFile.url
                    : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${uploadedFile.url}`;
                setAvatarUrl(fileUrl);

                toast({
                    title: "Avatar subido",
                    description: "No olvides guardar los cambios.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error al subir imagen",
                description: "Ocurrió un error al procesar el avatar.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={cn("relative space-y-6 max-w-2xl mx-auto p-6 bg-white/5 border border-white/10 rounded-3xl"
        )}>
            <div>
                <h2 className="text-2xl font-bold text-white font-heading">Configuración de Perfil</h2>
                <p className="text-gray-400 text-sm mt-1">
                    Administra tu información personal y pública.
                </p>
            </div>
            <div className="w-full absolute top-0 left-0 right-0 object-cover blur-md">
                {
                    avatarUrl && (
                        <Image
                            src={avatarUrl}
                            alt="Settings Background"
                            width={500}
                            height={500}
                            className="object-cover opacity-30 w-full h-60"
                            loading="lazy"
                            blurDataURL=""
                        />
                    )
                }
            </div>

            <form onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }} className="space-y-8 mt-8">

                {/* Avatar Section */}
                <div className="flex items-center gap-6 p-6 border-b border-white/10 mt-24  px-6">
                    <div className="relative group">
                        <Avatar className="w-24 h-24 border-2 border-white/10">
                            <AvatarImage src={avatarUrl || ""} alt="Avatar" className="object-cover" />
                            <AvatarFallback className="text-xl bg-gray-800 text-gray-300">
                                {form.state.values.name?.charAt(0) || form.state.values.username?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <label
                            htmlFor="avatar-upload"
                            className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                        >
                            {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Camera className="w-6 h-6 text-white" />}
                        </label>
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isUploading || isSubmitting}
                        />
                    </div>
                    <div>
                        <h3 className="text-white font-medium">Foto de Perfil</h3>
                        <p className="text-gray-400 text-sm mb-3">Recomendado 256x256px. JPG, PNG o GIF.</p>
                        <label
                            htmlFor="avatar-upload"
                            className="text-sm px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer inline-flex items-center"
                        >
                            {isUploading ? "Subiendo..." : "Cambiar imagen"}
                        </label>
                    </div>
                </div>

                {/* Información Pública (Author) */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Información Pública</h3>

                    <div className="space-y-2">
                        <form.Field
                            name="name"
                            children={(field) => (
                                <>
                                    <Label htmlFor={field.name} className="text-gray-300">Nombre Público</Label>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        className="w-full h-11 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:border-[#72004c]"
                                        placeholder="Tu nombre público como autor"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={() => field.handleBlur()}
                                    />
                                    <FieldInfo field={field} />
                                </>
                            )}
                        />
                    </div>
                </div>

                {/* Información de Cuenta (User) */}
                <div className="space-y-4 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-semibold text-white">Información de la Cuenta</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <form.Field
                                name="username"
                                children={(field) => (
                                    <>
                                        <Label htmlFor={field.name} className="text-gray-300">Nombre de Usuario</Label>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            className="w-full h-11 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:border-[#72004c]"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={() => field.handleBlur()}
                                        />
                                        <FieldInfo field={field} />
                                    </>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <form.Field
                                name="email"
                                children={(field) => (
                                    <>
                                        <Label htmlFor={field.name} className="text-gray-300">Correo Electrónico</Label>
                                        <Input
                                            type="email"
                                            id={field.name}
                                            name={field.name}
                                            className="w-full h-11 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:border-[#72004c]"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={() => field.handleBlur()}
                                        />
                                        <FieldInfo field={field} />
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex justify-end">
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isFormSubmitting]) => (
                            <Button
                                type="submit"
                                disabled={!canSubmit || isFormSubmitting || isSubmitting}
                                className="bg-gradient-to-r from-[#72004c] to-[#00b4db] hover:opacity-90 text-white rounded-xl px-8"
                            >
                                {(isFormSubmitting || isSubmitting) ? (
                                    <Loader variant="inverse" direction="row" text="Guardando..." />
                                ) : (
                                    "Guardar Cambios"
                                )}
                            </Button>
                        )}
                    />
                </div>
            </form>

            {/* Actualizar Contraseña */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    passwordForm.handleSubmit();
                }}
            >
                <div className="space-y-4 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-semibold text-white">Actualizar Contraseña</h3>

                    <div className="space-y-2">
                        <passwordForm.Field
                            name="currentPassword"
                            children={(field) => (
                                <>
                                    <Label htmlFor={field.name} className="text-gray-300">Contraseña Actual</Label>
                                    <Input
                                        type="password"
                                        id={field.name}
                                        name={field.name}
                                        className="w-full h-11 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:border-[#72004c]"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={() => field.handleBlur()}
                                    />
                                    <FieldInfo field={field} />
                                </>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <passwordForm.Field
                                name="password"
                                children={(field) => (
                                    <>
                                        <Label htmlFor={field.name} className="text-gray-300">Contraseña Nueva</Label>
                                        <Input
                                            type="password"
                                            id={field.name}
                                            name={field.name}
                                            className="w-full h-11 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:border-[#72004c]"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={() => field.handleBlur()}
                                        />
                                        <FieldInfo field={field} />
                                    </>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <passwordForm.Field
                                name="passwordConfirmation"
                                children={(field) => (
                                    <>
                                        <Label htmlFor={field.name} className="text-gray-300">Confirmar Contraseña</Label>
                                        <Input
                                            type="password"
                                            id={field.name}
                                            name={field.name}
                                            className="w-full h-11 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:border-[#72004c]"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={() => field.handleBlur()}
                                        />
                                        <FieldInfo field={field} />
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    <div className="pt-6 flex justify-end">
                        <passwordForm.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isFormSubmitting]) => (
                                <Button
                                    type="submit"
                                    disabled={!canSubmit || isFormSubmitting || isSubmitting}
                                    className="bg-gradient-to-r from-[#72004c] to-[#00b4db] hover:opacity-90 text-white rounded-xl px-8 h-11"
                                >
                                    {(isFormSubmitting || isSubmitting) ? (
                                        <Loader variant="inverse" direction="row" text="Actualizando..." />
                                    ) : (
                                        "Actualizar Contraseña"
                                    )}
                                </Button>
                            )}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
