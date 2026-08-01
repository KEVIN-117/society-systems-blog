"use client";

import { useEffect, useState } from "react";
import { userService } from "@/actions/user";
import { SettingsForm } from "@/components/organisms/SettingsForm";
import type { UserProfile } from "@/model/user.schema";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getProfile();
                setProfile(data);
            } catch (err: any) {
                setError(err.message || "Error al cargar el perfil");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-[#00b4db] animate-spin" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                <div className="text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                    <p>{error || "No se pudo cargar la información del usuario."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto">
                <SettingsForm initialData={profile} />
            </div>
        </div>
    );
}
