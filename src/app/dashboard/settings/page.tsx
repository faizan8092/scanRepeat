'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Save, Camera, Mail, Building2, UserCircle2, Briefcase, ShieldCheck, CheckCircle2, Loader2, ArrowRight, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/lib/auth-context';
import { useToast } from '@/src/lib/toast-context';

export default function SettingsPage() {
  const { user, fetchProfile, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);
  const [status, setStatus] = React.useState<{ type: 'error' | 'success' | null, message: string }>({ type: null, message: '' });
  
  // Profile Form States
  const [firstName, setFirstName] = React.useState(user?.firstName || '');
  const [lastName, setLastName] = React.useState(user?.lastName || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [company, setCompany] = React.useState(user?.company || '');
  const [role, setRole] = React.useState(user?.role || '');
  const [bio, setBio] = React.useState(user?.bio || '');
  const [avatar, setAvatar] = React.useState<string | null>(user?.avatar || null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showEmailModal, setShowEmailModal] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState('');
  const [errors, setErrors] = React.useState<{ firstName?: string, email?: string }>({});

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Initial fetch to ensure we have the latest user data
  React.useEffect(() => {
    fetchProfile().then(data => {
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setEmail(data.email || '');
      setCompany(data.company || '');
      setRole(data.role || '');
      setBio(data.bio || '');
      setAvatar(data.avatar || null);
    }).catch(() => {
      // fallback to current user
    });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation: File Type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        addToast('error', 'Invalid file format', 'Please upload a JPG, PNG, WEBP, or GIF image.');
        return;
      }

      // Validation: File Size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        addToast('error', 'File too large', 'Profile image must be less than 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setAvatar(base64);
        try {
          await updateProfile({ avatar: base64 });
          addToast('success', 'Profile image updated instantly!');
        } catch (err) {
          addToast('error', 'Upload failed', 'There was an error saving your image.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    const newErrors: { firstName?: string, email?: string } = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!email.trim()) newErrors.email = 'Email is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('error', 'Required fields missing', 'Please fill in all mandatory information.');
      return;
    }

    setErrors({});
    setIsSaving(true);
    
    try {
      await updateProfile({
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        company,
        role,
        bio,
        avatar
      });
      addToast('success', 'Profile updated successfully!', 'Your changes have been saved to your account.');
    } catch (err) {
      addToast('error', 'Update failed', 'There was an error saving your changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendOtp = async () => {
    setIsSending(true);
    // Simulate sending email
    await new Promise(r => setTimeout(r, 1500));
    setIsSending(false);
    setIsVerifying(true);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto check if all filled
    if (newOtp.every(digit => digit !== '') && newOtp.length === 6) {
      checkOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const checkOtp = async (code: string) => {
    setIsChecking(true);
    setStatus({ type: null, message: '' });
    // Simulate verification
    await new Promise(r => setTimeout(r, 2000));
    setIsChecking(false);
    
    if (code === '123456') {
      setStatus({ type: 'success', message: 'Email updated and verified successfully!' });
      setTimeout(() => {
        setEmail(newEmail);
        setIsVerified(true);
        setIsVerifying(false);
        setShowEmailModal(false);
        setNewEmail('');
        setOtp(['', '', '', '', '', '']);
      }, 1500);
    } else {
      setOtp(['', '', '', '', '', '']);
      setStatus({ type: 'error', message: 'Invalid code. Please check your email and try again.' });
      otpRefs.current[0]?.focus();
    }
  };

  const openEmailModal = () => {
    setShowEmailModal(true);
    setNewEmail('');
    setIsVerifying(false);
    setStatus({ type: null, message: '' });
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Account Profile</h1>
        <p className="text-sm text-muted-foreground font-medium mt-2">Update your personal information and public profile.</p>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="p-8 md:p-12 lg:p-16">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-6 shrink-0">
               <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-tr from-primary to-accent p-1 shadow-2xl shadow-primary/20 group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full rounded-[2.3rem] bg-card flex items-center justify-center overflow-hidden">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl font-black text-primary">{firstName?.substring(0, 1).toUpperCase() || 'U'}</span>
                      )}
                    </div>
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-foreground border-4 border-card text-background flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Camera size={20} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*" 
                  />
               </div>
                <div className="text-center">
                  <p className="text-xs font-black text-foreground uppercase tracking-widest mb-1">Upload New</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Max 2MB • JPG, PNG, WEBP</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="flex-1 space-y-10 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileInput 
                  label="First Name" 
                  required
                  icon={User} 
                  value={firstName} 
                  onChange={(val) => {
                    setFirstName(val);
                    if (errors.firstName) setErrors({...errors, firstName: undefined});
                  }} 
                  error={errors.firstName}
                />
                <ProfileInput label="Last Name" icon={UserCircle2} value={lastName} onChange={setLastName} />
                
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-foreground/80 uppercase tracking-widest block ml-1">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    {isVerified ? (
                      <div className="flex items-center gap-1 text-success text-[10px] font-black uppercase tracking-wider">
                         <CheckCircle2 size={12} />
                         Verified
                      </div>
                    ) : (
                      <button 
                        onClick={openEmailModal}
                        className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-wider underline flex items-center gap-1"
                      >
                        <ShieldCheck size={10} />
                        Change Email
                      </button>
                    )}
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                      <Mail size={18} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input 
                      type="text"
                      readOnly
                      value={email}
                      className="w-full bg-secondary/30 border border-border py-4 pl-14 pr-5 rounded-2xl text-sm font-bold opacity-70 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <ProfileInput label="Company" icon={Building2} value={company} onChange={setCompany} className="md:col-span-2" />
                <ProfileInput label="Professional Role" icon={Briefcase} value={role} onChange={setRole} className="md:col-span-2" />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-foreground/80 uppercase tracking-widest block ml-1">About / Bio</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us a little about yourself..."
                  className="w-full bg-secondary/50 border border-border focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/5 p-5 rounded-3xl text-sm font-bold transition-all outline-none resize-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="pt-6 border-t border-border flex justify-end">
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-foreground text-background hover:bg-primary transition-all shadow-lg hover:shadow-primary/30 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Profile Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isChecking && setShowEmailModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12"
            >
              <button 
                onClick={() => setShowEmailModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
                disabled={isChecking}
              >
                <X size={20} />
              </button>

              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                  <Mail size={32} />
                </div>
                <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Change Email Address</h2>
                <p className="text-sm text-muted-foreground font-medium">Enter your new email to receive a verification code.</p>
              </div>

              {!isVerifying ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-foreground/80 uppercase tracking-widest block ml-1">New Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Mail size={18} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
                      </div>
                      <input 
                        type="email"
                        placeholder="new@email.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full bg-secondary/50 border border-border focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/5 py-4 pl-14 pr-5 rounded-2xl text-sm font-bold transition-all outline-none"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleSendOtp}
                    disabled={!newEmail || isSending}
                    className="w-full bg-foreground text-background py-4 rounded-2xl font-black shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-2"
                  >
                    {isSending ? <Loader2 size={20} className="animate-spin" /> : 'Send Verification Code'}
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground mb-6">Enter the 6-digit code sent to <span className="text-primary">{newEmail}</span></p>
                    <div className="flex justify-center gap-2 md:gap-3">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => { otpRefs.current[i] = el; }}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(i, e)}
                          className="w-10 h-12 md:w-12 md:h-14 text-center bg-secondary/50 border border-border rounded-xl text-lg font-black focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  {status.message && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-4 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2",
                        status.type === 'success' ? "bg-success/10 text-success border border-success/20" : "bg-destructive/10 text-destructive border border-destructive/20"
                      )}
                    >
                      {status.type === 'success' ? <CheckCircle2 size={14} /> : <ShieldCheck size={14} className="rotate-180" />}
                      {status.message}
                    </motion.div>
                  )}

                  <div className="flex flex-col items-center gap-4">
                    <button 
                      onClick={() => setIsVerifying(false)}
                      className="text-xs font-black text-muted-foreground hover:text-foreground underline underline-offset-4"
                    >
                      Use a different email address
                    </button>
                  </div>
                </div>
              )}

              {isChecking && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex flex-col items-center justify-center z-50">
                   <div className="bg-card p-6 rounded-3xl border border-border shadow-2xl flex items-center gap-4">
                      <Loader2 size={24} className="text-primary animate-spin" />
                      <span className="text-lg font-black text-foreground tracking-tight">Verifying Code...</span>
                   </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ProfileInputProps {
  label: string;
  icon: any;
  value: string;
  onChange?: (val: string) => void;
  className?: string;
  error?: string;
  readOnly?: boolean;
  required?: boolean;
}

function ProfileInput({ label, icon: Icon, value, onChange, className, error, readOnly, required }: ProfileInputProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-xs font-black text-foreground/80 uppercase tracking-widest block ml-1">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Icon size={18} className={cn("text-muted-foreground transition-colors", error ? "text-destructive" : "group-focus-within:text-primary")} />
        </div>
        <input 
          type="text"
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "w-full bg-secondary/50 border border-border py-4 pl-14 pr-5 rounded-2xl text-sm font-bold transition-all outline-none",
            error ? "border-destructive bg-destructive/5" : "focus:bg-card focus:border-primary/30 focus:ring-4 focus:ring-primary/5",
            readOnly && "opacity-70 cursor-not-allowed"
          )}
        />
        {error && (
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] font-black text-destructive uppercase tracking-widest mt-1.5 ml-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
}


