"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Footer } from "@/components/organisms/Footer";
import { Navbar } from "@/components/organisms/Navbar";
import { Button } from "@/components/ui/button";

export default function AuthorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unable to load author profile", error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="container mx-auto flex min-h-screen flex-grow items-center justify-center px-6 pt-20">
        <div className="glass-card max-w-xl p-10 text-center">
          <AlertTriangle className="mx-auto size-10 text-amber-400" />
          <h1 className="mt-4 text-3xl font-bold text-white">
            No pudimos cargar este perfil
          </h1>
          <p className="mt-4 text-gray-400">
            El servicio de contenidos no está disponible en este momento.
            Inténtalo nuevamente.
          </p>
          <Button className="mt-8" onClick={reset}>
            Reintentar
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
