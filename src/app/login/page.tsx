'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Loader2, ArrowLeft, LogIn, AlertCircle } from 'lucide-react';
import { Logo } from '@/src/components/Logo';
import { useAuth } from '@/src/lib/auth-context';
import { cn } from '@/src/lib/utils';

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [loginError, setLoginError] = React.useState(false);
  const { user, login, loginWithGoogle, isLoading } = useAuth();
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
      setPasswordError('Min. 8 chars with uppercase, digit & special char.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);

    const isValid = validatePassword(password);
    if (!isValid) return;

    try {
      await login(email, password);
    } catch (err) {
      console.error("Login Error Details:", err);
      setLoginError(true);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white text-primary-foreground font-sans overflow-hidden">
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-8 relative">
        <Link href="/" className="absolute top-6 left-8 lg:left-12 flex items-center gap-2 text-muted-foreground hover:text-primary-foreground transition-all group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-bold">Back to site</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[420px] w-full mx-auto"
        >
          <div className="mb-6 text-center lg:text-left">
            <Link href="/" className="inline-flex mb-6">
              <Logo size={40} />
            </Link>
            <h1 className="text-3xl font-black tracking-tight mb-2">Welcome back</h1>
            <p className="text-muted-foreground font-medium text-sm">Login to continue your brand journey</p>
          </div>

          <div className="mb-6 relative h-[48px] group">
            <div 
              className="absolute inset-0 w-full h-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border rounded-xl bg-white hover:bg-secondary/50 hover:border-primary/30 transition-all duration-300 font-bold text-sm pointer-events-none"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Continue with Google</span>
            </div>

            <div className="absolute inset-0 opacity-0 cursor-pointer [&>div]:w-full [&>div]:h-full">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  setLoginError(false);
                  if (credentialResponse.credential) {
                    try {
                      await loginWithGoogle(credentialResponse.credential);
                    } catch (err) {
                      console.error(err);
                      setLoginError(true);
                    }
                  }
                }}
                onError={() => {
                  console.error("Google Login failed or was closed by user.");
                  setLoginError(true);
                }}
                useOneTap
                theme="outline"
                size="large"
                width="400"
                text="continue_with"
                shape="rectangular"
              />
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-white px-4 text-muted-foreground">Or</span>
            </div>
          </div>
          
          {loginError && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive leading-relaxed font-black">
                Incorrect credentials.{' '}
                <Link href="/forgot-password" title="reset password" className="text-primary hover:underline">Reset</Link>
                {' '}or{' '}
                <Link href="/signup" title="create account" className="text-primary hover:underline">Sign up</Link>
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-primary-foreground uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                placeholder="hello@yourcompany.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all placeholder:text-muted-foreground bg-secondary/20 text-sm"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-end mb-0.5">
                <label className="text-xs font-black text-primary-foreground uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-xs font-black text-primary hover:underline">Forgot?</Link>
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
                    "w-full px-4 py-3 rounded-xl border outline-none transition-all placeholder:text-muted-foreground bg-secondary/20 text-sm",
                    passwordError ? "border-destructive focus:ring-destructive/5" : "border-border focus:ring-primary/5 focus:border-primary"
                  )}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary-foreground transition-all"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className={cn(
                "text-[10px] font-bold transition-all duration-300 px-1",
                passwordError ? "text-destructive" : "text-muted-foreground"
              )}>
                {passwordError || "Min. 8 chars with uppercase, digit & special char."}
              </p>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-primary text-white text-sm font-black transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 group mt-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <LogIn size={20} className="transition-transform group-hover:translate-x-1" />
                  <span>Login to Dashboard</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-muted-foreground text-sm font-medium">
            Don't have an account?{' '}
            <Link href="/signup" className="font-black text-primary hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side: Image/Branding */}
      <div className="hidden lg:flex flex-1 p-6">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full h-full relative rounded-[2.5rem] overflow-hidden bg-secondary"
        >
          <motion.img 
            src="/Assets/auth.svg" 
            alt="Authentication" 
            className="absolute inset-0 w-full h-full object-contain p-20"
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
