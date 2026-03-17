'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Eye, Edit, QrCode, BarChart2, MoreVertical, Copy, Archive, Trash2, Globe, FileText,
  ExternalLink, X, BarChart3, Smartphone, Repeat,
} from 'lucide-react';
import { Product, upsertProduct, deleteProduct, archiveProduct } from '@/src/types/product';
import { QRCodeModal } from './QRCodeModal';
import { QRCustomizer } from './QRCustomizer';
import { QRCodeDisplay } from './QRCodeDisplay';

interface ProductCardProps {
  product: Product;
  onUpdate: (p: Product) => void;
  onDelete: (id: string) => void;
}

const TYPE_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  page_builder: { label: 'Page Builder', color: 'bg-blue-100 text-blue-700', icon: <Edit size={11} /> },
  file: { label: 'File / PDF', color: 'bg-orange-100 text-orange-700', icon: <FileText size={11} /> },
  external_url: { label: 'External URL', color: 'bg-purple-100 text-purple-700', icon: <ExternalLink size={11} /> },
};

function StatusBadge({ status }: { status: Product['status'] }) {
  if (status === 'published') return (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Published
    </span>
  );
  if (status === 'draft') return (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Draft
    </span>
  );
  if (status === 'archived') return (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />Archived
    </span>
  );
  return null;
}

function Thumbnail({ product }: { product: Product }) {
  if (product.thumbnailUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={product.thumbnailUrl} alt={product.name} className="w-full h-full object-cover" />
    );
  }
  const icons: Record<Product['type'], React.ReactNode> = {
    page_builder: <Globe size={28} className="text-blue-400" />,
    file: <FileText size={28} className="text-orange-400" />,
    external_url: <ExternalLink size={28} className="text-purple-400" />,
  };
  const bgs: Record<Product['type'], string> = {
    page_builder: 'bg-blue-50',
    file: 'bg-orange-50',
    external_url: 'bg-purple-50',
  };
  return (
    <div className={`w-full h-full flex items-center justify-center ${bgs[product.type]}`}>
      {icons[product.type]}
    </div>
  );
}

