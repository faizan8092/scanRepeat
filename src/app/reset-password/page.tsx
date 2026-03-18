'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { Logo } from '@/src/components/Logo';
import { cn } from '@/src/lib/utils';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [confirmError, setConfirmError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const router = useRouter();

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasDigit = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (!minLength || !hasUpper || !hasDigit || !hasSpecial) {
      return 'Password must be at least 8 characters with an uppercase letter, digit, and special character.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passErr = validatePassword(password);
    const matchErr = password !== confirmPassword ? "Passwords don't match." : "";
    
    setPasswordError(passErr);
    setConfirmError(matchErr);

    if (!passErr && !matchErr) {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
      setIsDone(true);
    }
  };

  if (isDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-[440px] w-full bg-emerald-50 border border-emerald-100 rounded-3xl p-12 text-center"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl font-bold text-emerald-900 mb-2">Password Reset Successful</h1>
          <p className="text-emerald-800/80 mb-8 leading-relaxed">
            Your password has been securely updated. You can now use your new credentials to access your account.
          </p>
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
          >
            Login to Account
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8fbff] text-[#0a0a0a] font-sans items-center justify-center relative overflow-hidden">
      {/* Abstract Background Design */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-[#2970ff]/10 rounded-full blur-[100px] border border-[#2970ff]/20 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-[#2970ff]/10 rounded-full blur-[100px] border border-[#2970ff]/20 -translate-x-1/2 translate-y-1/2" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[580px] w-full mx-auto p-12 bg-white rounded-[2.5rem] shadow-[0_24px_48px_-12px_rgba(41,112,255,0.08)] border border-[#eef2f8] text-center"
      >
        <div className="mb-10">
          <Link href="/" className="inline-flex mb-8">
            <Logo size={42} />
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Reset your password</h1>
          <p className="text-[#6b7280] text-lg font-medium">Enter new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="space-y-2">
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="New password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(validatePassword(e.target.value));
                }}
                className={cn(
                  "w-full px-5 py-4 rounded-xl border-2 transition-all outline-none text-base placeholder:text-[#9ca3af]",
                  passwordError ? "border-rose-500 bg-rose-50/10 focus:ring-rose-200/50" : "border-[#e5e7eb] focus:ring-[#2970ff]/10 focus:border-[#2970ff] hover:border-[#ccd1db]"
                )}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#9ca3af] hover:text-[#374151] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-[11px] font-bold text-rose-500 px-1 uppercase tracking-wider">{passwordError}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Confirm password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmError) setConfirmError(e.target.value !== password ? "Passwords don't match." : "");
                }}
                className={cn(
                  "w-full px-5 py-4 rounded-xl border-2 transition-all outline-none text-base placeholder:text-[#9ca3af]",
                  confirmError ? "border-rose-500 bg-rose-50/10 focus:ring-rose-200/50" : "border-[#e5e7eb] focus:ring-[#2970ff]/10 focus:border-[#2970ff] hover:border-[#ccd1db]"
                )}
              />
            </div>
            {confirmError && (
              <p className="text-[11px] font-bold text-rose-500 px-1 uppercase tracking-wider">{confirmError}</p>
            )}
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#171717] hover:bg-[#2970ff] text-white font-black py-4 rounded-xl shadow-[0_12px_24px_-4px_rgba(23,23,23,0.2)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Lock size={20} />
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-12 text-[#6b7280] font-medium">
          Remember your password?{' '}
          <Link href="/login" className="font-bold text-[#2970ff] hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
