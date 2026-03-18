"use client";

import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  CheckCircle2,
  X,
  ArrowRight,
  Zap,
  Star,
  ShieldCheck,
  BarChart3,
  Globe,
  RefreshCw,
  Headphones,
  Building2,
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.8 } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stagger: any = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const PLANS = [
  {
    name: "Starter",
    monthlyPrice: 9,
    annualPrice: 7,
    desc: "For independent makers and small brands just getting started.",
    color: "from-slate-500 to-slate-700",
    highlight: false,
    cta: "Start Free Trial",
    badge: null,
    features: {
      "QR Codes": "10 active codes",
      "Scan Analytics": true,
      "Page Builder": "Basic templates",
      "Reorder Funnel": true,
      "Video Embeds": false,
      "Custom Domain": false,
      "Remove Branding": false,
      "A/B Testing": false,
      "Priority Support": false,
      "Dedicated Manager": false,
    }
  },
  {
    name: "Growth",
    monthlyPrice: 29,
    annualPrice: 23,
    desc: "For scaling DTC brands that need more codes and analytics depth.",
    color: "from-[#2970ff] to-[#0040c1]",
    highlight: true,
    cta: "Start Free Trial",
    badge: "Most Popular",
    features: {
      "QR Codes": "100 active codes",
      "Scan Analytics": true,
      "Page Builder": "All templates + custom CSS",
      "Reorder Funnel": true,
      "Video Embeds": true,
      "Custom Domain": true,
      "Remove Branding": false,
      "A/B Testing": false,
      "Priority Support": false,
      "Dedicated Manager": false,
    }
  },
  {
    name: "Pro",
    monthlyPrice: 59,
    annualPrice: 47,
    desc: "For high-volume brands that want full control and white-labelling.",
    color: "from-violet-500 to-violet-700",
    highlight: false,
    cta: "Start Free Trial",
    badge: null,
    features: {
      "QR Codes": "500 active codes",
      "Scan Analytics": true,
      "Page Builder": "All templates + custom CSS",
      "Reorder Funnel": true,
      "Video Embeds": true,
      "Custom Domain": true,
      "Remove Branding": true,
      "A/B Testing": true,
      "Priority Support": false,
      "Dedicated Manager": false,
    }
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    desc: "For enterprise teams with unlimited scale and dedicated support.",
    color: "from-[#0a0a0a] to-[#1c1c1e]",
    highlight: false,
    cta: "Contact Sales",
    badge: null,
    features: {
      "QR Codes": "Unlimited",
      "Scan Analytics": true,
      "Page Builder": "All templates + custom CSS",
      "Reorder Funnel": true,
      "Video Embeds": true,
      "Custom Domain": true,
      "Remove Branding": true,
      "A/B Testing": true,
      "Priority Support": true,
      "Dedicated Manager": true,
    }
  }
];

const FEATURE_ROWS = [
  "QR Codes",
  "Scan Analytics",
  "Page Builder",
  "Reorder Funnel",
  "Video Embeds",
  "Custom Domain",
  "Remove Branding",
  "A/B Testing",
  "Priority Support",
  "Dedicated Manager",
];

const ADD_ONS = [
  { icon: BarChart3, title: "Advanced Analytics Pack", price: "$12/mo", desc: "Heat maps, funnel drop-off analysis, cohort retention, and exportable CSV reports." },
  { icon: Globe, title: "Multi-Region Hosting", price: "$8/mo", desc: "Serve hosted pages from edge regions across EU, APAC, and North America for sub-100ms load times." },
  { icon: ShieldCheck, title: "Brand Protection Suite", price: "$15/mo", desc: "Counterfeit scan detection, geo-blocking, IP rate limiting, and domain verification." },
  { icon: RefreshCw, title: "Unlimited Redirects", price: "$6/mo", desc: "Create unlimited destination rules, time-based redirects, and audience segmentation rules." },
];

