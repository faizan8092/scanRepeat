'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2, UserPlus } from 'lucide-react';
import { Logo } from '@/src/components/Logo';
import { useAuth } from '@/src/lib/auth-context';
import { cn } from '@/src/lib/utils';

export default function SignupPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const { user, signup, loginWithGoogle, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasDigit = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (!minLength || !hasUpper || !hasDigit || !hasSpecial) {
      setPasswordError('Password must be at least 8 characters with an uppercase letter, digit, and special character.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword(password)) {
      await signup(email, password, `${firstName} ${lastName}`.trim());
    }
  };

  return (
    <div className="min-h-screen flex bg-white text-[#0a0a0a] font-sans">
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 relative overflow-y-auto">
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
            <Link href="/" className="inline-flex mb-8">
              <Logo size={42} />
            </Link>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Create account</h1>
            <p className="text-[#6b7280]">Join 500+ brands turning physical into digital</p>
          </div>

          <div className="mb-8 relative h-[52px] group">
            {/* 1. Custom themed button (Visual Only) */}
            <div 
              className="absolute inset-0 w-full h-full flex items-center justify-center gap-3 px-4 py-3 border border-[#e5e7eb] rounded-xl bg-white hover:bg-[#f9fafb] hover:border-[#d1d5db] transition-all duration-300 font-medium pointer-events-none text-sm group"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[#374151]">Sign up with Google</span>
            </div>

            {/* 2. Official Google Login (Functional Overlay) */}
            <div className="absolute inset-0 opacity-0 cursor-pointer [&>div]:w-full [&>div]:h-full">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    try {
                      await loginWithGoogle(credentialResponse.credential);
                    } catch (err) {
                      console.error("Google SSO Signup Error:", err);
                    }
                  }
                }}
                onError={() => console.error("Google Login failed or was closed by user.")}
                useOneTap
                theme="outline"
                size="large"
                width="400"
                text="signup_with"
                shape="rectangular"
              />
            </div>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5e7eb]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-[#9ca3af] font-medium tracking-wider">Or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#374151]">First name</label>
                <input 
                  type="text" 
                  placeholder="Jane"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] focus:ring-primary focus:ring-[#2970ff]/20 focus:border-[#2970ff] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#374151]">Last name</label>
                <input 
                  type="text" 
                  placeholder="Doe"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] focus:ring-primary focus:ring-[#2970ff]/20 focus:border-[#2970ff] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#374151]">Work Email</label>
              <input 
                type="email" 
                placeholder="hello@yourcompany.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] focus:ring-primary focus:ring-[#2970ff]/20 focus:border-[#2970ff] outline-none transition-all placeholder:text-[#9ca3af]"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-col mb-1">
                <label className="text-sm font-semibold text-[#374151] leading-none">Security Password</label>
                <span className="text-[10px] text-[#6b7280] font-medium mt-1 leading-none">Update your login credentials regularly.</span>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                  }}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border outline-none transition-all placeholder:text-[#9ca3af]",
                    passwordError ? "border-rose-500 focus:ring-rose-500/20" : "border-[#e5e7eb] focus:ring-[#2970ff]/20 focus:border-[#2970ff]"
                  )}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className={cn(
                "text-[10px] font-medium transition-all duration-300 px-1",
                passwordError ? "text-rose-500" : "text-[#6b7280]"
              )}>
                {passwordError || "Min. 8 chars with uppercase, digit & special char."}
              </p>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#171717] hover:bg-[#2970ff] text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <UserPlus size={20} className="transition-transform group-hover:scale-110" />
                  <span>Get Started Free</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[#6b7280]">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#2970ff] hover:underline">Log in</Link>
          </p>

          <div className="mt-10 flex items-center justify-center gap-6 pt-10 border-t border-[#e5e7eb]">
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2 size={16} className="text-[#10b981]" />
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#6b7280]">14-Day Trial</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2 size={16} className="text-[#10b981]" />
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#6b7280]">No Credit Card</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Image/Branding */}
      <div className="hidden lg:flex flex-1 p-6">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full h-full relative rounded-[2.5rem] overflow-hidden bg-[#fafafa]"
        >
          <img 
            src="/Assets/hero-image.png" 
            alt="Dashboard Preview" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#2970ff]/10 to-transparent" />
          
          <div className="absolute top-12 left-12 right-12 p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
            <h2 className="text-accentxl font-bold text-white mb-4 tracking-tight">Launch in minutes.</h2>
            <p className="text-white/80 text-lg leading-relaxed">
              ScanRepeat handles the infrastructure, analytics, and experience so you can focus on building your brand.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