function MoreMenu({ product, onRename, onDuplicate, onArchive, onDelete }: {
  product: Product;
  onRename: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="h-8 px-2.5 flex items-center gap-0.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors text-xs font-medium">
        <MoreVertical size={14} />
      </button>
      {open && (
        <div className="absolute right-0 bottom-full mb-1 w-44 bg-white rounded-xl shadow-xl border z-50 py-1 overflow-hidden">
          {[
            { label: 'Rename', icon: <Edit size={13} />, action: onRename },
            { label: 'Duplicate', icon: <Copy size={13} />, action: onDuplicate },
            { label: product.status === 'archived' ? 'Unarchive' : 'Archive', icon: <Archive size={13} />, action: onArchive },
            { label: 'Delete', icon: <Trash2 size={13} />, action: onDelete, danger: true },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => { item.action(); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${item.danger ? 'text-red-500 hover:bg-red-50' : 'text-slate-700'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductCard({ product, onUpdate, onDelete }: ProductCardProps) {
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showQREditor, setShowQREditor] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameDraft, setRenameDraft] = useState(product.name);
  const [delConfirm, setDelConfirm] = useState(false);

  const shortUrl = `scanrepeat.com/p/${product.shortCode}`;
  const meta = TYPE_META[product.type];

  const copyUrl = () => {
    navigator.clipboard.writeText(`https://${shortUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRename = () => {
    if (renameDraft.trim() && renameDraft !== product.name) {
      const updated = { ...product, name: renameDraft.trim(), updatedAt: new Date().toISOString() };
      upsertProduct(updated);
      onUpdate(updated);
    }
    setRenaming(false);
  };

  const handleDuplicate = () => {
    const { generateShortCode } = require('@/src/types/product');
    const dup: Product = {
      ...product,
      id: `prd_${Date.now()}`,
      name: `${product.name} (Copy)`,
      shortCode: generateShortCode(8),
      status: 'draft',
      scans: 0,
      countries: 0,
      mobilePercent: 0,
      reorders: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: undefined,
    };
    upsertProduct(dup);
    onUpdate(dup);
  };

  const handleArchive = () => {
    archiveProduct(product.id);
    onUpdate({ ...product, status: product.status === 'archived' ? 'draft' : 'archived' });
  };

  const handleDelete = () => {
    if (!delConfirm) { setDelConfirm(true); return; }
    deleteProduct(product.id);
    onDelete(product.id);
  };

  const saveQR = (settings: any) => {
    const updated = { ...product, qr: settings, updatedAt: new Date().toISOString() };
    upsertProduct(updated);
    onUpdate(updated);
    setShowQREditor(false);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <div
        className={`bg-white rounded-2xl border transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md overflow-hidden ${
          product.status === 'archived' ? 'opacity-60' : ''
        }`}
        style={{ animation: 'cardIn 0.3s ease-out' }}
      >
        <style>{`@keyframes cardIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>

        <div className="flex items-start gap-5 p-5">
          {/* Thumbnail */}
          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border bg-slate-50">
            <Thumbnail product={product} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 py-1">
                <div className="mb-1.5 min-h-[32px] flex items-center">
                  {renaming ? (
                    <input
                      autoFocus
                      value={renameDraft}
                      onChange={e => setRenameDraft(e.target.value)}
                      onBlur={handleRename}
                      onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenaming(false); }}
                      className="text-lg font-bold text-slate-900 border-b-2 border-primary outline-none bg-transparent w-full"
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-slate-900 truncate">{product.name}</h3>
                  )}
                </div>

                {/* Type badge + Dates */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${meta.color}`}>
                    {meta.icon} {meta.label}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-400">Created {formatDate(product.createdAt)}</span>
                </div>

                {/* Short URL */}
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border truncate max-w-[200px]">{shortUrl}</span>
                  <button onClick={copyUrl} className={`p-1.5 rounded-lg border transition-colors ${copied ? 'border-green-400 text-green-600 bg-green-50' : 'border-slate-200 text-slate-400 hover:text-primary hover:border-primary/40'}`}>
                    {copied ? <span className="text-[10px] font-bold px-1">✓</span> : <Copy size={12} />}
                  </button>
                </div>

                {/* Stats */}
                {product.scans > 0 || product.type === 'page_builder' ? (
                  <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Scans</span>
                      <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                        <BarChart3 size={14} className="text-primary" /> {product.scans.toLocaleString()}
                      </span>
                    </div>
                    {product.countries > 0 && (
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Reach</span>
                        <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                          <Globe size={14} className="text-primary" /> {product.countries} {product.countries === 1 ? 'Country' : 'Countries'}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">No scans recorded yet</span>
                )}
              </div>

              {/* Right Side Info Area with QR and Status */}
              <div className="flex items-start gap-4 shrink-0">
                <button 
                  onClick={() => setShowQRModal(true)}
                  className="relative group/qr-preview"
                >
                  <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100 group-hover/qr-preview:border-primary/30 group-hover/qr-preview:shadow-xl group-hover/qr-preview:shadow-primary/5 transition-all duration-300">
                    <QRCodeDisplay 
                      url={`https://${shortUrl}`} 
                      settings={product.qr} 
                      size={110} 
                    />
                  </div>
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/qr-preview:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                    <div className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg transform scale-90 opacity-0 group-hover/qr-preview:scale-100 group-hover/qr-preview:opacity-100 transition-all">
                      VIEW FULL
                    </div>
                  </div>
                </button>
                <div className="pt-2">
                  <StatusBadge status={product.status} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action bar divider */}
        <div className="flex items-center gap-2 px-5 py-3 border-t bg-slate-50/70 relative">
          <Link
            href={`/p/${product.shortCode}`}
            target="_blank"
            className="h-8 px-3 flex items-center gap-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors text-xs font-medium"
          >
            <Eye size={13} /> Preview
          </Link>

          {product.type === 'page_builder' ? (
            <Link
              href={`/dashboard/builder/${product.id}`}
              className="h-8 px-3 flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-all text-xs font-medium"
            >
              <Edit size={13} /> Edit Page
            </Link>
          ) : (
            <button
              onClick={() => setShowQREditor(true)}
              className="h-8 px-3 flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-all text-xs font-medium"
            >
              <Edit size={13} /> Edit QR
            </button>
          )}

          <button
            onClick={() => setShowQRModal(true)}
            className="h-8 px-3 flex items-center gap-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors text-xs font-medium"
          >
            <QrCode size={13} /> QR Code
          </button>

          <div className="ml-auto flex items-center gap-2">
            <MoreMenu
              product={product}
              onRename={() => { setRenaming(true); setRenameDraft(product.name); }}
              onDuplicate={handleDuplicate}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          </div>

          {delConfirm && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-center gap-4 px-5">
              <span className="text-sm text-red-600 font-bold">Delete campaign forever?</span>
              <div className="flex gap-2">
                <button onClick={handleDelete} className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700">Delete</button>
                <button onClick={() => setDelConfirm(false)} className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showQRModal && (
        <QRCodeModal
          product={product}
          onClose={() => setShowQRModal(false)}
          onEditAppearance={() => { setShowQRModal(false); setShowQREditor(true); }}
        />
      )}

      {showQREditor && (
        <div className="fixed inset-0 z-[9985] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowQREditor(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden" style={{ height: '80vh' }}>
            <button onClick={() => setShowQREditor(false)} className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 bg-white shadow-sm">
              <X size={18} />
            </button>
            <QRCustomizer
              productName={product.name}
              shortCode={product.shortCode}
              initialSettings={product.qr}
              onSave={saveQR}
              saveLabel="Save QR Settings"
            />
          </div>
        </div>
      )}
    </>
  );
}
