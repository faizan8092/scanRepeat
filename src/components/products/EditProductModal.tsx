'use client';
import React, { useState, useCallback } from 'react';
import { X, Check, Loader2, AlertTriangle, FileText, Link as LinkIcon, Image, Film } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Product, slugFromName } from '@/src/types/product';
import { updateProductApi, uploadFileApi } from '@/src/lib/product-service';
import { useToast } from '@/src/lib/toast-context';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onUpdated: (product: Product) => void;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function EditProductModal({ product, onClose, onUpdated }: EditProductModalProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form state initialized with product data
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.shortCode);
  const [thumbnailUrl, setThumbnailUrl] = useState(product.thumbnailUrl || '');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [destUrl, setDestUrl] = useState(product.destinationUrl || '');
  const [file, setFile] = useState<File | null>(null);
  const [currentFileUrl, setCurrentFileUrl] = useState(product.fileUrl || '');

  const handleSave = async () => {
    try {
      setLoading(true);

      let finalThumbnail = thumbnailUrl;
      if (thumbnailFile) {
        const upload = await uploadFileApi(thumbnailFile);
        finalThumbnail = upload.url;
      }

      let finalFileUrl = currentFileUrl;
      let finalFileType = product.fileType;
      if (product.type === 'file' && file) {
        const upload = await uploadFileApi(file);
        finalFileUrl = upload.url;
        finalFileType = file.type.includes('pdf') ? 'application/pdf' : file.type;
      }

      const updated = await updateProductApi(product.id, {
        name,
        shortCode: slug,
        thumbnailUrl: finalThumbnail,
        destinationUrl: product.type === 'external_url' ? destUrl : undefined,
        fileUrl: product.type === 'file' ? finalFileUrl : undefined,
        fileType: product.type === 'file' ? finalFileType : undefined,
      });

      addToast('success', 'Changes saved', 'Product details updated successfully.');
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      addToast('error', 'Update failed', err.message || 'Could not save changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <h2 className="text-xl font-bold text-slate-900">Edit Details</h2>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Campaign Name</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Summer Sale" 
              className="w-full text-base p-3 border-2 border-slate-100 rounded-xl bg-white focus:border-primary outline-none" 
            />
          </div>

          {/* Short Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Short Code</label>
            <div className="flex items-center gap-2 p-3 border-2 border-slate-100 rounded-xl bg-slate-50">
              <span className="text-sm text-slate-400 font-mono">/p/</span>
              <input 
                value={slug} 
                onChange={e => setSlug(slugify(e.target.value))} 
                className="flex-1 bg-transparent text-sm font-mono text-slate-800 outline-none" 
              />
            </div>
          </div>

          {/* Type Specific Fields */}
          {product.type === 'external_url' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Destination URL</label>
              <input 
                value={destUrl} 
                onChange={e => setDestUrl(e.target.value)} 
                placeholder="https://..." 
                className="w-full text-base p-3 border-2 border-slate-100 rounded-xl bg-white focus:border-primary outline-none" 
              />
            </div>
          )}

          {product.type === 'file' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Product File</label>
              <FileEditZone file={file} currentUrl={currentFileUrl} onFile={setFile} />
            </div>
          )}

          {/* Thumbnail */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Thumbnail Image</label>
            <ThumbnailEditZone url={thumbnailUrl} onFile={setThumbnailFile} onUrl={setThumbnailUrl} />
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3 bg-white shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading || !name} 
            className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function FileEditZone({ file, currentUrl, onFile }: { file: File | null; currentUrl: string; onFile: (f: File) => void }) {
  const onDrop = useCallback((files: File[]) => { if (files[0]) onFile(files[0]); }, [onFile]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-all bg-slate-50/50">
      <input {...getInputProps()} />
      {file ? (
        <p className="text-sm font-bold text-primary truncate max-w-[300px] mx-auto">New file: {file.name}</p>
      ) : (
        <div className="space-y-1 text-slate-500">
           <p className="text-sm font-medium">{isDragActive ? 'Drop to upload' : 'Drag or click to replace current file'}</p>
           {currentUrl && <p className="text-[10px] opacity-70 truncate max-w-[200px] mx-auto">Current: {currentUrl.split('/').pop()}</p>}
        </div>
      )}
    </div>
  );
}

function ThumbnailEditZone({ url, onUrl, onFile }: { url: string; onUrl: (v: string) => void; onFile: (f: File) => void }) {
  const onDrop = useCallback((files: File[]) => {
    if (files[0]) {
      onUrl(URL.createObjectURL(files[0]));
      onFile(files[0]);
    }
  }, [onUrl, onFile]);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 1, accept: { 'image/*': [] } });

  return (
    <div className="flex gap-4">
      <div {...getRootProps()} className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-primary/50 overflow-hidden shrink-0">
        <input {...getInputProps()} />
        {url ? <img src={url} alt="" className="w-full h-full object-cover" /> : <Image size={20} className="text-slate-400" />}
      </div>
      <input 
        value={url} 
        onChange={e => onUrl(e.target.value)} 
        placeholder="Or paste image URL..." 
        className="flex-1 text-sm p-3 border-2 border-slate-100 rounded-xl bg-white focus:border-primary outline-none h-20" 
      />
    </div>
  );
}
