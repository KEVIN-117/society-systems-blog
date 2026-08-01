"use client";

import * as React from "react";
import { GlassButton } from "@/components/atoms/GlassButton";
import { Badge } from "@/components/ui/badge";
import { FileUp, Edit3, Eye, Image as ImageIcon, Send, X } from "lucide-react";
import Post from "../molecules/Post";

const CATEGORIES = [
  { name: "Software", slug: "software" },
  { name: "Datos", slug: "datos" },
  { name: "Redes", slug: "redes" },
  { name: "Arquitectura", slug: "arquitectura" },
  { name: "Inteligencia Artificial", slug: "inteligencia-artificial" },
  { name: "Ciberseguridad", slug: "ciberseguridad" },
  { name: "Desarrollo Web", slug: "desarrollo-web" },
  { name: "Desarrollo Móvil", slug: "desarrollo-movil" },
  { name: "DevOps", slug: "devops" },
  { name: "Cloud Computing", slug: "cloud-computing" },
  { name: "Hardware e IoT", slug: "hardware-e-iot" },
  { name: "Gestión de TI", slug: "gestion-de-ti" },
  { name: "Sistemas Operativos", slug: "sistemas-operativos" },
  { name: "Innovación", slug: "innovacion" },
];

export function ArticleForm() {
  const [tab, setTab] = React.useState<"write" | "preview">("write");
  const [content, setContent] = React.useState("");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [imagePreview, setImagePreview] = React.useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val && !selectedCategories.includes(val)) {
      setSelectedCategories([...selectedCategories, val]);
    }
    e.target.value = "";
  };

  const removeCategory = (slug: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== slug));
  };

  const handleMdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setContent(e.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Strapi API
    console.log("Submit article");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="glass-panel p-6 rounded-2xl space-y-6 border-white/5">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-300">Título del Artículo</span>
            <input
              type="text"
              name="title"
              required
              className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#72004c]/50 transition-all font-heading text-lg"
              placeholder="Escribe un título llamativo..."
            />
          </label>

          <label className="block">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-300">Breve Descripción</span>
              <span className="text-xs text-gray-500">Max 80 caracteres</span>
            </div>
            <input
              type="text"
              name="description"
              maxLength={80}
              required
              className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#72004c]/50 transition-all"
              placeholder="Un resumen que atraiga al lector..."
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="block">
            <span className="text-sm font-medium text-gray-300">Categorías (Múltiples)</span>
            <select
              className="mt-1 w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#72004c]/50 transition-all appearance-none cursor-pointer"
              onChange={handleCategorySelect}
              defaultValue=""
            >
              <option value="" disabled>Añadir categoría...</option>
              {CATEGORIES.filter(c => !selectedCategories.includes(c.slug)).map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>

            {/* Badges Container */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedCategories.map(slug => {
                  const cat = CATEGORIES.find(c => c.slug === slug);
                  return (
                    <Badge
                      key={slug}
                      variant="secondary"
                      className="cursor-pointer bg-[#72004c]/20 text-white hover:bg-[#72004c]/40 border border-[#72004c]/50 transition-colors py-1 px-3"
                      onClick={() => removeCategory(slug)}
                      title="Haz clic para remover"
                    >
                      {cat?.name} <X className="w-3 h-3 ml-1 inline-block" />
                    </Badge>
                  );
                })}
              </div>
            )}
            {/* Hidden inputs to submit array data */}
            {selectedCategories.map(slug => (
              <input type="hidden" name="categories[]" value={slug} key={`hidden-${slug}`} />
            ))}
          </div>

          <label className="block">
            <span className="text-sm font-medium text-gray-300">Imagen de Portada (Opcional)</span>
            <div className="mt-1 flex items-center gap-3">
              <div className="flex-1 relative cursor-pointer group">
                <input
                  type="file"
                  name="cover"
                  accept="image/*,video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleImageUpload}
                />
                <div className="w-full bg-black/40 border border-white/10 border-dashed rounded-xl py-3 px-4 text-gray-400 group-hover:border-[#72004c]/50 group-hover:text-white transition-all flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  <span>Subir portada</span>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Markdown Editor */}
      {imagePreview && (
        <div className="glass-panel p-6 rounded-2xl space-y-6 border-white/5">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-300">Imagen de Portada</span>
              <img src={imagePreview} alt="Portada" className="w-full h-auto rounded-xl mt-2" />
            </label>
          </div>
        </div>
      )}
      <div className="glass-panel rounded-2xl border-white/5 overflow-hidden flex flex-col">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-black/60">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "write" ? "bg-[#72004c]/20 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Escribir
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "preview" ? "bg-[#006f87]/20 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Eye className="w-4 h-4 mr-2" />
              Vista Previa
            </button>
          </div>

          <div>
            <input
              type="file"
              accept=".md,.mdx"
              ref={fileInputRef}
              onChange={handleMdUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              title="Importar archivo Markdown (.md)"
            >
              <FileUp className="w-4 h-4 mr-2" />
              Importar .md
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="min-h-[400px] bg-[#060609] p-4">
          {tab === "write" ? (
            <textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] bg-transparent resize-y outline-none text-gray-300 font-mono text-sm leading-relaxed"
              placeholder="# Escribe el contenido de tu artículo aquí...&#10;&#10;Puedes usar sintaxis Markdown o HTML puro para darle formato. ¡También puedes arrastrar o importar un archivo .md!"
              required
            />
          ) : (
            <div className="min-h-[400px] text-gray-300 font-sans leading-relaxed">
              {content ? (
                <Post content={content} />
              ) : (
                <p className="text-gray-500 italic mt-8 text-center">No hay contenido para previsualizar. Escribe algo en la pestaña "Escribir".</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <GlassButton type="submit" variant="primary" className="pl-6 pr-8">
          <Send className="w-4 h-4 mr-2" />
          Publicar Artículo
        </GlassButton>
      </div>
    </form>
  );
}
