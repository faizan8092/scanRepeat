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
    className: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400',
    iconClassName: 'text-emerald-500',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400',
    iconClassName: 'text-rose-500',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400',
    iconClassName: 'text-amber-50',
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400',
    iconClassName: 'text-blue-500',
  },
  delete: {
    icon: Trash2,
    className: 'bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-500/10 dark:border-slate-500/20 dark:text-slate-400',
    iconClassName: 'text-slate-500',
  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none w-full max-w-sm">
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
                "pointer-events-auto flex items-start gap-4 p-4 rounded-[1.5rem] border shadow-2xl backdrop-blur-xl",
                config.className
              )}
            >
              <div className={cn("p-2 rounded-xl bg-white/50 dark:bg-black/20", config.iconClassName)}>
                <Icon size={20} />
              </div>
              
              <div className="flex-1 pt-0.5">
                <p className="text-sm font-black tracking-tight">{toast.message}</p>
                {toast.description && (
                  <p className="text-xs font-bold opacity-70 mt-1">{toast.description}</p>
                )}
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors mt-0.5"
              >
                <X size={16} className="opacity-50" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
