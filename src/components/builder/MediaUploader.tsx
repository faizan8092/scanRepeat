'use client';
import React, { useRef, useState } from 'react';
import { UploadCloud, Link2, X, AlertCircle, CheckCircle } from 'lucide-react';
import { apiFetch, getApiUrl } from '@/src/lib/api';
import { Loader } from '@/src/components/ui/Loader';

// ─── Types ────────────────────────────────────────────────────────────────────
export type MediaType = 'image' | 'video';

interface MediaUploaderProps {
  type: MediaType;
  onUploaded: (url: string) => void;
  label?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';
const VIDEO_ACCEPT = 'video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska';

const IMAGE_MIME_LABELS = 'JPEG, PNG, WebP, GIF';
const VIDEO_MIME_LABELS = 'MP4, WebM, MOV, AVI, MKV';

const IMAGE_MAX_MB = 5;
const VIDEO_MAX_MB = 50;

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_MIMES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];

// ─── Main Component ───────────────────────────────────────────────────────────
export function MediaUploader({ type, onUploaded, label }: MediaUploaderProps) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [fileKey, setFileKey] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const isImage = type === 'image';
  const maxMB = isImage ? IMAGE_MAX_MB : VIDEO_MAX_MB;
  const allowedMimes = isImage ? IMAGE_MIMES : VIDEO_MIMES;
  const mimeLabels = isImage ? IMAGE_MIME_LABELS : VIDEO_MIME_LABELS;
  const accept = isImage ? IMAGE_ACCEPT : VIDEO_ACCEPT;
  const endpoint = isImage ? '/upload/image' : '/upload/video';

  const clearState = () => {
    setError(null);
    setSuccess(false);
  };

  const handleFile = async (file: File) => {
    clearState();

    if (!allowedMimes.includes(file.type)) {
      setError(`Invalid file type. Allowed: ${mimeLabels}`);
      return;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxMB) {
      setError(`File is too large. Max allowed: ${maxMB}MB (your file: ${sizeMB.toFixed(1)}MB)`);
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await apiFetch<{ data: { url: string } }>(getApiUrl(endpoint), {
        method: 'POST',
        body: fd,
      });
      setSuccess(true);
      onUploaded(res.data.url);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleUrlSubmit = () => {
    clearState();
    if (!urlInput.trim()) {
      setError('Please enter a URL.');
      return;
    }
    try {
      new URL(urlInput.trim());
    } catch {
      setError('Please enter a valid URL (must start with https://).');
      return;
    }
    onUploaded(urlInput.trim());
    setUrlInput('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{label}</p>}

      {/* Tab Switch */}
      <div className="flex bg-slate-100 rounded-lg p-0.5">
        {(['upload', 'url'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); clearState(); }}
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${
              tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t === 'upload' ? '📁 Upload' : '🔗 URL'}
          </button>
        ))}
      </div>

      {tab === 'upload' ? (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => !uploading && fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all group ${
            uploading
              ? 'border-primary/50 bg-primary/5'
              : 'border-slate-200 hover:border-primary/40 hover:bg-primary/3'
          }`}
        >
          <input
            key={fileKey}
            ref={fileRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) { handleFile(f); setFileKey(k => k + 1); } }}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-1 py-1">
              <Loader size={45} />
              <p className="text-[11px] text-primary font-bold">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-1">
              <UploadCloud size={22} className="text-slate-400 group-hover:text-primary transition-colors" />
              <p className="text-xs font-semibold text-slate-600">
                Drop {isImage ? 'image' : 'video'} here or <span className="text-primary underline">browse</span>
              </p>
              <p className="text-[10px] text-slate-400">{mimeLabels} · Max {maxMB}MB</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={e => { setUrlInput(e.target.value); clearState(); }}
            onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
            placeholder={isImage ? 'https://example.com/image.jpg' : 'https://example.com/video.mp4'}
            className="flex-1 text-xs p-2 border-2 border-slate-100 rounded-xl bg-white outline-none focus:border-primary"
          />
          <button
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
            className="px-3 py-2 text-xs font-bold bg-primary text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex items-center gap-1"
          >
            <Link2 size={12} /> Add
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {success && !error && (
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700">
          <CheckCircle size={14} />
          <span>{isImage ? 'Image' : 'Video'} {tab === 'url' ? 'URL set' : 'uploaded'} successfully!</span>
        </div>
      )}
    </div>
  );
}
