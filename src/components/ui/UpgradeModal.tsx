'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Zap, Globe, ShieldCheck, BarChart3, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: 'limit' | 'time' | null;
}

const features = [
  { icon: Globe, title: 'Unlimited Funnels', desc: 'Create boundless product pages without restrictions.' },
  { icon: BarChart3, title: 'Deep Analytics', desc: 'Track geolocation, devices, and full conversion data.' },
  { icon: Zap, title: 'Pro Builder', desc: 'Unlock premium templates, video blocks & custom CSS.' },
  { icon: ShieldCheck, title: 'Custom Domains', desc: 'Use your own branded domain (scan.yourbrand.com).' }
];

export function UpgradeModal({ isOpen, onClose, reason }: UpgradeModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        />
        
        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
          className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 w-9 h-9 right-4 z-20 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Left Side (Dark Premium gradient) */}
          <div className="hidden md:flex md:w-[45%] bg-slate-900 p-10 flex-col justify-between relative overflow-hidden shrink-0">
             {/* Abstract background shapes */}
             <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 pointer-events-none" />
             
             <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                   <Sparkles size={18} className="text-white" />
                </div>
                <span className="text-white font-black tracking-wide text-lg flex items-center gap-2">
                  ScanRepeat <span className="bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-wider">Pro</span>
                </span>
             </div>

             <div className="relative z-10 mt-16 mb-12">
               <h2 className="text-4xl font-black text-white leading-tight mb-5">
                 {reason === 'limit' ? "You've Outgrown \nThe Free Plan." : "Unlock Your True Potential."}
               </h2>
               <p className="text-slate-400 text-sm leading-loose font-medium max-w-sm">
                 {reason === 'limit' 
                   ? "You have reached the maximum active campaigns. Upgrade to Pro to keep creating an unlimited amount of tracking pages."
                   : "Unlock premium funnels, granular tracking, and full brand control to supercharge your physical product packaging."
                 }
               </p>
             </div>

             <div className="relative z-10 flex items-center gap-3">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 bg-[url('https://i.pravatar.cc/100?img=${i}')] bg-cover`} />
                   ))}
                </div>
                <div className="ml-2">
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map(s => <Sparkles key={s} size={10} className="text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">Join 10,000+ top creators</p>
                </div>
             </div>
          </div>

          {/* Right Side */}
          <div className="flex-1 p-8 md:p-12 bg-white flex flex-col justify-center">
             {/* Mobile Header (only shows on mobile) */}
             <div className="md:hidden mb-8 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
                   <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-slate-900 font-black tracking-wide">ScanRepeat <span className="text-primary-foreground bg-primary px-1.5 py-0.5 rounded text-[10px] uppercase">Pro</span></span>
             </div>
             
             <div className="md:hidden mb-8">
               <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                 {reason === 'limit' ? "You've Hit Your Limit!" : "Ready to scale?"}
               </h2>
               <p className="text-slate-500 text-sm">Upgrade to unlock unlimited active campaigns and pro tracking.</p>
             </div>

             <div className="space-y-8">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (i * 0.1) }}
                      className="flex items-start gap-5 group"
                    >
                       <div className="w-12 h-12 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-300">
                         <Icon size={22} className="group-hover:scale-110 transition-transform duration-300" />
                       </div>
                       <div className="pt-1">
                         <h4 className="text-sm font-black text-slate-900 mb-1">{f.title}</h4>
                         <p className="text-xs text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                       </div>
                    </motion.div>
                  );
                })}
             </div>

             <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col gap-3">
               <button 
                 onClick={() => { onClose(); router.push('/dashboard/billing'); }}
                 className="w-full relative group h-14 flex items-center justify-center rounded-2xl bg-slate-900 overflow-hidden shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
               >
                 <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 <span className="relative z-10 flex items-center gap-2 text-white font-black tracking-wide text-sm">
                   Upgrade to Pro 
                   <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                 </span>
               </button>
               <button 
                 onClick={onClose} 
                 className="w-full h-12 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-2xl transition-colors"
               >
                 Maybe Later
               </button>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
