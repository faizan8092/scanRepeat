'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { QRSettings } from '@/src/types/product';

interface QRCodeDisplayProps {
  url: string;
  settings: QRSettings;
  size?: number;
  className?: string;
}

import { Loader } from '@/src/components/ui/Loader';

export function QRCodeDisplay({ url, settings, size = 240, className = '' }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const generate = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    try {
      const opts: QRCode.QRCodeRenderersOptions = {
        width: size,
        margin: settings.margin,
        color: {
          dark: settings.foreground,
          light: settings.background,
        },
        errorCorrectionLevel: settings.errorLevel as any,
      };
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, url, opts);
        setDataUrl(canvasRef.current.toDataURL('image/png'));
      }
    } catch (e) {
      console.error('QR gen error:', e);
    } finally {
      setLoading(false);
    }
  }, [url, settings, size]);

  useEffect(() => {
    const t = setTimeout(generate, 120);
    return () => clearTimeout(t);
  }, [generate]);

  return (
    <div className={`relative inline-block transition-opacity duration-150 ${loading ? 'opacity-50' : 'opacity-100'} ${className}`}>
      <canvas ref={canvasRef} width={size} height={size} style={{ display: 'block', borderRadius: '8px' }} />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader size={60} />
        </div>
      )}
    </div>
  );
}

// ─── QR Download helpers ──────────────────────────────────────────────────────
export async function downloadQRPng(url: string, settings: QRSettings, size: number, filename: string) {
  const dataUrl = await QRCode.toDataURL(url, {
    width: size,
    margin: settings.margin,
    color: { dark: settings.foreground, light: settings.background },
    errorCorrectionLevel: settings.errorLevel as any,
  });
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${filename}-qr.png`;
  a.click();
}

export async function downloadQRSvg(url: string, settings: QRSettings, filename: string) {
  const svg = await QRCode.toString(url, {
    type: 'svg',
    margin: settings.margin,
    color: { dark: settings.foreground, light: settings.background },
    errorCorrectionLevel: settings.errorLevel as any,
  });
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${filename}-qr.svg`;
  a.click();
  URL.revokeObjectURL(a.href);
}
