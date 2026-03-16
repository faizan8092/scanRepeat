"use client";

import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import Link from 'next/link';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef } from 'react';
import { 
  ArrowRight,
  CheckCircle2, 
  QrCode, 
  Layout, 
  Link2, 
  BarChart3,
  Zap,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';

const FADE_UP_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0, duration: 0.8 } },
};

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-[#0a0a0a] overflow-hidden font-sans selection:bg-[#2970ff] selection:text-white" ref={containerRef}>
      <Navbar />

      <main className="flex-1 relative">
        
        {/* Ambient Gradients - More precise and premium */}
        <div className="absolute top-0 inset-x-0 h-[100vh] bg-gradient-to-b from-[#f5faff] to-transparent pointer-events-none -z-10" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2970ff]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#d1e0ff]/30 blur-[150px] rounded-full pointer-events-none -z-10" />

        {/* --- HERO SECTION --- */}
        <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
              
              {/* Text Content */}
              <motion.div 
                style={{ y: heroY, opacity: heroOpacity }}
                className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start"
                initial="hidden"
                animate="show"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                
                <motion.div 
                  variants={FADE_UP_ANIMATION_VARIANTS}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-[#e5e7eb] text-[#374151] font-medium text-sm mb-8 shadow-sm"
                >
                  <span className="flex h-2 w-2 rounded-full bg-[#2970ff]"></span>
                  ScanRepeat 2.0 is now live
                  <ArrowRight className="w-4 h-4 ml-1 text-[#9ca3af]" />
                </motion.div>

                <motion.h1 
                  variants={FADE_UP_ANIMATION_VARIANTS}
                  className="text-[48px] md:text-[72px] lg:text-[88px] font-bold tracking-[-0.04em] mb-8 leading-[1.05]"
                >
                  The intelligent <br className="hidden md:block"/>
                  <span className="relative whitespace-nowrap">
                    <span className="absolute -inset-1 rounded-xl bg-[#2970ff]/10"></span>
                    <span className="relative text-[#2970ff]">QR Code</span>
                  </span> platform.
                </motion.h1>

                <motion.p 
                  variants={FADE_UP_ANIMATION_VARIANTS}
                  className="text-xl md:text-[22px] text-[#4b5563] mb-12 max-w-[600px] leading-[1.6]"
                >
                  Every product box is a missed opportunity. Turn passive packaging into automated repeat purchases and dynamic product guides.
                </motion.p>

                <motion.div 
                  variants={FADE_UP_ANIMATION_VARIANTS}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full"
                >
                  <Link 
                    href="/signup" 
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#171717] hover:bg-[#2970ff] px-8 py-4 text-lg font-medium text-white shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(41,112,255,0.23)] transition-all duration-300 transform-gpu hover:-translate-y-0.5"
                  >
                    Start for free
                  </Link>
                  <Link 
                    href="#demo" 
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white hover:bg-[#f3f4f6] px-8 py-4 text-lg font-medium text-[#171717] ring-1 ring-[#e5e7eb] transition-all duration-300"
                  >
                    View demo
                  </Link>
                </motion.div>
              </motion.div>

              {/* Hero Image Content */}
              <motion.div
                 initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                 animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                 transition={{ type: "spring", bounce: 0, duration: 1.2, delay: 0.4 }}
                 className="flex-1 w-full max-w-2xl lg:max-w-none perspective-1000"
              >
                 <div className="relative w-full rounded-[2rem] md:rounded-[3rem] bg-white p-2 md:p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] ring-1 ring-black/5 overflow-hidden transform-gpu lg:rotate-[-1deg] hover:rotate-0 transition-transform duration-700">
                    <img 
                      src="/Assets/hero-image.png" 
                      alt="ScanRepeat Experience" 
                      className="w-full h-auto rounded-[1.5rem] md:rounded-[2.5rem]"
                    />
                 </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* --- LOGO STRIP --- */}
        <section className="py-8 md:py-14 border-y border-[#e5e7eb] bg-white overflow-hidden">
           <div className="container mx-auto px-4 flex flex-col items-center">
              <p className="text-sm font-medium text-[#6b7280] mb-8 uppercase tracking-widest">Powering modern physical brands</p>
              <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                 <motion.ul 
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                    className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none gap-8"
                 >
                    {[...Array(2)].map((_, i) => (
                       <div key={i} className="flex items-center justify-center space-x-16 md:space-x-24">
                          {["GYMSHARK", "AESOP", "L'ORÉAL", "OLIPOP", "CERAVE", "HUEL", "OLAPLEX"].map(logo => (
                             <li key={logo} className="text-xl md:text-2xl font-bold text-[#d1d5db] tracking-tighter uppercase font-sans">
                                {logo}
                             </li>
                          ))}
                       </div>
                    ))}
                 </motion.ul>
              </div>
           </div>
        </section>

        {/* --- FEATURES BENTO --- */}
        <section className="py-24 md:py-40 bg-[#fafafa]">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div 
               initial="hidden"
               whileInView="show"
               viewport={{ once: true, margin: "-100px" }}
               variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.1 } }
               }}
               className="text-center mb-20 md:mb-32"
            >
              <motion.h2 variants={FADE_UP_ANIMATION_VARIANTS} className="text-[40px] md:text-[56px] font-bold mb-6 tracking-[-0.03em] leading-[1.1]">
                 Everything you need.<br/>
                 <span className="text-[#9ca3af]">Nothing you don't.</span>
              </motion.h2>
              <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-[18px] md:text-xl text-[#6b7280] max-w-2xl mx-auto leading-relaxed">
                 A robust suite of tools built specifically for consumer goods. From generating reliable QR codes to capturing analytics.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
              
              {/* Feature 1 */}
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="md:col-span-2 row-span-1 bg-white rounded-[2rem] p-10 ring-1 ring-[#e5e7eb] shadow-[0_2px_4px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-500"
              >
                 <div className="relative z-10 w-full md:w-3/5">
                    <div className="w-12 h-12 bg-[#f3f4f6] rounded-xl flex items-center justify-center text-[#171717] mb-6">
                       <QrCode className="w-6 h-6" />
                    </div>
                    <h3 className="text-[28px] font-bold mb-3 tracking-tight">Dynamic Generation</h3>
                    <p className="text-[#6b7280] text-lg leading-relaxed">
                       Generate and download high-resolution QR codes in SVG or PNG format. Change the destination URL anytime without reprinting packaging.
                    </p>
                 </div>
                 {/* Decorative */}
                 <div className="absolute top-0 right-0 bottom-0 w-2/5 translate-x-12 translate-y-12 opacity-50 transition-transform duration-700 group-hover:translate-x-4 group-hover:translate-y-4 hidden md:block">
                    <div className="w-full h-full bg-[#f8f9fa] rounded-tl-[3rem] ring-1 ring-[#e5e7eb] border-l-[8px] border-t-[8px] border-white p-6">
                       <div className="w-32 h-32 bg-[#171717] rounded-3xl text-white flex items-center justify-center">
                          <QrCode className="w-20 h-20" />
                       </div>
                    </div>
                 </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="md:col-span-1 row-span-1 bg-white rounded-[2rem] p-10 ring-1 ring-[#e5e7eb] shadow-[0_2px_4px_rgba(0,0,0,0.02)] relative group hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-500"
              >
                 <div className="w-12 h-12 bg-[#e0f2fe] rounded-xl flex items-center justify-center text-[#0284c7] mb-6">
                    <Layout className="w-6 h-6" />
                 </div>
                 <h3 className="text-[28px] font-bold mb-3 tracking-tight">Hosted Links</h3>
                 <p className="text-[#6b7280] text-lg leading-relaxed">
                    Build beautiful, mobile-optimized landing pages. Add video tutorials, product manuals, and usage guides instantly.
                 </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="md:col-span-1 row-span-1 bg-white rounded-[2rem] p-10 ring-1 ring-[#e5e7eb] shadow-[0_2px_4px_rgba(0,0,0,0.02)] relative group hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-500"
              >
                 <div className="w-12 h-12 bg-[#fce7f3] rounded-xl flex items-center justify-center text-[#db2777] mb-6">
                    <BarChart3 className="w-6 h-6" />
                 </div>
                 <h3 className="text-[28px] font-bold mb-3 tracking-tight">Scan Tracking</h3>
                 <p className="text-[#6b7280] text-lg leading-relaxed">
                    Log every scan. View precise analytics on geography, device types, and daily scan volume to understand user behavior.
                 </p>
              </motion.div>

              {/* Feature 4 */}
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="md:col-span-2 row-span-1 bg-[#171717] rounded-[2rem] p-10 md:p-14 object-cover relative overflow-hidden group shadow-xl"
              >
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#2970ff]/20 to-transparent pointer-events-none"></div>
                 <div className="relative z-10 text-white w-full md:w-2/3 h-full flex flex-col justify-center">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white mb-6 backdrop-blur-md ring-1 ring-white/20">
                       <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-[32px] font-bold mb-4 tracking-tight">The Reorder Funnel</h3>
                    <p className="text-[#9ca3af] text-lg leading-relaxed mb-6">
                       Connect directly to Shopify checkout. Programmatically offer unique, one-time discounts the moment a customer scans the box to lock in repeat revenue.
                    </p>
                 </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* --- PRICING --- */}
        <section className="py-24 md:py-40 bg-white" id="pricing">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div 
               initial="hidden"
               whileInView="show"
               viewport={{ once: true, margin: "-100px" }}
               variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.1 } }
               }}
               className="text-center mb-20 md:mb-24"
            >
              <motion.h2 variants={FADE_UP_ANIMATION_VARIANTS} className="text-[40px] md:text-[56px] font-bold mb-6 tracking-[-0.03em] leading-[1.1]">
                 Simple, transparent pricing.
              </motion.h2>
              <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-[18px] md:text-xl text-[#6b7280] max-w-xl mx-auto leading-relaxed">
                 Scale up infinitely. Every plan includes a 14-day free trial. No credit card required.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: "Starter", price: "$9", desc: "Perfect for independent makers.", qrs: "10 Active QR Codes", video: false, btn: "Start Free" },
                 { title: "Growth", price: "$29", desc: "For scaling consumer brands.", qrs: "100 Active QR Codes", video: true, pop: true, btn: "Start Free Trial" },
                 { title: "Enterprise", price: "$79", desc: "Unlimited tracking and pages.", qrs: "Unlimited QR Codes", video: true, brand: true, btn: "Contact Sales" }
               ].map((plan, i) => (
                 <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ type: "spring", bounce: 0, duration: 0.8, delay: i * 0.1 }}
                    key={i} 
                    className={`relative p-8 md:p-10 rounded-[2.5rem] flex flex-col ${plan.pop ? 'bg-[#171717] text-white shadow-2xl scale-100 md:scale-105 z-10' : 'bg-[#fafafa] ring-1 ring-[#e5e7eb] text-[#171717]'}`}
                 >
                    {plan.pop && (
                       <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2970ff] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                          Most Popular
                       </div>
                    )}
                    <h3 className="text-2xl font-bold mb-2 tracking-tight">{plan.title}</h3>
                    <p className={`text-sm mb-6 ${plan.pop ? 'text-[#9ca3af]' : 'text-[#6b7280]'}`}>{plan.desc}</p>
                    
                    <div className="mb-8 flex items-baseline gap-1">
                       <span className="text-[48px] font-bold tracking-tight leading-none">{plan.price}</span>
                       <span className={`text-sm font-medium ${plan.pop ? 'text-[#9ca3af]' : 'text-[#6b7280]'}`}>/mo</span>
                    </div>

                    <ul className="space-y-4 mb-10 flex-1">
                       <li className="flex items-center gap-3">
                          <CheckCircle2 className={`w-5 h-5 ${plan.pop ? 'text-white' : 'text-[#171717]'}`} />
                          <span className={`${plan.pop ? 'text-[#e5e7eb]' : 'text-[#374151]'}`}>{plan.qrs}</span>
                       </li>
                       <li className="flex items-center gap-3">
                          <CheckCircle2 className={`w-5 h-5 ${plan.pop ? 'text-white' : 'text-[#171717]'}`} />
                          <span className={`${plan.pop ? 'text-[#e5e7eb]' : 'text-[#374151]'}`}>Detailed Scan Analytics</span>
                       </li>
                       <li className="flex items-center gap-3">
                          <CheckCircle2 className={`w-5 h-5 ${plan.pop ? 'text-white' : 'text-[#171717]'}`} />
                          <span className={`${plan.pop ? 'text-[#e5e7eb]' : 'text-[#374151]'}`}>Discount Code Auto-apply</span>
                       </li>
                       <li className={`flex items-center gap-3 ${!plan.video ? 'opacity-40' : ''}`}>
                          <CheckCircle2 className={`w-5 h-5 ${plan.pop ? 'text-white' : 'text-[#171717]'}`} />
                          <span className={`${plan.pop ? 'text-[#e5e7eb]' : 'text-[#374151]'}`}>Rich Video Embeds</span>
                       </li>
                       <li className={`flex items-center gap-3 ${!plan.brand ? 'opacity-40' : ''}`}>
                          <CheckCircle2 className={`w-5 h-5 ${plan.pop ? 'text-white' : 'text-[#171717]'}`} />
                          <span className={`${plan.pop ? 'text-[#e5e7eb]' : 'text-[#374151]'}`}>Remove ScanRepeat Branding</span>
                       </li>
                    </ul>

                    <button className={`w-full rounded-2xl py-4 font-semibold text-lg transition-transform hover:-translate-y-0.5 ${plan.pop ? 'bg-[#2970ff] text-white hover:bg-[#0040c1]' : 'bg-white ring-1 ring-[#e5e7eb] hover:bg-[#f9fafb]'}`}>
                       {plan.btn}
                    </button>
                 </motion.div>
               ))}
            </div>
          </div>
        </section>

        {/* --- FAQ --- */}
        <section className="py-24 md:py-40 bg-[#fafafa]">
           <div className="container mx-auto px-4 max-w-3xl">
              <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                 className="text-center mb-16"
              >
                 <h2 className="text-4xl md:text-[48px] font-bold mb-6 tracking-[-0.03em]">Frequently asked questions.</h2>
              </motion.div>

              <div className="space-y-6">
                 {[
                   { q: "Do I need to reprint my packaging?", a: "No. If you already have a QR code on packaging, you can point it to your ScanRepeat page. For new runs, simply print our high-res generated QR." },
                   { q: "Does it work with Shopify?", a: "Yes. Paste your Shopify product URL as the reorder link — it works flawlessly with any modern storefront." },
                   { q: "Can I track who scanned?", a: "Yes. Your dashboard provides detailed views on total scans, location mapping, and device type breakdowns." }
                 ].map((faq, i) => (
                    <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true, margin: "-50px" }}
                       transition={{ delay: i * 0.1, type: "spring", bounce: 0, duration: 0.8 }}
                       key={i} 
                       className="p-8 bg-white rounded-3xl ring-1 ring-[#e5e7eb] shadow-sm"
                    >
                       <h4 className="text-[20px] font-bold mb-3 tracking-tight">{faq.q}</h4>
                       <p className="text-[#6b7280] text-[17px] leading-relaxed">{faq.a}</p>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="py-32 md:py-48 relative overflow-hidden bg-[#2970ff]">
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-tr from-[#0040c1] to-transparent z-0 pointer-events-none" />
          
          <div className="container mx-auto px-4 text-center text-white relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", bounce: 0, duration: 0.8 }}
              className="text-[48px] md:text-[80px] font-bold tracking-[-0.04em] mb-8 leading-[1.05] max-w-4xl mx-auto"
            >
              Start tracking your physical conversions today.
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0, duration: 0.8, delay: 0.1 }}
            >
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center rounded-full bg-[#171717] text-white px-10 py-5 text-lg whitespace-nowrap font-semibold shadow-2xl hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300 transform-gpu"
              >
                Create your first QR Code
              </Link>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
