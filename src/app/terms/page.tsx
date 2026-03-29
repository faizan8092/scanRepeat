'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, ShieldCheck, Scale, MessageSquare } from 'lucide-react';
import { Logo } from '@/src/components/Logo';

export default function TermsPage() {
  const sections = [
    {
      id: "1",
      title: "1. INTRODUCTION",
      content: "ScanRepeat (“we”, “our”, “us”) is a platform that enables businesses to create QR codes, dynamic product pages, and track engagement analytics. By using our services, you agree to these Terms."
    },
    {
      id: "2",
      title: "2. SERVICES",
      content: "ScanRepeat provides:\n- QR code generation\n- Dynamic product pages\n- Analytics (scans, device, location)\n- Optional redirects and integrations"
    },
    {
      id: "3",
      title: "3. USER RESPONSIBILITY",
      content: "You are responsible for all content shown through your QR codes. Any content linked or displayed is publicly accessible."
    },
    {
      id: "4",
      title: "4. DATA COLLECTION",
      content: "We may collect:\n- Emails submitted via forms\n- Analytics data (IP, device, location)\nYou must ensure you have consent to collect user data."
    },
    {
      id: "5",
      title: "5. PAYMENTS",
      content: "We offer Free and Paid plans. Subscriptions may auto-renew unless canceled."
    },
    {
      id: "6",
      title: "6. LIMITATION OF LIABILITY",
      content: "We are not responsible for:\n- Accuracy of analytics\n- External links\n- Misuse of QR codes\n- Counterfeit detection limitations"
    },
    {
      id: "7",
      title: "7. TERMINATION",
      content: "We may suspend or terminate accounts for misuse or violation."
    },
    {
      id: "8",
      title: "8. GOVERNING LAW",
      content: "These terms are governed by Indian law."
    },
    {
      id: "9",
      title: "9. CONTACT",
      content: "If you have any questions, contact us at support@scanrepeat.com"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-primary-foreground font-sans selection:bg-primary/10">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-border z-50 flex items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={32} />
        </Link>
        <Link href="/signup" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-black">
          <ArrowLeft size={16} />
          Back to Signup
        </Link>
      </header>

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-8 bg-secondary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-4 block">Legal Center</span>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Terms and Conditions</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              Last Updated: 2026. Please read these terms carefully before using the ScanRepeat platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20 px-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-16">
            {sections.map((section, index) => (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <h2 className="text-2xl font-black mb-6 text-primary flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">{section.id}</span>
                  {section.title.split('. ')[1] || section.title}
                </h2>
                <div className="text-muted-foreground leading-relaxed font-medium text-lg whitespace-pre-wrap pl-11">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-32 p-10 rounded-[2.5rem] bg-secondary border border-border text-center"
          >
            <ShieldCheck size={48} className="mx-auto text-primary mb-6" />
            <h3 className="text-2xl font-black mb-4">Have questions?</h3>
            <p className="text-muted-foreground mb-8 font-medium">If you have any questions or concerns regarding our terms, our legal team is here to help.</p>
            <a 
              href="mailto:support@scanrepeat.com" 
              className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-border text-center text-muted-foreground text-sm font-medium">
        &copy; {new Date().getFullYear()} ScanRepeat. All rights reserved.
      </footer>
    </div>
  );
}
