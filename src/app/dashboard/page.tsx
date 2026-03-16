'use client';

import * as React from 'react';
import { 
  TrendingUp, 
  Users, 
  QrCode, 
  ArrowUpRight, 
  MoreHorizontal,
  Plus,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import Link from 'next/link';
import { ZeroDataView } from '@/src/components/dashboard/ZeroDataView';

const data = [
  { name: 'Mon', scans: 450, unique: 380 },
  { name: 'Tue', scans: 520, unique: 410 },
  { name: 'Wed', scans: 840, unique: 620 },
  { name: 'Thu', scans: 1100, unique: 890 },
  { name: 'Fri', scans: 950, unique: 760 },
  { name: 'Sat', scans: 1450, unique: 1150 },
  { name: 'Sun', scans: 1250, unique: 980 },
];

const products = [
  { id: 1, name: 'Whey Protein 1kg', scans: 1240, conversion: '12%', status: 'Active', growth: '+2.5%' },
  { id: 2, name: 'Pre-Workout Blast', scans: 850, conversion: '8%', status: 'Active', growth: '+1.8%' },
  { id: 3, name: 'Creatine Monohydrate', scans: 420, conversion: '15%', status: 'Draft', growth: '0%' },
  { id: 4, name: 'BCAA Recovery', scans: 310, conversion: '5%', status: 'Active', growth: '-0.5%' },
];

const containers = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const [isZeroData, setIsZeroData] = React.useState(false);

  return (
    <div className="space-y-10">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground font-bold text-[11px] uppercase tracking-widest mb-2">
            <Calendar size={14} className="text-primary" />
             Monday, March 16, 2026
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Dashboard Overview</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsZeroData(!isZeroData)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-warning/10 border border-warning/20 text-sm font-bold text-warning hover:bg-warning/20 transition-all shadow-sm"
          >
            {isZeroData ? 'Show Mock Data' : 'Zero State'}
          </button>
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border text-sm font-bold text-muted-foreground hover:bg-secondary transition-all shadow-sm">
            <Download size={18} />
             Export
          </button>
          <Link href="/dashboard/builder" className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-foreground text-sm font-bold text-background hover:bg-primary transition-all shadow-lg hover:shadow-primary/30">
            <Plus size={18} />
             Create QR Code
          </Link>
        </div>
      </div>

      {isZeroData ? (
        <ZeroDataView />
      ) : (
        <div className="space-y-10">
      {/* --- STATS GRID --- */}
      <motion.div 
        variants={containers}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Scans', value: '12,482', trend: '+12.5%', icon: QrCode, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Active Products', value: '24', trend: '+2', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Direct Funnels', value: '8,241', trend: '+8.2%', icon: Users, color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'Avg. Conversion', value: '10.4%', trend: '+1.2%', icon: ArrowUpRight, color: 'text-warning', bg: 'bg-warning/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            variants={item}
            className="p-8 rounded-[2.5rem] bg-card border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300", stat.bg)}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <div className="flex flex-col items-end">
                <div className="text-[11px] font-black text-success bg-success/10 px-2 py-0.5 rounded-full mb-1">
                  {stat.trend}
                </div>
                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">THIS MONTH</div>
              </div>
            </div>
            <div className="text-3xl font-black text-foreground tracking-tight mb-1">{stat.value}</div>
            <div className="text-sm font-bold text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* --- CHARTS & ACTIVITY --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-8 p-1 rounded-[2.5rem] bg-gradient-to-br from-border to-card">
          <div className="h-full bg-card rounded-[2.3rem] p-8 md:p-10 flex flex-col shadow-inner">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">Scan Activity</h2>
                <p className="text-sm text-muted-foreground font-medium">Real-time engagement across your physical branding.</p>
              </div>
              <div className="flex items-center gap-2 p-1 bg-secondary rounded-2xl font-bold text-xs text-muted-foreground">
                <button className="px-3 py-2 bg-card text-foreground rounded-xl shadow-sm">Daily</button>
                <button className="px-3 py-2 hover:text-foreground transition-colors">Weekly</button>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fontWeight: 700, fill: 'hsl(var(--muted-foreground))'}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fontWeight: 700, fill: 'hsl(var(--muted-foreground))'}} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', padding: '15px' }}
                    labelStyle={{ fontWeight: 800, color: 'hsl(var(--foreground))', marginBottom: '5px' }}
                  />
                  <Area type="monotone" dataKey="scans" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorScans)" />
                  <Area type="monotone" dataKey="unique" stroke="hsl(var(--accent))" strokeWidth={4} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorUnique)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 flex items-center gap-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs font-bold text-muted-foreground">Total Scans</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-xs font-bold text-muted-foreground">Unique Visitors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Mini sections */}
        <div className="lg:col-span-4 space-y-8">
           <div className="p-8 rounded-[2.5rem] bg-foreground text-background shadow-xl flex flex-col h-full overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform duration-700">
               <QrCode size={120} />
             </div>
             <div className="relative z-10">
               <h3 className="text-xl font-black mb-2">Usage Limits</h3>
               <p className="text-background/60 text-sm font-medium mb-8">Your resource activity this month.</p>
               
               <div className="space-y-6">
                 <UsageLine label="Funnels" value={24} max={100} unit="" />
                 <UsageLine label="Monthly Volume" value={12482} max={50000} unit=" scans" />
                 <UsageLine label="Assets" value={1.2} max={5} unit=" GB" />
               </div>
               
               <button className="w-full mt-10 py-4 rounded-2xl bg-background/10 hover:bg-background/20 text-background font-bold text-sm transition-all border border-background/10">
                 Manage Plan
               </button>
             </div>
           </div>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">Recent Products</h2>
            <p className="text-sm text-muted-foreground font-medium">Monitoring the performance of your top packaging funnels.</p>
          </div>
          <button className="p-3 rounded-2xl bg-card border border-border hover:bg-secondary text-muted-foreground transition-all">
            <Filter size={20} />
          </button>
        </div>

        <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="px-8 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-wider">Product Info</th>
                  <th className="px-6 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-wider text-center">Engagement</th>
                  <th className="px-6 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-wider text-center">Conversion</th>
                  <th className="px-6 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-wider text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/80 transition-colors group">
                    <td className="px-8 py-6">
                      <div>
                        <div className="text-sm font-black text-foreground mb-0.5">{product.name}</div>
                        <div className="text-[10px] text-primary font-bold">UID: SR-2938{product.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="text-sm font-bold text-foreground">{product.scans.toLocaleString()}</div>
                      <div className="text-[10px] text-success font-bold">{product.growth}</div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="text-sm font-bold text-foreground">{product.conversion}</div>
                      <div className="w-16 h-1 mx-auto bg-muted rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: product.conversion }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                        product.status === 'Active' 
                          ? "bg-success/10 text-success" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full mr-2", product.status === 'Active' ? "bg-success" : "bg-muted-foreground")} />
                        {product.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-5 bg-secondary/30 border-t border-border flex items-center justify-center">
             <Link href="/dashboard/products" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
               View All Products
               <ArrowUpRight size={16} />
             </Link>
          </div>
        </div>
      </div>
      </div>
      )}
    </div>
  );
}

function UsageLine({ label, value, max, unit }: { label: string, value: number, max: number, unit: string }) {
  const percent = (value / max) * 100;
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-xs font-bold text-background/50 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-black text-background">{value.toLocaleString()}<span className="text-background/40 font-bold">{unit}</span><span className="text-background/20 mx-1">/</span>{max.toLocaleString()}</span>
      </div>
      <div className="h-2 w-full bg-background/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_15px_rgba(var(--primary),0.4)]" 
        />
      </div>
    </div>
  );
}
