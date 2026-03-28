"use client";

import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  QrCode,
  BarChart3,
  Zap,
  RefreshCw,
  Globe,
  Scan,
  TrendingUp,
  ShieldCheck,
  Star,
  ChevronDown,
  Package,
  Smartphone,
  MousePointerClick,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.8 } as any },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2970ff]/8 border border-[#2970ff]/20 text-[#2970ff] text-xs font-semibold uppercase tracking-widest mb-6"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#2970ff]" />
      {children}
    </motion.div>
  );
}

const STATS = [
  { value: "50K+", label: "QR Codes Generated" },
  { value: "2.4M+", label: "Total Scans Tracked" },
  { value: "38%", label: "Avg. Repeat Purchase Lift" },
  { value: "4.9★", label: "Customer Rating" },
];

const HOW_IT_WORKS = [
  { icon: QrCode, step: "01", title: "Generate Your QR Code", desc: "Create a dynamic QR code for any product in seconds. Download in SVG or PNG — print-ready at any resolution." },
  { icon: Package, step: "02", title: "Print on Packaging", desc: "Add the QR code to your box, label, or insert. No reprint needed if you already have packaging — just redirect your existing QR." },
  { icon: Smartphone, step: "03", title: "Customers Scan & Engage", desc: "Buyers scan the code and land on a beautiful branded page — with tutorials, product guides, and a one-click reorder button." },
  { icon: TrendingUp, step: "04", title: "Track & Optimize", desc: "See every scan in real time. Understand geography, device, timing and conversion — then optimize your funnel accordingly." },
];

const FEATURES = [
  {
    icon: Zap,
    color: "bg-amber-400/10 text-amber-500",
    title: "Reorder Funnel",
    desc: "Programmatically surface personalized discount codes the instant a customer scans. Connect to Shopify in one click.",
    wide: true,
  },
  {
    icon: BarChart3,
    color: "bg-rose-400/10 text-rose-500",
    title: "Scan Analytics",
    desc: "Log every scan. Get granular data on geography, device type, and scan volume.",
    wide: false,
  },
  {
    icon: Globe,
    color: "bg-sky-400/10 text-sky-500",
    title: "Hosted Pages",
    desc: "Build mobile-first product pages with videos, manuals, and FAQs in minutes.",
    wide: false,
  },
  {
    icon: RefreshCw,
    color: "bg-violet-400/10 text-violet-500",
    title: "Dynamic Redirects",
    desc: "Change the destination of any QR code without reprinting. A/B test landing pages on the fly.",
    wide: false,
  },
  {
    icon: ShieldCheck,
    color: "bg-emerald-400/10 text-emerald-500",
    title: "Brand Protection",
    desc: "Detect counterfeit scans, geo-restrict content, and add domain verification to keep your brand safe.",
    wide: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Founder, AURA Skincare",
    avatar: "SC",
    rating: 5,
    text: "We printed ScanRepeat QR codes on our serums and saw repeat purchases jump 42% in 60 days. The reorder funnel is genuinely brilliant.",
  },
  {
    name: "Marcus Rivera",
    role: "Head of Marketing, Elevate Nutrition",
    avatar: "MR",
    rating: 5,
    text: "Our protein powder boxes now convert like an e-commerce page. Customers scan the box mid-workout and reorder before they run out.",
  },
  {
    name: "Priya Nair",
    role: "DTC Lead, BLOOM Botanicals",
    avatar: "PN",
    rating: 5,
    text: "The scan analytics alone are worth it. We had no idea 60% of our scans came from iOS in California. Total game changer for ad targeting.",
  },
];

