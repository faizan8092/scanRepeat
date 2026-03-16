'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff, Smartphone, LogOut, ChevronRight, Save, Trash2, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/lib/auth-context';

export default function SecurityPage() {
  const { logout } = useAuth();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Security Settings</h1>
        <p className="text-sm text-muted-foreground font-medium mt-2">Protect your account and managed brand assets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Password Section */}
          <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-12 shadow-sm">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Key size={24} />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-foreground tracking-tight">Security Password</h2>
                 <p className="text-muted-foreground text-sm font-medium">Update your login credentials regularly.</p>
               </div>
            </div>

            <div className="space-y-6 max-w-xl">
              <SecurityInput label="Current Password" type="password" placeholder="••••••••" />
              <SecurityInput label="New Password" type="password" placeholder="••••••••" />
              <SecurityInput label="Confirm New Password" type="password" placeholder="••••••••" />
              
              <div className="pt-4">
                <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background hover:bg-primary transition-all shadow-xl">
                  <Save size={18} />
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* 2FA Section */}
          <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-12 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
               <Key size={120} />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success">
                    <Smartphone size={24} />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-foreground tracking-tight">Two-Factor Authentication</h2>
                   <p className="text-muted-foreground text-sm font-medium">Add an extra layer of protection.</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full border border-success/20 text-success text-[10px] font-black uppercase">
                 Recommended
              </div>
            </div>

            <p className="text-sm font-bold text-muted-foreground leading-relaxed mb-10 max-w-2xl relative z-10">
              Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to log in.
            </p>

            <button className="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-success text-sm font-black text-success hover:bg-success hover:text-background transition-all relative z-10">
              Enable 2FA Now <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
             <h3 className="text-xl font-black text-foreground mb-6">Active Sessions</h3>
             <div className="space-y-6">
                <SessionItem device="MacBook Pro" location="San Francisco, US" status="Current" icon="laptop" />
                <SessionItem device="iPhone 15" location="San Francisco, US" status="Active 2h ago" icon="phone" />
             </div>
             <button className="w-full mt-10 py-4 rounded-2xl border border-border text-sm font-bold text-muted-foreground hover:text-destructive hover:border-destructive/10 hover:bg-destructive/5 transition-all flex items-center justify-center gap-2">
               <LogOut size={16} /> Sign out of all sessions
             </button>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-destructive/5 border border-destructive/10">
             <div className="flex items-center gap-3 mb-4 text-destructive">
                <AlertCircle size={20} />
                <h3 className="text-lg font-black italic">Danger Zone</h3>
             </div>
             <p className="text-muted-foreground text-[11px] font-bold leading-relaxed mb-8 uppercase tracking-wider">Deleting your account is permanent and cannot be undone.</p>
             <button className="w-full py-4 rounded-2xl bg-destructive text-background font-bold text-sm shadow-xl shadow-destructive/20 hover:bg-destructive/90 transition-all flex items-center justify-center gap-2">
                <Trash2 size={16} /> Delete Account
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function SecurityInput({ label, type, placeholder }: { label: string, type: string, placeholder: string }) {
  const [show, setShow] = React.useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-2">
      <label className="text-sm font-black text-foreground/80 block ml-1">{label}</label>
      <div className="relative">
        <input 
          type={isPassword ? (show ? 'text' : 'password') : type}
          placeholder={placeholder}
          className="w-full bg-secondary/50 border border-border focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/5 py-4 px-5 rounded-2xl text-sm font-bold transition-all outline-none"
        />
        {isPassword && (
          <button 
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

function SessionItem({ device, location, status, icon }: { device: string, location: string, status: string, icon: 'laptop' | 'phone' }) {
  return (
    <div className="flex items-center gap-4 group p-4 rounded-3xl hover:bg-secondary/50 transition-all duration-300">
      <div className="p-3 rounded-2xl bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-background transition-all duration-300">
        <Smartphone size={18} />
      </div>
      <div>
        <p className="text-sm font-black text-foreground">{device}</p>
        <p className="text-[10px] text-muted-foreground font-bold">{location} • <span className={cn(status === 'Current' ? "text-success" : "text-muted-foreground")}>{status}</span></p>
      </div>
    </div>
  );
}

