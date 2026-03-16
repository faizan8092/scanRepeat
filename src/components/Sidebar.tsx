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
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Tooltip } from '@mui/material';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Products', icon: Package, href: '/dashboard/products' },
    { label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-card text-card-foreground transition-all duration-300 z-50 flex flex-col border-r border-border shadow-sm overflow-visible",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header / Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <span className="font-tektur text-lg font-bold tracking-tight text-foreground">ScanRepeat</span>
          </Link>
        )}
        {isCollapsed && (
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto transition-all">
             <QrCode className="h-6 w-6 text-primary" />
           </div>
        )}
        
        {/* Toggle Button */}
        <button 
          onClick={onToggle}
          type="button"
          className={cn(
            "absolute -right-3.5 top-8 -translate-y-1/2 bg-background text-muted-foreground border border-border shadow-md hover:text-primary hover:border-primary/40 transition-all w-7 h-7 rounded-full flex items-center justify-center z-[60] group",
          )}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavItem 
            key={item.href} 
            {...item} 
            isActive={pathname === item.href} 
            isCollapsed={isCollapsed} 
          />
        ))}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--muted)); border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: hsl(var(--muted-foreground)); }
      `}</style>
    </aside>
  );
}

function NavItem({ label, icon: Icon, href, isActive, isCollapsed, className }: { 
  label: string; 
  icon: any; 
  href: string; 
  isActive: boolean; 
  isCollapsed: boolean; 
  className?: string; 
}) {
  const content = (
    <Link 
      href={href}
      className={cn(
        "flex items-center px-3 py-2.5 rounded-xl transition-all duration-150 group relative mb-1",
        isActive 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
    >
      <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-all")} />
      {!isCollapsed && <span className="ml-3 text-[13px] tracking-wide truncate flex-1">{label}</span>}
      
      {isActive && !isCollapsed && (
        <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full shadow-lg shadow-primary/50" />
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip title={label} placement="right" arrow>
        <div className="w-full">
          {content}
        </div>
      </Tooltip>
    );
  }

  return content;
}
