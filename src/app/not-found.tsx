'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl w-full flex flex-col items-center"
      >
        {/* --- ILLUSTRATION --- */}
        <div className="w-full max-w-[520px] aspect-square mb-8 relative">
          <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
          <img 
            src="/assets/404.svg" 
            alt="404 - Not Found" 
            className="w-full h-full object-contain animate-float drop-shadow-xl"
          />
        </div>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(1deg); }
          }
          .animate-float {
            animation: float 5s ease-in-out infinite;
          }
        `}</style>
        {/* --- TEXT CONTENT --- */}
        <h2 className="text-accentxl md:text-5xl font-black text-primary-foreground mb-4 tracking-tight">
          Houston, We Have a Problem
        </h2>
        
        <p className="text-muted-foreground font-medium text-lg mb-10 max-w-lg leading-relaxed">
          The page you are looking for has drifted into deep space or never existed in this galaxy.
        </p>

        {/* --- ACTIONS --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-10 py-5 rounded-2xl bg-primary-foreground text-background font-bold hover:bg-primary transition-all shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-primary/30 w-full sm:w-auto justify-center group"
          >
            <Home size={20} className="group-hover:scale-110 transition-transform" />
            Back to Dashboard
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-10 py-5 rounded-2xl bg-secondary border border-border text-primary-foreground font-bold hover:bg-border transition-all w-full sm:w-auto justify-center group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>
      </motion.div>
      
      {/* --- FOOTER DECOR --- */}
      
    </div>
  );
}

