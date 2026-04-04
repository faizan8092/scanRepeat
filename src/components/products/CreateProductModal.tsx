'use client';
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowLeft, Check, AlertTriangle, Loader2, Star, Layout, FileText, Link as LinkIcon, Image, Film } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import {
  Product, ProductType, QRSettings, defaultQR,
  generateShortCode, slugFromName, upsertProduct,
} from '@/src/types/product';
import { getBaseUrl } from '@/src/lib/api';
import { defaultTheme } from '@/src/types/builder';
import { QRCustomizer } from './QRCustomizer';
import { createProductApi, uploadFileApi } from '@/src/lib/product-service';
import { useToast } from '@/src/lib/toast-context';
import { Loader } from '@/src/components/ui/Loader';

type Step = 'type_select' | 'page_details' | 'file_details' | 'url_details' | 'qr_customizer';

interface CreateProductModalProps {
  onClose: () => void;
  onCreated?: (product: Product) => void;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Type card ────────────────────────────────────────────────────────────────
function TypeCard({ icon: Icon, title, desc, recommended, onClick }: { icon: any; title: string; desc: string; recommended?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative text-left rounded-2xl border-primary p-5 flex flex-col gap-3 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg group ${
        recommended
          ? 'border-primary/40 bg-primary/5 hover:border-primary shadow-sm'
          : 'border-slate-200 bg-white hover:border-primary/60'
      }`}
    >
      {recommended && (
        <span className="absolute -top-3 left-4 bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Star size={10} fill="currentColor" /> Recommended
        </span>
      )}
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon size={24} />
      </div>
      <div>
        <p className="font-bold text-sm text-slate-800">{title}</p>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
      </div>
      <div className={`mt-auto self-end w-7 h-7 rounded-full flex items-center justify-center text-white text-sm transition-all ${recommended ? 'bg-primary' : 'bg-slate-200 group-hover:bg-primary'}`}>
        →
      </div>
    </button>
  );
}

// ─── Short URL field ──────────────────────────────────────────────────────────
function ShortUrlField({ slug, onChange }: { slug: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Short URL</p>
      <div className="flex items-center gap-2 p-3 border-primary border-slate-100 rounded-xl bg-slate-50 hover:border-primary/40 transition-colors">
        <span className="text-sm text-slate-400 whitespace-nowrap font-mono">{getBaseUrl().replace(/^https?:\/\//, '')}/p/</span>
        {editing ? (
          <input
            autoFocus
            value={slug}
            onChange={e => onChange(slugify(e.target.value))}
            onBlur={() => setEditing(false)}
            className="flex-1 bg-transparent text-sm font-mono text-slate-800 outline-none"
          />
        ) : (
          <>
            <span className="flex-1 text-sm font-mono text-slate-800">{slug || '—'}</span>
            <button onClick={() => setEditing(true)} className="text-xs font-bold text-primary hover:underline">Edit</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── File Dropzone ────────────────────────────────────────────────────────────
function FileDropzone({ file, onFile }: { file: File | null; onFile: (f: File) => void }) {
  const onDrop = useCallback((files: File[]) => { if (files[0]) onFile(files[0]); }, [onFile]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1, maxSize: 20 * 1024 * 1024, accept: { 'application/pdf': [], 'image/*': [], 'video/*': [] } });

  return (
    <div
      {...getRootProps()}
      className={`border-primary border-accentashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
        isDragActive ? 'border-primary bg-primary/5' : file ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-primary/60 hover:bg-slate-50'
      }`}
    >
      <input {...getInputProps()} />
      {file ? (
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto text-slate-600">
            {file.type.includes('pdf') ? <FileText size={24} /> : file.type.includes('image') ? <Image size={24} /> : <Film size={24} />}
          </div>
          <p className="font-bold text-sm text-slate-800 truncate">{file.name}</p>
          <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(1)} MB · Click to change</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-2">
            <FileText size={24} />
          </div>
          <p className="font-medium text-sm text-slate-700">{isDragActive ? 'Drop it here!' : 'Drag & drop your file here'}</p>
          <p className="text-xs text-slate-400">or click to browse</p>
          <p className="text-[11px] text-slate-400 mt-3">PDF · JPG · PNG · MP4 · up to 20MB</p>
        </div>
      )}
    </div>
  );
}

// ─── Product thumbnail dropzone ───────────────────────────────────────────────
function ThumbnailUpload({ url, onFile, onUrl }: { url: string; onFile: (f: File) => void; onUrl: (v: string) => void }) {
  const onDrop = useCallback((files: File[]) => {
    if (files[0]) {
      onUrl(URL.createObjectURL(files[0]));
      onFile(files[0]);
    }
  }, [onUrl, onFile]);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 1, accept: { 'image/*': [] } });

  return (
    <div className="flex items-start gap-4">
      <div {...getRootProps()} className="w-28 h-28 rounded-2xl border-primary border-accentashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 hover:bg-slate-50 transition-all overflow-hidden shrink-0">
        <input {...getInputProps()} />
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-1">
              <Image size={16} />
            </div>
            <p className="text-[11px] text-slate-500">Upload Image</p>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-xs font-medium text-slate-600">Or paste image URL</p>
        <input value={url} onChange={e => onUrl(e.target.value)} placeholder="https://..." className="w-full text-sm p-2.5 border-primary border-slate-100 rounded-xl bg-white focus:border-primary outline-none" />
        <p className="text-[11px] text-slate-400">PNG, JPG up to 5MB. You can add this later.</p>
      </div>
    </div>
  );
}

// ─── URL Checker ──────────────────────────────────────────────────────────────
function UrlChecker({ url }: { url: string }) {
  const [status, setStatus] = React.useState<'idle' | 'checking' | 'ok' | 'fail'>('idle');
  React.useEffect(() => {
    if (!url.startsWith('http')) { setStatus('idle'); return; }
    setStatus('checking');
    const t = setTimeout(() => {
      // Simulate reachability check (real impl: HEAD /api/check-url?url=...)
      const ok = url.length > 10 && !url.includes('localhost');
      setStatus(ok ? 'ok' : 'fail');
    }, 600);
    return () => clearTimeout(t);
  }, [url]);
  if (status === 'idle') return null;
  if (status === 'checking') return <p className="text-xs text-slate-400 flex items-center gap-1"><Loader size={24} /> Checking URL...</p>;
  if (status === 'ok') return <p className="text-xs text-green-600 flex items-center gap-1"><Check size={12} /> URL is reachable</p>;
  return <p className="text-xs text-orange-500 flex items-center gap-1"><AlertTriangle size={12} /> Could not reach this URL</p>;
}

// ─── Step progress pill ───────────────────────────────────────────────────────
function StepPill({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`rounded-full transition-all ${i < step ? 'bg-primary' : 'bg-slate-200'} ${i === step - 1 ? 'w-6 h-2' : 'w-2 h-2'}`} />
      ))}
    </div>
  );
}

// ─── The modal ────────────────────────────────────────────────────────────────
export function CreateProductModal({ onClose, onCreated }: CreateProductModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('type_select');
  const [selectedType, setSelectedType] = useState<ProductType>('page_builder');

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [destUrl, setDestUrl] = useState('');
  const [qrSettings, setQrSettings] = useState<QRSettings>(defaultQR);
  const slugAutoSet = React.useRef(false);

  const [isCreating, setIsCreating] = useState(false);
  const { addToast } = useToast();

  const handleNameChange = (v: string) => {
    setName(v);
    if (!slugAutoSet.current) setSlug(slugFromName(v));
  };
  const handleSlugChange = (v: string) => { setSlug(v); slugAutoSet.current = true; };

  const handleTypeSelect = (type: ProductType) => {
    setSelectedType(type);
    setStep(type === 'page_builder' ? 'page_details' : type === 'file' ? 'file_details' : 'url_details');
  };

  const goToBuilder = async () => {
    setStep('qr_customizer');
  };

  const goToQRCustomizer = () => {
    setStep('qr_customizer');
  };

  const saveQRProduct = async (settings: QRSettings) => {
    try {
      setIsCreating(true);
      
      let finalThumbnail = thumbnailUrl;
      if (thumbnailFile) {
        const upload = await uploadFileApi(thumbnailFile);
        finalThumbnail = upload.url;
      }

      let finalFileUrl = undefined;
      let finalFileType = undefined;
      if (selectedType === 'file' && file) {
        const upload = await uploadFileApi(file);
        finalFileUrl = upload.url;
        finalFileType = file.type.includes('pdf') ? 'application/pdf' : file.type;
      }

      const p = await createProductApi({
        name,
        type: selectedType,
        thumbnailUrl: finalThumbnail,
        shortCode: slug || undefined,
        destinationUrl: selectedType === 'external_url' ? destUrl : undefined,
        fileUrl: finalFileUrl,
        fileType: finalFileType,
        // QR Settings mapping
        qrForeground: settings.foreground,
        qrBackground: settings.background,
        qrLogoUrl: settings.logoUrl || undefined,
        qrDotStyle: settings.dotStyle,
        qrErrorLevel: settings.errorLevel,
        qrLabelText: settings.labelText || undefined,
        qrMargin: settings.margin,
        status: selectedType === 'page_builder' ? 'draft' : 'published'
      });

      onCreated?.(p);

      if (selectedType === 'page_builder') {
        router.push(`/dashboard/builder/${p.id}`);
        // Only close after a tiny delay or let the route change handle it
        setTimeout(onClose, 100);
      } else {
        onClose();
        addToast('success', 'Product created!', 'Your new QR campaign is ready.');
      }
    } catch (err: any) {
      addToast('error', 'Creation failed', err.message || 'Could not create product on the server.');
    } finally {
      setIsCreating(false);
    }
  };

  const canContinuePageDetails = name.trim().length > 0;
  const canContinueFile = name.trim().length > 0 && file !== null;
  const canContinueUrl = name.trim().length > 0 && destUrl.startsWith('http');

  const backMap: Partial<Record<Step, Step>> = {
    page_details: 'type_select',
    file_details: 'type_select',
    url_details: 'type_select',
    qr_customizer: selectedType === 'page_builder' ? 'page_details' : selectedType === 'file' ? 'file_details' : 'url_details',
  };

  return (
    <div className="fixed inset-0 z-[9980] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white rounded-3xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col"
        style={{ maxHeight: '92vh', animation: 'modalIn 0.18s ease-out' }}
      >
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>

        {isCreating && (
          <div className="absolute inset-0 z-[9990] bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1">
            <Loader size={120} />
            <p className="text-sm font-bold text-slate-800 -mt-4">Creating your product...</p>
            <p className="text-xs text-slate-500 tracking-wide uppercase">Finalizing your QR code</p>
          </div>
        )}

        {/* ──────────────── TYPE SELECT ──────────────────────────────── */}
        {step === 'type_select' && (
          <>
            <div className="flex items-center justify-between px-8 pt-8 pb-2">
              <div>
                <h2 className="text-primaryxl font-bold text-slate-900">What would you like to create?</h2>
                <p className="text-sm text-slate-500 mt-1">Choose how your QR code will work</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-3 gap-4 p-8 pt-6">
              <TypeCard
                icon={Layout}
                title="Product Page Builder"
                desc="Build a full mobile-optimized page with sections, videos, reviews, offers and reorder CTA."
                recommended
                onClick={() => handleTypeSelect('page_builder')}
              />
              <TypeCard
                icon={FileText}
                title="File / PDF"
                desc="Upload a PDF, image or document. QR code will open the file directly."
                onClick={() => handleTypeSelect('file')}
              />
              <TypeCard
                icon={LinkIcon}
                title="External URL"
                desc="Point the QR to any website, Shopify store, or product listing."
                onClick={() => handleTypeSelect('external_url')}
              />
            </div>
          </>
        )}

        {/* ──────────── PAGE BUILDER DETAILS ────────────────────────── */}
        {step === 'page_details' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-8 pt-7 pb-5 border-b shrink-0">
              <button onClick={() => setStep('type_select')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mr-2"><ArrowLeft size={16} /> Back</button>
              <div className="flex-1">
                <h2 className="font-bold text-lg">Create Product — Step 1 of 2</h2>
              </div>
              <StepPill step={1} total={2} />
              <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Product Name <span className="text-red-500">*</span></label>
                <input
                  autoFocus
                  value={name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. Whey Protein 2.0"
                  className="w-full text-base p-3.5 border-primary border-slate-100 rounded-2xl bg-white focus:border-primary outline-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Product Image <span className="text-slate-400 font-normal">(optional)</span></label>
                <ThumbnailUpload url={thumbnailUrl} onFile={setThumbnailFile} onUrl={setThumbnailUrl} />
              </div>
              <ShortUrlField slug={slug} onChange={handleSlugChange} />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t shrink-0 bg-white">
              <button disabled={!canContinuePageDetails} onClick={goToBuilder} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none transition-colors">
                Continue to Builder →
              </button>
            </div>
          </div>
        )}

        {/* ──────────── FILE DETAILS ─────────────────────────────────── */}
        {step === 'file_details' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-8 pt-7 pb-5 border-b shrink-0">
              <button onClick={() => setStep('type_select')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mr-2"><ArrowLeft size={16} /> Back</button>
              <div className="flex-1"><h2 className="font-bold text-lg">Create Product — File / PDF</h2></div>
              <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Product Name <span className="text-red-500">*</span></label>
                <input autoFocus value={name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Product Brochure" className="w-full text-base p-3.5 border-primary border-slate-100 rounded-2xl bg-white focus:border-primary outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Upload File <span className="text-red-500">*</span></label>
                <FileDropzone file={file} onFile={setFile} />
              </div>
              <ShortUrlField slug={slug} onChange={handleSlugChange} />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t shrink-0 bg-white">
              <button disabled={!canContinueFile} onClick={goToQRCustomizer} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none transition-colors">
                Continue to QR Customizer →
              </button>
            </div>
          </div>
        )}

        {/* ──────────── URL DETAILS ──────────────────────────────────── */}
        {step === 'url_details' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-8 pt-7 pb-5 border-b shrink-0">
              <button onClick={() => setStep('type_select')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mr-2"><ArrowLeft size={16} /> Back</button>
              <div className="flex-1"><h2 className="font-bold text-lg">Create Product — External URL</h2></div>
              <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Product Name <span className="text-red-500">*</span></label>
                <input autoFocus value={name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Shopify Store" className="w-full text-base p-3.5 border-primary border-slate-100 rounded-2xl bg-white focus:border-primary outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Destination URL <span className="text-red-500">*</span></label>
                <input value={destUrl} onChange={e => setDestUrl(e.target.value)} placeholder="https://yourstore.com/product/..." className="w-full text-base p-3.5 border-primary border-slate-100 rounded-2xl bg-white focus:border-primary outline-none" />
                <div className="pt-1"><UrlChecker url={destUrl} /></div>
              </div>
              <ShortUrlField slug={slug} onChange={handleSlugChange} />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t shrink-0 bg-white">
              <button disabled={!canContinueUrl} onClick={goToQRCustomizer} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none transition-colors">
                Continue to QR Customizer →
              </button>
            </div>
          </div>
        )}

        {/* ──────────── QR CUSTOMIZER ────────────────────────────────── */}
        {step === 'qr_customizer' && (
          <div className="flex flex-col" style={{ height: '80vh' }}>
            <QRCustomizer
              productName={name}
              shortCode={slug || generateShortCode(8)}
              initialSettings={qrSettings}
              onBack={() => setStep(backMap[step] || 'type_select')}
              onSave={saveQRProduct}
              saveLabel="Save & Add to List →"
            />
          </div>
        )}
      </div>
    </div>
  );
}
