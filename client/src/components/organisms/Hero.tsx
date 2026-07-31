import { GlassButton } from "@/components/atoms/GlassButton";
import { ArrowRight, Code, Database, Network, Cpu } from "lucide-react";
import Image from "next/image";

const CircuitPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-10 pointer-events-none mix-blend-screen"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="circuit-board"
        width="120"
        height="120"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 10 10 L 30 10 L 40 20 L 40 40 M 60 10 L 80 10 L 90 20 L 90 40 M 10 60 L 30 60 L 40 70 L 40 90 M 60 60 L 80 60 L 90 70 L 90 90 M 40 20 L 60 20 M 40 70 L 60 70"
          stroke="#72004c"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 110 50 L 90 50 L 80 40 L 80 20 M 110 110 L 90 110 L 80 100 L 80 80 M 50 50 L 30 50 L 20 40 L 20 20 M 50 110 L 30 110 L 20 100 L 20 80"
          stroke="#006f87"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="10" r="2.5" fill="#72004c" />
        <circle cx="60" cy="10" r="2.5" fill="#72004c" />
        <circle cx="40" cy="40" r="2.5" fill="#72004c" />
        <circle cx="90" cy="40" r="2.5" fill="#72004c" />
        <circle cx="110" cy="50" r="2.5" fill="#006f87" />
        <circle cx="80" cy="20" r="2.5" fill="#006f87" />
        <circle cx="50" cy="50" r="2.5" fill="#006f87" />
        <circle cx="20" cy="20" r="2.5" fill="#006f87" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#circuit-board)" />
  </svg>
);

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
      <CircuitPattern />
      
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#72004c] rounded-full blur-[100px] md:blur-[150px] opacity-20 mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#006f87] rounded-full blur-[100px] md:blur-[150px] opacity-20 mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Logo Sociedad */}
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#72004c] to-[#006f87] rounded-full blur-xl opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <Image 
                src="/logosociedad.png" 
                alt="Logo SOCITEC" 
                width={160} 
                height={160} 
                className="relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border-[#72004c]/30 text-sm font-medium text-white/90">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#72004c] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#72004c]"></span>
            </span>
            Sociedad Científica de Ingeniería de Sistemas y Tecnología
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-[1.1]">
            Ingeniería que <span className="text-gradient-purple block md:inline">transforma.</span>
            <br className="hidden md:block" /> Ciencia que <span className="text-gradient-blue block md:inline">trasciende.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            Un espacio de encuentro para la innovación, la investigación y la formación académica de excelencia en la Universidad Autónoma Tomás Frías.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <GlassButton variant="primary" size="lg" className="w-full sm:w-auto group">
              Explorar Artículos
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </GlassButton>
            <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto">
              Nuestros Proyectos
            </GlassButton>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-16 max-w-3xl mx-auto">
            <div className="glass-card p-6 flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-[#72004c]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code className="text-[#72004c] w-6 h-6" />
              </div>
              <span className="text-sm text-gray-300 font-medium">Software</span>
            </div>
            <div className="glass-card p-6 flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-[#006f87]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Database className="text-[#006f87] w-6 h-6" />
              </div>
              <span className="text-sm text-gray-300 font-medium">Datos</span>
            </div>
            <div className="glass-card p-6 flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-[#72004c]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Network className="text-[#72004c] w-6 h-6" />
              </div>
              <span className="text-sm text-gray-300 font-medium">Redes</span>
            </div>
            <div className="glass-card p-6 flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-[#006f87]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cpu className="text-[#006f87] w-6 h-6" />
              </div>
              <span className="text-sm text-gray-300 font-medium">Arquitectura</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
