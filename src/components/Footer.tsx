import Link from 'next/link';
import { Mail, Facebook, Linkedin, Twitter, Globe, Phone, Github } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#040411] text-white pt-24 pb-10 mt-auto">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* TOP SECTION: Newsletter */}
        <div className="flex flex-col md:flex-row justify-between mb-24 gap-16">
          {/* Left */}
          <div className="max-w-md">
            <div className="w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center mb-8">
              <Mail className="w-8 h-8 text-[#040411]" strokeWidth={2} />
            </div>
            <h2 className="text-[44px] md:text-[56px] font-bold mb-6 tracking-tight leading-[1.05]">Keep up with the<br/>latest</h2>
            <p className="text-slate-400 text-[17px]">Join our newsletter to stay up to date on features and releases.</p>
          </div>
          
          {/* Right */}
          <div className="flex flex-col justify-center max-w-lg w-full">
            <label className="text-base font-semibold mb-4 text-white">Newsletter</label>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white text-slate-900 px-8 py-4 md:py-5 rounded-full focus:outline-none focus:ring-4 focus:ring-[#6b65ff]/50 font-medium placeholder:font-normal placeholder:text-slate-400"
              />
              <button className="bg-[#6b65ff] hover:bg-[#5a55f0] text-white px-10 py-4 md:py-5 rounded-full font-bold transition-all shadow-lg shadow-[#6b65ff]/20 hover:-translate-y-0.5 min-w-[160px]">
                Subscribe
              </button>
            </div>
            <p className="text-slate-500 text-[15px] mt-4 font-normal">Join our newsletter to stay up to date</p>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px w-full bg-slate-800/80 mb-20" />

        {/* MIDDLE SECTION: Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 mb-24">
          {/* Col 1 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-8">
               <div className="brightness-0 invert opacity-90">
                 <Logo size={32} showText={false} />
               </div>
               <span className="text-primaryxl font-bold tracking-tight text-white">ScanRepeat</span>
            </div>
            <p className="text-[15.5px] text-slate-400 mb-10 leading-relaxed max-w-[280px]">
              Make your physical engagement and repeat sales more simple with us.
            </p>
            <div className="flex items-center gap-6 text-slate-400">
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5 fill-current" /></a>
              <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5 fill-current" /></a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5 fill-current" /></a>
              <a href="#" className="hover:text-white transition-colors" aria-label="GitHub"><Github className="w-5 h-5 fill-current" /></a>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="text-xl font-bold mb-7 text-white">Contact</h3>
              <div className="space-y-5 text-[15.5px] text-slate-400">
                <p className="flex items-center gap-3">
                  <Phone className="w-4 h-4 fill-current opacity-80" /> +1 (469) 409 9209
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="w-4 h-4 fill-current opacity-80" /> hello@scanrepeat.com
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-5 text-white">Address</h3>
              <div className="space-y-3 text-[15.5px] text-slate-400 leading-relaxed">
                <p>5600 Tennyson Parkway Plano<br/>Texas USA</p>
                <p className="mt-1">07.00 AM - 19.00 PM</p>
              </div>
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-xl font-bold mb-7 text-white">Explore</h3>
            <ul className="space-y-5 text-[15.5px] text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors block">Home</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors block">Why ScanRepeat?</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors block">Features</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors block">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors block">Contact</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="text-xl font-bold mb-7 text-white">Support</h3>
            <ul className="space-y-5 text-[15.5px] text-slate-400">
              <li><Link href="/help" className="hover:text-white transition-colors block">Help Center</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors block">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors block">Disclaimer</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors block">FAQs</Link></li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px w-full bg-slate-800/80 mb-8" />

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between text-[14px] text-slate-500 gap-6">
          <p>Copyright {currentYear} all rights reserved</p>
          <div className="flex items-center gap-12 font-medium">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/security" className="hover:text-white transition-colors">Security</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
          <div className="flex items-center gap-2.5 text-slate-400">
            <Globe className="w-4 h-4" />
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
