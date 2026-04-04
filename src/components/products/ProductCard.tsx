'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import Link from 'next/link';
import {
  Eye, Edit, QrCode, BarChart2, MoreVertical, Copy, Archive, Trash2, Globe, FileText,
  ExternalLink, X, BarChart3, Smartphone, Repeat, Palette, CheckSquare, Square,
} from 'lucide-react';
import { Product, upsertProduct, deleteProduct, archiveProduct, getProductQR } from '@/src/types/product';
import { customizeQRApi, pauseProductApi, unpauseProductApi } from '@/src/lib/product-service';
import { useToast } from '@/src/lib/toast-context';
import { getBaseUrl } from '@/src/lib/api';
import { QRCodeModal } from './QRCodeModal';
import { QRCustomizer } from './QRCustomizer';
import { QRCodeDisplay } from './QRCodeDisplay';
import EditProductModal from './EditProductModal';

interface ProductCardProps {
  product: Product;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onDuplicate?: () => void;
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
  if (status === 'paused') return (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Paused
    </span>
  );
  return null;
}

function Thumbnail({ product }: { product: Product }) {
  if (product.thumbnailUrl) {
    return (
      <img src={product.thumbnailUrl} alt={product.name} className="w-full h-full object-cover" />
    );
  }
  const icons: Record<Product['type'], React.ReactNode> = {
    page_builder: <Globe size={28} className="text-blue-400" />,
    file: <FileText size={28} className="text-orange-400" />,
    external_url: <ExternalLink size={28} className="text-purple-400" />,
  };
  const bgs: Record<Product['type'], string> = {
    page_builder: 'bg-primary/5',
    file: 'bg-orange-50',
    external_url: 'bg-purple-50',
  };
  return (
    <div className={`w-full h-full flex items-center justify-center ${bgs[product.type]}`}>
      {icons[product.type]}
    </div>
  );
}

