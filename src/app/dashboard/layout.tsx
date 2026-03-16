'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/src/components/Sidebar';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { Bell, Search, User, Settings, LogOut, ChevronDown, Sparkles, Shield, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/src/lib/auth-context';
import { cn } from '@/src/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isBuilder = pathname?.startsWith('/dashboard/builder');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  if (isBuilder) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#0a0a0a] font-sans selection:bg-[#2970ff]/10">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      
      <div className={cn("flex flex-col min-h-screen transition-all duration-500 ease-in-out", isCollapsed ? "pl-20" : "pl-64")}>
        {/* --- HEADER --- */}
        <header className="h-20 border-b border-[#e5e7eb] bg-white/70 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-8 transition-all">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={18} className="text-[#9ca3af] group-focus-within:text-[#2970ff] transition-colors" />
              </div>
              <input 
                type="text"
                placeholder="Search scans, products, or analytics..."
                className="w-full bg-[#f3f4f6]/50 border border-transparent focus:bg-white focus:border-[#2970ff]/30 focus:ring-4 focus:ring-[#2970ff]/5 py-3 pl-12 pr-4 rounded-2xl text-sm font-medium transition-all outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                <kbd className="px-1.5 py-0.5 rounded border border-[#e5e7eb] bg-white text-[10px] font-bold text-[#6b7280]">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-[#e5e7eb] bg-white text-[10px] font-bold text-[#6b7280]">K</kbd>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center px-3 py-1.5 bg-[#f0f7ff] rounded-full border border-[#d1e9ff] text-[#2970ff] text-[11px] font-bold tracking-tight">
              <Sparkles size={12} className="mr-1.5 text-blue-500" />
              PRO PLAN
            </div>

            <div className="h-8 w-px bg-[#e5e7eb] mx-1" />

            <ThemeToggle />
            
            <button className="relative p-2.5 rounded-xl hover:bg-[#f3f4f6] text-[#6b7280] transition-colors group">
              <Bell size={20} className="group-hover:scale-110 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ff4d4d] rounded-full border-2 border-white ring-2 ring-[#ff4d4d]/20 animate-pulse" />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-2xl transition-all border border-transparent group",
                  isMenuOpen ? "bg-[#f3f4f6] border-[#e5e7eb]" : "hover:bg-[#f3f4f6]"
                )}
              >
                <div className="relative">
                  <div className="h-9 w-9 bg-gradient-to-tr from-[#2970ff] to-[#6da1ff] rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-[#2970ff]/20">
                    {user?.name?.substring(0, 2).toUpperCase() || 'AF'}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10b981] rounded-full border-2 border-white shadow-sm" />
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-[#0a0a0a] leading-tight">{user?.name || 'Ali Faizan'}</p>
                  <p className="text-[10px] text-[#6b7280] font-bold uppercase tracking-wider mt-0.5">Admin Account</p>
                </div>
                <ChevronDown size={14} className={cn("text-[#9ca3af] transition-transform duration-300", isMenuOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsMenuOpen(false)}
                      className="fixed inset-0 z-40"
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-[#e5e7eb] shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-2 z-50 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-[#f3f4f6] bg-[#f9fafb]/50">
                        <p className="text-sm font-bold text-[#0a0a0a]">{user?.name || 'Ali Faizan'}</p>
                        <p className="text-xs text-[#6b7280] font-medium mt-0.5 truncate">{user?.email || 'faizan@tezminds.com'}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <UserMenuItem 
                          icon={User} 
                          label="My Profile" 
                          onClick={() => { setIsMenuOpen(false); (window as any).location.href = '/dashboard/settings'; }}
                        />
                        <UserMenuItem 
                          icon={Shield} 
                          label="Security" 
                          onClick={() => { setIsMenuOpen(false); (window as any).location.href = '/dashboard/security'; }}
                        />
                        <UserMenuItem 
                          icon={CreditCard} 
                          label="Billing" 
                          onClick={() => { setIsMenuOpen(false); (window as any).location.href = '/dashboard/billing'; }}
                        />
                        <div className="h-px bg-[#f3f4f6] mx-2 my-1" />
                        <UserMenuItem 
                          icon={LogOut} 
                          label="Logout" 
                          variant="danger"
                          onClick={() => { setIsMenuOpen(false); logout(); }}
                        />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function UserMenuItem({ icon: Icon, label, onClick, variant = 'default' }: { 
  icon: any, 
  label: string, 
  onClick: () => void,
  variant?: 'default' | 'danger'
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group",
        variant === 'danger' 
          ? "text-[#ff4d4d] hover:bg-[#fff5f5]" 
          : "text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#0a0a0a]"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-lg transition-colors",
        variant === 'danger' ? "bg-[#fff5f5]" : "bg-[#f3f4f6] group-hover:bg-white"
      )}>
        <Icon size={16} />
      </div>
      {label}
    </button>
  );
}

