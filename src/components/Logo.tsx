'use client';

import React from 'react';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className, size = 28, showText = true }: LogoProps) {
  const fontSize = size * 0.65;
  
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative shrink-0 flex items-center justify-center overflow-hidden" style={{ width: size, height: size }}>
        <div 
          className="w-[85%] h-[85%] bg-primary shadow-sm"
          style={{ 
            maskImage: 'url(/assets/Logo.svg)', 
            WebkitMaskImage: 'url(/assets/Logo.svg)',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskSize: 'contain',
            WebkitMaskSize: 'contain'
          }}
        />
      </div>
      {showText && (
        <span 
          className="font-black tracking-tighter text-foreground select-none leading-none"
          style={{ fontSize: fontSize > 0 ? fontSize : undefined }}
        >
          ScanRepeat
        </span>
      )}
    </div>
  );
}
