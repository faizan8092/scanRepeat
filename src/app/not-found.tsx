'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <h1 className="text-[120px] font-black text-primary leading-none mb-4 selection:bg-primary/20">
          404
        </h1>
        
        <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight">
          Oops! You're lost.
        </h2>
        
        <p className="text-muted-foreground font-medium text-lg mb-10 leading-relaxed">
          The page you are looking for doesn't exist or has been moved to another URL.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background font-bold hover:bg-primary transition-all shadow-lg w-full sm:w-auto justify-center"
          >
            <Home size={18} />
            Back to Dashboard
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-secondary border border-border text-foreground font-bold hover:bg-border transition-all w-full sm:w-auto justify-center"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </motion.div>
      
      <div className="mt-20 text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
        ScanRepeat System Core
      </div>
    </div>
  );
}
