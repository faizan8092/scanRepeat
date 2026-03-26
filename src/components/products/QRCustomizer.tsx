'use client';
import React, { useState, useCallback } from 'react';
import { ArrowLeft, X, Download } from 'lucide-react';
import { QRSettings, defaultQR } from '@/src/types/product';
import { QRCodeDisplay, downloadQRPng, downloadQRSvg } from './QRCodeDisplay';
import { HexColorPicker } from 'react-colorful';

const BASE_URL = 'scanrepeat.com/p/';

interface QRCustomizerProps {
  productName: string;
  shortCode: string;
  qrDataUrl?: string;
  initialSettings?: QRSettings;
  onSave: (settings: QRSettings) => void;
  onBack?: () => void;
  saveLabel?: string;
}

function ColorPickerPopover({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 border-2 border-slate-200 rounded-xl hover:border-primary/50 transition-colors bg-white"
      >
        <div className="w-5 h-5 rounded-md border shadow-sm" style={{ background: value }} />
        <span className="text-sm font-mono">{value}</span>
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 z-[9999] bg-white rounded-2xl shadow-2xl border p-3 w-56">
          <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">{label}</p>
          <HexColorPicker color={value} onChange={onChange} style={{ width: '100%', height: 140 }} />
          <div className="flex items-center gap-2 mt-2 border rounded-lg px-2 py-1 bg-slate-50">
            <span className="text-xs font-mono text-slate-400">#</span>
            <input value={value.replace('#', '')} onChange={e => onChange('#' + e.target.value.toUpperCase())} maxLength={6} className="flex-1 text-xs font-mono uppercase bg-transparent outline-none" />
          </div>
        </div>
      )}
    </div>
  );
}

export function QRCustomizer({ productName, shortCode, qrDataUrl, initialSettings, onSave, onBack, saveLabel = 'Save & Add to List →' }: QRCustomizerProps) {
  const [settings, setSettings] = useState<QRSettings>(initialSettings ?? defaultQR);
  const url = `https://${BASE_URL}${shortCode}`;
  const set = (patch: Partial<QRSettings>) => setSettings(s => ({ ...s, ...patch }));

  const downloadPng = () => downloadQRPng(url, settings, 400, productName.replace(/\s+/g, '-').toLowerCase());
  const downloadSvg = () => downloadQRSvg(url, settings, productName.replace(/\s+/g, '-').toLowerCase());

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b shrink-0">
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
        )}
        <div className="flex-1">
          <h2 className="font-bold text-base">QR Customizer</h2>
          <p className="text-xs text-slate-500">{productName}</p>
        </div>
      </div>

      {/* Body — two col */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Settings */}
        <div className="w-72 border-r shrink-0 overflow-y-auto p-5 space-y-5">
          {/* Colors */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Colors</p>
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1.5">Foreground (dots)</p>
              <ColorPickerPopover value={settings.foreground} onChange={v => set({ foreground: v })} label="Foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1.5">Background</p>
              <ColorPickerPopover value={settings.background} onChange={v => set({ background: v })} label="Background" />
            </div>
          </div>

          {/* Error Correction */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Error Correction</p>
            <div className="flex gap-2">
              {(['L', 'M', 'H', 'Q'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => set({ errorLevel: l })}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border-2 transition-all ${settings.errorLevel === l ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400">Use H when adding a logo</p>
          </div>

          {/* Margin */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Quiet Zone</p>
              <span className="text-xs font-mono text-slate-500">{settings.margin} units</span>
            </div>
            <input type="range" min={0} max={8} value={settings.margin} onChange={e => set({ margin: Number(e.target.value) })} className="w-full h-1.5 accent-primary cursor-pointer" />
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Logo / Icon</p>
            <input
              type="text"
              value={settings.logoUrl}
              onChange={e => set({ logoUrl: e.target.value, errorLevel: e.target.value ? 'H' : settings.errorLevel })}
              placeholder="Paste logo image URL..."
              className="w-full text-xs p-2.5 border-2 border-slate-100 rounded-xl bg-white focus:border-primary outline-none"
            />
            {settings.logoUrl && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Logo size</p>
                  <span className="text-xs font-mono text-slate-500">{settings.logoSize}%</span>
                </div>
                <input type="range" min={10} max={30} value={settings.logoSize} onChange={e => set({ logoSize: Number(e.target.value) })} className="w-full h-1.5 accent-primary cursor-pointer" />
              </div>
            )}
          </div>

          {/* Frame Label */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Frame Label</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => set({ showLabel: !settings.showLabel })}
                className={`relative w-8 h-4 rounded-full transition-colors ${settings.showLabel ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${settings.showLabel ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-xs text-slate-600">Add text below QR</span>
            </label>
            {settings.showLabel && (
              <>
                <input value={settings.labelText} onChange={e => set({ labelText: e.target.value })} placeholder="Scan to view product" className="w-full text-sm p-2.5 border-2 border-slate-100 rounded-xl bg-white focus:border-primary outline-none" />
                <div>
                  <p className="text-xs text-slate-500 mb-1.5">Label color</p>
                  <ColorPickerPopover value={settings.labelColor} onChange={v => set({ labelColor: v })} label="Label Color" />
                </div>
              </>
            )}
          </div>

          {/* Quick Download */}
          <div className="flex gap-2 pt-2 border-t">
            <button onClick={downloadPng} className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5">
              <Download size={12} /> PNG
            </button>
            <button onClick={downloadSvg} className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5">
              <Download size={12} /> SVG
            </button>
          </div>
        </div>

      {/* Live Preview */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 bg-slate-50">
          <div className="bg-white rounded-3xl p-6 shadow-lg border flex flex-col items-center gap-3">
            {qrDataUrl && JSON.stringify(settings) === JSON.stringify(initialSettings ?? defaultQR) ? (
              <img src={qrDataUrl} alt="QR Preview" width={220} height={220} className="rounded-xl" />
            ) : (
              <QRCodeDisplay url={url} settings={settings} size={220} />
            )}
            {settings.showLabel && (
              <p className="text-sm font-medium" style={{ color: settings.labelColor }}>{settings.labelText}</p>
            )}
          </div>
          <p className="text-xs font-mono text-slate-500">{BASE_URL}{shortCode}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t flex justify-end bg-white shrink-0">
        <button
          onClick={() => onSave(settings)}
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
        >
          {saveLabel}
        </button>
      </div>
    </div>
  );
}
