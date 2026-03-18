'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className, size = 28, showText = true }: LogoProps) {
  // Optically balance text size based on logo size
  const fontSize = size * 0.65;
  
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative shrink-0 flex items-center justify-center overflow-hidden" style={{ width: size, height: size }}>
        <img 
          src="/assets/Logo.svg" 
          alt="ScanRepeat Logo" 
          className="w-[85%] h-[85%] object-contain"
        />
      </div>
      {showText && (
        <span 
          className="font-tektur font-black tracking-tighter text-foreground select-none leading-none"
          style={{ fontSize: fontSize > 0 ? fontSize : undefined }}
        >
          ScanRepeat
        </span>
      )}
    </div>
  );
}
