'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Eye, EyeOff, Smartphone, Laptop, LogOut, ChevronRight, Save, Trash2, AlertCircle, X, Info } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '@/src/lib/auth-context';
import { useToast } from '@/src/lib/toast-context';
import { Loader } from '@/src/components/ui/Loader';
import { updatePassword, getSessions, revokeAllSessions, revokeSession, Session } from '@/src/lib/auth-service';

export default function SecurityPage() {
  const { logout } = useAuth();
  const { addToast } = useToast();
  
  const [passwords, setPasswords] = React.useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [errors, setErrors] = React.useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = React.useState(true);

  React.useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasDigit = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (!minLength || !hasUpper || !hasDigit || !hasSpecial) {
      return 'Password must be at least 8 characters with an uppercase letter, digit, and special character.';
    }
    return '';
  };

  const handleUpdatePassword = async () => {
    const currentPassError = !passwords.current ? 'Current password is required.' : '';
    const newPassError = validatePassword(passwords.new);
    let sameAsOldError = '';
    
    if (passwords.new && passwords.current && passwords.new === passwords.current) {
      sameAsOldError = 'New password cannot be the same as the current password.';
    }

    const finalNewPassError = newPassError || sameAsOldError;
    const confirmPassError = passwords.new !== passwords.confirm ? "Passwords don't match." : "";
    
    setErrors({
      current: currentPassError,
      new: finalNewPassError,
      confirm: confirmPassError
    });

    if (!currentPassError && !finalNewPassError && !confirmPassError) {
      setIsUpdatingPassword(true);
      try {
        await updatePassword({
          currentPassword: passwords.current,
          newPassword: passwords.new,
          confirmPassword: passwords.confirm
        });
        addToast('success', 'Password updated', 'Your account security has been strengthened.');
        setPasswords({ current: '', new: '', confirm: '' });
      } catch (err: any) {
        addToast('error', 'Update Failed', err.message || 'Failed to update password.');
      } finally {
        setIsUpdatingPassword(false);
      }
    } else {
      addToast('error', 'Update Failed', 'Please fix the errors in the form.');
    }
  };

  const handleRevokeSession = async (id: string) => {
    try {
      await revokeSession(id);
      addToast('success', 'Session signed out', 'The device has been disconnected.');
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      addToast('error', 'Error', err.message || 'Could not sign out session.');
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      await revokeAllSessions();
      addToast('success', 'All sessions signed out', 'All devices have been disconnected.');
      // Keep only current session or refetch
      fetchSessions();
    } catch (err: any) {
      addToast('error', 'Error', 'Could not sign out sessions.');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    // Simulate API call for deletion
    await new Promise(r => setTimeout(r, 1500));
    setIsDeleting(false);
    setShowDeleteModal(false);
    setDeleteConfirmText('');
    addToast('delete', 'Account deactivated', 'Your account has been permanently deleted.');
    logout();
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setDeleteConfirmText('');
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Security Settings</h1>
        <p className="text-sm text-muted-foreground font-medium mt-2">Protect your account and managed brand assets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Password Section */}
          <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-12 shadow-sm">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Key size={24} />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-foreground tracking-tight">Security Password</h2>
                 <p className="text-muted-foreground text-sm font-medium">Update your login credentials regularly.</p>
               </div>
            </div>

            <div className="space-y-6 max-w-xl">
              <SecurityInput 
                label="Current Password" 
                type="password" 
                placeholder="••••••••"
                value={passwords.current}
                error={errors.current}
                onChange={(val) => {
                  setPasswords(prev => ({ ...prev, current: val }));
                  if (errors.current) setErrors(prev => ({ ...prev, current: !val ? 'Current password is required.' : '' }));
                }}
              />
              {errors.current && (
                <p className="text-[10px] font-bold text-destructive px-1 ml-1 -mt-4">
                  {errors.current}
                </p>
              )}
              
              <div className="space-y-2">
                <SecurityInput 
                  label="New Password" 
                  type="password" 
                  placeholder="••••••••"
                  value={passwords.new}
                  error={errors.new}
                  onChange={(val) => {
                    setPasswords(prev => ({ ...prev, new: val }));
                    if (errors.new) setErrors(prev => ({ ...prev, new: validatePassword(val) }));
                  }}
                />
                <p className={cn(
                  "text-[10px] font-bold transition-all duration-300 px-1 ml-1",
                  errors.new ? "text-destructive" : "text-muted-foreground opacity-60"
                )}>
                  {errors.new || "Min. 8 chars with uppercase, digit & special char."}
                </p>
              </div>

              <div className="space-y-2">
                <SecurityInput 
                  label="Confirm New Password" 
                  type="password" 
                  placeholder="••••••••"
                  value={passwords.confirm}
                  error={errors.confirm}
                  onChange={(val) => {
                    setPasswords(prev => ({ ...prev, confirm: val }));
                    if (errors.confirm) setErrors(prev => ({ ...prev, confirm: val !== passwords.new ? "Passwords don't match." : "" }));
                  }}
                />
                {errors.confirm && (
                  <p className="text-[10px] font-bold text-destructive px-1 ml-1">
                    {errors.confirm}
                  </p>
                )}
              </div>
              
              <div className="pt-4">
                <button 
                  onClick={handleUpdatePassword}
                  disabled={isUpdatingPassword}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background hover:bg-primary transition-all shadow-xl disabled:opacity-50 min-w-[200px] justify-center"
                >
                  {isUpdatingPassword ? <Loader size={30} /> : (
                    <>
                      <Save size={18} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 2FA Section */}
          <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-12 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
               <Key size={120} />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success">
                    <Smartphone size={24} />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-foreground tracking-tight">Two-Factor Authentication</h2>
                   <p className="text-muted-foreground text-sm font-medium">Add an extra layer of protection.</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full border border-success/20 text-success text-[10px] font-black uppercase">
                 Recommended
              </div>
            </div>

            <p className="text-sm font-bold text-muted-foreground leading-relaxed mb-10 max-w-2xl relative z-10">
              Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to log in.
            </p>

            <button className="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-success text-sm font-black text-success hover:bg-success hover:text-background transition-all relative z-10">
              Enable 2FA Now <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
             <h3 className="text-xl font-bold text-foreground mb-2">Active Sessions</h3>
             {!isLoadingSessions && sessions.length > 0 && (
               <p className="text-sm font-medium text-muted-foreground mb-6">
                 You have <strong className="text-foreground">{sessions.length} active sessions</strong>, we only show you the top 3 most recent sessions here.
               </p>
             )}
             <div className="space-y-3">
                {isLoadingSessions ? (
                  <div className="flex justify-center p-4">
                    <Loader size={60} />
                  </div>
                ) : sessions.length > 0 ? (
                  sessions.slice(0, 3).map((session, index) => (
                    <SessionItem 
                      key={session.id}
                      device={session.device || 'Unknown Device'} 
                      location={session.ip || 'Unknown Location'} 
                      status={new Date(session.createdAt).toLocaleDateString()} 
                      icon={session.device?.toLowerCase().includes('iphone') || session.device?.toLowerCase().includes('android') ? 'phone' : 'laptop'}
                      onRevoke={() => handleRevokeSession(session.id)}
                      sessionData={session}
                      isCurrent={index === 0}
                    />
                  ))
                ) : (
                  <p className="text-sm font-bold text-muted-foreground text-center">No active sessions found.</p>
                )}
             </div>
             {sessions.length > 0 && (
               <button 
                 onClick={handleRevokeAllSessions}
                 className="w-full mt-10 py-4 rounded-2xl border border-border text-sm font-bold text-muted-foreground hover:text-destructive hover:border-destructive/10 hover:bg-destructive/5 transition-all flex items-center justify-center gap-2"
               >
                 <LogOut size={16} /> Sign out of all sessions
               </button>
             )}
           </div>

           <div className="p-8 rounded-[2.5rem] bg-destructive/5 border border-destructive/10">
             <div className="flex items-center gap-3 mb-4 text-destructive">
                <AlertCircle size={20} />
                <h3 className="text-lg font-black italic">Danger Zone</h3>
             </div>
             <p className="text-muted-foreground text-[11px] font-bold leading-relaxed mb-8 uppercase tracking-wider">Deleting your account is permanent and cannot be undone.</p>
             <button 
               onClick={openDeleteModal}
               className="w-full py-4 rounded-2xl bg-destructive text-background font-bold text-sm shadow-xl shadow-destructive/20 hover:bg-destructive/90 transition-all flex items-center justify-center gap-2"
             >
                <Trash2 size={16} /> Delete Account
              </button>
            </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-10"
            >
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
                disabled={isDeleting}
              >
                <X size={20} />
              </button>

              <div className="mb-8 pr-8">
                <h2 className="text-2xl font-black text-foreground tracking-tight mb-6 mt-2">Delete account</h2>
                
                <div className="space-y-6 text-sm font-medium text-muted-foreground">
                  <p>
                    You are about to delete your account. All the data associated with this account will be permanently deleted.
                  </p>
                  <p>
                    Please type <strong className="text-foreground font-black">DELETE</strong> below to proceed with your action.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <input 
                  type="text"
                  placeholder="Type DELETE to confirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full bg-secondary/50 border border-border focus:bg-card focus:border-destructive/50 focus:ring-4 focus:ring-destructive/10 py-4 px-5 rounded-2xl text-sm font-bold transition-all outline-none"
                />

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                  <button 
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                    className="px-6 py-3 rounded-2xl border border-border text-sm font-bold hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                    className="px-6 py-3 rounded-2xl bg-destructive text-background text-sm font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-destructive/90 transition-all flex items-center justify-center gap-2 min-w-[160px]"
                  >
                    {isDeleting ? <Loader size={30} /> : 'Delete account'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SecurityInput({ 
  label, 
  type, 
  placeholder, 
  value, 
  onChange, 
  error 
}: { 
  label: string, 
  type: string, 
  placeholder: string,
  value: string,
  onChange: (val: string) => void,
  error?: string
}) {
  const [show, setShow] = React.useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-2">
      <label className="text-sm font-black text-foreground/80 block ml-1">{label}</label>
      <div className="relative">
        <input 
          type={isPassword ? (show ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full bg-secondary/50 border focus:bg-card focus:ring-4 py-4 px-5 rounded-2xl text-sm font-bold transition-all outline-none",
            error 
              ? "border-destructive focus:border-destructive focus:ring-destructive/5" 
              : "border-border focus:border-primary/30 focus:ring-primary/5"
          )}
        />
        {isPassword && (
          <button 
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

function SessionItem({ device, location, status, icon, onRevoke, sessionData, isCurrent }: { device: string, location: string, status: string, icon: 'laptop' | 'phone', onRevoke?: () => void, sessionData?: any, isCurrent?: boolean }) {
  const IconComponent = icon === 'laptop' ? Laptop : Smartphone;
  
  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).replace('AM', 'AM').replace('PM', 'PM');
  };

  const formatDevice = (ua: string) => {
    if (!ua || ua.length < 5) return 'Unknown Device';
    if (!ua.includes('/')) return ua;
    
    let browser = 'Browser';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';

    let os = 'Unknown OS';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac OS') || ua.includes('Macintosh')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    return `${browser} on ${os}`;
  };

  const deviceName = formatDevice(sessionData?.device || device);

  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[2rem] border transition-all duration-300 relative overflow-hidden group/session",
      isCurrent ? "bg-primary/[0.03] border-primary/20" : "bg-card border-border hover:bg-secondary/50"
    )}>
      {isCurrent && (
         <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      )}
      <div className="flex items-start gap-4">
        <div className={cn(
          "mt-0.5 p-2.5 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
          isCurrent ? "bg-primary text-background" : "bg-secondary text-foreground group-hover/session:bg-border border border-border"
        )}>
          <IconComponent size={20} strokeWidth={2} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <p className="text-[15px] font-black tracking-tight text-foreground">{deviceName}</p>
            {isCurrent && (
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black tracking-widest uppercase">
                Current Session
              </span>
            )}
          </div>
          <div className="text-[12px] text-muted-foreground font-medium space-y-0.5">
            <p className="text-foreground/80 font-bold">Logged in: <span className="text-foreground">{sessionData?.createdAt ? formatDateTime(sessionData.createdAt) : status}</span></p>
            <p className="flex items-center gap-2"><span>IP: <span className="font-bold">{sessionData?.ip || location}</span></span> <span className="opacity-50">•</span> <span>Expires: {sessionData?.expiresAt ? formatDateTime(sessionData.expiresAt) : 'Never'}</span></p>
          </div>
        </div>
      </div>
      
      {onRevoke && !isCurrent && (
        <button 
          onClick={onRevoke}
          className="self-end sm:self-center px-5 py-2.5 rounded-xl hover:bg-destructive text-muted-foreground hover:text-background text-xs font-bold transition-all whitespace-nowrap border border-border hover:border-destructive shadow-sm"
        >
          Log out
        </button>
      )}
    </div>
  );
}

