'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { QrCode, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { useAuth } from '@/src/lib/auth-context';

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email);
  };

  return (
    <div className="min-h-screen flex bg-white text-[#0a0a0a] font-sans">
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 relative">
        <Link href="/" className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-[#6b7280] hover:text-[#0a0a0a] transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to site</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[440px] w-full mx-auto"
        >
          <div className="mb-10 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <QrCode className="w-8 h-8 text-[#2970ff]" />
              <span className="text-2xl font-bold tracking-tight">ScanRepeat</span>
            </Link>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back</h1>
            <p className="text-[#6b7280]">Login to continue your brand journey</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-3 px-4 py-3 border border-[#e5e7eb] rounded-xl hover:bg-[#f9fafb] transition-colors font-medium">
              <FaGoogle className="w-5 h-5 text-[#ea4335]" />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 px-4 py-3 border border-[#e5e7eb] rounded-xl hover:bg-[#f9fafb] transition-colors font-medium">
              <FaApple className="w-5 h-5" />
              <span>Apple</span>
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5e7eb]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-[#9ca3af] font-medium tracking-wider">Or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#374151]">Email Address</label>
              <input 
                type="email" 
                placeholder="hello@yourcompany.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] focus:ring-2 focus:ring-[#2970ff]/20 focus:border-[#2970ff] outline-none transition-all placeholder:text-[#9ca3af]"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-[#374151]">Password</label>
                <Link href="#" className="text-sm font-medium text-[#2970ff] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] focus:ring-2 focus:ring-[#2970ff]/20 focus:border-[#2970ff] outline-none transition-all placeholder:text-[#9ca3af]"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#171717] hover:bg-[#2970ff] text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] transition-all duration-300 disabled:opacity-50 disabled:hover:bg-[#171717] flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
            </button>
          </form>

          <p className="mt-8 text-center text-[#6b7280]">
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold text-[#2970ff] hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side: Image/Branding */}
      <div className="hidden lg:flex flex-1 p-6">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full h-full relative rounded-[2.5rem] overflow-hidden bg-[#f8faff]"
        >
          <img 
            src="/Assets/hero-image.png" 
            alt="Dashboard Preview" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#2970ff]/20 to-transparent" />
          
          <div className="absolute bottom-12 left-12 right-12 p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Streamline your physical brand conversions.</h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Join thousands of brands using ScanRepeat to bridge the gap between their products and digital experiences.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

