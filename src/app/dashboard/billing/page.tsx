'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2, Download, Plus, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function BillingPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[#0a0a0a]">Billing & Plan</h1>
          <p className="text-sm text-[#6b7280] font-medium mt-2">Manage your subscription, invoices, and payments.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-4 py-2 bg-[#f0f7ff] rounded-full border border-[#d1e9ff]">
              <ShieldCheck size={16} className="text-[#2970ff]" />
              <span className="text-[11px] font-black text-[#2970ff] uppercase tracking-wider">Secure Billing</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Current Plan */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-[#2970ff] to-[#6da1ff] shadow-[0_20px_50px_rgba(41,112,255,0.15)]">
            <div className="bg-white rounded-[2.3rem] p-8 md:p-12 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform duration-700 group-hover:scale-[1.7]">
                <Zap size={150} className="text-[#2970ff]" />
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div>
                    <div className="inline-flex items-center px-4 py-1 rounded-full bg-[#f0f7ff] text-[#2970ff] text-[11px] font-black uppercase tracking-widest mb-4">
                      Current Subscription
                    </div>
                    <h2 className="text-4xl font-black text-[#0a0a0a] tracking-tight mb-2">Growth Plan</h2>
                    <p className="text-[#6b7280] font-bold text-sm">Efficiently scaling your brand experiences.</p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-4xl font-black text-[#0a0a0a] tracking-tight mb-1">$29<span className="text-lg text-[#9ca3af]">/mo</span></div>
                    <p className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest">Next payment: April 14, 2026</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  <PlanFeature text="Unlimited Dynamic QR Codes" />
                  <PlanFeature text="50,000 Monthly Scans" />
                  <PlanFeature text="Advanced AI Customer Insights" />
                  <PlanFeature text="Priority 24/7 Support" />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#0a0a0a] text-sm font-bold text-white hover:bg-[#2970ff] transition-all shadow-xl">
                    Change Plan
                  </button>
                  <button className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white border border-[#e5e7eb] text-sm font-bold text-[#4b5563] hover:bg-[#f9fafb] transition-all">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-[#e5e7eb] p-8 md:p-12 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-[#0a0a0a]">Payment Methods</h3>
              <button className="flex items-center gap-2 text-sm font-bold text-[#2970ff] hover:underline">
                <Plus size={18} /> Add New
              </button>
            </div>
            
            <div className="p-6 rounded-3xl border border-[#f3f4f6] bg-[#f9fafb]/50 flex items-center justify-between group hover:border-[#2970ff]/30 hover:bg-white transition-all duration-300">
              <div className="flex items-center gap-6">
                <div className="w-16 h-10 bg-gradient-to-br from-[#0a0a0a] to-[#262626] rounded-xl flex items-center justify-center text-white text-[10px] font-black italic shadow-lg">
                  VISA
                </div>
                <div>
                  <p className="text-sm font-black text-[#0a0a0a]">Visa ending in 4242</p>
                  <p className="text-[10px] text-[#6b7280] font-bold uppercase mt-1">Expiry 12/26 • Primary</p>
                </div>
              </div>
              <button className="text-xs font-black text-[#6b7280] hover:text-[#0a0a0a] transition-colors p-2 underline underline-offset-4">
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Invoices */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-[#e5e7eb] p-8 shadow-sm">
            <h3 className="text-xl font-black text-[#0a0a0a] mb-6">Recent Invoices</h3>
            <div className="space-y-4">
              <InvoiceItem date="Mar 14, 2026" amount="$29.00" status="Paid" />
              <InvoiceItem date="Feb 14, 2026" amount="$29.00" status="Paid" />
              <InvoiceItem date="Jan 14, 2026" amount="$29.00" status="Paid" />
              <InvoiceItem date="Dec 14, 2025" amount="$19.00" status="Paid" />
            </div>
            <button className="w-full mt-8 py-4 text-sm font-bold text-[#6b7280] hover:text-[#0a0a0a] transition-colors border border-[#f3f4f6] rounded-2xl">
              View All History
            </button>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-[#0a0a0a] text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
               <Zap size={60} />
            </div>
            <h3 className="text-lg font-black mb-2 italic">Need more?</h3>
            <p className="text-white/60 text-xs font-bold leading-relaxed mb-6">Unlock custom features, API access, and unlimited storage with our Enterprise solutions.</p>
            <button className="text-xs font-black text-[#2970ff] flex items-center gap-2 group">
              Contact Sales <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanFeature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-[#10b981]/10 flex items-center justify-center shrink-0">
        <CheckCircle2 size={12} className="text-[#10b981]" />
      </div>
      <span className="text-xs font-bold text-[#4b5563]">{text}</span>
    </div>
  );
}

function InvoiceItem({ date, amount, status }: { date: string, amount: string, status: string }) {
  return (
    <div className="flex items-center justify-between py-4 group">
      <div>
        <p className="text-sm font-black text-[#0a0a0a] group-hover:text-[#2970ff] transition-colors">{date}</p>
        <p className="text-[10px] text-[#9ca3af] font-bold mt-0.5">{status}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-black text-[#0a0a0a]">{amount}</span>
        <button className="p-2.5 rounded-xl bg-[#f3f4f6] text-[#6b7280] hover:text-[#0a0a0a] hover:bg-[#e5e7eb] transition-all">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}
