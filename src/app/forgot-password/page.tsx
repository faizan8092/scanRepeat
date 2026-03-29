'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/src/components/Logo';
import { forgotPassword } from '@/src/lib/auth-service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await forgotPassword({ email });
      setIsSent(true);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white text-primary-foreground font-sans overflow-hidden">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 relative">
        {/* Background Decorative Elements - Themed Blue */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-10" />

        <Link href="/login" className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-muted-foreground hover:text-primary-foreground transition-all group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-bold">Back to login</span>
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
            <h1 className="text-3xl font-black tracking-tight mb-3">Reset password</h1>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Enter the email that you used when you signed up to recover your password.
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-black text-primary-foreground">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border border-border focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all placeholder:text-muted-foreground bg-secondary/20"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-primary text-white text-sm font-black transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 group"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary/5 border border-primary/10 rounded-2xl p-10 text-center"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-primary/20">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black text-primary-foreground mb-2">Check your email</h3>
              <p className="text-muted-foreground font-medium mb-8">
                We've sent a password reset link to <br /><span className="font-black text-primary-foreground">{email}</span>
              </p>
              
              <button 
                onClick={() => {
                  setIsSent(false);
                  setError(null);
                }}
                className="text-primary font-black hover:underline text-sm uppercase tracking-widest"
              >
                Didn't receive it? Try again
              </button>
            </motion.div>
          )}

          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground text-sm font-medium mb-6">
              If you need further assistance <br />
              <Link href="#" className="font-black text-primary hover:underline">contact our support team</Link>
            </p>
            <div className="flex items-center justify-center gap-8">
              <Link href="/login" className="text-sm font-black text-primary hover:underline uppercase tracking-widest">Sign In</Link>
              <Link href="/signup" className="text-sm font-black text-primary hover:underline uppercase tracking-widest">Sign Up</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
