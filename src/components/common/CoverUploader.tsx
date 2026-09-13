import React, { useState, useRef } from 'react';
import { Upload, Check, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api.ts';

interface CoverUploaderProps {
  productId: string;
  bookTitle?: string;
  onUploaded?: (newImageUrl: string) => void;
  className?: string;
  buttonLabel?: string;
}

export const CoverUploader: React.FC<CoverUploaderProps> = ({
  productId,
  bookTitle,
  onUploaded,
  className = '',
  buttonLabel = 'Upload Original Cover File'
}) => {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file) return;
    try {
      setUploading(true);
      setError(null);
      setSuccess(false);

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target?.result as string;
          if (!base64Data) {
            throw new Error('Failed to read image file.');
          }

          const res = await api.uploadCover(productId, file.name, base64Data);
          if (res.success && res.imageUrl) {
            setSuccess(true);
            if (onUploaded) {
              onUploaded(res.imageUrl);
            }
            setTimeout(() => setSuccess(false), 4000);
          }
        } catch (err: any) {
          console.error('Upload failed:', err);
          setError(err.message || 'Upload failed. Please try again.');
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read selected file.');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Upload error');
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jfif,.jpg,.jpeg,.png,.webp,.svg"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`group/btn cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-md ${
          isDragOver
            ? 'bg-cyan-500/30 border-2 border-cyan-400 text-cyan-200'
            : success
            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
            : 'bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-white'
        }`}
        title={bookTitle ? `Upload exact cover for ${bookTitle}` : 'Upload exact image file'}
      >
        {uploading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>Updating Cover...</span>
          </>
        ) : success ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exact Cover Applied!</span>
          </>
        ) : (
          <>
            <Upload className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:scale-110 transition-transform" />
            <span>{buttonLabel}</span>
          </>
        )}
      </div>

      {error && (
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-rose-400 font-mono">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
