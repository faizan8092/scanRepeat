'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { Logo } from '@/src/components/Logo';
import { cn } from '@/src/lib/utils';
import { resetPassword } from '@/src/lib/auth-service';
import { useRouter, useSearchParams } from 'next/navigation';

import { Suspense } from 'react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [confirmError, setConfirmError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasDigit = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (!minLength || !hasUpper || !hasDigit || !hasSpecial) {
      return 'Min. 8 chars with uppercase, digit & special char.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const passErr = validatePassword(password);
    const matchErr = password !== confirmPassword ? "Passwords don't match." : "";

    setPasswordError(passErr);
    setConfirmError(matchErr);

    if (!token) {
      setError('Missing password reset token. Please use the link we emailed you.');
      return;
    }

    if (!passErr && !matchErr) {
      setIsLoading(true);
      try {
        await resetPassword({ token, password, confirmPassword });
        setIsDone(true);
      } catch (err: any) {
        setError(err?.message || 'Unable to reset password. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isDone) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white p-8 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-[440px] w-full bg-primary/5 border border-primary/10 rounded-[2.5rem] p-12 text-center"
        >
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-primary/20">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-black text-primary-foreground mb-3">Password Reset Successful</h1>
          <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
            Your password has been securely updated. You can now use your new credentials to access your account.
          </p>
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Login to Account
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-[#f8fbff] text-primary-foreground font-sans items-center justify-center relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[480px] w-full mx-auto p-12 bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(var(--primary),0.08)] border border-border text-center"
      >
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex mb-8">
            <Logo size={42} />
          </Link>
          <h1 className="text-3xl font-black tracking-tight mb-2">Reset your password</h1>
          <p className="text-muted-foreground font-medium">Enter your new secure password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive font-black">
              {error}
            </div>
          )}

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
                  "w-full px-5 py-4 rounded-xl border border-border transition-all outline-none text-base placeholder:text-muted-foreground bg-secondary/20",
                  passwordError ? "border-destructive focus:ring-destructive/5" : "focus:ring-4 focus:ring-primary/5 focus:border-primary"
                )}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary-foreground transition-all"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-[10px] font-black text-destructive uppercase tracking-widest px-1">{passwordError}</p>
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
                  "w-full px-5 py-4 rounded-xl border border-border transition-all outline-none text-base placeholder:text-muted-foreground bg-secondary/20",
                  confirmError ? "border-destructive focus:ring-destructive/5" : "focus:ring-4 focus:ring-primary/5 focus:border-primary"
                )}
              />
            </div>
            {confirmError && (
              <p className="text-[10px] font-black text-destructive uppercase tracking-widest px-1">{confirmError}</p>
            )}
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-primary text-white text-sm font-black transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Lock size={20} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-12 text-muted-foreground font-medium">
          Remember your password?{' '}
          <Link href="/login" className="font-black text-primary hover:underline uppercase tracking-widest text-xs">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-[#f8fbff]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
