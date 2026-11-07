// src/components/form/file-upload.tsx
"use client";

import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type FileUploadProps = {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
};

export function FileUpload({
  label = "Upload file",
  value,
  onChange,
  accept = "image/*",
  maxSize = 5,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");
  const [preview, setPreview] = useState<string>(value || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onChange(result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-[13px] font-medium text-im-ink">
          {label}
        </label>
      )}

      <div className="relative">
        {preview ? (
          <div className="relative rounded-xl border border-black/10 overflow-hidden bg-im-surface">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 object-contain p-4"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors"
            >
              <X className="size-4 text-im-ink" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full h-32 rounded-xl border-2 border-dashed border-black/10 bg-im-surface/50 hover:bg-im-surface transition-colors flex flex-col items-center justify-center gap-2"
          >
            <div className="grid size-10 place-items-center rounded-full bg-white">
              <Upload className="size-5 text-im-muted" />
            </div>
            <span className="text-[13px] font-medium text-im-ink">
              Click to upload
            </span>
            <span className="text-[11px] text-im-muted">
              PNG, JPG up to {maxSize}MB
            </span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && <p className="text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}
