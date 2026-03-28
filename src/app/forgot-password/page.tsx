'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/src/components/Logo';
import { cn } from '@/src/lib/utils';
import { forgotPassword } from '@/src/lib/auth-service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);
  const [resetToken, setResetToken] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await forgotPassword({ email });
      setIsSent(true);
      if (response.resetToken) {
        setResetToken(response.resetToken);
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white text-[#0a0a0a] font-sans">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-[#2970ff]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#2970ff]/5 rounded-full blur-3xl -z-10" />

        <Link href="/login" className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-[#6b7280] hover:text-[#0a0a0a] transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to login</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[440px] w-full mx-auto"
        >
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex mb-8">
              <Logo size={48} />
            </Link>
            <h1 className="text-accentxl font-bold tracking-tight mb-3">Reset password</h1>
            <p className="text-[#6b7280] leading-relaxed">
              Enter the email that you used when you signed up to recover your password. You will receive a password reset link.
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#374151]">Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] focus:ring-primary focus:ring-[#2970ff]/20 focus:border-[#2970ff] outline-none transition-all placeholder:text-[#9ca3af]"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#171717] hover:bg-[#2970ff] text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <span>Send Link</span>
                )}
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">Check your email</h3>
              <p className="text-emerald-800/80 mb-6">
                We've sent a password reset link to <br /><span className="font-bold text-emerald-900">{email}</span>
              </p>
              <div className="flex flex-col gap-3 max-w-[200px] mx-auto">
                <Link 
                  href={resetToken ? `/reset-password?token=${encodeURIComponent(resetToken)}` : '/reset-password'}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm"
                >
                  Test Link
                </Link>
                <button 
                  onClick={() => {
                    setIsSent(false);
                    setError(null);
                  }}
                  className="text-emerald-700 font-bold hover:underline text-sm"
                >
                  Didn't receive it? Try again
                </button>
              </div>
            </motion.div>
          )}

          <div className="mt-12 pt-8 border-t border-[#f3f4f6] text-center">
            <p className="text-[#6b7280] text-sm mb-6">
              If you need further assistance <br />
              <Link href="#" className="font-bold text-[#0a0a0a] hover:text-[#2970ff]">contact our support team</Link>
            </p>
            <div className="flex items-center justify-center gap-6">
              <Link href="/login" className="text-sm font-bold text-[#2970ff] hover:underline">Sign In</Link>
              <Link href="/signup" className="text-sm font-bold text-[#2970ff] hover:underline">Sign Up</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
