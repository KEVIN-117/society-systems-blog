import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "@/components/organisms/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-[#060609] py-12">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#006f87] rounded-full blur-[150px] opacity-20 pointer-events-none animate-pulse" />
      
      {/* Top Nav (Back to home) */}
      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="text-gray-400 hover:text-white flex items-center text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>
      </div>

      <RegisterForm />
    </div>
  );
}
