import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Film, X, Loader2, Replace } from 'lucide-react';
import { cn } from './TextField';

type MediaUploaderProps = {
  label: string;
  url: string | null;
  onUploadSuccess: (url: string) => void;
  onDeleteSuccess: () => void;
  type?: 'image' | 'video';
  className?: string;
};

export default function MediaUploader({ label, url, onUploadSuccess, onDeleteSuccess, type = 'image', className }: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }
      onUploadSuccess(data.data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  return (
    <div className={cn("mb-6", className)}>
      <label className="block text-sm font-semibold text-slate-800 mb-2">{label}</label>
      
      {url ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm aspect-video max-w-sm">
          {type === 'image' ? (
            <img src={url} alt="Uploaded media" className="w-full h-full object-cover" />
          ) : (
            <video src={url} className="w-full h-full object-cover" controls />
          )}
          
          {/* Overlay actions on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
            <button 
              onClick={() => inputRef.current?.click()}
              className="bg-white/90 text-slate-800 p-2 rounded-full hover:bg-white hover:scale-105 transition-all shadow-sm"
              title="Replace"
            >
              <Replace className="w-5 h-5" />
            </button>
            <button 
              onClick={onDeleteSuccess}
              className="bg-red-500/90 text-white p-2 rounded-full hover:bg-red-500 hover:scale-105 transition-all shadow-sm"
              title="Remove"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <input 
            type="file" 
            ref={inputRef}
            className="hidden" 
            accept={type === 'image' ? 'image/*' : 'video/*'} 
            onChange={(e) => handleFileChange(e.target.files?.[0])} 
            disabled={isUploading} 
          />
        </div>
      ) : (
        <div 
          className={cn(
            "flex flex-col items-center justify-center w-full max-w-sm h-48 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer",
            isDragActive 
              ? "border-blue-500 bg-blue-50/50" 
              : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-500">
              <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">Click or drag to upload</span>
              <span className="text-xs text-slate-400 mt-1">
                {type === 'image' ? 'SVG, PNG, JPG or GIF' : 'MP4, WebM or OGG'}
              </span>
            </div>
          )}
          <input 
            type="file" 
            ref={inputRef}
            className="hidden" 
            accept={type === 'image' ? 'image/*' : 'video/*'} 
            onChange={(e) => handleFileChange(e.target.files?.[0])} 
            disabled={isUploading} 
          />
        </div>
      )}
      {error && <p className="text-red-500 text-sm font-medium mt-2">{error}</p>}
    </div>
  );
}
