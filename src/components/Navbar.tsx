'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onContactClick?: () => void;
}

export function Navbar({ onContactClick }: NavbarProps) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#e5e7eb]/80 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <Logo size={28} />
        </Link>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
          <Link href="/#features" className="text-[#6b7280] hover:text-[#0a0a0a] transition-colors">Features</Link>
          <Link href="/pricing" className="text-[#6b7280] hover:text-[#0a0a0a] transition-colors">Pricing</Link>
          <button 
            onClick={onContactClick}
            className="text-[#6b7280] hover:text-[#0a0a0a] transition-colors font-semibold"
          >
            Contact
          </button>
          <Link href="/#faq" className="text-[#6b7280] hover:text-[#0a0a0a] transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center space-x-3">
          <Link href="/login" className="text-sm font-semibold text-[#374151] hover:text-[#0a0a0a] transition-colors px-3 py-2">Login</Link>
          <Link 
            href="/signup" 
            className="inline-flex items-center justify-center rounded-full bg-[#0a0a0a] hover:bg-[#2970ff] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            Start Free <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
