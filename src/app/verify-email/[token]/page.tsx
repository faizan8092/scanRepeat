'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { verifyEmail } from '@/src/lib/auth-service';
import { Logo } from '@/src/components/Logo';

export default function VerifyEmailPage() {
  const params = useParams();
  const tokenRaw = params?.token;
  const token = Array.isArray(tokenRaw) ? tokenRaw[0] : tokenRaw;
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState<string>('Verifying your email...');

  React.useEffect(() => {
    (async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token.');
        return;
      }

      try {
        const response = await verifyEmail(token);
        setStatus('success');
        setMessage(response.message);
      } catch (err: any) {
        setStatus('error');
        setMessage(err?.message || 'Unable to verify email.');
      }
    })();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-[#e5e7eb] rounded-3xl shadow-lg p-10 text-center"
      >
        <Link href="/" className="inline-flex mb-10">
          <Logo size={42} />
        </Link>

        <div className="mb-8">
          {status === 'success' ? (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={28} />
            </div>
          ) : status === 'loading' ? (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <span className="font-bold">…</span>
            </div>
          ) : (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <XCircle size={28} />
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-3">
          {status === 'success' ? 'Email Verified' : status === 'loading' ? 'Verifying...' : 'Verification Failed'}
        </h1>
        <p className="text-sm text-[#6b7280] mb-8">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full bg-[#171717] hover:bg-[#2970ff] text-white font-bold py-3 rounded-xl transition-colors"
          >
            Go to Login
          </Link>
          <Link
            href="/"
            className="w-full text-sm font-bold text-[#2970ff] hover:underline"
          >
            Return to homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
