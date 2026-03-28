'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/src/components/Sidebar';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { Bell, Search, User, Settings, LogOut, ChevronDown, Sparkles, Shield, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/src/lib/auth-context';
import { cn } from '@/src/lib/utils';
import { useUpgradePrompt } from '@/src/hooks/useUpgradePrompt';
import { UpgradeModal } from '@/src/components/ui/UpgradeModal';
import { Loader } from '@/src/components/ui/Loader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const isBuilder = pathname?.startsWith('/dashboard/builder');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { showModal, triggerReason, closeModal } = useUpgradePrompt();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Prevent rendering protected content if not authenticated
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <Loader size={120} />
      </div>
    );
  }

  if (isBuilder) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-secondary/30 text-foreground font-sans selection:bg-primary/10">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      
      <div className={cn("flex flex-col min-h-screen transition-all duration-500 ease-in-out", isCollapsed ? "pl-20" : "pl-64")}>
        {/* --- HEADER --- */}
        <header className="h-20 border-b border-border bg-card/70 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-8 transition-all">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={18} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="text"
                placeholder="Search scans, products, or analytics..."
                className="w-full bg-secondary/50 border border-transparent focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/5 py-3 pl-12 pr-4 rounded-2xl text-sm font-medium transition-all outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-card text-[10px] font-bold text-muted-foreground">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-card text-[10px] font-bold text-muted-foreground">K</kbd>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20 text-primary text-[11px] font-bold tracking-tight">
              <Sparkles size={12} className="mr-1.5" />
              PRO PLAN
            </div>

            <div className="h-8 w-px bg-border mx-1" />

            <ThemeToggle />
            
            <button className="relative p-2.5 rounded-xl hover:bg-secondary text-muted-foreground transition-colors group">
              <Bell size={20} className="group-hover:scale-110 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-card ring-2 ring-destructive/20 animate-pulse" />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-2xl transition-all border border-transparent group",
                  isMenuOpen ? "bg-secondary border-border" : "hover:bg-secondary"
                )}
              >
                <div className="relative">
                  <div className="h-9 w-9 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary/20 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.firstName?.substring(0, 1).toUpperCase() || user?.name?.substring(0, 2).toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card shadow-sm" />
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-foreground leading-tight">{user?.name || 'Ali Faizan'}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">Admin Account</p>
                </div>
                <ChevronDown size={14} className={cn("text-muted-foreground transition-transform duration-300", isMenuOpen && "rotate-180")} />
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
                      className="absolute right-0 mt-3 w-64 bg-card rounded-3xl border border-border shadow-xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-border bg-secondary/50">
                        <p className="text-sm font-bold text-foreground">{user?.name || 'Ali Faizan'}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5 truncate">{user?.email || 'faizan@tezminds.com'}</p>
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
                        <div className="h-px bg-border mx-2 my-1" />
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

      <UpgradeModal isOpen={showModal} reason={triggerReason} onClose={closeModal} />
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
          ? "text-destructive hover:bg-destructive/10" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-lg transition-colors",
        variant === 'danger' ? "bg-destructive/10" : "bg-secondary group-hover:bg-card"
      )}>
        <Icon size={16} />
      </div>
      {label}
    </button>
  );
}


