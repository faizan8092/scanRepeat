'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, X, Download, Palette, Type, Layout, Image as ImageIcon, Sparkles, RefreshCw, Plus } from 'lucide-react';
import { QRSettings, defaultQR } from '@/src/types/product';
import { QRCodeDisplay } from './QRCodeDisplay';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/src/lib/utils';
import QRCodeStyling from 'qr-code-styling';
import { Loader } from "@/src/components/ui/Loader";

import { getBaseUrl } from '@/src/lib/api';

const BASE_URL = `${getBaseUrl().replace(/^https?:\/\//, '')}/p/`;

interface QRCustomizerProps {
  productName: string;
  shortCode: string;
  qrDataUrl?: string; // Legacy
  initialSettings?: QRSettings;
  onSave: (settings: QRSettings) => void;
  onBack?: () => void;
  saveLabel?: string;
}

function ColorPickerPopover({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 border border-slate-200 rounded-xl hover:border-primary/50 transition-all bg-white shadow-sm hover:shadow-md"
      >
        <div className="w-8 h-8 rounded-lg border-2 border-slate-100 shadow-inner" style={{ background: value }} />
        <span className="text-[10px] font-mono font-bold uppercase text-slate-500 pr-2">{value}</span>
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 z-[100] bg-white rounded-3xl shadow-2xl border p-4 w-60 animate-in zoom-in-95 duration-200">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{label}</p>
          <HexColorPicker color={value} onChange={onChange} style={{ width: '100%', height: 160 }} />
          <div className="flex items-center gap-2 mt-4 border rounded-xl px-3 py-2 bg-slate-50">
            <span className="text-xs font-mono font-bold text-slate-400">#</span>
            <input 
              value={value.replace('#', '')} 
              onChange={e => onChange('#' + e.target.value.toUpperCase())} 
              maxLength={6} 
              className="flex-1 text-xs font-mono font-bold uppercase bg-transparent outline-none text-slate-700" 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function QRCustomizer({ productName, shortCode, initialSettings, onSave, onBack, saveLabel = 'Save & Finalize →' }: QRCustomizerProps) {
  const [settings, setSettings] = useState<QRSettings>(initialSettings ?? defaultQR);
  const [activeTab, setActiveTab] = useState<'template' | 'logo' | 'eyes' | 'pattern' | 'background' | 'frame'>('template');
  const [isUploading, setIsUploading] = useState(false);
  const qrRef = useRef<QRCodeStyling | null>(null);
  
  const url = `https://${BASE_URL}${shortCode}`;
  const set = (patch: Partial<QRSettings>) => setSettings(s => ({ ...s, ...patch }));

  const dotStyles: { key: QRSettings['dotStyle']; label: string }[] = [
    { key: 'square', label: 'Classic' },
    { key: 'rounded', label: 'Rounded' },
    { key: 'dots', label: 'Dots' },
    { key: 'extra-rounded', label: 'Smooth' },
    { key: 'classy', label: 'Modern' },
    { key: 'classy-rounded', label: 'Liquid' },
  ];

  const eyeStyles: { key: QRSettings['eyeStyle']; label: string }[] = [
    { key: 'square', label: 'Square' },
    { key: 'rounded', label: 'Smooth' },
    { key: 'extra-rounded', label: 'Circle' },
    { key: 'leaf', label: 'Organic' },
  ];

  const frameStyles: { key: QRSettings['frameStyle']; label: string }[] = [
    { key: 'none', label: 'No Frame' },
    { key: 'basic', label: 'Classic Border' },
    { key: 'modern', label: 'Designer Box' },
    { key: 'bubble', label: 'Bubble Pop' },
  ];

  const templates = [
    { name: 'OG Classic', settings: defaultQR },
    { name: 'Dark Stealth', settings: { ...defaultQR, foreground: '#FFFFFF', background: '#0f172a', eyeColorOuter: '#FFFFFF', eyeColorInner: '#FFFFFF', dotStyle: 'rounded' as any } },
    { name: 'Royal Gold', settings: { ...defaultQR, foreground: '#B8860B', eyeStyle: 'leaf' as any, dotStyle: 'classy-rounded' as any, eyeColorOuter: '#B8860B', eyeColorInner: '#8B6508' } },
    { name: 'Cyber Neon', settings: { ...defaultQR, foreground: '#00FF41', background: '#111111', eyeStyle: 'extra-rounded' as any, dotStyle: 'dots' as any, eyeColorOuter: '#00FF41', eyeColorInner: '#00FF41' } },
    { name: 'Tropical', settings: { ...defaultQR, foreground: '#0ea5e9', background: '#f0f9ff', eyeStyle: 'rounded' as any, dotStyle: 'extra-rounded' as any, eyeColorOuter: '#0369a1', eyeColorInner: '#0ea5e9' } },
    { name: 'Midnight', settings: { ...defaultQR, foreground: '#f8fafc', background: '#1e293b', dotStyle: 'classy' as any, eyeStyle: 'square' as any, frameStyle: 'modern' as any, frameColor: '#334155', eyeColorOuter: '#f8fafc', eyeColorInner: '#38bdf8' } },
  ];

  const applyTemplate = (ts: QRSettings) => setSettings(prev => ({ ...ts, logoUrl: prev.logoUrl, logoSize: prev.logoSize }));

  const [dlFormat, setDlFormat] = useState<'png' | 'jpeg' | 'svg' | 'webp'>('png');
  const [dlSize, setDlSize] = useState<number>(1200);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { uploadFileApi } = require('@/src/lib/product-service');
      const res = await uploadFileApi(file);
      set({ logoUrl: res.url, errorLevel: 'H' });
    } catch (err) {
      console.error('Logo upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white select-none overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between p-5 border-b shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/40 transition-all shadow-sm">
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <h2 className="font-black text-base uppercase tracking-tighter text-slate-900 leading-none">Design QR Code</h2>
            <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Customize colors & shapes</p>
          </div>
          <button onClick={() => setSettings(defaultQR)} className="flex items-center gap-1.5 px-3 py-1.5 border border-red-100 text-red-500 hover:bg-red-50 rounded-lg text-[10px] font-black transition-all ml-4">
            <RefreshCw size={12} /> RESET
          </button>
        </div>
        <div className="pr-14" /> {/* Space for Close Button */}
      </div>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar Controls (70%) */}
        <div className="flex-1 min-w-0 h-full flex flex-col border-r bg-white overflow-hidden shrink-0">
          {/* Tabs */}
          <div className="p-4 grid grid-cols-3 gap-2 border-b bg-slate-50/30">
            {[
              { id: 'template', label: 'Template', icon: <Sparkles size={14} /> },
              { id: 'logo', label: 'Logo', icon: <ImageIcon size={14} /> },
              { id: 'eyes', label: 'Eyes', icon: <Palette size={14} /> },
              { id: 'pattern', label: 'Pattern', icon: <Layout size={14} /> },
              { id: 'background', label: 'Bg', icon: <Layout size={14} /> },
              { id: 'frame', label: 'Frame', icon: <Type size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-[0_10px_20px_-5px_rgba(var(--primary-rgb),0.3)] scale-[1.02]" 
                    : "text-slate-500 hover:bg-slate-100"
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Active Panel Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {activeTab === 'template' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Quick Themes</p>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map(t => (
                    <button 
                      key={t.name}
                      onClick={() => applyTemplate(t.settings)}
                      className="p-3 border-2 border-slate-100 rounded-3xl hover:border-primary/30 transition-all text-left group flex flex-col items-center gap-3 bg-white hover:shadow-lg hover:shadow-slate-100"
                    >
                      <div 
                        className="w-full aspect-square rounded-2xl flex items-center justify-center p-3 overflow-hidden shadow-inner"
                        style={{ background: t.settings.background }}
                      >
                         <div className="w-full aspect-square opacity-90 group-hover:opacity-100 transition-opacity" style={{ 
                            background: `radial-gradient(circle at 20% 20%, ${t.settings.foreground} 0%, transparent 20%), 
                                        radial-gradient(circle at 80% 80%, ${t.settings.foreground} 0%, transparent 20%),
                                        linear-gradient(45deg, ${t.settings.foreground}11 25%, transparent 25%)`,
                            backgroundSize: '8px 8px',
                            border: `2px solid ${t.settings.foreground}44`,
                            borderRadius: '6px'
                         }} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-tight text-slate-600 truncate w-full text-center">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'pattern' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                 <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dot Pattern Style</p>
                  <div className="grid grid-cols-3 gap-2">
                    {dotStyles.map(s => (
                      <button 
                        key={s.key}
                        onClick={() => set({ dotStyle: s.key })}
                        className={cn(
                          "px-3 py-2.5 rounded-xl border-2 text-[10px] font-black uppercase transition-all",
                          settings.dotStyle === s.key ? "border-primary bg-primary/5 text-primary" : "border-slate-100 text-slate-500 hover:border-slate-200"
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">QR Main Color</p>
                  <ColorPickerPopover value={settings.foreground} onChange={v => set({ foreground: v })} label="Foreground Color" />
                </div>
              </div>
            )}

            {activeTab === 'eyes' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Corner Shape</p>
                  <div className="grid grid-cols-2 gap-2">
                    {eyeStyles.map(s => (
                      <button 
                        key={s.key}
                        onClick={() => set({ eyeStyle: s.key })}
                        className={cn(
                          "px-4 py-3 rounded-xl border-2 text-[10px] font-black uppercase transition-all flex items-center justify-between",
                          settings.eyeStyle === s.key ? "border-primary bg-primary/5 text-primary" : "border-slate-100 text-slate-500 hover:border-slate-200"
                        )}
                      >
                        {s.label}
                        <div className={cn("w-3 h-3 border-2 border-current rounded-sm", s.key === 'leaf' && "rounded-tr-[6px] rounded-bl-[6px]", s.key === 'rounded' && "rounded-[4px]", s.key === 'extra-rounded' && "rounded-full")} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Corner Colors</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Outer Ring</p>
                      <ColorPickerPopover value={settings.eyeColorOuter || settings.foreground} onChange={v => set({ eyeColorOuter: v })} label="Eye Frame" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Inner Ball</p>
                      <ColorPickerPopover value={settings.eyeColorInner || settings.foreground} onChange={v => set({ eyeColorInner: v })} label="Eye Dot" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'logo' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><ImageIcon size={12} /> Branding Logo</p>
                  
                  {/* Upload Zone */}
                  <div className="relative group/upload">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-wait"
                    />
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center bg-slate-50 group-hover/upload:border-primary/50 group-hover/upload:bg-white transition-all overflow-hidden relative">
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 animate-in fade-in duration-300">
                           <Loader size={40} />
                           <p className="text-[9px] font-black uppercase text-primary mt-2 animate-pulse tracking-widest">Optimizing Branding</p>
                        </div>
                      )}
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover/upload:text-primary group-hover/upload:scale-110 transition-all">
                        <Plus size={24} />
                      </div>
                      <p className="text-xs font-black uppercase text-slate-500">Upload Image</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">PNG, JPG recommended</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px bg-slate-100 flex-1" />
                    <span className="text-[10px] font-black text-slate-300 uppercase">OR</span>
                    <div className="h-px bg-slate-100 flex-1" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Paste Image URL</p>
                    <input
                      type="text"
                      value={settings.logoUrl}
                      onChange={e => set({ logoUrl: e.target.value, errorLevel: e.target.value ? 'H' : settings.errorLevel })}
                      placeholder="https://..."
                      className="w-full text-sm font-bold p-3.5 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:bg-white focus:border-primary outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                {settings.logoUrl && (
                  <div className="space-y-6 pt-6 border-t animate-in slide-in-from-top-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-slate-50 rounded-xl border p-1 overflow-hidden">
                            <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Active Logo</p>
                            <button onClick={() => set({ logoUrl: '' })} className="text-[10px] font-bold text-red-500 hover:underline">Remove</button>
                         </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Logo Size</p>
                        <span className="text-[10px] font-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{settings.logoSize}%</span>
                      </div>
                      <input type="range" min={10} max={35} value={settings.logoSize} onChange={e => set({ logoSize: Number(e.target.value) })} className="w-full h-2 accent-primary cursor-pointer" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'background' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Background Color</p>
                  <ColorPickerPopover value={settings.background} onChange={v => set({ background: v })} label="Background Color" />
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                   <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                     <span className="block mb-1">PRO TIP:</span> Ensure high contrast between foreground and background for scannability. White background is highly recommended.
                   </p>
                </div>
              </div>
            )}

            {activeTab === 'frame' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Frame Layout</p>
                  <div className="grid grid-cols-2 gap-2">
                    {frameStyles.map(s => (
                      <button 
                        key={s.key}
                        onClick={() => set({ frameStyle: s.key })}
                        className={cn(
                          "px-4 py-3 rounded-xl border-2 text-[10px] font-black uppercase transition-all",
                          settings.frameStyle === s.key ? "border-primary bg-primary/5 text-primary" : "border-slate-100 text-slate-500 hover:border-slate-200"
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {settings.frameStyle !== 'none' && (
                  <div className="space-y-6 pt-6 border-t animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Frame Color</p>
                      <ColorPickerPopover value={settings.frameColor} onChange={v => set({ frameColor: v })} label="Frame Color" />
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Label Text</p>
                      <div className="flex items-center gap-3">
                         <div
                          onClick={() => set({ showLabel: !settings.showLabel })}
                          className={`shrink-0 relative w-10 h-5 rounded-full transition-colors cursor-pointer ${settings.showLabel ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow transition-transform ${settings.showLabel ? 'translate-x-5' : ''}`} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 uppercase">Visible</span>
                      </div>
                      
                      {settings.showLabel && (
                        <div className="space-y-4 pt-2">
                          <input 
                            value={settings.labelText} 
                            onChange={e => set({ labelText: e.target.value.toUpperCase() })} 
                            placeholder="SCAN ME" 
                            maxLength={20}
                            className="w-full text-sm font-black p-3.5 border-2 border-slate-100 rounded-2xl bg-slate-50 focus:bg-white focus:border-primary outline-none transition-all" 
                          />
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Text Color</p>
                            <ColorPickerPopover value={settings.labelColor} onChange={v => set({ labelColor: v })} label="Text Color" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live Rendering Arena (30%) */}
        <div className="w-[420px] bg-slate-100 p-6 flex flex-col items-center justify-start relative overflow-y-auto custom-scrollbar shrink-0 min-h-0">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 20%, transparent 20%)', backgroundSize: '15px 15px' }} />
          
          <div className="flex flex-col items-center gap-6 relative z-10 w-full animate-in zoom-in-95 duration-500 py-4">
             <div className="flex flex-col items-center gap-4 group">
                <QRCodeDisplay 
                  url={url} 
                  settings={settings} 
                  size={260} 
                  downloadRef={qrRef}
                  className="shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] group-hover:scale-[1.01] transition-transform duration-500 bg-white p-2 rounded-2xl" 
                />
             </div>

             <div className="flex flex-col items-center gap-4 w-full">
                <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-[2rem] border shadow-sm w-full max-w-sm">
                  <p className="text-[11px] font-mono font-black text-slate-400 tracking-tighter uppercase whitespace-nowrap overflow-hidden flex justify-between">
                    <span>LIVE LINK:</span> <span className="text-primary truncate ml-2 italic">{BASE_URL}{shortCode}</span>
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border shadow-sm w-full space-y-5">
                   <div className="flex items-center justify-between border-b pb-4">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">Download Studio</p>
                      <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                         {(['png', 'jpeg', 'svg'] as const).map(f => (
                           <button 
                            key={f}
                            onClick={() => setDlFormat(f)}
                            className={cn(
                              "px-3 py-1 rounded text-[10px] font-black uppercase transition-all",
                              dlFormat === f ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                           >
                            {f}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <span>Resolution / Size</span>
                         <span className="text-primary">{dlSize}x{dlSize} px</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[1200, 2400, 3600, 4800].map(s => (
                          <button 
                            key={s}
                            onClick={() => setDlSize(s)}
                            className={cn(
                              "py-2 rounded-xl border-2 text-[10px] font-black transition-all",
                              dlSize === s ? "border-primary bg-primary/5 text-primary" : "border-slate-100 text-slate-400"
                            )}
                          >
                            {s/1000}k
                          </button>
                        ))}
                      </div>
                   </div>

                   <button 
                    onClick={() => {
                      if (!qrRef.current) return;
                      qrRef.current.update({ width: dlSize, height: dlSize });
                      qrRef.current.download({ name: `${productName.replace(/\s+/g, '-')}-qr`, extension: dlFormat });
                      // Reset preview size back
                      setTimeout(() => qrRef.current?.update({ width: 280, height: 280 }), 500);
                    }}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]"
                   >
                     <Download size={18} /> GENERATE {dlFormat}
                   </button>

                   <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter text-center">
                      <div className="p-2 border rounded-lg bg-slate-50">High DPI Print</div>
                      <div className="p-2 border rounded-lg bg-slate-50">Vector Support</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div className="p-6 border-t flex justify-between items-center bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)] shrink-0 px-10">
        <div className="flex items-center gap-3">
           <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
           <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Scannability: <span className="text-green-600">Excellent</span></span>
        </div>
        <button
          onClick={() => onSave(settings)}
          className="px-10 py-4 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-3xl hover:bg-primary/90 transition-all shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.4)] active:scale-95 flex items-center gap-3 group"
        >
          {saveLabel}
          <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
