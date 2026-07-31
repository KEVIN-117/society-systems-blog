import { Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#040406]/80 mt-24 relative z-10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#72004c] to-[#006f87] p-[1px]">
                <div className="w-full h-full rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <Cpu className="text-white w-4 h-4" />
                </div>
              </div>
              <span className="font-heading font-bold text-lg tracking-wider text-white">
                SOCITEC
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Sociedad Científica de Ingeniería de Sistemas y Tecnología. Universidad Autónoma "Tomás Frías", Potosí, Bolivia.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 font-heading">Enlaces</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#mision" className="hover:text-white transition-colors">Misión y Visión</a></li>
              <li><a href="#blog" className="hover:text-white transition-colors">Artículos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Estatuto Orgánico</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Directorio</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 font-heading">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Av. Las Banderas 222</li>
              <li>Ciudadela Universitaria, Bloque 3</li>
              <li>Villa Imperial de Potosí</li>
              <li><a href="mailto:contacto@socitec.uatf.edu.bo" className="hover:text-white transition-colors">contacto@socitec.uatf.edu.bo</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} SOCITEC UATF. Todos los derechos reservados.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
