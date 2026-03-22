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
        <section ref={heroRef} className="relative min-h-[90vh] flex items-center pt-32 pb-24 overflow-hidden">
          {/* Immersive Background Design */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] to-white -z-20" />
          <div className="absolute inset-0 -z-10 overflow-hidden flex items-center justify-center">
            {/* Central Glow behind phone */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 15, 0]
              }}
              transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" } as any}
              className="absolute w-[600px] lg:w-[800px] h-[600px] lg:h-[800px] bg-gradient-to-tr from-cyan-300 via-blue-500 to-purple-500 rounded-full blur-[100px] opacity-25" 
            />
            {/* Grid Pattern overlay for texture */}
            <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:60px_60px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10 hero-mesh">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8 max-w-[1400px] mx-auto">
              
              {/* LEFT COLUMN: Text Content */}
              <motion.div
                style={{ y: heroY, opacity: heroOpacity }}
                initial="hidden"
                animate="show"
                variants={stagger}
                className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left lg:max-w-[450px]"
              >
                {/* Avatars */}
                <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8 bg-white/60 backdrop-blur-md pr-5 pl-2 py-2 rounded-full border border-gray-200/50 shadow-sm">
                  <div className="flex -space-x-2">
                    <img src="https://i.pravatar.cc/100?img=1" alt="user" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                    <img src="https://i.pravatar.cc/100?img=2" alt="user" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                    <img src="https://i.pravatar.cc/100?img=3" alt="user" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  </div>
                  <span className="text-[13px] font-semibold text-gray-700">
                    1500+ Trusted Brands
                  </span>
                </motion.div>

                {/* Impact Headline */}
                <motion.h1 
                  variants={fadeUp} 
                  className="text-[48px] md:text-[64px] lg:text-[72px] font-black tracking-tight mb-6 leading-[1.05] text-[#0a0a0a]"
                >
                  Turn physical packaging into repeat <span className="text-[#2970ff]">sales</span>.
                </motion.h1>

                {/* Descriptive Subtext */}
                <motion.p 
                  variants={fadeUp} 
                  className="text-lg text-gray-600 mb-10 leading-[1.6] font-medium max-w-xl"
                >
                  Work smarter, create faster, and achieve more with ScanRepeat's advanced intelligent QR codes designed to bridge the physical-digital gap.
                </motion.p>
                
                <motion.div variants={fadeUp}>
                   <Link 
                     href="/signup" 
                     className="inline-flex lg:hidden items-center justify-center rounded-full bg-[#0a0a0a] hover:bg-[#2970ff] px-8 py-4 text-base font-bold text-white shadow-xl transition-all duration-300"
                   >
                     Get Started Free
                   </Link>
                </motion.div>
              </motion.div>

              {/* CENTER COLUMN: Mobile Mockup */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.1, duration: 1.5, delay: 0.2 } as any}
                className="flex-1 relative flex justify-center w-full max-w-[340px] lg:max-w-none lg:w-auto z-20"
              >
                {/* Mockup Container */}
                <div className="relative w-full max-w-[320px] aspect-[1/2.15] bg-[#111] rounded-[3.5rem] p-3 sm:p-4 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] ring-2 ring-black/10 mx-auto">
                    {/* Screen inner */}
                    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative shadow-inner">
                       {/* dynamic Island mock */}
                       <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[35%] h-6 bg-black rounded-full z-20"></div>
                       {/* Top edge gradient representing phone screen edge */}
                       <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/10 to-transparent z-10 pointer-events-none"></div>
                       
                       <img src="/Assets/hero-image.png" alt="ScanRepeat Interface" className="w-full h-full object-cover object-left-top opacity-95 scale-105" />
                    </div>
                </div>
              </motion.div>

              {/* RIGHT COLUMN: QR Code section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 1, delay: 0.4 } as any}
                className="flex-[0.8] flex flex-col items-center lg:items-start w-full max-w-sm lg:max-w-[300px] z-10"
              >
                <div className="text-center lg:text-left mb-6 w-full">
                  <h2 className="text-[28px] md:text-[36px] font-bold text-[#0a0a0a] leading-[1.1] mb-2 tracking-tight">
                    Scan QR code to<br />try it out
                  </h2>
                </div>

                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl ring-1 ring-black/5 w-full flex flex-col items-center gap-8 border border-white">
                  {/* QR Box with dot pattern imitation */}
                  <div className="w-full aspect-square bg-[#f8faff] rounded-[1.5rem] flex items-center justify-center p-6 border border-[#e5e7eb] relative overflow-hidden group">
                     {/* QR Code Graphic element */}
                     <QrCode size={160} strokeWidth={1} className="text-[#2970ff] opacity-90 transition-transform duration-500 group-hover:scale-105" />
                     {/* Overlay scanning line effect */}
                     <motion.div 
                       className="absolute top-0 left-0 w-full h-[2px] bg-[#2970ff]/60 shadow-[0_0_8px_2px_rgba(41,112,255,0.4)]"
                       animate={{ y: [0, 200, 0] }}
                       transition={{ repeat: Infinity, duration: 3, ease: "linear" } as any}
                     />
                  </div>

                  <div className="flex gap-4 w-full">
                     <Link href="/signup" className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-black text-white hover:bg-[#2970ff] text-sm font-bold shadow-lg transition-all">
                        Create Yours <ArrowRight size={18} />
                     </Link>
                  </div>
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
        <section className="py-36 md:py-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0e1932] to-[#0040c1] -z-10" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" } as any}
            className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#2970ff]/30 blur-[100px] -z-10"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 3 } as any}
            className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#7c3aed]/30 blur-[100px] -z-10"
          />

          <div className="container mx-auto px-4 text-center text-white relative z-10">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Join 5,000+ brands already using ScanRepeat
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-[48px] md:text-[80px] lg:text-[96px] font-bold tracking-[-0.04em] mb-8 leading-[1.02] max-w-5xl mx-auto">
                Start tracking your physical conversions today.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-white/70 text-xl max-w-xl mx-auto mb-12">
                Every unscanned box is revenue you're leaving on the table. Fix that in 5 minutes.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-white text-[#0a0a0a] px-10 py-5 text-lg font-bold shadow-2xl hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 transform-gpu">
                  Create your first QR Code <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-10 py-5 text-lg font-bold transition-all duration-300">
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