const FAQS = [
  { q: "Can I switch plans at any time?", a: "Yes. You can upgrade or downgrade instantly. When upgrading, you'll be charged pro-rata for the remaining days in your cycle." },
  { q: "What happens after my trial ends?", a: "You'll be prompted to choose a plan. If you don't, your account will be paused — your data is never deleted." },
  { q: "Do annual plans auto-renew?", a: "Yes. Annual plans auto-renew by default. You'll receive a reminder email 14 days before renewal." },
  { q: "Can I get a refund?", a: "Yes. If you're unhappy within 7 days of your first paid cycle, we'll issue a full refund — no questions asked." },
];

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value
      ? <CheckCircle2 className="w-5 h-5 text-[#2970ff] mx-auto" />
      : <X className="w-4 h-4 text-[#d1d5db] mx-auto" />;
  }
  return <span className="text-sm font-semibold text-[#374151]">{value}</span>;
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#0a0a0a] font-sans overflow-x-hidden selection:bg-[#2970ff] selection:text-white">
      <Navbar />

      <main className="flex-1 relative">

        {/* Background blobs */}
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[#eef5ff] to-transparent pointer-events-none -z-10" />
        <motion.div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#2970ff]/8 blur-[120px] -z-10 pointer-events-none"
          animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} />

        {/* ── Header ── */}
        <section className="pt-40 pb-20 text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2970ff]/8 border border-[#2970ff]/20 text-[#2970ff] text-xs font-semibold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2970ff]" />
                Pricing
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-[52px] md:text-[76px] font-bold tracking-[-0.04em] mb-6 leading-[1.05]">
                Simple, transparent<br />
                <span className="bg-gradient-to-r from-[#2970ff] to-[#7c3aed] bg-clip-text text-transparent">pricing.</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-xl text-[#6b7280] mb-10 max-w-xl mx-auto">
                Start free for 14 days. No credit card required. Cancel at any time.
              </motion.p>

              {/* Toggle */}
              <motion.div variants={fadeUp} className="inline-flex items-center gap-4 bg-white rounded-full p-1 ring-1 ring-[#e5e7eb] shadow-sm">
                <button
                  onClick={() => setAnnual(false)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!annual ? 'bg-[#0a0a0a] text-white shadow-md' : 'text-[#6b7280] hover:text-[#0a0a0a]'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${annual ? 'bg-[#0a0a0a] text-white shadow-md' : 'text-[#6b7280] hover:text-[#0a0a0a]'}`}
                >
                  Annual
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">Save 20%</span>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Plans ── */}
        <section className="pb-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              {PLANS.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: "spring", bounce: 0, duration: 0.8 }}
                  className={`relative flex flex-col rounded-[2rem] overflow-hidden ${plan.highlight ? 'lg:-mt-6 shadow-2xl' : 'shadow-sm'}`}
                >
                  {/* Plan header */}
                  <div className={`bg-gradient-to-br ${plan.color} p-8 text-white relative overflow-hidden`}>
                    {/* Decorative rings */}
                    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-white/10" />
                    <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full border border-white/10" />

                    {plan.badge && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest mb-4 border border-white/30">
                        <Star className="w-3 h-3 fill-white" />
                        {plan.badge}
                      </div>
                    )}

                    <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
                    <p className="text-white/70 text-sm mb-6 leading-snug">{plan.desc}</p>

                    <div className="flex items-baseline gap-1">
                      {plan.monthlyPrice !== null ? (
                        <>
                          <span className="text-[48px] font-black leading-none">
                            ${annual ? plan.annualPrice : plan.monthlyPrice}
                          </span>
                          <span className="text-white/60 text-sm font-medium">/mo</span>
                        </>
                      ) : (
                        <span className="text-[36px] font-black leading-none">Custom</span>
                      )}
                    </div>
                    {annual && plan.monthlyPrice !== null && (
                      <p className="text-white/60 text-xs mt-1">Billed annually</p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="bg-white flex-1 p-8 flex flex-col ring-1 ring-[#e5e7eb]">
                    <ul className="space-y-4 flex-1 mb-8">
                      {FEATURE_ROWS.map((feat) => {
                        const val = plan.features[feat as keyof typeof plan.features];
                        const enabled = val === true || typeof val === 'string';
                        return (
                          <li key={feat} className={`flex items-start gap-3 ${!enabled && val !== false ? '' : !enabled ? 'opacity-40' : ''}`}>
                            {typeof val === 'boolean' ? (
                              val
                                ? <CheckCircle2 className="w-4 h-4 text-[#2970ff] shrink-0 mt-0.5" />
                                : <X className="w-4 h-4 text-[#d1d5db] shrink-0 mt-0.5" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-[#2970ff] shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className="text-sm font-semibold text-[#374151]">{feat}</p>
                              {typeof val === 'string' && (
                                <p className="text-xs text-[#9ca3af]">{val}</p>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <Link
                      href={plan.cta === "Contact Sales" ? "/contact" : "/signup"}
                      className={`w-full py-3.5 rounded-2xl font-bold text-sm text-center transition-all duration-300 hover:-translate-y-0.5 ${
                        plan.highlight
                          ? 'bg-gradient-to-r from-[#2970ff] to-[#0040c1] text-white shadow-lg shadow-[#2970ff]/20'
                          : 'bg-[#f3f4f6] hover:bg-[#0a0a0a] text-[#0a0a0a] hover:text-white'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="py-20 bg-white overflow-x-auto">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
              <motion.h2 variants={fadeUp} className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] mb-4">Compare plans</motion.h2>
              <motion.p variants={fadeUp} className="text-[#6b7280] text-lg">A full breakdown of what's included in each tier.</motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0, duration: 0.8 }}
              className="rounded-[2rem] ring-1 ring-[#e5e7eb] overflow-hidden shadow-sm"
            >
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    <th className="text-left p-6 font-bold text-[#374151] text-base w-1/3">Feature</th>
                    {PLANS.map(p => (
                      <th key={p.name} className={`p-6 text-center font-black ${p.highlight ? 'text-[#2970ff]' : ''}`}>
                        {p.name}
                        {p.highlight && <span className="ml-1.5 text-[9px] bg-[#2970ff] text-white px-2 py-0.5 rounded-full uppercase">Popular</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_ROWS.map((feat, i) => (
                    <tr key={feat} className={`border-b border-[#f3f4f6] ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                      <td className="p-5 pl-6 font-semibold text-[#374151]">{feat}</td>
                      {PLANS.map(p => (
                        <td key={p.name} className="p-5 text-center">
                          <FeatureCell value={p.features[feat as keyof typeof p.features]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* ── Add-ons ── */}
        <section className="py-28 bg-[#fafafa]">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mb-14 text-center">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2970ff]/8 border border-[#2970ff]/20 text-[#2970ff] text-xs font-semibold uppercase tracking-widest mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2970ff]" />
                Add-ons
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] mb-4">Power up any plan.</motion.h2>
              <motion.p variants={fadeUp} className="text-[#6b7280] text-lg max-w-xl mx-auto">Add only what you need. All add-ons can be cancelled independently at any time.</motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ADD_ONS.map((addon, i) => {
                const Icon = addon.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.1, type: "spring", bounce: 0, duration: 0.8 }}
                    className="bg-white rounded-[2rem] p-8 ring-1 ring-[#e5e7eb] flex items-start gap-6 hover:shadow-lg hover:ring-[#2970ff]/20 transition-all duration-500 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#2970ff]/8 flex items-center justify-center text-[#2970ff] shrink-0 group-hover:bg-[#2970ff] group-hover:text-white transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold">{addon.title}</h3>
                        <span className="text-sm font-bold text-[#2970ff] bg-[#2970ff]/8 px-3 py-1 rounded-full">{addon.price}</span>
                      </div>
                      <p className="text-[#6b7280] text-sm leading-relaxed">{addon.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Enterprise CTA ── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0, duration: 0.8 }}
              className="rounded-[2.5rem] bg-gradient-to-br from-[#0a0a0a] to-[#1c1c2e] p-12 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2970ff]/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#7c3aed]/10 rounded-full blur-[80px]" />
              <div className="relative z-10 max-w-xl">
                <div className="flex items-center gap-3 mb-5">
                  <Building2 className="w-8 h-8 text-[#2970ff]" />
                  <h2 className="text-[32px] font-bold tracking-tight">Need an Enterprise plan?</h2>
                </div>
                <p className="text-white/70 text-lg leading-relaxed">
                  Unlimited codes, custom SLAs, SSO, dedicated account management, and a private Slack channel. Built for brands doing serious volume.
                </p>
              </div>
              <div className="relative z-10 flex flex-col gap-4 shrink-0">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-[#0a0a0a] font-bold px-8 py-4 rounded-2xl shadow-lg hover:bg-[#f3f4f6] transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap">
                  <Headphones className="w-5 h-5" />
                  Talk to Sales
                </Link>
                <p className="text-white/50 text-xs text-center">Usually responds within 2 hours</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-24 bg-[#fafafa]">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
              <motion.h2 variants={fadeUp} className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] mb-4">Pricing FAQ</motion.h2>
              <motion.p variants={fadeUp} className="text-[#6b7280] text-lg">Common questions about billing, trials, and plans.</motion.p>
            </motion.div>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <motion.details
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: "spring", bounce: 0, duration: 0.7 }}
                  className="group p-7 bg-white rounded-3xl ring-1 ring-[#e5e7eb] shadow-sm open:shadow-md open:ring-[#2970ff]/30 transition-all duration-300 cursor-pointer"
                >
                  <summary className="flex items-center justify-between text-[17px] font-bold tracking-tight list-none">
                    {faq.q}
                    <span className="text-[#9ca3af] group-open:rotate-45 transition-transform duration-300 ml-4 text-2xl leading-none shrink-0">+</span>
                  </summary>
                  <p className="text-[#6b7280] text-[15px] leading-relaxed mt-4">{faq.a}</p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-36 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2970ff] to-[#0040c1] -z-10" />
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_60%_40%,white_1px,transparent_1px)] [background-size:32px_32px] -z-10" />
          <div className="container mx-auto px-4 text-center text-white">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="text-[48px] md:text-[72px] font-bold tracking-[-0.04em] mb-6 leading-[1.05] max-w-3xl mx-auto">
                Your first 14 days are free.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-white/80 text-xl mb-12 max-w-xl mx-auto">
                No credit card. No commitment. Just set up your first QR code and start converting.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-white text-[#2970ff] px-10 py-5 text-lg font-black shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  Get started for free <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
