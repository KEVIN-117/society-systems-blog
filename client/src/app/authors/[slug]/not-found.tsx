import Link from "next/link";
import { Footer } from "@/components/organisms/Footer";
import { Navbar } from "@/components/organisms/Navbar";
import { Button } from "@/components/ui/button";

export default function AuthorNotFound() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto flex min-h-screen flex-grow items-center justify-center px-6 pt-20">
        <div className="glass-card max-w-xl p-10 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#66d9ff]">
            404
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white">
            Autor no encontrado
          </h1>
          <p className="mt-4 text-gray-400">
            El autor o la página de artículos solicitada no existe.
          </p>
          <Button
            className="mt-8"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Volver al inicio
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
