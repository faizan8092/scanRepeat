'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Save, Camera, Mail, CheckCircle2, Loader2, Phone, Globe, ChevronDown, ShieldAlert, X, Send } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PremiumSelect } from '@/src/components/ui/PremiumSelect';
import { useAuth } from '@/src/lib/auth-context';
import { useToast } from '@/src/lib/toast-context';
import { resendVerification } from '@/src/lib/auth-service';

// Comprehensive Country List
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

export default function SettingsPage() {
  const { user, fetchProfile, updateProfile } = useAuth();
  const { addToast } = useToast();
  
  const [firstName, setFirstName] = React.useState(user?.firstName || '');
  const [lastName, setLastName] = React.useState(user?.lastName || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [country, setCountry] = React.useState(user?.company || 'India'); 
  const [bio, setBio] = React.useState(user?.bio || '');
  const [avatar, setAvatar] = React.useState<string | null>(user?.avatar || null);
  const [emailVerified, setEmailVerified] = React.useState(user?.emailVerified || false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Verification Modal States
  const [showEmailModal, setShowEmailModal] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    fetchProfile().then(data => {
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setBio(data.bio || '');
      setAvatar(data.avatar || null);
      setEmailVerified(data.emailVerified || false);
      if (data.company) setCountry(data.company);
    }).catch(() => {});
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setAvatar(base64);
        try {
          await updateProfile({ avatar: base64 });
          addToast('success', 'Avatar updated!');
        } catch (err) {
          addToast('error', 'Upload failed');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ 
        firstName, 
        lastName, 
        name: `${firstName} ${lastName}`.trim(), 
        phone,
        bio, 
        avatar,
        company: country 
      });
      addToast('success', 'Profile updated!');
    } catch (err) {
      addToast('error', 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendLink = async () => {
    setIsSending(true);
    try {
      await resendVerification({ email });
      setIsSent(true);
      addToast('success', 'Verification Sent!', `We've emailed a verification link to ${email}.`);
    } catch (err: any) {
      addToast('error', 'Failed to send link', err?.message || 'Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const openEmailModal = () => {
    setShowEmailModal(true);
    setIsSent(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary-foreground">Account Profile</h1>
          <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.1em] mt-1">Manage personal presence & verification</p>
        </div>
        <button 
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-white font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="flex-1 bg-card rounded-[2.5rem] border border-border/60 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 p-8 lg:p-10 overflow-y-auto custom-scrollbar space-y-10">
          
          {/* Avatar Area */}
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-28 h-28 rounded-3xl bg-primary/5 p-1 border-2 border-primary/10 group-hover:border-primary/30 transition-all duration-300 overflow-hidden shadow-sm">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-secondary flex items-center justify-center text-2xl font-black text-primary/40">
                    {firstName?.substring(0, 1).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                  <Camera className="text-white" size={20} />
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Profile Avatar</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <SettingsInput label="First Name" value={firstName} onChange={setFirstName} icon={User} />
            <SettingsInput label="Last Name" value={lastName} onChange={setLastName} icon={User} />
            
            <SettingsInput 
              label="Email Address" 
              value={email} 
              icon={Mail} 
              verified={emailVerified}
              notVerified={!emailVerified} 
              onAction={openEmailModal}
            />

            <SettingsInput label="Phone Number" value={phone} onChange={setPhone} icon={Phone} />

            <PremiumSelect 
              label="Country Location" 
              options={COUNTRIES} 
              value={country} 
              onChange={setCountry} 
              icon={Globe}
              searchable={true} 
            />

            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Public Bio</label>
              <textarea 
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="w-full bg-secondary/20 border border-border focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/5 p-5 rounded-3xl text-sm font-bold transition-all outline-none resize-none text-slate-700 shadow-sm shadow-primary/5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEmailModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-xl overflow-hidden p-8 md:p-12">
              <button onClick={() => setShowEmailModal(false)} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors" >
                <X size={20} />
              </button>
              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6"> 
                  {isSent ? <Send size={32} /> : <Mail size={32} />} 
                </div>
                <h2 className="text-3xl font-black text-primary-foreground tracking-tight mb-2">Verify Email</h2>
                <p className="text-sm text-muted-foreground font-bold italic px-4">Verify your address to unlock all brand features.</p>
              </div>

              {!isSent ? (
                <div className="space-y-6">
                  <div className="p-8 rounded-3xl bg-secondary/40 text-center space-y-4 border border-border/50">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-none">Associated Email</p>
                    <p className="text-xl font-black text-primary break-all">{email}</p>
                  </div>
                  <button onClick={handleSendLink} disabled={isSending} className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    {isSending ? <Loader2 size={20} className="animate-spin" /> : 'Send Verification Link'}
                  </button>
                </div>
              ) : (
                <div className="space-y-8 flex flex-col items-center">
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center w-full">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white mx-auto mb-4">
                       <CheckCircle2 size={24} />
                    </div>
                    <p className="text-base font-black text-emerald-600 mb-2">Sent Successfully!</p>
                    <p className="text-sm font-bold text-emerald-600/70 leading-relaxed italic">A secure verification link has been delivered to your inbox. Please check your email and click the link to verify your account.</p>
                  </motion.div>
                  
                  <button onClick={() => setShowEmailModal(false)} className="w-full py-4 rounded-2xl bg-secondary text-primary-foreground font-black hover:bg-secondary/80 transition-all uppercase tracking-widest text-sm">
                    Done
                  </button>
                  
                  <button onClick={() => setIsSent(false)} className="text-[10px] font-black text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 uppercase tracking-widest"> 
                    Didn't receive it? Send again
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border) / 0.5); border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: hsl(var(--primary) / 0.1); }
      `}</style>
    </div>
  );
}

function SettingsInput({ label, value, onChange, icon: Icon, verified, notVerified, onAction }: { 
  label: string, 
  value: string, 
  onChange?: (v: string) => void, 
  icon: any,
  verified?: boolean,
  notVerified?: boolean,
  onAction?: () => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">{label}</label>
        {verified && (
          <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-wider leading-none">
             <CheckCircle2 size={10} strokeWidth={3} className="fill-emerald-500 text-white" />
             Verified
          </div>
        )}
        {notVerified && onAction && (
          <button onClick={onAction} className="flex items-center gap-1 text-[9px] font-black text-destructive hover:underline hover:text-destructive/80 transition-colors uppercase tracking-wider leading-none">
             <ShieldAlert size={10} strokeWidth={3} />
             Verify Email
          </button>
        )}
      </div>
      <div className="relative group">
        <input 
          type="text" 
          value={value}
          readOnly={!onChange}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "w-full bg-secondary/20 border border-border py-4 pl-5 pr-14 rounded-2xl text-sm font-bold transition-all outline-none text-slate-700 shadow-sm shadow-primary/5",
            !onChange && "opacity-70 cursor-not-allowed border-transparent pointer-events-none select-none"
          )}
        />
        <Icon size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
      </div>
    </div>
  );
}
