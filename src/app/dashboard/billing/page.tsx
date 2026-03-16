'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2, Download, Plus, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function BillingPage() {
  const [isFreePlan, setIsFreePlan] = React.useState(false);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Billing & Plan</h1>
          <p className="text-sm text-muted-foreground font-medium mt-2">Manage your subscription, invoices, and payments.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsFreePlan(!isFreePlan)}
             className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-warning/10 border border-warning/20 text-sm font-bold text-warning hover:bg-warning/20 transition-all shadow-sm"
           >
             {isFreePlan ? 'Show Paid Plan' : 'Show Free Plan'}
           </button>
           <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <ShieldCheck size={16} className="text-primary" />
              <span className="text-[11px] font-black text-primary uppercase tracking-wider">Secure Billing</span>
           </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Current Plan */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-primary to-accent shadow-xl shadow-primary/10">
            <div className="bg-card rounded-[2.3rem] p-8 md:p-12 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform duration-700 group-hover:scale-[1.7]">
                <Zap size={150} className="text-primary" />
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div>
                     <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest mb-4">
                      {isFreePlan ? 'Starter Plan' : 'Current Subscription'}
                    </div>
                    <h2 className="text-4xl font-black text-foreground tracking-tight mb-2">
                      {isFreePlan ? 'Free Explorer' : 'Growth Plan'}
                    </h2>
                    <p className="text-muted-foreground font-bold text-sm">
                      {isFreePlan ? 'Getting started with digital experiences.' : 'Efficiently scaling your brand experiences.'}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-4xl font-black text-foreground tracking-tight mb-1">
                      {isFreePlan ? '$0' : '$29'}<span className="text-lg text-muted-foreground">/mo</span>
                    </div>
                    {isFreePlan ? (
                      <p className="text-[10px] text-success font-black uppercase tracking-widest">Always Free</p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Next payment: April 14, 2026</p>
                    )}
                  </div>

                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {isFreePlan ? (
                    <>
                      <PlanFeature text="5 Dynamic QR Codes" />
                      <PlanFeature text="1,000 Monthly Scans" />
                      <PlanFeature text="Standard Analytics" />
                      <PlanFeature text="Community Support" />
                    </>
                  ) : (
                    <>
                      <PlanFeature text="Unlimited Dynamic QR Codes" />
                      <PlanFeature text="50,000 Monthly Scans" />
                      <PlanFeature text="Advanced AI Customer Insights" />
                      <PlanFeature text="Priority 24/7 Support" />
                    </>
                  )}
                </div>


                 <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-foreground text-background hover:bg-primary transition-all shadow-xl font-bold">
                    {isFreePlan ? 'Upgrade to Growth' : 'Change Plan'}
                  </button>
                  {!isFreePlan && (
                    <button className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-card border border-border text-sm font-bold text-muted-foreground hover:bg-secondary transition-all">
                      Cancel Subscription
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>

           <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-12 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-foreground">Payment Methods</h3>
              {!isFreePlan && (
                <button className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                  <Plus size={18} /> Add New
                </button>
              )}
            </div>
            
            {isFreePlan ? (
              <div className="p-10 rounded-3xl border border-dashed border-border bg-secondary/20 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
                  <CreditCard size={20} />
                </div>
                <p className="text-sm font-black text-foreground mb-1">No payment methods</p>
                <p className="text-xs text-muted-foreground font-bold">Payment methods are only required for paid subscriptions.</p>
              </div>
            ) : (
              <div className="p-6 rounded-3xl border border-border bg-secondary/50 flex items-center justify-between group hover:border-primary/30 hover:bg-card transition-all duration-300">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-10 bg-gradient-to-br from-foreground to-foreground/80 rounded-2xl flex items-center justify-center text-background text-[10px] font-black italic shadow-lg">
                    VISA
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground">Visa ending in 4242</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Expiry 12/26 • Primary</p>
                  </div>
                </div>
                <button className="text-xs font-black text-muted-foreground hover:text-foreground transition-colors p-2 underline underline-offset-4">
                  Edit
                </button>
              </div>
            )}
          </div>

        </div>

         <div className="lg:col-span-4 space-y-8">
          <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
            <h3 className="text-xl font-black text-foreground mb-6">Recent Invoices</h3>
            {isFreePlan ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground/50 mb-4">
                  <Download size={20} />
                </div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">No invoices yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                <InvoiceItem date="Mar 14, 2026" amount="$29.00" status="Paid" />
                <InvoiceItem date="Feb 14, 2026" amount="$29.00" status="Paid" />
                <InvoiceItem date="Jan 14, 2026" amount="$29.00" status="Paid" />
                <InvoiceItem date="Dec 14, 2025" amount="$19.00" status="Paid" />
              </div>
            )}
            {!isFreePlan && (
              <button className="w-full mt-8 py-4 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors border border-border rounded-2xl">
                View All History
              </button>
            )}
          </div>


          <div className="p-8 rounded-[2.5rem] bg-foreground text-background overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
               <Zap size={60} />
            </div>
            <h3 className="text-lg font-black mb-2 italic">Need more?</h3>
            <p className="text-background/60 text-xs font-bold leading-relaxed mb-6">Unlock custom features, API access, and unlimited storage with our Enterprise solutions.</p>
            <button className="text-xs font-black text-primary flex items-center gap-2 group">
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
      <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
        <CheckCircle2 size={12} className="text-success" />
      </div>
      <span className="text-xs font-bold text-muted-foreground">{text}</span>
    </div>
  );
}

function InvoiceItem({ date, amount, status }: { date: string, amount: string, status: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-3xl hover:bg-secondary/50 transition-all duration-300 group">
      <div>
        <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{date}</p>
        <p className="text-[10px] text-muted-foreground font-bold mt-0.5">{status}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-black text-foreground">{amount}</span>
        <button className="p-2.5 rounded-2xl bg-secondary text-muted-foreground hover:text-foreground hover:bg-border transition-all">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}

