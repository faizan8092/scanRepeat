'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/src/components/Sidebar';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { Bell, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { IconButton, InputBase, Paper, Avatar, Menu, MenuItem, ListItemIcon, Typography, Divider } from '@mui/material';
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
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (isBuilder) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <div className={cn("transition-all duration-300", isCollapsed ? "pl-20" : "pl-64")}>
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="flex-1 max-w-md">
            <div className="flex items-center px-4 py-2 bg-muted/50 rounded-xl border border-border focus-within:bg-card focus-within:border-primary/40 focus-within:shadow-sm transition-all group">
              <Search size={18} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
              <InputBase
                placeholder="Search scans, products..."
                className="ml-3 flex-1 text-sm font-medium"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <IconButton size="medium" className="text-muted-foreground hover:bg-muted transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-card"></span>
            </IconButton>
            
            <div className="h-8 w-px bg-border mx-2" />
            
            <button 
              onClick={handleClick}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-muted transition-all border border-transparent hover:border-border group"
            >
              <Avatar 
                className="h-8 w-8 bg-primary/10 text-primary border border-primary/20 text-xs font-bold"
                src={user?.image}
              >
                {user?.name?.substring(0, 2).toUpperCase() || 'AF'}
              </Avatar>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-foreground leading-tight">{user?.name || 'Ali Faizan'}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Administrator</p>
              </div>
              <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.08))',
                  mt: 1.5,
                  borderRadius: '16px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  minWidth: 200,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
            >
              <div className="px-4 py-3">
                <Typography variant="subtitle2" className="font-bold">{user?.name || 'Ali Faizan'}</Typography>
                <Typography variant="caption" className="text-slate-500 block">{user?.email || 'faizan@tezminds.com'}</Typography>
              </div>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={() => { handleClose(); (window as any).location.href = '/dashboard/settings'; }} className="py-2.5 text-sm font-medium">
                <ListItemIcon><User size={18} /></ListItemIcon> My Profile
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); (window as any).location.href = '/dashboard/settings'; }} className="py-2.5 text-sm font-medium">
                <ListItemIcon><Settings size={18} /></ListItemIcon> Settings
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={() => { handleClose(); logout(); }} className="py-2.5 text-sm font-medium text-red-600">
                <ListItemIcon><LogOut size={18} className="text-red-600" /></ListItemIcon> Logout
              </MenuItem>
            </Menu>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
