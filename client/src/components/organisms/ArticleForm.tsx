"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { GlassButton } from "@/components/atoms/GlassButton";
import { Badge } from "@/components/ui/badge";
import { FileUp, Edit3, Eye, Image as ImageIcon, Send, X, Save } from "lucide-react";
import Post from "../molecules/Post";
import { Article, Category, CreateArticleInput, createArticleSchema } from "@/model/article.schema";
import * as articleService from "@/actions/article";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axiosClient from "@/datasource/local/axios";
import { Loader } from "@/components/atoms/Loader";
import { ErrorFieldInfo } from "@/components/atoms/ErrorFieldInfo";
import { CoverPicker } from "@/components/molecules/CoverPicker";

interface ArticleFormProps {
    initialData?: Article;
}

export function ArticleForm({ initialData }: ArticleFormProps) {
    const [tab, setTab] = React.useState<"write" | "preview">("write");
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [imagePreview, setImagePreview] = React.useState<string | null>(
        initialData?.cover?.url
            ? (initialData.cover.url.startsWith('http') ? initialData.cover.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${initialData.cover.url}`)
            : null
    );
    const [coverId, setCoverId] = React.useState<number | null>(initialData?.cover?.id || null);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const router = useRouter();

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await articleService.getCategories();
                setCategories(res.data);
            } catch (err) {
                console.error("Failed to fetch categories");
            }
        };
        fetchCategories();
    }, []);

    const form = useForm({
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            content: initialData?.content || "",
            slug: initialData?.slug || "",
            categories: initialData?.categories?.map(c => c.documentId) || [],
            cover: initialData?.cover?.id || null,
            publishedAt: initialData?.publishedAt || new Date().toISOString(), // Default to published
        } as CreateArticleInput,
        onSubmit: async ({ value }) => {
            try {
                const payload = {
                    ...value,
                    slug: value.slug || value.title.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, ''),
                    cover: coverId
                };

                if (initialData) {
                    await articleService.updateArticle(initialData.documentId, payload);
                    toast({ title: "Artículo actualizado", description: "Tu artículo ha sido guardado exitosamente." });
                } else {
                    await articleService.createArticle(payload);
                    toast({ title: "Artículo creado", description: "Tu artículo ha sido creado exitosamente." });
                }
                router.push('/dashboard/articles');
                router.refresh();
            } catch (err: any) {
                toast({
                    variant: "destructive",
                    title: "Error al guardar",
                    description: err.response?.data?.error?.message || "Ocurrió un error inesperado.",
                });
            }
        },
    });

    const handleMdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            form.setFieldValue('content', result);
        };
        reader.readAsText(file);
    };

    const handleCoverSelect = (id: number, url: string) => {
        setCoverId(id);
        setImagePreview(url);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-8 max-w-4xl mx-auto"
        >
            <div className="glass-panel p-6 rounded-2xl space-y-6 border-white/5">
                <div className="space-y-4">
                    <form.Field
                        name="title"
                        children={(field) => (
                            <label className="block">
                                <span className="text-sm font-medium text-gray-300">Título del Artículo</span>
                                <input
                                    type="text"
                                    name={field.name}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#72004c]/50 transition-all font-heading text-lg"
                                    placeholder="Escribe un título llamativo..."
                                />
                                <ErrorFieldInfo field={field} />
                            </label>
                        )}
                    />

                    <form.Field
                        name="description"
                        children={(field) => (
                            <label className="block">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-300">Breve Descripción</span>
                                    <span className="text-xs text-gray-500">Max 200 caracteres</span>
                                </div>
                                <input
                                    type="text"
                                    name={field.name}
                                    maxLength={200}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#72004c]/50 transition-all"
                                    placeholder="Un resumen que atraiga al lector..."
                                />
                                <ErrorFieldInfo field={field} />
                            </label>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form.Field
                        name="categories"
                        children={(field) => (
                            <div className="block">
                                <span className="text-sm font-medium text-gray-300">Categorías</span>
                                <select
                                    className="mt-1 w-full bg-[#0a0a0f] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#72004c]/50 transition-all appearance-none cursor-pointer"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val && !field.state.value.includes(val)) {
                                            field.handleChange([...field.state.value, val]);
                                        }
                                        e.target.value = "";
                                    }}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Añadir categoría...</option>
                                    {categories.filter(c => !field.state.value.includes(c.documentId)).map(cat => (
                                        <option key={cat.documentId} value={cat.documentId}>{cat.name}</option>
                                    ))}
                                </select>

                                {field.state.value.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {field.state.value.map(docId => {
                                            const cat = categories.find(c => c.documentId === docId);
                                            return (
                                                <Badge
                                                    key={docId}
                                                    variant="secondary"
                                                    className="cursor-pointer bg-[#00b4db]/10 text-white hover:bg-[#00b4db]/30 border border-[#00b4db]/50 transition-colors py-1 px-3"
                                                    onClick={() => field.handleChange(field.state.value.filter(c => c !== docId))}
                                                    title="Haz clic para remover"
                                                >
                                                    {cat?.name || 'Cargando...'} <X className="w-3 h-3 ml-1 inline-block" />
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                )}
                                <ErrorFieldInfo field={field} />
                            </div>
                        )}
                    />

                    <label className="block">
                        <span className="text-sm font-medium text-gray-300">Imagen de Portada</span>
                        <div className="mt-1 flex items-center gap-3">
                            <CoverPicker
                                currentCoverId={coverId}
                                currentPreview={imagePreview}
                                onCoverSelect={handleCoverSelect}
                            />
                        </div>
                    </label>
                </div>
            </div>

            {imagePreview && (
                <div className="glass-panel p-6 rounded-2xl space-y-6 border-white/5">
                    <div className="space-y-4">
                        <span className="text-sm font-medium text-gray-300">Previsualización de Portada</span>
                        <img src={imagePreview} alt="Portada" className="w-full h-48 object-cover rounded-xl mt-2 border border-white/10" />
                    </div>
                </div>
            )}

            <div className="glass-panel rounded-2xl border-white/5 overflow-hidden flex flex-col">
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
                        <input type="file" accept=".md,.mdx" ref={fileInputRef} onChange={handleMdUpload} className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                            <FileUp className="w-4 h-4 mr-2" />
                            Importar .md
                        </button>
                    </div>
                </div>

                <div className="min-h-[400px] bg-[#060609] p-4">
                    <form.Field
                        name="content"
                        children={(field) => (
                            <>
                                {tab === "write" ? (
                                    <textarea
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="w-full min-h-[400px] bg-transparent resize-y outline-none text-gray-300 font-mono text-sm leading-relaxed"
                                        placeholder="# Escribe el contenido de tu artículo aquí...&#10;&#10;Puedes usar sintaxis Markdown o HTML puro."
                                    />
                                ) : (
                                    <div className="min-h-[400px] text-gray-300 font-sans leading-relaxed">
                                        {field.state.value ? <Post content={field.state.value} /> : <p className="text-gray-500 italic mt-8 text-center">No hay contenido para previsualizar.</p>}
                                    </div>
                                )}
                                <ErrorFieldInfo field={field} />
                            </>
                        )}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <form.Field
                    name="publishedAt"
                    children={(field) => (
                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isFormSubmitting]) => (
                                <>
                                    <GlassButton
                                        type="button"
                                        disabled={!canSubmit || isFormSubmitting}
                                        onClick={() => {
                                            field.handleChange(null);
                                            form.handleSubmit();
                                        }}
                                        className="px-6 border-white/10 text-gray-300 hover:text-white"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Guardar Borrador
                                    </GlassButton>

                                    <GlassButton
                                        type="button"
                                        disabled={!canSubmit || isFormSubmitting}
                                        onClick={() => {
                                            field.handleChange(new Date().toISOString());
                                            form.handleSubmit();
                                        }}
                                        variant="primary"
                                        className="pl-6 pr-8"
                                    >
                                        {isFormSubmitting && field.state.value !== null ? (
                                            <Loader variant="inverse" direction="row" text="Publicando..." />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                {initialData?.publishedAt ? "Actualizar Artículo" : "Publicar Artículo"}
                                            </>
                                        )}
                                    </GlassButton>
                                </>
                            )}
                        />
                    )}
                />
            </div>
        </form>
    );
}
