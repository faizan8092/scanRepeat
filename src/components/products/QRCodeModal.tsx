import React, { useState, useRef } from 'react';
import { X, Copy, Check, Download, Palette } from 'lucide-react';
import { Product, QRSettings, defaultQR, getProductQR } from '@/src/types/product';
import { QRCodeDisplay, downloadQRPng, downloadQRSvg } from './QRCodeDisplay';
import { HexColorPicker } from 'react-colorful';
import QRCodeStyling from 'qr-code-styling';

const BASE_URL = 'scanrepeat.com/p/';

interface QRCodeModalProps {
  product: Product;
  onClose: () => void;
  onEditAppearance: () => void;
}

type SizeOption = 200 | 400 | 800;

export function QRCodeModal({ product, onClose, onEditAppearance }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [size, setSize] = useState<SizeOption>(400);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const url = `https://${BASE_URL}${product.shortCode}`;
  const qrSettings = getProductQR(product);

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const downloadPng = () => {
    if (qrRef.current) {
      qrRef.current.update({ width: size, height: size });
      downloadQRPng(qrRef.current, product.name.replace(/\s+/g, '-').toLowerCase());
      // Reset after tiny delay back to modal preview size
      setTimeout(() => qrRef.current?.update({ width: 220, height: 220 }), 500);
    }
  };
  const downloadSvg = () => downloadQRSvg(qrRef.current, product.name.replace(/\s+/g, '-').toLowerCase());

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in"
        style={{ animation: 'modalIn 0.18s ease-out' }}
      >
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b">
          <div>
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-sm text-slate-500">Download your QR code</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* QR Preview */}
        <div className="flex flex-col items-center px-6 py-6 gap-4">
          <div className="bg-white rounded-2xl p-5 border shadow-inner">
             <QRCodeDisplay 
                url={url} 
                settings={qrSettings} 
                size={220} 
                downloadRef={qrRef}
             />
          </div>

          {/* Short URL + Copy */}
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2 w-full">
            <span className="text-sm font-mono text-slate-600 flex-1 truncate">{BASE_URL}{product.shortCode}</span>
            <button onClick={copy} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${copied ? 'bg-green-500 text-white' : 'bg-white border hover:bg-slate-50 text-slate-700'}`}>
              {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>

          {/* Size selection */}
          <div className="w-full">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Download Size</p>
            <div className="flex gap-2">
              {([200, 400, 800] as SizeOption[]).map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-2 text-xs font-medium rounded-xl border-primary transition-all ${size === s ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                >
                  {s === 200 ? 'Small' : s === 400 ? 'Medium' : 'Large'}<br />
                  <span className="text-[10px] opacity-70">{s}px</span>
                </button>
              ))}
            </div>
          </div>

          {/* Download buttons */}
          <div className="flex gap-3 w-full">
            <button onClick={downloadPng} className="flex-1 py-3 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <Download size={16} /> PNG
            </button>
            <button onClick={downloadSvg} className="flex-1 py-3 text-sm font-bold rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
              <Download size={16} /> SVG
            </button>
          </div>
          <button onClick={onEditAppearance} className="w-full py-2.5 text-sm font-medium rounded-xl border-primary border-accentashed border-slate-300 text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
            <Palette size={16} /> Edit QR Appearance
          </button>
        </div>
      </div>
    </div>
  );
}
