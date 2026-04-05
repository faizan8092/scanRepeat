'use client';
import React, { useEffect, useRef, useState } from 'react';
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
import { Loader } from '@/src/components/ui/Loader';

interface QRCodeDisplayProps {
  url: string;
  settings: QRSettings;
  size?: number;
  className?: string;
  downloadRef?: React.MutableRefObject<QRCodeStyling | null>;
}

export function QRCodeDisplay({ url, settings, size = 240, className = '', downloadRef }: QRCodeDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [loading, setLoading] = useState(true);

  // Map our internal settings to qr-code-styling options
  const getOptions = (url: string, settings: QRSettings, size: number): Options => {
    return {
      width: size,
      height: size,
      type: 'canvas' as DrawType,
      data: url,
      image: settings.logoUrl || undefined,
      margin: 0, // No margin for library
      qrOptions: {
        typeNumber: 0 as TypeNumber,
        mode: 'Byte' as Mode,
        errorCorrectionLevel: settings.errorLevel as ErrorCorrectionLevel
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: settings.logoSize,
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        color: settings.foreground,
        type: settings.dotStyle as DotType
      },
      backgroundOptions: {
        color: settings.background,
      },
      cornersSquareOptions: {
        color: settings.eyeColorOuter || settings.foreground,
        type: settings.eyeStyle as CornerSquareType
      },
      cornersDotOptions: {
        color: settings.eyeColorInner || settings.foreground,
        type: settings.eyeStyle as CornerDotType
      }
    };
  };

  useEffect(() => {
    if (!url) return;
    setLoading(true);

    const options = getOptions(url, settings, size);

    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling(options);
      if (containerRef.current) {
        qrCodeRef.current.append(containerRef.current);
      }
    } else {
      qrCodeRef.current.update(options);
    }

    if (downloadRef) {
      downloadRef.current = qrCodeRef.current;
    }

    setLoading(false);
  }, [url, settings, size, downloadRef]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className={`relative inline-block transition-all duration-300 ${loading ? 'opacity-50' : 'opacity-100'} ${className}`}
        style={{ 
          backgroundColor: settings.background,
        }}
      >
        <div ref={containerRef} className="overflow-hidden flex items-center justify-center" />
        
        {settings.showLabel && (
          <div 
            className="absolute bottom-2 left-0 right-0 text-center px-4 transition-all"
            style={{ 
              color: settings.labelColor,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
             {settings.frameStyle === 'modern' && (
               <div className="w-8 h-1 bg-current rounded-full mb-1 opacity-20" />
             )}
             <span className="text-[12px] font-black uppercase tracking-[0.1em] truncate w-full">
               {settings.labelText || 'SCAN ME'}
             </span>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
            <Loader size={60} />
          </div>
        )}
      </div>
    </div>
  );
}

export async function downloadQRPng(instance: QRCodeStyling | null, filename: string) {
  if (!instance) return;
  await instance.download({ name: filename, extension: 'png' });
}

export async function downloadQRSvg(instance: QRCodeStyling | null, filename: string) {
  if (!instance) return;
  await instance.download({ name: filename, extension: 'svg' });
}
