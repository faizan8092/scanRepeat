'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Lock, Fingerprint, Eye, EyeOff, Smartphone, LogOut, ChevronRight, Save, Trash2, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/lib/auth-context';

export default function SecurityPage() {
  const { logout } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-[#0a0a0a]">Security Settings</h1>
        <p className="text-sm text-[#6b7280] font-medium mt-2">Protect your account and managed brand assets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Password Section */}
          <div className="bg-white rounded-[2.5rem] border border-[#e5e7eb] p-8 md:p-12 shadow-sm">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-[#f3f4f6]">
               <div className="w-12 h-12 rounded-2xl bg-[#f0f7ff] flex items-center justify-center text-[#2970ff]">
                  <Key size={24} />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-[#0a0a0a] tracking-tight">Security Password</h2>
                 <p className="text-[#6b7280] text-sm font-medium">Update your login credentials regularly.</p>
               </div>
            </div>

            <div className="space-y-6 max-w-xl">
              <SecurityInput label="Current Password" type="password" placeholder="••••••••" />
              <SecurityInput label="New Password" type="password" placeholder="••••••••" />
              <SecurityInput label="Confirm New Password" type="password" placeholder="••••••••" />
              
              <div className="pt-4">
                <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#0a0a0a] text-sm font-bold text-white hover:bg-[#2970ff] transition-all shadow-xl">
                  <Save size={18} />
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* 2FA Section */}
          <div className="bg-white rounded-[2.5rem] border border-[#e5e7eb] p-8 md:p-12 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
               <Fingerprint size={120} />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-[#ecfdf5] flex items-center justify-center text-[#10b981]">
                    <Smartphone size={24} />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-[#0a0a0a] tracking-tight">Two-Factor Authentication</h2>
                   <p className="text-[#6b7280] text-sm font-medium">Add an extra layer of protection.</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#ecfdf5] rounded-full border border-[#d1fae5] text-[#10b981] text-[10px] font-black uppercase">
                 Recommended
              </div>
            </div>

            <p className="text-sm font-bold text-[#4b5563] leading-relaxed mb-10 max-w-2xl relative z-10">
              Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to log in.
            </p>

            <button className="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-[#10b981] text-sm font-black text-[#10b981] hover:bg-[#10b981] hover:text-white transition-all relative z-10">
              Enable 2FA Now <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white rounded-[2.5rem] border border-[#e5e7eb] p-8 shadow-sm">
             <h3 className="text-xl font-black text-[#0a0a0a] mb-6">Active Sessions</h3>
             <div className="space-y-6">
                <SessionItem device="MacBook Pro" location="San Francisco, US" status="Current" icon="laptop" />
                <SessionItem device="iPhone 15" location="San Francisco, US" status="Active 2h ago" icon="phone" />
             </div>
             <button className="w-full mt-10 py-4 rounded-2xl border border-[#f3f4f6] text-sm font-bold text-[#6b7280] hover:text-[#ff4d4d] hover:border-[#ff4d4d]/10 hover:bg-[#fff5f5] transition-all flex items-center justify-center gap-2">
               <LogOut size={16} /> Sign out of all sessions
             </button>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-[#fff5f5] border border-[#ff4d4d]/10">
             <div className="flex items-center gap-3 mb-4 text-[#ff4d4d]">
                <AlertCircle size={20} />
                <h3 className="text-lg font-black italic">Danger Zone</h3>
             </div>
             <p className="text-[#6b7280] text-[11px] font-bold leading-relaxed mb-8 uppercase tracking-wider">Deleting your account is permanent and cannot be undone.</p>
             <button className="w-full py-4 rounded-2xl bg-[#ff4d4d] text-white font-bold text-sm shadow-xl shadow-[#ff4d4d]/20 hover:bg-[#e60000] transition-all flex items-center justify-center gap-2">
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
      <label className="text-sm font-black text-[#374151] block ml-1">{label}</label>
      <div className="relative">
        <input 
          type={isPassword ? (show ? 'text' : 'password') : type}
          placeholder={placeholder}
          className="w-full bg-[#f9fafb] border border-[#e5e7eb] focus:bg-white focus:border-[#2970ff]/30 focus:ring-4 focus:ring-[#2970ff]/5 py-4 px-5 rounded-2xl text-sm font-bold transition-all outline-none"
        />
        {isPassword && (
          <button 
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#9ca3af] hover:text-[#374151] transition-colors"
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
    <div className="flex items-center gap-4 group">
      <div className="p-3 rounded-xl bg-[#f3f4f6] text-[#6b7280] group-hover:bg-[#2970ff] group-hover:text-white transition-all duration-300">
        {icon === 'laptop' ? <Smartphone size={18} /> : <Smartphone size={18} />}
      </div>
      <div>
        <p className="text-sm font-black text-[#0a0a0a]">{device}</p>
        <p className="text-[10px] text-[#6b7280] font-bold">{location} • <span className={cn(status === 'Current' ? "text-[#10b981]" : "text-[#9ca3af]")}>{status}</span></p>
      </div>
    </div>
  );
}