function MoreMenu({ product, isOpen, onOpenChange, onEdit, onDuplicate, onArchive, onPause, onDelete }: {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onPause: () => void;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onOpenChange(false); };
    if (isOpen) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen, onOpenChange]);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => onOpenChange(!isOpen)} className="h-8 px-2.5 flex items-center gap-0.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors text-xs font-medium">
        <MoreVertical size={14} />
      </button>
      {isOpen && (
        <div className="absolute right-0 bottom-full mb-1 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 z-[100] py-1 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
          {[
            { label: 'Edit Details', icon: <Edit size={13} />, action: onEdit },
            { label: 'Duplicate', icon: <Copy size={13} />, action: onDuplicate },
            {
              label: product.status === 'paused' ? 'Resume (Unpause)' : 'Pause Redirects',
              icon: <Repeat size={13} />,
              action: onPause,
              disabled: product.isLockedDueToPlan
            },
            { label: product.status === 'archived' ? 'Unarchive' : 'Archive', icon: <Archive size={13} />, action: onArchive },
            { label: 'Delete', icon: <Trash2 size={13} />, action: onDelete, danger: true },
          ].map(item => (
            <button
              key={item.label}
              disabled={(item as any).disabled}
              onClick={() => { item.action(); onOpenChange(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${item.danger ? 'text-red-500 hover:bg-red-50' : 'text-slate-700'} ${(item as any).disabled ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductCard({
  product,
  isSelected = false,
  onToggleSelect,
  onDuplicate,
  onUpdate,
  onDelete
}: ProductCardProps) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showQREditor, setShowQREditor] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameDraft, setRenameDraft] = useState(product.name);
  const [delConfirm, setDelConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const shortUrl = `${getBaseUrl().replace(/^https?:\/\//, '')}/p/${product.shortCode}`;
  const meta = TYPE_META[product.type];
  const qrSettings = getProductQR(product);
  const scansCount = product.totalScans ?? product.scans ?? 0;
  const countriesCount = product.uniqueCountries ?? product.countries ?? 0;

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
    if (onDuplicate) {
      onDuplicate();
      return;
    }
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

  const handleTogglePause = async () => {
    try {
      if (product.status === 'paused') {
        const result = await unpauseProductApi(product.id);
        onUpdate(result);
        addToast('success', 'Product Reactivated', 'QR scans will now redirect normally.');
      } else {
        const result = await pauseProductApi(product.id);
        onUpdate(result);
        addToast('warning', 'Product Paused', 'QR scans are now temporarily disabled.');
      }
    } catch (err: any) {
      addToast('error', 'Update Failed', err.message);
    }
  };

  const handleDelete = () => {
    if (!delConfirm) { setDelConfirm(true); return; }
    deleteProduct(product.id);
    onDelete(product.id);
  };

  const saveQR = async (settings: any) => {
    try {
      const mappedData = {
        qrForeground: settings.foreground,
        qrBackground: settings.background,
        qrLogoUrl: settings.logoUrl || null,
        qrDotStyle: settings.dotStyle,
        qrErrorLevel: settings.errorLevel,
        qrLabelText: settings.labelText || null,
        qrMargin: settings.margin,
      };

      const result = await customizeQRApi(product.id, mappedData);
      onUpdate(result.product);
      addToast('success', 'QR Settings Saved', 'Your stylized QR code is now live.');
      setShowQREditor(false);
    } catch (err: any) {
      addToast('error', 'Save failed', err.message || 'Could not update QR settings on the server.');
    }
  };

  return (
    <>
      <div
        className={cn(
          "bg-white rounded-2xl border transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md relative group",
          product.status === 'archived' && "opacity-60",
          isSelected && "border-primary ring-2 ring-primary/10 shadow-xl shadow-primary/5",
          isMenuOpen && "z-[70]"
        )}
        style={{ animation: 'cardIn 0.3s ease-out' }}
      >
        <style>{`@keyframes cardIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>

        {/* Select Overlay/Checkbox */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSelect?.(); }}
          className={cn(
            "absolute left-4 top-4 z-[20] w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center",
            isSelected
              ? "bg-primary border-primary shadow-lg shadow-primary/20 scale-110"
              : "bg-white/80 backdrop-blur-sm border-slate-200 opacity-0 group-hover:opacity-100"
          )}
        >
          {isSelected && <CheckSquare size={14} className="text-white" />}
        </button>

        <div className={cn(
          "flex items-start gap-5 py-3 px-5 relative transition-all",
          isSelected && "bg-primary/5 ml-8"
        )}>
          {/* Thumbnail */}
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border bg-slate-50 relative">
            <Thumbnail product={product} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 py-0.5">
                <div className="mb-0.5 min-h-[28px] flex items-center">
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

                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.color}`}>
                    {meta.icon} {meta.label}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-[150px]">{shortUrl}</span>
                  <button onClick={copyUrl} className={`p-1 rounded-lg border transition-colors ${copied ? 'border-green-400 text-green-600 bg-green-50' : 'border-slate-200 text-slate-400 hover:text-primary hover:border-primary/40'}`}>
                    {copied ? <span className="text-[9px] font-bold px-1">✓</span> : <Copy size={10} />}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 size={13} className="text-primary" />
                    <span className="text-[11px] font-bold text-slate-600">{scansCount.toLocaleString()} <span className="text-slate-400 font-medium lowercase">scans</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe size={13} className="text-primary" />
                    <span className="text-[11px] font-bold text-slate-600">{countriesCount} <span className="text-slate-400 font-medium lowercase">countries</span></span>
                  </div>
                  {product.type === 'page_builder' && (
                    <div className="flex items-center gap-1.5">
                      <Repeat size={13} className="text-primary" />
                      <span className="text-[11px] font-bold text-slate-600">{product.totalReviews ?? 0} <span className="text-slate-400 font-medium lowercase">reviews</span></span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 shrink-0">
                <button
                  onClick={() => setShowQREditor(true)}
                  className="relative group/qr-preview"
                >
                  <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-100 group-hover/qr-preview:border-primary/30 group-hover/qr-preview:shadow-xl group-hover/qr-preview:shadow-primary/5 transition-all duration-300">
                    <QRCodeDisplay
                      url={`https://${shortUrl}`}
                      settings={qrSettings}
                      size={80}
                    />
                  </div>
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/qr-preview:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                    <div className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg transform scale-90 opacity-0 group-hover/qr-preview:opacity-100 transition-all">
                      DESIGN QR
                    </div>
                  </div>
                </button>
                <div className="pt-2">
                  <StatusBadge status={product.isLockedDueToPlan ? 'paused' : product.status} />
                </div>
              </div>
            </div>
          </div>

          {product.isLockedDueToPlan && (
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] flex items-center justify-center p-6 z-[10] select-none rounded-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-amber-400/50 rounded-[2rem] p-5 shadow-[0_20px_50px_-20px_rgba(245,158,11,0.2)] flex items-center gap-5 max-w-sm animate-in fade-in zoom-in duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-inner">
                  <Archive size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-tighter mb-1">Plan limit reached</h4>
                  <p className="text-xs text-slate-500 font-bold leading-tight">This campaign is paused. Upgrade your plan to reactivate it immediately.</p>
                </div>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('scanrepeat_show_upgrade'))}
                  className="px-5 py-2.5 bg-primary text-white text-[11px] font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 whitespace-nowrap active:scale-95"
                >
                  UPGRADE
                </button>
              </motion.div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-5 py-2 border-t bg-slate-50/70 relative">
          <Link
            href={product.isLockedDueToPlan ? '#' : `/p/${product.shortCode}`}
            target={product.isLockedDueToPlan ? undefined : "_blank"}
            className={`h-7 px-2.5 flex items-center gap-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors text-xs font-medium ${product.isLockedDueToPlan ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
          >
            <Eye size={12} /> {product.isLockedDueToPlan ? 'Locked' : 'Preview'}
          </Link>

          {product.type === 'page_builder' ? (
            <Link
              href={`/dashboard/builder/${product.id}`}
              className="h-7 px-2.5 flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-all text-xs font-medium"
            >
              <Edit size={12} /> Edit Page
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="h-7 px-2.5 flex items-center gap-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors text-xs font-medium"
              >
                <Edit size={12} /> Edit Details
              </button>
              <button
                onClick={() => setShowQREditor(true)}
                className="h-7 px-2.5 flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-all text-xs font-medium"
              >
                <Palette size={12} /> Edit QR
              </button>
            </div>
          )}

          <button
            onClick={() => setShowQRModal(true)}
            className="h-7 px-2.5 flex items-center gap-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors text-xs font-medium"
          >
            <QrCode size={12} /> QR Code
          </button>

          <div className="ml-auto flex items-center gap-2 relative">
            <MoreMenu
              product={product}
              isOpen={isMenuOpen}
              onOpenChange={setIsMenuOpen}
              onEdit={() => setShowEditModal(true)}
              onDuplicate={handleDuplicate}
              onPause={handleTogglePause}
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
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-7xl overflow-hidden" style={{ height: '90vh' }}>
            <button onClick={() => setShowQREditor(false)} className="absolute top-4 right-4 z-[999] w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 bg-white shadow-sm transition-colors border">
              <X size={18} />
            </button>
            <QRCustomizer
              productName={product.name}
              shortCode={product.shortCode}
              initialSettings={qrSettings}
              onSave={saveQR}
              saveLabel="Save QR Settings"
            />
          </div>
        </div>
      )}

      {showEditModal && (
        <EditProductModal
          product={product}
          onClose={() => setShowEditModal(false)}
          onUpdated={(p) => onUpdate(p)}
        />
      )}
    </>
  );
}
