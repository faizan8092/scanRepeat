'use client';
import React, { useEffect, useRef, memo } from 'react';
import QRCodeStyling, { 
  Options, 
  DrawType, 
  TypeNumber, 
  Mode, 
  ErrorCorrectionLevel, 
  DotType, 
  CornerSquareType, 
  CornerDotType 
} from 'qr-code-styling';
import { QRSettings } from '@/src/types/product';

interface QRCodeDisplayProps {
  url: string;
  settings: QRSettings;
  size?: number;
  className?: string;
  downloadRef?: React.MutableRefObject<QRCodeStyling | null>;
}

function buildOptions(url: string, settings: QRSettings, size: number): Options {
  return {
    width: size,
    height: size,
    type: 'canvas' as DrawType,
    data: url,
    image: settings.logoUrl || undefined,
    margin: 0,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: 'Byte' as Mode,
      errorCorrectionLevel: settings.errorLevel as ErrorCorrectionLevel,
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: settings.logoSize / 100,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: settings.foreground,
      type: settings.dotStyle as DotType,
    },
    backgroundOptions: {
      color: settings.background,
    },
    cornersSquareOptions: {
      color: settings.eyeColorOuter || settings.foreground,
      type: settings.eyeStyle as CornerSquareType,
    },
    cornersDotOptions: {
      color: settings.eyeColorInner || settings.foreground,
      type: settings.eyeStyle as CornerDotType,
    },
  };
}

// Serialize only the fields that affect the QR visual for stable comparison
function serializeSettings(url: string, settings: QRSettings, size: number): string {
  return [
    url, size,
    settings.foreground, settings.background,
    settings.dotStyle, settings.eyeStyle,
    settings.eyeColorOuter ?? '', settings.eyeColorInner ?? '',
    settings.logoUrl ?? '', settings.logoSize,
    settings.errorLevel,
  ].join('|');
}

export const QRCodeDisplay = memo(function QRCodeDisplay({
  url,
  settings,
  size = 240,
  className = '',
  downloadRef,
}: QRCodeDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevKeyRef = useRef<string>('');
  const mountedRef = useRef(false);

  useEffect(() => {
    const key = serializeSettings(url, settings, size);
    const isFirstRender = !mountedRef.current;
    mountedRef.current = true;

    // Skip update if nothing visually changed
    if (!isFirstRender && key === prevKeyRef.current) return;
    prevKeyRef.current = key;

    const run = () => {
      if (!url) return;
      const options = buildOptions(url, settings, size);

      if (!qrRef.current) {
        qrRef.current = new QRCodeStyling(options);
        if (containerRef.current) {
          // Clear any previous canvas to avoid duplicates on strict-mode double-mount
          containerRef.current.innerHTML = '';
          qrRef.current.append(containerRef.current);
        }
      } else {
        qrRef.current.update(options);
      }

      if (downloadRef) downloadRef.current = qrRef.current;
    };

    if (isFirstRender) {
      // Draw immediately on first mount — no debounce
      run();
    } else {
      // Debounce rapid slider / color changes by 120ms
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(run, 120);
    }

    return () => {
      // Only cancel debounce timer; don't destroy on unmount so canvas persists
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, settings, size, downloadRef]);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative inline-block ${className}`}
        style={{ backgroundColor: settings.background }}
      >
        <div ref={containerRef} className="overflow-hidden flex items-center justify-center" />
        {settings.showLabel && (
          <div
            className="absolute bottom-2 left-0 right-0 text-center px-4"
            style={{ color: settings.labelColor, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <span className="text-[12px] font-black uppercase tracking-[0.1em] truncate w-full">
              {settings.labelText || 'SCAN ME'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

export async function downloadQRPng(instance: QRCodeStyling | null, filename: string) {
  if (!instance) return;
  await instance.download({ name: filename, extension: 'png' });
}

export async function downloadQRSvg(instance: QRCodeStyling | null, filename: string) {
  if (!instance) return;
  await instance.download({ name: filename, extension: 'svg' });
}
