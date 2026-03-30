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
    className: 'bg-primary border-primary/20 text-white shadow-primary/20 shadow-lg',
    iconClassName: 'bg-white/20 text-white',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-destructive border-destructive/20 text-white shadow-destructive/20 shadow-lg',
    iconClassName: 'bg-white/20 text-white',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-warning border-warning/20 text-white shadow-warning/20 shadow-lg',
    iconClassName: 'bg-white/20 text-white',
  },
  info: {
    icon: Info,
    className: 'bg-primary border-primary/20 text-white shadow-primary/20 shadow-lg',
    iconClassName: 'bg-white/20 text-white',
  },
  delete: {
    icon: Trash2,
    className: 'bg-destructive border-destructive/20 text-white shadow-destructive/20 shadow-lg',
    iconClassName: 'bg-white/20 text-white',
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
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
              className={cn(
                "pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border shadow-xl backdrop-blur-xl transition-all duration-300",
                config.className
              )}
            >
              <div className={cn("inline-flex items-center justify-center p-2 rounded-xl shrink-0 transition-colors duration-300", config.iconClassName)}>
                <Icon size={20} className="transition-transform duration-300" />
              </div>
              
              <div className="flex-1 pt-0.5 text-white">
                <p className="text-sm font-semibold tracking-tight leading-tight !text-white">{toast.message}</p>
                {toast.description && (
                  <p className="text-xs font-medium opacity-80 mt-1 leading-snug !text-white">{toast.description}</p>
                )}
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors mt-0.5"
              >
                <X size={16} className="text-white opacity-60 hover:opacity-100 transition-opacity" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
