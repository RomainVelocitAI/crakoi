"use client";

import { useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  bucket: string;
  path: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({
  bucket,
  path,
  currentUrl,
  onUpload,
  label,
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Seules les images sont acceptées");
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 20 Mo");
        return;
      }

      setError(null);
      setUploading(true);
      setProgress(0);

      // Show local preview immediately
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      try {
        const supabase = createClient();

        // Simulate progress since Supabase doesn't provide upload progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 15, 85));
        }, 200);

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, { cacheControl: "3600", upsert: true });

        clearInterval(progressInterval);

        if (uploadError) {
          throw uploadError;
        }

        setProgress(100);

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(path);

        onUpload(publicUrl);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de l'upload"
        );
        setPreview(currentUrl || null);
      } finally {
        setUploading(false);
        URL.revokeObjectURL(localPreview);
      }
    },
    [bucket, path, currentUrl, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onUpload("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-sans text-text-secondary">
          {label}
        </label>
      )}

      {preview ? (
        <div className="relative group rounded-lg overflow-hidden border border-border bg-background">
          <div className="relative aspect-[16/10]">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 600px) 100vw, 400px"
              unoptimized
            />
          </div>

          {/* Upload progress overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 text-gold animate-spin" />
              <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-white/70">{progress}%</span>
            </div>
          )}

          {/* Remove button */}
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-3 py-10 px-6",
            "border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200",
            dragOver
              ? "border-gold bg-gold/5"
              : "border-border hover:border-text-muted hover:bg-surface"
          )}
        >
          <div
            className={cn(
              "p-3 rounded-full transition-colors",
              dragOver ? "bg-gold/10 text-gold" : "bg-surface text-text-muted"
            )}
          >
            {dragOver ? (
              <Upload className="h-5 w-5" />
            ) : (
              <ImageIcon className="h-5 w-5" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm text-text-secondary">
              {dragOver ? "Déposez l'image ici" : "Glissez-déposez ou cliquez"}
            </p>
            <p className="text-xs text-text-muted mt-1">
              PNG, JPG, WebP — Max 20 Mo
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