const FAQS = [
  { q: "Do I need to reprint my packaging?", a: "No. If you already have a QR code on your packaging, simply point it to your ScanRepeat page. For new print runs, download our high-res QR code in SVG format." },
  { q: "Does it work with Shopify?", a: "Yes — natively. Paste your Shopify product URL as the reorder link and the one-click reorder experience works out of the box." },
  { q: "Can I customize the look of the landing page?", a: "Absolutely. Use our page builder to match your brand colors, fonts, and layout. Add video, FAQs, image galleries, and a custom domain." },
  { q: "Is there a free trial?", a: "Every plan comes with a 14-day free trial — no credit card required. You can generate QR codes and test the full platform before committing." },
  { q: "How accurate is the scan tracking?", a: "Very. We track every scan server-side and log IP geolocation, device OS, time, and referrer URL. No cookies or client-side tricks required." },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.details
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, type: "spring", bounce: 0, duration: 0.7 } as any}
      className="group p-8 bg-white rounded-3xl ring-1 ring-[#e5e7eb] shadow-sm open:shadow-md open:ring-[#2970ff]/30 transition-all duration-300 cursor-pointer"
    >
      <summary className="flex items-center justify-between text-[18px] font-bold tracking-tight list-none">
        {q}
        <ChevronDown className="w-5 h-5 text-[#9ca3af] group-open:rotate-180 transition-transform duration-300 shrink-0 ml-4" />
      </summary>
      <p className="text-[#6b7280] text-[16px] leading-relaxed mt-4">{a}</p>
    </motion.details>
  );
}

