"use client";

import * as React from "react";
import { Image as ImageIcon, UploadCloud, CheckCircle2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GlassButton } from "@/components/atoms/GlassButton";
import { Loader } from "@/components/atoms/Loader";
import axiosClient from "@/datasource/local/axios";
import { useToast } from "@/hooks/use-toast";

interface CoverPickerProps {
  currentCoverId: number | null;
  currentPreview: string | null;
  onCoverSelect: (id: number, url: string) => void;
}

export function CoverPicker({ currentCoverId, currentPreview, onCoverSelect }: CoverPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      // Ordenar por createdAt:desc para ver los más recientes primero
      const res = await axiosClient.get("/upload/files?sort=createdAt:desc");
      setFiles(res.data);
    } catch (error) {
      console.error("Error fetching media files", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las imágenes.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchFiles();
    }
  }, [open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("files", file);

      const response = await axiosClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.length > 0) {
        toast({ title: "Imagen subida", description: "La imagen se ha subido y guardado." });
        // Recargar la lista de imágenes para que aparezca la nueva
        fetchFiles();
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error al subir",
        description: "No se pudo subir la imagen.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const selectImage = (file: any) => {
    const url = file.url.startsWith("http")
      ? file.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${file.url}`;
    onCoverSelect(file.id, url);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex-1 relative cursor-pointer group w-full text-left">
        <div className="w-full bg-black/40 border border-white/10 border-dashed rounded-xl py-3 px-4 text-gray-400 group-hover:border-[#72004c]/50 group-hover:text-white transition-all flex items-center justify-center">
            <>
              <ImageIcon className="w-5 h-5 mr-2" />
              <span>{currentPreview ? "Cambiar portada" : "Seleccionar portada"}</span>
            </>
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl bg-[#0a0a0f] border-white/10 p-6 flex flex-col h-full">
        <SheetHeader className="mb-6 px-0">
          <SheetTitle className="text-white text-xl">Galería de Medios</SheetTitle>
          <SheetDescription className="text-gray-400">
            Selecciona una imagen existente o sube una nueva para tu portada.
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center gap-4 mb-6">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <GlassButton
            type="button"
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full sm:w-auto"
          >
            {isUploading ? (
              <Loader variant="inverse" direction="row" text="Subiendo..." />
            ) : (
              <>
                <UploadCloud className="w-4 h-4 mr-2" />
                Subir nueva imagen
              </>
            )}
          </GlassButton>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader variant="inverse" />
            </div>
          ) : files.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              No hay imágenes disponibles. Sube una nueva.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {files.map((file) => {
                const isSelected = file.id === currentCoverId;
                const url = file.formats?.small?.url || file.url;
                const fullUrl = url.startsWith("http")
                  ? url
                  : `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${url}`;

                return (
                  <div
                    key={file.id}
                    onClick={() => selectImage(file)}
                    className={`relative group cursor-pointer rounded-xl overflow-hidden aspect-square border-2 transition-all ${isSelected ? "border-[#00b4db]" : "border-transparent hover:border-white/20"
                      }`}
                  >
                    <img
                      src={fullUrl}
                      alt={file.alternativeText || file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                        Seleccionar
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-black/50 rounded-full">
                        <CheckCircle2 className="text-[#00b4db] w-6 h-6" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
