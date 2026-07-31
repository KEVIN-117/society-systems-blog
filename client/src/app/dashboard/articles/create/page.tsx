import { ArticleForm } from "@/components/organisms/ArticleForm";
import { PenTool } from "lucide-react";

export default function CreateArticlePage() {
  return (
    <div className="flex-1 w-full p-4 md:p-8 pt-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto mb-8 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#72004c] to-[#006f87] p-[1px]">
            <div className="w-full h-full rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <PenTool className="text-white w-5 h-5" />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-heading text-white">
            Crear <span className="text-gradient">Artículo</span>
          </h1>
        </div>
        <p className="text-gray-400">
          Escribe y publica tu investigación en el blog oficial de SOCITEC.
          Puedes redactar directamente aquí o importar tu archivo Markdown.
        </p>
      </div>

      <div className="relative z-10">
        <ArticleForm />
      </div>
    </div>
  );
}
