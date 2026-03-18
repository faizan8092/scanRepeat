import * as React from 'react';
import { QrCode, Plus, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';

export function ZeroDataView() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in duration-500">
      <div className="relative mb-6 group">
        <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full group-hover:bg-primary/30 transition-all duration-700"></div>
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
          <img 
            src="/assets/zero-data.svg" 
            alt="No Data" 
            className="w-full h-full object-contain animate-float"
          />
        </div>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}</style>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3 tracking-tight max-w-2xl">
        Connect Your Physical Products
      </h2>
      <p className="text-base text-muted-foreground font-medium mb-6 max-w-lg mx-auto leading-relaxed">
        Start generating dynamic QR codes and building post-purchase funnels today.
      </p>

      <Link href="/dashboard/builder" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-foreground text-background font-bold text-base hover:bg-primary transition-all shadow-lg group mb-12">
        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" /> Let's Get Started
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full px-4">
        {[
          { icon: Plus, title: '1. Create', desc: 'Design custom codes in seconds.', color: 'text-primary', bg: 'bg-primary/10' },
          { icon: Users, title: '2. Engage', desc: 'Link directly to guides & offers.', color: 'text-accent', bg: 'bg-accent/10' },
          { icon: TrendingUp, title: '3. Track', desc: 'Monitor real-time metrics.', color: 'text-success', bg: 'bg-success/10' },
        ].map((step, i) => (
          <div key={i} className="bg-card rounded-3xl border border-border p-5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all text-left group">
             <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300", step.bg, step.color)}>
               <step.icon size={20} />
             </div>
             <h3 className="text-lg font-black text-foreground mb-1">{step.title}</h3>
             <p className="text-xs text-muted-foreground font-medium leading-tight">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
