'use client';
import React from 'react';
import Lottie from 'lottie-react';
import loaderAnimation from '@/public/assets/loader.json';

interface LoaderProps {
  size?: number;
  className?: string;
  fullScreen?: boolean;
}

export function Loader({ size = 100, className = '', fullScreen = false }: LoaderProps) {
  const content = (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Lottie 
        animationData={loaderAnimation} 
        loop={true} 
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
