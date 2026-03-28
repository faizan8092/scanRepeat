'use client';
import React from 'react';
import { X, Mail, Users, MessageSquare, CheckCircle2 } from 'lucide-react';
import { PageBlock, BrandTheme } from '@/src/types/builder';

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  props: any;
}

const TEMPLATES: FormTemplate[] = [
  {
    id: 'contact',
    name: 'Modern Contact',
    description: 'Perfect for support and inquiries.',
    icon: <Mail className="w-6 h-6" />,
    color: 'bg-blue-500',
    props: {
      title: 'Contact Us',
      description: "We'll get back to you within 24 hours.",
      formName: 'contact_form',
      formType: 'overlay',
      showHeaderImage: true,
      buttonLabel: 'Send Message',
      fields: [
        { id: 'f1', label: 'Your Name', type: 'text', required: true },
        { id: 'f2', label: 'Email Address', type: 'email', required: true },
        { id: 'f3', label: 'Nature of Inquiry', type: 'dropdown', options: ['Support', 'Sales', 'Feedback', 'Other'], required: true },
        { id: 'f4', label: 'Message', type: 'textarea', required: true }
      ]
    }
  },
  {
    id: 'lead',
    name: 'Lead Generation',
    description: 'Collect high-quality leads for your business.',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-emerald-500',
    props: {
      title: 'Get a Quote',
      description: 'Interested in our services? Fill out the details below.',
      formName: 'lead_gen',
      formType: 'inline',
      showHeaderImage: false,
      buttonLabel: 'Request Proposal',
      fields: [
        { id: 'l1', label: 'Full Name', type: 'text', required: true },
        { id: 'l2', label: 'Work Email', type: 'email', required: true },
        { id: 'l3', label: 'Phone Number', type: 'phone', required: true },
        { id: 'l4', label: 'Company Name', type: 'text', required: false },
        { id: 'l5', label: 'Budget Range', type: 'dropdown', options: ['$500 - $1k', '$1k - $5k', '$5k+'], required: false }
      ]
    }
  },
  {
    id: 'feedback',
    name: 'Quick Feedback',
    description: 'Gather insights from your users quickly.',
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'bg-purple-500',
    props: {
      title: 'Quick Feedback',
      description: 'How was your experience today? Tell us more.',
      formName: 'user_feedback',
      formType: 'overlay',
      trigger: 'scroll',
      showHeaderImage: true,
      buttonLabel: 'Submit Feedback',
      fields: [
        { id: 's1', label: 'Overall Satisfaction', type: 'multi_choice', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'], required: true },
        { id: 's2', label: 'What did you like most?', type: 'checkbox', options: ['Design', 'Features', 'Ease of Use', 'Support'], required: false },
        { id: 's3', label: 'Additional Comments', type: 'textarea', required: false }
      ]
    }
  }
];

interface FormTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (props: any) => void;
}

export function FormTemplateModal({ isOpen, onClose, onSelect }: FormTemplateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Choose a Form Template</h2>
            <p className="text-sm text-slate-500">Pick a starting point to capture the best data.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEMPLATES.map((tmpl) => (
            <div 
              key={tmpl.id}
              onClick={() => onSelect(tmpl.props)}
              className="group relative flex flex-col bg-white border-2 border-slate-100 rounded-2xl p-5 hover:border-primary hover:shadow-xl hover:shadow-primary/5 cursor-pointer transition-all duration-300 active:scale-[0.98]"
            >
              {/* Icon / Badge */}
              <div className={`w-12 h-12 ${tmpl.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-${tmpl.color.replace('bg-', '')}/30 group-hover:scale-110 transition-transform`}>
                {tmpl.icon}
              </div>

              <h3 className="font-bold text-slate-800 mb-1">{tmpl.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{tmpl.description}</p>

              {/* Preview Hint */}
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-primary transition-colors">
                  {tmpl.props.fields.length} Fields
                </span>
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle2 size={16} />
                </span>
              </div>
            </div>
          ))}

          {/* Blank Option */}
          <div 
            onClick={() => onSelect({})}
            className="md:col-span-3 mt-2 flex items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <p className="text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors">Skip and start from scratch →</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 text-center border-t">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">PRO TIP: ALL TEMPLATES CAN BE FULLY CUSTOMIZED LATER</p>
        </div>
      </div>
    </div>
  );
}
