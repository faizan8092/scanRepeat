'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Trash2, 
  X 
} from 'lucide-react';
import { useToast, ToastType } from '@/src/lib/toast-context';
import { cn } from '@/src/lib/utils';

const toastConfig = {
  success: {
    icon: CheckCircle2,
    className: 'bg-white border-emerald-500/30 text-emerald-950 dark:bg-emerald-950 dark:border-emerald-500/30 dark:text-emerald-400',
    iconClassName: 'text-emerald-600 dark:text-emerald-500',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-white border-rose-500/30 text-rose-950 dark:bg-rose-950 dark:border-rose-500/30 dark:text-rose-400',
    iconClassName: 'text-rose-600 dark:text-rose-500',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-white border-amber-500/30 text-amber-950 dark:bg-amber-950 dark:border-amber-500/30 dark:text-amber-400',
    iconClassName: 'text-amber-600 dark:text-amber-500',
  },
  info: {
    icon: Info,
    className: 'bg-white border-blue-500/30 text-blue-950 dark:bg-blue-950 dark:border-blue-500/30 dark:text-blue-400',
    iconClassName: 'text-primary dark:text-primary/90',
  },
  delete: {
    icon: Trash2,
    className: 'bg-white border-slate-500/30 text-slate-950 dark:bg-slate-950 dark:border-slate-500/30 dark:text-slate-400',
    iconClassName: 'text-slate-600 dark:text-slate-500',
  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-8 right-8 z-[100000] flex flex-col-reverse gap-4 pointer-events-none w-full max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={cn(
                "pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border shadow-xl backdrop-blur-xl",
                config.className
              )}
            >
              <div className={cn("p-2 rounded-xl bg-white/40 dark:bg-black/20 shrink-0", config.iconClassName)}>
                <Icon size={20} />
              </div>
              
              <div className="flex-1 pt-0.5">
                <p className="text-sm font-semibold tracking-tight leading-tight">{toast.message}</p>
                {toast.description && (
                  <p className="text-xs font-medium opacity-80 mt-1 leading-snug">{toast.description}</p>
                )}
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors mt-0.5"
              >
                <X size={16} className="opacity-40 hover:opacity-100 transition-opacity" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
