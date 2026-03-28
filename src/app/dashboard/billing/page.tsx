'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2, Download, Plus, Zap, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useToast } from '@/src/lib/toast-context';
import { Loader } from '@/src/components/ui/Loader';
import { 
  fetchMyPlan, 
  fetchBillingInfo, 
  fetchAllPlans,
  createCheckoutSession, 
  createBillingPortalSession,
  mockUpgradePlan,
  UserBillingSummary,
  BillingInfo
} from '@/src/lib/billing-service';
import { format } from 'date-fns';

export default function BillingPage() {
  const [summary, setSummary] = React.useState<UserBillingSummary | null>(null);
  const [info, setInfo] = React.useState<BillingInfo | null>(null);
  const [plans, setPlans] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSelectingPlan, setIsSelectingPlan] = React.useState(false);
  const { addToast } = useToast();

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const [s, i, pList] = await Promise.all([fetchMyPlan(), fetchBillingInfo(), fetchAllPlans()]);
      setSummary(s);
      setInfo(i);
      setPlans(pList);
    } catch (err: any) {
      addToast('error', 'Failed to load billing', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePortal = async () => {
    try {
      setIsProcessing(true);
      const { url } = await createBillingPortalSession();
      window.location.href = url;
    } catch (err: any) {
      addToast('error', 'Portal Error', err.message);
      setIsProcessing(false);
    }
  };

  const handleUpgrade = async () => {
    setIsSelectingPlan(true);
  };

  const executeUpgrade = async (planKey: string) => {
    try {
      setIsProcessing(true);
      await mockUpgradePlan(planKey);
      addToast('success', 'Plan Updated', `Successfully switched to ${planKey} plan.`);
      await loadData();
      setIsSelectingPlan(false);
    } catch (err: any) {
      addToast('error', 'Upgrade Error', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
        <Loader size={120} />
        <p className="text-xs font-black text-slate-400 tracking-[0.2em] uppercase -mt-4">Synchronizing Billing</p>
      </div>
    );
  }

  const isFreePlan = summary?.plan?.key === 'free';

  if (isSelectingPlan) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-primary-foreground">Select a Plan</h1>
            <p className="text-sm text-muted-foreground font-medium mt-2">Choose the perfect plan for your business needs.</p>
          </div>
          <button 
            onClick={() => setIsSelectingPlan(false)}
            className="px-5 py-2 rounded-2xl bg-secondary hover:bg-border transition-all text-sm font-bold text-muted-foreground"
          >
            ← Back to Billing
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const isCurrent = summary?.plan?.key === p.key;
            return (
              <div 
                key={p.key} 
                className={cn(
                  "relative flex flex-col bg-card rounded-[2rem] border overflow-hidden transition-all duration-300",
                  p.popular ? "border-primary/50 shadow-lg shadow-primary/10 ring-primary ring-primary/20" : "border-border shadow-sm hover:border-primary/30"
                )}
              >
                {p.popular && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-accent" />
                )}
                <div className="p-8 pb-6 border-b border-border/50">
                  <h3 className="text-primaryxl font-black mb-1 text-primary-foreground">{p.name}</h3>
                  <p className="text-xs font-bold text-muted-foreground mb-6 line-clamp-2">{p.tagline}</p>
                  
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-black">{p.priceLabel.split('/')[0]}</span>
                    {p.priceLabel.includes('/') && <span className="text-sm font-bold text-muted-foreground">/mo</span>}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1 mb-8">
                    <PlanFeature text={`${p.features.maxProducts === -1 ? 'Unlimited' : p.features.maxProducts} Dynamic QR Codes`} />
                    <PlanFeature text={`${p.features.monthlyScansLimit === -1 ? 'Unlimited' : (p.features.monthlyScansLimit / 1000) + 'k'} Monthly Scans`} />
                    <PlanFeature text={`${p.features.teamSeats === -1 ? 'Unlimited' : p.features.teamSeats} Team Seats`} />
                    {p.features.customDomain && <PlanFeature text="Custom Domains" />}
                    {p.features.aiInsights && <PlanFeature text="AI Customer Insights" />}
                  </div>

                  <button 
                    disabled={isProcessing || isCurrent}
                    onClick={() => executeUpgrade(p.key)}
                    className={cn(
                      "w-full py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2",
                      isCurrent 
                        ? "bg-secondary text-muted-foreground cursor-not-allowed shadow-none" 
                        : (p.popular ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-card border border-border text-foreground hover:bg-secondary")
                    )}
                  >
                    {isProcessing ? <Loader size={30} /> : (isCurrent ? 'Current Plan' : (p.key === 'free' ? 'Downgrade to Free' : 'Select Plan'))}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary-foreground">Billing & Plan</h1>
          <p className="text-sm text-muted-foreground font-medium mt-2">Manage your subscription, invoices, and payments.</p>
        </div>
        <div className="flex items-center gap-3">
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
                    <h2 className="text-4xl font-black text-primary-foreground tracking-tight mb-2">
                      {summary?.plan?.name} Plan
                    </h2>
                    <p className="text-muted-foreground font-bold text-sm">
                      {summary?.plan?.tagline}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-4xl font-black text-primary-foreground tracking-tight mb-1">
                      {summary?.plan?.priceLabel}
                    </div>
                    {isFreePlan ? (
                      <p className="text-[10px] text-success font-black uppercase tracking-widest">Always Free</p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        {summary?.subscription?.periodEnd ? (
                          summary?.subscription?.cancelAtPeriodEnd 
                            ? `Ends on ${format(new Date(summary.subscription.periodEnd), 'MMM dd, yyyy')}`
                            : `Next payment: ${format(new Date(summary.subscription.periodEnd), 'MMM dd, yyyy')}`
                        ) : 'Subscription Active'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Usage Bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <UsageBar 
                    label="Active Products" 
                    used={summary?.usage?.products?.used || 0}
                    limit={summary?.usage?.products?.limit || 0}
                    percentage={summary?.usage?.products?.percentage || 0}
                  />
                  <UsageBar 
                    label="Monthly Scans" 
                    used={summary?.usage?.monthlyScans?.used || 0}
                    limit={summary?.usage?.monthlyScans?.limit || 0}
                    percentage={summary?.usage?.monthlyScans?.percentage || 0}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button 
                    onClick={handleUpgrade}
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xl font-bold flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <Loader size={30} /> : (isFreePlan ? 'Upgrade to Growth' : 'Manage Subscription')}
                  </button>
                  {summary?.subscription?.cancelAtPeriodEnd && (
                    <div className="px-4 py-2 bg-warning/10 border border-warning/20 rounded-xl text-[10px] font-black text-warning uppercase tracking-wider">
                      Cancellation Scheduled
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-12 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-primary-foreground">Payment Methods</h3>
              {!isFreePlan && (
                <button onClick={handlePortal} className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                  <Plus size={18} /> Manage
                </button>
              )}
            </div>
            
            {(!info?.paymentMethods || info.paymentMethods.length === 0) ? (
              <div className="p-10 rounded-3xl border border-accentashed border-border bg-secondary/20 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
                  <CreditCard size={20} />
                </div>
                <p className="text-sm font-black text-primary-foreground mb-1">No payment methods</p>
                <p className="text-xs text-muted-foreground font-bold">Payment methods are only required for paid subscriptions.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {info.paymentMethods.map(pm => (
                  <div key={pm.id} className="p-6 rounded-3xl border border-border bg-secondary/50 flex items-center justify-between group hover:border-primary/30 hover:bg-card transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-10 bg-gradient-to-br from-primary-foreground to-primary-foreground/80 rounded-2xl flex items-center justify-center text-background text-[10px] font-black italic shadow-lg">
                        {pm.brand.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-black text-primary-foreground">{pm.brand.charAt(0).toUpperCase() + pm.brand.slice(1)} ending in {pm.last4}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">
                          Expiry {pm.expMonth}/{pm.expYear} {pm.isDefault && '• Primary'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
            <h3 className="text-xl font-black text-primary-foreground mb-6">Recent Invoices</h3>
            {(!info?.invoices || info.invoices.length === 0) ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground/50 mb-4">
                  <Download size={20} />
                </div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">No invoices yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {info.invoices.map(invoice => (
                  <InvoiceItem 
                    key={invoice.id}
                    date={format(new Date(invoice.created * 1000), 'MMM dd, yyyy')} 
                    amount={`$${(invoice.amountPaid / 100).toFixed(2)}`} 
                    status={invoice.status.toUpperCase()} 
                    pdf={invoice.pdfUrl}
                  />
                ))}
              </div>
            )}
            {!isFreePlan && (
              <button onClick={handlePortal} className="w-full mt-8 py-4 text-sm font-bold text-muted-foreground hover:text-primary-foreground transition-colors border border-border rounded-2xl">
                View All History
              </button>
            )}
          </div>

          <div className="p-8 rounded-[2.5rem] bg-card border border-border text-foreground overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
               <Zap size={60} className="text-primary" />
            </div>
            <h3 className="text-lg font-black mb-2 italic text-primary-foreground">Need more?</h3>
            <p className="text-muted-foreground text-xs font-bold leading-relaxed mb-6">Unlock custom features, API access, and unlimited scale with our Enterprise solutions.</p>
            <button className="text-xs font-black text-primary flex items-center gap-2 group">
              Contact Sales <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      
      {!isFreePlan && !summary?.subscription?.cancelAtPeriodEnd && (
        <div className="pt-12 flex justify-center border-t border-border/20">
          <button 
            disabled={isProcessing}
            onClick={handlePortal}
            className="text-[10px] font-black text-slate-400 dark:text-slate-600 opacity-20 hover:opacity-100 hover:text-destructive transition-all uppercase tracking-[0.2em]"
          >
            Cancel my subscription
          </button>
        </div>
      )}
    </div>
  );
}

function UsageBar({ label, used, limit, percentage }: { label: string, used: number, limit: number, percentage: number }) {
  const isUnlimited = limit === -1;
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
        <span className="text-sm font-black text-primary-foreground">
          {used.toLocaleString()}
          <span className="text-muted-foreground/40 font-bold ml-1">
            / {isUnlimited ? '∞' : limit.toLocaleString()}
          </span>
        </span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: isUnlimited ? '100%' : `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full transition-colors",
            percentage > 90 && !isUnlimited ? "bg-destructive" : "bg-primary"
          )}
        />
      </div>
    </div>
  );
}

function InvoiceItem({ date, amount, status, pdf }: { date: string, amount: string, status: string, pdf?: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-3xl hover:bg-secondary/50 transition-all duration-300 group">
      <div>
        <p className="text-sm font-black text-primary-foreground group-hover:text-primary transition-colors">{date}</p>
        <p className="text-[10px] text-muted-foreground font-bold mt-0.5">{status}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-black text-primary-foreground">{amount}</span>
        {pdf && (
          <a href={pdf} target="_blank" rel="noreferrer" className="p-2.5 rounded-2xl bg-secondary text-muted-foreground hover:text-primary-foreground hover:bg-border transition-all">
            <Download size={16} />
          </a>
        )}
      </div>
    </div>
  );
}

function PlanFeature({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
      <span className="text-sm font-semibold text-muted-foreground">{text}</span>
    </div>
  );
}

