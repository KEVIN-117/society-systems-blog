"use client";

import * as React from "react";
import { GlassButton } from "@/components/atoms/GlassButton";
import { Badge } from "@/components/ui/badge";
import { FileUp, Edit3, Eye, Image as ImageIcon, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

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
                <div className="p-6 border border-white/5 rounded-xl bg-black/20 shadow-inner">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2 font-heading" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-6 mb-3 font-heading" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mt-5 mb-2 font-heading" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-4 text-gray-300" {...props} />,
                      a: ({ node, ...props }) => <a className="text-[#00b4db] hover:text-[#72004c] underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-300" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-300" {...props} />,
                      li: ({ node, ...props }) => <li className="marker:text-[#72004c]" {...props} />,
                      blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-[#72004c] pl-4 py-1 italic bg-[#72004c]/10 text-gray-400 mb-4 rounded-r-lg" {...props} />,
                      pre: ({ node, ...props }: any) => {
                        const codeNode = node.children?.[0];
                        if (codeNode && codeNode.type === 'element' && codeNode.tagName === 'code') {
                          const getText = (n: any): string => {
                            if (n.type === 'text') return n.value;
                            if (n.children) return n.children.map(getText).join('');
                            return '';
                          };
                          const codeString = getText(codeNode);
                          const className = codeNode.properties?.className || [];
                          const classNameStr = Array.isArray(className) ? className.join(' ') : String(className || '');
                          const match = /language-(\w+)/.exec(classNameStr);
                          
                          return (
                            <div className="relative rounded-xl overflow-hidden mb-4 border border-white/10 block mt-4">
                              <div className="absolute top-0 w-full h-8 bg-black/50 backdrop-blur-md flex items-center px-4 border-b border-white/10">
                                <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">{match ? match[1] : 'Code'}</span>
                              </div>
                              <pre className="bg-[#040406] p-4 pt-12 overflow-x-auto text-sm text-[#00b4db] font-mono m-0">
                                <code className={classNameStr}>{codeString}</code>
                              </pre>
                            </div>
                          );
                        }
                        return <pre {...props} />;
                      },
                      code: ({ node, className, children, ...props }: any) => {
                        return (
                          <code className="bg-[#72004c]/30 text-[#ff80c0] px-1.5 py-0.5 rounded-md font-mono text-sm border border-[#72004c]/50" {...props}>
                            {children}
                          </code>
                        );
                      },
                      img: ({ node, ...props }) => <img className="rounded-xl shadow-lg border border-white/10 mx-auto my-6 max-w-full h-auto" loading="lazy" {...props} />,
                      table: ({ node, ...props }) => <div className="overflow-x-auto mb-4"><table className="w-full text-left border-collapse" {...props} /></div>,
                      th: ({ node, ...props }) => <th className="border-b border-white/10 p-3 bg-black/40 text-white font-medium" {...props} />,
                      td: ({ node, ...props }) => <td className="border-b border-white/5 p-3 text-gray-300" {...props} />
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
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
