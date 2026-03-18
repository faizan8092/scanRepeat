'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  Settings, 
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
import { Logo } from './Logo';

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
      className="fixed left-0 top-0 h-screen bg-background text-foreground z-50 flex flex-col border-r border-border shadow-[10px_0_40px_rgba(0,0,0,0.02)] overflow-visible"
    >
      {/* Header / Logo */}
      <div className="h-20 flex items-center px-6 relative border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-3 group overflow-hidden">
          <Logo size={32} showText={!isCollapsed} />
        </Link>
        
        {/* Toggle Button */}
        <button 
          onClick={onToggle}
          type="button"
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 bg-background text-muted-foreground border border-border shadow-md hover:text-primary hover:border-primary/40 transition-all w-7 h-7 rounded-full flex items-center justify-center z-[60] group hover:scale-110 active:scale-95"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-4 space-y-8 custom-scrollbar">
        <div>
          {!isCollapsed && (
            <div className="px-4 mb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
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
            <div className="px-4 mb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
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
      <div className="p-4 mt-auto border-t border-border/50">
        {!isCollapsed ? (
          <div className="p-5 rounded-3xl bg-secondary border border-primary/10 relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:rotate-12 transition-transform duration-500">
              <Zap size={60} className="text-primary" />
            </div>
            <p className="text-xs font-black text-primary mb-2">PRO PLAN</p>
            <p className="text-[11px] text-muted-foreground font-bold leading-relaxed mb-4">You're using 24% of your current plan limits.</p>
            <button className="w-full py-2 bg-background border border-border rounded-xl text-[11px] font-black text-primary hover:bg-primary hover:text-background transition-all">
              Upgrade Now
            </button>
          </div>
        ) : (
          <button className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all mx-auto">
            <Zap size={20} />
          </button>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: hsl(var(--muted-foreground)); }
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
          ? "bg-primary/10 text-primary font-black shadow-[0_10px_20px_rgba(var(--primary),0.05)]" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <div className={cn(
        "shrink-0 transition-all duration-300",
        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
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
          className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
        />
      )}
    </Link>
  );
}


