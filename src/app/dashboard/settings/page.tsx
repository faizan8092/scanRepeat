'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { User, Save, Camera, Mail, Building2, UserCircle2, Briefcase } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/lib/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Account Profile</h1>
        <p className="text-sm text-muted-foreground font-medium mt-2">Update your personal information and public profile.</p>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="p-8 md:p-12 lg:p-16">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-6 shrink-0">
               <div className="relative group cursor-pointer">
                  <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-tr from-primary to-accent p-1 shadow-2xl shadow-primary/20 group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full rounded-[2.3rem] bg-card flex items-center justify-center overflow-hidden">
                      {user?.image ? (
                        <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl font-black text-primary">{user?.name?.substring(0, 2).toUpperCase() || 'AF'}</span>
                      )}
                    </div>
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-foreground border-4 border-card text-background flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Camera size={20} />
                  </button>
               </div>
               <div className="text-center">
                 <p className="text-xs font-black text-foreground uppercase tracking-widest mb-1">Upload New</p>
                 <p className="text-[10px] text-muted-foreground font-bold">Max 5MB • JPG, PNG</p>
               </div>
            </div>

            {/* Form Section */}
            <div className="flex-1 space-y-10 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileInput label="First Name" icon={User} defaultValue={user?.name?.split(' ')[0] || 'Ali'} />
                <ProfileInput label="Last Name" icon={UserCircle2} defaultValue={user?.name?.split(' ')[1] || 'Faizan'} />
                <ProfileInput label="Email Address" icon={Mail} defaultValue={user?.email || 'faizan@tezminds.com'} className="md:col-span-2" />
                <ProfileInput label="Company" icon={Building2} defaultValue="Tezminds" className="md:col-span-2" />
                <ProfileInput label="Professional Role" icon={Briefcase} defaultValue="Administrator" className="md:col-span-2" />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-foreground/80 uppercase tracking-widest block ml-1">About / Bio</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us a little about yourself..."
                  className="w-full bg-secondary/50 border border-border focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/5 p-5 rounded-3xl text-sm font-bold transition-all outline-none resize-none"
                  defaultValue="Helping brands connect with their customers through smart, interactive physical packaging funnels."
                />
              </div>

              <div className="pt-6 border-t border-border flex justify-end">
                <button className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-foreground text-background hover:bg-primary transition-all shadow-lg hover:shadow-primary/30">
                  <Save size={18} />
                  Save Profile Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileInput({ label, icon: Icon, defaultValue, className }: { label: string, icon: any, defaultValue: string, className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-xs font-black text-foreground/80 uppercase tracking-widest block ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Icon size={18} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <input 
          type="text"
          defaultValue={defaultValue}
          className="w-full bg-secondary/50 border border-border focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/5 py-4 pl-14 pr-5 rounded-2xl text-sm font-bold transition-all outline-none"
        />
      </div>
    </div>
  );
}

