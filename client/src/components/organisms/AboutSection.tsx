import { Code, Brain, Lightbulb, ShieldCheck } from "lucide-react";

export function AboutSection() {
  return (
    <section id="mision" className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Nuestra <span className="text-gradient">Esencia</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Inspirados por nuestro emblema, representamos la fusión del pensamiento lógico y la tecnología digital, impulsando el desarrollo social y tecnológico de Potosí.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Left Hemisphere (Purple) */}
          <div className="glass-card p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#72004c] opacity-20 blur-3xl rounded-full group-hover:opacity-40 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-[#72004c]/20 flex items-center justify-center mb-6">
              <Lightbulb className="text-[#72004c] w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Creatividad y Lógica</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              El hemisferio izquierdo de nuestro emblema, en tono burdeo, simboliza la creatividad, el diseño UX/UI y el pensamiento abstracto. Innovamos para resolver desafíos de desarrollo de software con estructura y originalidad.
            </p>
          </div>

          {/* Right Hemisphere (Blue) */}
          <div className="glass-card p-10 relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#006f87] opacity-20 blur-3xl rounded-full group-hover:opacity-40 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-[#006f87]/20 flex items-center justify-center mb-6">
              <ShieldCheck className="text-[#006f87] w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Enfoque Técnico</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              El hemisferio derecho, en azul petróleo, representa la solidez técnica: redes, arquitectura de servidores y DevOps. Nos basamos en la precisión y confianza para construir sistemas distribuidos escalables.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
