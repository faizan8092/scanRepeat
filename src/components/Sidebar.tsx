'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  Settings, 
  QrCode,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
  Bell,
  CreditCard,
  Shield
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const mainItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Products', icon: Package, href: '/dashboard/products' },
    { label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
  ];

  const systemItems = [
    { label: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
    { label: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
    { label: 'Security', icon: Shield, href: '/dashboard/security' },
    { label: 'Account Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen bg-white text-[#0a0a0a] z-50 flex flex-col border-r border-[#e5e7eb] shadow-[10px_0_40px_rgba(0,0,0,0.02)] overflow-visible"
    >
      {/* Header / Logo */}
      <div className="h-20 flex items-center px-6 relative border-b border-[#f3f4f6]">
        <Link href="/dashboard" className="flex items-center gap-3 group overflow-hidden">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-[#0a0a0a] flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-300">
            <QrCode className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-tektur text-xl font-black tracking-tight text-[#0a0a0a]"
              >
                ScanRepeat
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        
        {/* Toggle Button */}
        <button 
          onClick={onToggle}
          type="button"
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 bg-white text-[#9ca3af] border border-[#e5e7eb] shadow-md hover:text-[#2970ff] hover:border-[#2970ff]/40 transition-all w-7 h-7 rounded-full flex items-center justify-center z-[60] group hover:scale-110 active:scale-95"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-4 space-y-8 custom-scrollbar">
        <div>
          {!isCollapsed && (
            <div className="px-4 mb-4 text-[10px] font-black text-[#9ca3af] uppercase tracking-widest">
              Main Menu
            </div>
          )}
          <div className="space-y-1">
            {mainItems.map((item) => (
              <NavItem 
                key={item.href} 
                {...item} 
                isActive={pathname === item.href} 
                isCollapsed={isCollapsed} 
              />
            ))}
          </div>
        </div>

        <div>
          {!isCollapsed && (
            <div className="px-4 mb-4 text-[10px] font-black text-[#9ca3af] uppercase tracking-widest">
              Security & Tools
            </div>
          )}
          <div className="space-y-1">
            {systemItems.map((item) => (
              <NavItem 
                key={item.href} 
                {...item} 
                isActive={pathname === item.href} 
                isCollapsed={isCollapsed} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Upgrade */}
      <div className="p-4 mt-auto border-t border-[#f3f4f6]">
        {!isCollapsed ? (
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#f0f7ff] to-[#f5f3ff] border border-[#d1e9ff] relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:rotate-12 transition-transform duration-500">
              <Zap size={60} className="text-[#2970ff]" />
            </div>
            <p className="text-xs font-black text-[#2970ff] mb-2">PRO PLAN</p>
            <p className="text-[11px] text-[#4b5563] font-bold leading-relaxed mb-4">You're using 24% of your current plan limits.</p>
            <button className="w-full py-2 bg-white border border-[#d1e9ff] rounded-xl text-[11px] font-black text-[#2970ff] hover:bg-[#2970ff] hover:text-white transition-all">
              Upgrade Now
            </button>
          </div>
        ) : (
          <button className="w-12 h-12 rounded-2xl bg-[#f0f7ff] border border-[#d1e9ff] flex items-center justify-center text-[#2970ff] hover:bg-[#2970ff] hover:text-white transition-all mx-auto">
            <Zap size={20} />
          </button>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f3f4f6; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #e5e7eb; }
      `}</style>
    </motion.aside>
  );
}

function NavItem({ label, icon: Icon, href, isActive, isCollapsed }: { 
  label: string; 
  icon: any; 
  href: string; 
  isActive: boolean; 
  isCollapsed: boolean; 
}) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group relative truncate",
        isActive 
          ? "bg-[#2970ff]/10 text-[#2970ff] font-black shadow-[0_10px_20px_rgba(41,112,255,0.05)]" 
          : "text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#0a0a0a]"
      )}
    >
      <div className={cn(
        "shrink-0 transition-all duration-300",
        isActive ? "text-[#2970ff]" : "text-[#9ca3af] group-hover:text-[#0a0a0a] group-hover:scale-110"
      )}>
        <Icon size={20} />
      </div>
      
      {!isCollapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-4 text-[13px] font-bold tracking-tight"
        >
          {label}
        </motion.span>
      )}

      {isActive && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#2970ff] rounded-r-full shadow-[0_0_10px_rgba(41,112,255,0.5)]" 
        />
      )}
    </Link>
  );
}

