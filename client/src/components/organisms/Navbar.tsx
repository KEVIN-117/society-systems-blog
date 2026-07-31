import Link from "next/link";
import { glassButtonVariants } from "@/components/atoms/GlassButton";
import { Cpu } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border-b border-white/10" />
      <div className="container mx-auto px-6 h-20 relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#72004c] to-[#006f87] p-[1px] group-hover:shadow-[0_0_20px_rgba(114,0,76,0.5)] transition-all">
              <div className="w-full h-full rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Cpu className="text-white w-5 h-5" />
              </div>
            </div>
            <span className="font-heading font-bold text-xl tracking-wider text-white">
              SOCITEC
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#mision" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Nuestra Misión
          </Link>
          <Link href="#blog" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Artículos
          </Link>
          <Link href="#contacto" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className={glassButtonVariants({ variant: "ghost", className: "hidden md:inline-flex" })}>
            Ingresar
          </Link>
          <Link href="/register" className={glassButtonVariants({ variant: "primary" })}>
            Únete a SOCITEC
          </Link>
        </div>
      </div>
    </header>
  );
}
