'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Mail, Smartphone, Globe, Info, Save } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = React.useState('email');

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-[#0a0a0a]">Notifications</h1>
        <p className="text-sm text-[#6b7280] font-medium mt-2">Manage how you receive updates and alerts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Categories */}
        <div className="lg:col-span-3 space-y-2">
          <TabButton 
            active={activeTab === 'email'} 
            onClick={() => setActiveTab('email')}
            icon={Mail}
            label="Email Alerts"
          />
          <TabButton 
            active={activeTab === 'push'} 
            onClick={() => setActiveTab('push')}
            icon={Smartphone}
            label="Push Notifications"
          />
          <TabButton 
            active={activeTab === 'system'} 
            onClick={() => setActiveTab('system')}
            icon={Info}
            label="System Updates"
          />
        </div>

        {/* Right Side: Options */}
        <div className="lg:col-span-9">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] border border-[#e5e7eb] p-8 md:p-12 shadow-sm"
          >
            <div className="space-y-8">
              <div className="border-b border-[#f3f4f6] pb-6">
                <h2 className="text-2xl font-black text-[#0a0a0a] tracking-tight capitalize">{activeTab} Notifications</h2>
                <p className="text-[#6b7280] text-sm font-medium mt-1">Configure your preferences for {activeTab} delivery.</p>
              </div>

              <div className="space-y-6">
                <NotificationToggle 
                  title="Weekly Analytics Report" 
                  description="Get a summary of your product performance every Monday morning."
                  defaultEnabled={true}
                />
                <NotificationToggle 
                  title="Scan Threshold Alerts" 
                  description="Receive an instant alert when a product reaches a major scan milestone."
                  defaultEnabled={true}
                />
                <NotificationToggle 
                  title="New Customer Segments" 
                  description="Be notified when our AI detects a new high-value customer group."
                  defaultEnabled={false}
                />
                <NotificationToggle 
                  title="Account Activity" 
                  description="Security alerts and login notifications for your account."
                  defaultEnabled={true}
                />
              </div>

              <div className="pt-10 flex justify-end">
                <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#0a0a0a] text-sm font-bold text-white hover:bg-[#2970ff] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[#2970ff]/30">
                  <Save size={18} />
                  Save Preferences
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all border outline-none",
        active 
          ? "bg-[#2970ff] border-[#2970ff] text-white shadow-[0_10px_20px_rgba(41,112,255,0.2)]" 
          : "bg-white border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb] hover:border-[#d1d5db]"
      )}
    >
      <Icon size={18} className={cn(active ? "text-white" : "text-[#2970ff]")} />
      {label}
    </button>
  );
}

function NotificationToggle({ title, description, defaultEnabled }: { title: string, description: string, defaultEnabled: boolean }) {
  const [enabled, setEnabled] = React.useState(defaultEnabled);
  
  return (
    <div className="flex items-center justify-between p-6 rounded-3xl bg-[#f9fafb]/50 border border-[#f3f4f6] group hover:bg-white hover:border-[#e5e7eb] hover:shadow-xl hover:shadow-[#2970ff]/5 transition-all duration-300">
      <div className="flex-1 pr-6">
        <h3 className="text-sm font-black text-[#0a0a0a] group-hover:text-[#2970ff] transition-colors">{title}</h3>
        <p className="text-xs text-[#6b7280] font-medium mt-1 leading-relaxed">{description}</p>
      </div>
      <button 
        onClick={() => setEnabled(!enabled)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 outline-none",
          enabled ? "bg-[#2970ff]" : "bg-[#e5e7eb]"
        )}
      >
        <span 
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}
