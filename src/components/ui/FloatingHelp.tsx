'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ContactModal } from './ContactModal';

export function FloatingHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 font-sans">
        {/* Floating Button */}
        <button 
          onClick={() => setIsContactOpen(true)}
          className={cn(
            "h-12 px-5 rounded-full flex items-center gap-2.5 transition-all duration-300 shadow-xl active:scale-95",
            "bg-[#1e90ff] hover:bg-[#187bcd] text-white"
          )}
        >
          <div className="relative">
              <span className="flex h-2 w-2 absolute -top-1 -right-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <MessageCircle size={20} />
          </div>
          <span className="font-bold text-[14px] whitespace-nowrap">Need Help?</span>
        </button>
      </div>

      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </>
  );
}
