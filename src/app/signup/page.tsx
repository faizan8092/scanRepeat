'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { QrCode, Eye, EyeOff, Apple, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/src/lib/auth-context';

export default function SignupPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const { signup, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 py-12">
      <Container maxWidth="sm">
        <Paper className="p-8 md:p-12 shadow-xl rounded-2xl border">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <QrCode className="h-8 w-8 text-primary" />
              <span className="font-tektur text-2xl font-bold tracking-tight">ScanRepeat</span>
            </Link>
            <Typography variant="h4" className="font-bold mb-2">Create Account</Typography>
            <Typography variant="body2" color="text.secondary" className="text-center">
              Join 500+ brands turning packaging into a purchase funnel
            </Typography>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <TextField fullWidth label="First Name" variant="outlined" required disabled={isLoading} />
              <TextField fullWidth label="Last Name" variant="outlined" required disabled={isLoading} />
            </div>
            <TextField
              fullWidth
              label="Work Email"
              variant="outlined"
              placeholder="name@company.com"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              required
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControlLabel
              control={<Checkbox defaultChecked color="primary" disabled={isLoading} />}
              label={
                <Typography variant="caption" color="text.secondary">
                  I agree to the <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
                </Typography>
              }
            />

            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 py-3 font-bold"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Get Started Free'}
            </Button>
          </form>

          <div className="my-8 flex items-center">
            <Divider className="flex-1" />
            <Typography variant="caption" color="text.secondary" className="px-4">
              OR SIGN UP WITH
            </Typography>
            <Divider className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outlined" startIcon={<Apple size={20} />} className="py-2.5" onClick={() => signup('test@apple.com')} disabled={isLoading}>
              Apple
            </Button>
            <Button variant="contained" startIcon={<Mail size={20} />} className="py-2.5 bg-white text-black hover:bg-gray-100 border border-gray-300 shadow-sm font-bold" onClick={() => signup('test@google.com')} disabled={isLoading}>
              Google
            </Button>
          </div>

          <Typography variant="body2" className="text-center mt-8 text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </Typography>
        </Paper>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            "14-day free trial",
            "No credit card",
            "Cancel anytime"
          ].map((text, i) => (
            <div key={i} className="flex flex-col items-center">
              <CheckCircle2 size={16} className="text-success mb-1" />
              <Typography variant="caption" className="font-medium">{text}</Typography>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
