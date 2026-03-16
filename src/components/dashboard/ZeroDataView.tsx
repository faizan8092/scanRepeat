import * as React from 'react';
import { QrCode, Plus, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';

export function ZeroDataView() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <div className="relative mb-10 group">
        <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full group-hover:bg-primary/30 transition-all duration-700"></div>
        <div className="relative w-32 h-32 bg-card border border-border rounded-[2.5rem] flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
          <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary">
            <QrCode size={40} />
          </div>
        </div>
      </div>
      
      <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight max-w-2xl">
        Connect Your Physical Products to the Digital World
      </h2>
      <p className="text-lg text-muted-foreground font-medium mb-12 max-w-xl mx-auto leading-relaxed">
        Start generating dynamic QR codes, tracking customer engagement, and building powerful post-purchase funnels today.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-16 px-4">
        {[
          { icon: Plus, title: '1. Create a Code', desc: 'Design a custom, trackable QR code for your product packaging in seconds.', color: 'text-primary', bg: 'bg-primary/10' },
          { icon: Users, title: '2. Engage Users', desc: 'Link customers directly to guides, offers, and loyalty programs after purchase.', color: 'text-accent', bg: 'bg-accent/10' },
          { icon: TrendingUp, title: '3. Track Results', desc: 'Monitor real-time scans, locations, and conversion metrics on this dashboard.', color: 'text-success', bg: 'bg-success/10' },
        ].map((step, i) => (
          <div key={i} className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all text-left group">
             <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300", step.bg, step.color)}>
               <step.icon size={28} />
             </div>
             <h3 className="text-xl font-black text-foreground mb-3">{step.title}</h3>
             <p className="text-sm text-muted-foreground font-medium leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      <Link href="/dashboard/builder" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-foreground text-background font-bold text-lg hover:bg-primary transition-all shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-primary/30 group">
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" /> Let's Get Started
      </Link>
    </div>
  );
}
