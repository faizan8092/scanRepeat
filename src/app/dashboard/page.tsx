'use client';

import * as React from 'react';
import { 
  TrendingUp, 
  Users, 
  QrCode, 
  ArrowUpRight, 
  MoreHorizontal,
  ExternalLink,
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
  return (
    <div className="space-y-10">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#6b7280] font-bold text-[11px] uppercase tracking-widest mb-2">
            <Calendar size={14} className="text-[#2970ff]" />
             Monday, March 16, 2026
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[#0a0a0a]">Dashboard Overview</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-[#e5e7eb] text-sm font-bold text-[#4b5563] hover:bg-[#f9fafb] transition-all shadow-sm">
            <Download size={18} />
             Export
          </button>
          <Link href="/dashboard/builder" className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-[#0a0a0a] text-sm font-bold text-white hover:bg-[#2970ff] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[#2970ff]/30">
            <Plus size={18} />
             Create QR Code
          </Link>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <motion.div 
        variants={containers}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Scans', value: '12,482', trend: '+12.5%', icon: QrCode, color: '#2970ff', bg: 'bg-[#f0f7ff]' },
          { label: 'Active Products', value: '24', trend: '+2', icon: TrendingUp, color: '#10b981', bg: 'bg-[#ecfdf5]' },
          { label: 'Direct Funnels', value: '8,241', trend: '+8.2%', icon: Users, color: '#8b5cf6', bg: 'bg-[#f5f3ff]' },
          { label: 'Avg. Conversion', value: '10.4%', trend: '+1.2%', icon: ArrowUpRight, color: '#f59e0b', bg: 'bg-[#fffbeb]' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            variants={item}
            className="p-8 rounded-[2rem] bg-white border border-[#e5e7eb] shadow-sm hover:shadow-xl hover:shadow-[#2970ff]/5 transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300", stat.bg)}>
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <div className="flex flex-col items-end">
                <div className="text-[11px] font-black text-[#10b981] bg-[#ecfdf5] px-2 py-0.5 rounded-full mb-1">
                  {stat.trend}
                </div>
                <div className="text-[10px] text-[#9ca3af] font-bold uppercase tracking-wider">THIS MONTH</div>
              </div>
            </div>
            <div className="text-3xl font-black text-[#0a0a0a] tracking-tight mb-1">{stat.value}</div>
            <div className="text-sm font-bold text-[#6b7280]">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* --- CHARTS & ACTIVITY --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-8 p-1 rounded-[2.5rem] bg-gradient-to-br from-[#e5e7eb] to-white">
          <div className="h-full bg-white rounded-[2.3rem] p-8 md:p-10 flex flex-col shadow-inner">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-[#0a0a0a] tracking-tight">Scan Activity</h2>
                <p className="text-sm text-[#6b7280] font-medium">Real-time engagement across your physical branding.</p>
              </div>
              <div className="flex items-center gap-2 p-1 bg-[#f3f4f6] rounded-xl font-bold text-xs text-[#6b7280]">
                <button className="px-3 py-2 bg-white text-[#0a0a0a] rounded-lg shadow-sm">Daily</button>
                <button className="px-3 py-2 hover:text-[#0a0a0a] transition-colors">Weekly</button>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2970ff" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2970ff" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fontWeight: 700, fill: '#9ca3af'}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fontWeight: 700, fill: '#9ca3af'}} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', padding: '15px' }}
                    labelStyle={{ fontWeight: 800, color: '#0a0a0a', marginBottom: '5px' }}
                  />
                  <Area type="monotone" dataKey="scans" stroke="#2970ff" strokeWidth={4} fillOpacity={1} fill="url(#colorScans)" />
                  <Area type="monotone" dataKey="unique" stroke="#8b5cf6" strokeWidth={4} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorUnique)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 flex items-center gap-6 pt-6 border-t border-[#f3f4f6]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2970ff]" />
                <span className="text-xs font-bold text-[#4b5563]">Total Scans</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
                <span className="text-xs font-bold text-[#4b5563]">Unique Visitors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Mini sections */}
        <div className="lg:col-span-4 space-y-8">
           <div className="p-8 rounded-[2.5rem] bg-[#0a0a0a] text-white shadow-xl flex flex-col h-full overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform duration-700">
               <QrCode size={120} />
             </div>
             <div className="relative z-10">
               <h3 className="text-xl font-black mb-2">Usage Limits</h3>
               <p className="text-white/60 text-sm font-medium mb-8">Your resource activity this month.</p>
               
               <div className="space-y-6">
                 <UsageLine label="Funnels" value={24} max={100} unit="" />
                 <UsageLine label="Monthly Volume" value={12482} max={50000} unit=" scans" />
                 <UsageLine label="Assets" value={1.2} max={5} unit=" GB" />
               </div>
               
               <button className="w-full mt-10 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/10">
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
            <h2 className="text-2xl font-black text-[#0a0a0a] tracking-tight">Recent Products</h2>
            <p className="text-sm text-[#6b7280] font-medium">Monitoring the performance of your top packaging funnels.</p>
          </div>
          <button className="p-3 rounded-xl bg-white border border-[#e5e7eb] hover:bg-[#f9fafb] text-[#6b7280] transition-all">
            <Filter size={20} />
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-[#e5e7eb] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fafb]/50 border-b border-[#e5e7eb]">
                  <th className="px-8 py-5 text-[11px] font-black text-[#9ca3af] uppercase tracking-wider">Product Info</th>
                  <th className="px-6 py-5 text-[11px] font-black text-[#9ca3af] uppercase tracking-wider text-center">Engagement</th>
                  <th className="px-6 py-5 text-[11px] font-black text-[#9ca3af] uppercase tracking-wider text-center">Conversion</th>
                  <th className="px-6 py-5 text-[11px] font-black text-[#9ca3af] uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-[11px] font-black text-[#9ca3af] uppercase tracking-wider text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#f9fafb]/80 transition-colors group">
                    <td className="px-8 py-6">
                      <div>
                        <div className="text-sm font-black text-[#0a0a0a] mb-0.5">{product.name}</div>
                        <div className="text-[10px] text-[#2970ff] font-bold">UID: SR-2938{product.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="text-sm font-bold text-[#0a0a0a]">{product.scans.toLocaleString()}</div>
                      <div className="text-[10px] text-[#10b981] font-bold">{product.growth}</div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="text-sm font-bold text-[#0a0a0a]">{product.conversion}</div>
                      <div className="w-16 h-1 mx-auto bg-[#e5e7eb] rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-[#2970ff]" 
                          style={{ width: product.conversion }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                        product.status === 'Active' 
                          ? "bg-[#ecfdf5] text-[#10b981]" 
                          : "bg-[#f3f4f6] text-[#6b7280]"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full mr-2", product.status === 'Active' ? "bg-[#10b981]" : "bg-[#9ca3af]")} />
                        {product.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 rounded-xl text-[#9ca3af] hover:text-[#0a0a0a] hover:bg-[#f3f4f6] transition-all">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-5 bg-[#f9fafb]/30 border-t border-[#e5e7eb] flex items-center justify-center">
             <button className="text-sm font-bold text-[#2970ff] hover:text-[#1a56cc] transition-colors flex items-center gap-2">
               View All Products
               <ArrowUpRight size={16} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsageLine({ label, value, max, unit }: { label: string, value: number, max: number, unit: string }) {
  const percent = (value / max) * 100;
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-xs font-bold text-white/50 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-black">{value.toLocaleString()}<span className="text-white/40 font-bold">{unit}</span><span className="text-white/20 mx-1">/</span>{max.toLocaleString()}</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#2970ff] to-[#6da1ff] rounded-full shadow-[0_0_15px_rgba(41,112,255,0.4)]" 
        />
      </div>
    </div>
  );
}

