'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, Loader2, MessageSquareText } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { getApiUrl } from '@/src/lib/api';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const payload = Object.fromEntries(formData.entries());

      const res = await fetch(getApiUrl('/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Submission failed');

      setSubmitted(true);
      setTimeout(() => {
          setSubmitted(false);
          onClose();
      }, 2500);
    } catch (err) {
      console.error(err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className={cn(
          "relative bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300",
          submitted && "max-w-md"
        )}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all active:scale-95"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="p-12 flex flex-col items-center text-center space-y-6 w-full">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Message Received!</h2>
              <p className="text-slate-500">Our team will get back to you within 24 hours. Hang tight!</p>
            </div>
          </div>
        ) : (
          <>
            {/* Left Side: Info (Gradient Background) */}
            <div className="w-full md:w-[38%] bg-primary p-8 md:p-12 text-white flex flex-col relative overflow-hidden">
              {/* Decorative Circles */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute top-20 -left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl" />

              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Let's build<br />something great.</h2>
                  <p className="text-indigo-100 opacity-90 leading-relaxed text-lg">
                    Fill out the form and our team will get back to you within 24 hours. We're excited to help you scale your brand.
                  </p>
                </div>

                {/* Abstract Graphic Element */}
                <div className="flex-1 flex items-center justify-center py-12 relative overflow-hidden">
                   <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                     <div className="absolute inset-0 bg-white/10 rounded-[3rem] rotate-12 backdrop-blur-sm transition-transform duration-700 hover:rotate-[24deg]" />
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-[3rem] -rotate-6 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-2xl transition-transform duration-700 hover:scale-105">
                        <MessageSquareText size={72} className="text-white drop-shadow-xl" strokeWidth={1.5} />
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full md:w-[62%] p-8 md:p-12 overflow-y-auto max-h-[90vh]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-1.5 focus-within:text-primary transition-colors">
                    <label className="text-sm font-bold tracking-wide uppercase text-slate-500">First Name *</label>
                    <input 
                      required
                      name="firstName"
                      type="text" 
                      placeholder="e.g. John"
                      className="w-full bg-slate-50 border-b-2 border-slate-200 px-0 py-3 focus:border-primary outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium"
                    />
                  </div>
                  {/* Last Name */}
                  <div className="space-y-1.5 focus-within:text-primary transition-colors">
                    <label className="text-sm font-bold tracking-wide uppercase text-slate-500">Last Name *</label>
                    <input 
                      required
                      name="lastName"
                      type="text" 
                      placeholder="e.g. Doe"
                      className="w-full bg-slate-50 border-b-2 border-slate-200 px-0 py-3 focus:border-primary outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-1.5 focus-within:text-primary transition-colors">
                    <label className="text-sm font-bold tracking-wide uppercase text-slate-500">Work Email *</label>
                    <input 
                      required
                      name="email"
                      type="email" 
                      placeholder="john@company.com"
                      className="w-full bg-slate-50 border-b-2 border-slate-200 px-0 py-3 focus:border-primary outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium"
                    />
                  </div>
                  {/* Phone */}
                  <div className="space-y-1.5 focus-within:text-primary transition-colors">
                    <label className="text-sm font-bold tracking-wide uppercase text-slate-500">Phone Number</label>
                    <input 
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-50 border-b-2 border-slate-200 px-0 py-3 focus:border-primary outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company */}
                  <div className="space-y-1.5 focus-within:text-primary transition-colors">
                    <label className="text-sm font-bold tracking-wide uppercase text-slate-500">Company Name</label>
                    <input 
                      type="text"
                      name="companyName"
                      placeholder="e.g. Acme Inc"
                      className="w-full bg-slate-50 border-b-2 border-slate-200 px-0 py-3 focus:border-primary outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium"
                    />
                  </div>
                  {/* Employees */}
                  <div className="space-y-1.5 focus-within:text-primary transition-colors">
                    <label className="text-sm font-bold tracking-wide uppercase text-slate-500">Total Employees</label>
                    <input 
                      type="number"
                      name="totalEmployees"
                      placeholder="e.g. 15"
                      className="w-full bg-slate-50 border-b-2 border-slate-200 px-0 py-3 focus:border-primary outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium"
                    />
                  </div>
                </div>


                {/* Message */}
                <div className="space-y-1.5 focus-within:text-primary transition-colors pt-2">
                  <p className="text-sm font-medium text-slate-500 mb-2">
                    Please briefly share your use case so we can provide the best assistance. *
                  </p>
                  <textarea 
                    required
                    name="message"
                    rows={4}
                    placeholder="Write your message..."
                    className="w-full bg-slate-100/50 rounded-2xl border-2 border-transparent p-4 focus:border-primary focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