export default function LandingPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-[#0a0a0a] overflow-x-hidden font-sans selection:bg-[#2970ff] selection:text-white" ref={containerRef}>
      <Navbar />

      <main className="flex-1 relative">
        <section ref={heroRef} className="relative min-h-[90vh] flex items-center pt-32 pb-24 overflow-hidden bg-[#fafafa]">
          {/* Enhanced Background Design */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_0%_0%,#eff6ff_0%,transparent_50%)]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] -z-10 opacity-20 pointer-events-none">
            <motion.div 
               animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
               transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' } as any}
               className="w-full h-full bg-gradient-to-tr from-blue-300 via-indigo-300 to-purple-300 blur-[100px] rounded-full"
            />
          </div>
          <div className="absolute inset-0 opacity-[0.02] [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:40px_40px] -z-10" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-12 max-w-[1400px] mx-auto">
              
              {/* LEFT COLUMN: Premium Typography */}
              <motion.div
                style={{ y: heroY, opacity: heroOpacity }}
                initial="hidden"
                animate="show"
                variants={stagger}
                className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left lg:max-w-[650px]"
              >
                {/* Modern Status Badge */}
                <motion.div variants={fadeUp} className="mb-8 px-5 py-2 rounded-full border border-blue-100 bg-white/80 backdrop-blur-md shadow-lg shadow-blue-500/5 flex items-center gap-2.5">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  <span className="text-[10px] font-black tracking-[0.25em] text-blue-600 uppercase">The Future of Packaging</span>
                </motion.div>

                {/* Explosive Headline */}
                <motion.h1 
                  variants={fadeUp} 
                  className="text-[52px] md:text-[72px] lg:text-[88px] font-black tracking-[-0.04em] mb-8 leading-[0.98] text-slate-950"
                >
                  Turn physical packaging into <span className="text-blue-600">revenue.</span>
                </motion.h1>

                {/* Refined Subtext */}
                <motion.p 
                  variants={fadeUp} 
                  className="text-lg md:text-xl text-slate-500 mb-12 leading-relaxed max-w-xl font-medium"
                >
                  Bridge the physical-digital gap. Track every scan, personalize every journey, and turn one-time buyers into lifelong fans with intelligent QR technology.
                </motion.p>
                
                {/* Premium CTAs */}
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-5 w-full lg:w-auto">
                   <Link 
                     href="/signup" 
                     className="group relative w-full sm:w-auto px-10 py-5 bg-slate-900 text-white font-black text-base rounded-2xl shadow-2xl shadow-blue-900/10 transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-3 overflow-hidden"
                   >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative z-10">Start Tracking Free</span>
                      <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </Link>
                   <Link 
                     href="#how-it-works" 
                     className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-900 font-bold text-base rounded-2xl transition-all hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center gap-2 shadow-sm"
                   >
                     Watch Demo
                   </Link>
                </motion.div>
              </motion.div>

              {/* RIGHT COLUMN: Enhanced Illustration */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", bounce: 0.1, duration: 1.2, delay: 0.2 } as any}
                className="flex-1 relative flex justify-center lg:justify-end w-full"
              >
                <div className="relative w-full max-w-[380px] md:max-w-[480px] lg:max-w-[550px] group">
                   <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                   <img 
                     src="/Assets/hero.svg" 
                     alt="ScanRepeat Hero Illustration" 
                     className="relative w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.08)] group-hover:translate-y-[-8px] transition-transform duration-700 ease-out" 
                   />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────── STATS ─────────────────────────────────────── */}
        <section className="py-16 border-y border-[#e5e7eb] bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#e5e7eb]">
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", bounce: 0, duration: 0.7 } as any}
                  className="flex flex-col items-center justify-center py-6 px-4 text-center"
                >
                  <span className="text-[40px] md:text-[48px] font-bold tracking-tight bg-gradient-to-r from-[#0a0a0a] to-[#374151] bg-clip-text text-transparent">{stat.value}</span>
                  <span className="text-sm text-[#6b7280] font-medium mt-1">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────── LOGO STRIP ─────────────────────────────────────── */}
        <section className="py-12 bg-[#fafafa] overflow-hidden">
          <div className="container mx-auto px-4 flex flex-col items-center mb-8">
            <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-widest">Trusted by physical-first brands worldwide</p>
          </div>
          <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <motion.ul
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 30 } as any}
              className="flex items-center justify-center [&_li]:mx-10"
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center space-x-20 md:space-x-28">
                  {["GYMSHARK", "AESOP", "L'ORÉAL", "OLIPOP", "CERAVE", "HUEL", "OLAPLEX", "GRAZA", "JONES ROAD"].map(logo => (
                    <li key={logo} className="text-lg md:text-xl font-bold text-[#d1d5db] tracking-tighter uppercase whitespace-nowrap">{logo}</li>
                  ))}
                </div>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* ─────────────────────────────────────── HOW IT WORKS ─────────────────────────────────────── */}
        <section id="how-it-works" className="py-28 md:py-40 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-20">
              <SectionBadge>How It Works</SectionBadge>
              <motion.h2 variants={fadeUp} className="text-[38px] md:text-[56px] font-bold mb-5 tracking-[-0.03em] leading-[1.1]">
                From box to browser<br />
                <span className="text-[#9ca3af]">in four simple steps.</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-[#6b7280] max-w-xl mx-auto">
                No engineering required. If you can print a label, you can run a repeat purchase funnel.
              </motion.p>
            </motion.div>

            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e5e7eb] to-transparent hidden md:block" />

              <div className="space-y-16">
                {HOW_IT_WORKS.map((step, i) => {
                  const Icon = step.icon;
                  const isEven = i % 2 === 0;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ type: "spring", bounce: 0, duration: 0.8 } as any}
                      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-16`}
                    >
                      <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'} text-center`}>
                        <span className="text-[80px] font-black text-[#f3f4f6] leading-none block">{step.step}</span>
                        <h3 className="text-[26px] font-bold mb-3 tracking-tight -mt-4">{step.title}</h3>
                        <p className="text-[#6b7280] text-lg leading-relaxed max-w-md mx-auto md:mx-0 md:ml-auto">{step.desc}</p>
                      </div>

                      {/* Center icon */}
                      <div className="relative z-10 w-20 h-20 rounded-full bg-white ring-4 ring-[#e5e7eb] shadow-lg flex items-center justify-center shrink-0">
                        <div className="w-12 h-12 rounded-full bg-[#2970ff] flex items-center justify-center text-white">
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>

                      <div className="flex-1 hidden md:block" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────── FEATURES BENTO ─────────────────────────────────────── */}
        <section id="features" className="py-28 md:py-40 bg-[#fafafa]">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-20">
              <SectionBadge>Features</SectionBadge>
              <motion.h2 variants={fadeUp} className="text-[38px] md:text-[56px] font-bold mb-5 tracking-[-0.03em] leading-[1.1]">
                Everything you need.<br />
                <span className="text-[#9ca3af]">Nothing you don't.</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-[#6b7280] max-w-2xl mx-auto">
                A complete toolkit for turning physical products into digital revenue channels.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[300px]">
              {/* Big feature - spans 2 cols */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", bounce: 0, duration: 0.8 } as any}
                className="md:col-span-2 row-span-1 bg-[#0a0a0a] text-white rounded-[2rem] p-10 md:p-14 relative overflow-hidden group shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#2970ff]/30 via-transparent to-[#7c3aed]/20 pointer-events-none" />
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 60, ease: "linear" } as any}
                  className="absolute -right-32 -bottom-32 w-[500px] h-[500px] rounded-full border border-white/5"
                />
                <motion.div
                  animate={{ rotate: [0, -360] }}
                  transition={{ repeat: Infinity, duration: 40, ease: "linear" } as any}
                  className="absolute -right-20 -bottom-20 w-[350px] h-[350px] rounded-full border border-white/5"
                />
                <div className="relative z-10 h-full flex flex-col justify-between max-w-lg">
                  <div>
                    <div className="w-14 h-14 bg-[#2970ff] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#2970ff]/40">
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-[32px] font-bold mb-3 tracking-tight">The Reorder Funnel</h3>
                    <p className="text-[#9ca3af] text-lg leading-relaxed">
                      Connect directly to Shopify. Auto-apply discount codes the moment a customer scans — lock in repeat revenue before the competition even knows they're shopping.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-8">
                    <Link href="/signup" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm font-semibold text-white transition-all">
                      Explore feature <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Col 3, row 1 */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", bounce: 0, duration: 0.8, delay: 0.1 } as any}
                className="md:col-span-1 row-span-1 bg-white rounded-[2rem] p-10 ring-1 ring-[#e5e7eb] shadow-sm relative overflow-hidden group hover:shadow-lg hover:ring-[#2970ff]/20 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-[3rem] -z-0" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-500 mb-6">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-[26px] font-bold mb-3 tracking-tight">Scan Analytics</h3>
                  <p className="text-[#6b7280] text-[16px] leading-relaxed">Log every scan with geography, device type, and volume. Visualized in real time on your dashboard.</p>
                </div>
              </motion.div>

              {/* Row 2 features */}
              {[
                { icon: Globe, color: "bg-sky-100 text-sky-500", bg: "bg-sky-50", title: "Hosted Product Pages", desc: "Build beautiful mobile pages with video, FAQs, and usage guides. Zero code required." },
                { icon: RefreshCw, color: "bg-violet-100 text-violet-500", bg: "bg-violet-50", title: "Dynamic Redirects", desc: "Update your QR's destination at any time without reprinting a single box." },
                { icon: ShieldCheck, color: "bg-emerald-100 text-emerald-500", bg: "bg-emerald-50", title: "Brand Protection", desc: "Geo-restrict, detect suspicious scans, and verify your domain — stay fully protected." },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ type: "spring", bounce: 0, duration: 0.8, delay: i * 0.1 } as any}
                    className="bg-white rounded-[2rem] p-10 ring-1 ring-[#e5e7eb] shadow-sm relative overflow-hidden group hover:shadow-lg hover:ring-[#2970ff]/20 transition-all duration-500"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 ${f.bg} rounded-bl-[3rem] -z-0`} />
                    <div className="relative z-10">
                      <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-6`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-[24px] font-bold mb-3 tracking-tight">{f.title}</h3>
                      <p className="text-[#6b7280] text-[16px] leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────── TESTIMONIALS ─────────────────────────────────────── */}
        <section className="py-28 md:py-40 bg-white overflow-hidden">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-20">
              <SectionBadge>Testimonials</SectionBadge>
              <motion.h2 variants={fadeUp} className="text-[38px] md:text-[56px] font-bold mb-5 tracking-[-0.03em] leading-[1.1]">
                Brands that made the switch.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-[#6b7280] max-w-xl mx-auto">
                Real stories from teams using ScanRepeat to close the loop between physical and digital.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.12, type: "spring", bounce: 0, duration: 0.8 } as any}
                  className="p-8 bg-[#fafafa] rounded-[2rem] ring-1 ring-[#e5e7eb] flex flex-col gap-6 hover:shadow-lg hover:ring-[#2970ff]/20 transition-all duration-500 group"
                >
                  <div className="flex gap-1">
                    {Array(t.rating).fill(0).map((_, si) => (
                      <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[16px] text-[#374151] leading-relaxed flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-[#e5e7eb]">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2970ff] to-[#7c3aed] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-xs text-[#9ca3af]">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────── CTA PRICING TEASER ─────────────────────────────────────── */}
        <section className="py-20 bg-[#fafafa] border-y border-[#e5e7eb]">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <SectionBadge>Pricing</SectionBadge>
              <motion.h2 variants={fadeUp} className="text-[38px] md:text-[52px] font-bold mb-4 tracking-[-0.03em]">Simple, transparent pricing.</motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-[#6b7280] mb-10 max-w-xl mx-auto">
                Start free for 14 days. No credit card. Cancel anytime. Plans start at <strong>$9/month</strong>.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link href="/pricing" className="inline-flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#2970ff] text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-base">
                  View all plans <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ─────────────────────────────────────── FAQ ─────────────────────────────────────── */}
        <section id="faq" className="py-28 md:py-40 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="text-center mb-16">
              <SectionBadge>FAQ</SectionBadge>
              <motion.h2 variants={fadeUp} className="text-[38px] md:text-[52px] font-bold mb-4 tracking-[-0.03em]">Got questions?</motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-[#6b7280]">We've got answers. If you can't find what you need, reach out — we respond fast.</motion.p>
            </motion.div>
            <div className="space-y-4">
              {FAQS.map((faq, i) => <FaqItem key={i} {...faq} index={i} />)}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────── FINAL CTA ─────────────────────────────────────── */}
        <section className="py-20 md:py-24 relative overflow-hidden bg-white border-t border-[#e5e7eb]">
          <div className="absolute inset-0 bg-gradient-to-b from-white to-[#f8fafc] -z-10" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" } as any}
            className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#2970ff]/10 blur-[100px] -z-10"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 3 } as any}
            className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#7c3aed]/10 blur-[100px] -z-10"
          />

          <div className="container mx-auto px-4 text-center text-[#0a0a0a] relative z-10">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2970ff]/8 border border-[#2970ff]/20 text-[#2970ff] text-xs font-semibold uppercase tracking-widest mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2970ff] animate-pulse" />
                Join 5,000+ brands already using ScanRepeat
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-[48px] md:text-[80px] lg:text-[96px] font-bold tracking-[-0.04em] mb-8 leading-[1.02] max-w-5xl mx-auto text-[#0a0a0a]">
                Start tracking your physical conversions today.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-[#6b7280] text-xl max-w-xl mx-auto mb-12 font-medium">
                Every unscanned box is revenue you're leaving on the table. Fix that in 5 minutes.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] text-white px-10 py-5 text-lg font-bold shadow-2xl hover:-translate-y-1 hover:bg-[#2970ff] transition-all duration-300 transform-gpu">
                  Create your first QR Code <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-white/80 border border-[#e5e7eb] text-[#0a0a0a] px-10 py-5 text-lg font-bold transition-all duration-300">
                  View pricing
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
