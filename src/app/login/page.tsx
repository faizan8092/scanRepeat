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
  InputAdornment
} from '@mui/material';
import { QrCode, Eye, EyeOff, Apple, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/src/lib/auth-context';

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <Container maxWidth="sm">
        <Paper className="p-8 md:p-12 shadow-xl rounded-2xl border">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <QrCode className="h-8 w-8 text-primary" />
              <span className="font-tektur text-2xl font-bold tracking-tight">ScanRepeat</span>
            </Link>
            <Typography variant="h4" className="font-bold mb-2">Welcome Back</Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access your account
            </Typography>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
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
            
            <div className="flex justify-end">
              <Link href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 py-3 font-bold"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Sign In'}
            </Button>
          </form>

          <div className="my-8 flex items-center">
            <Divider className="flex-1" />
            <Typography variant="caption" color="text.secondary" className="px-4">
              OR CONTINUE WITH
            </Typography>
            <Divider className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outlined" startIcon={<Apple size={20} />} className="py-2.5" onClick={() => login('test@apple.com')} disabled={isLoading}>
              Apple
            </Button>
            <Button variant="contained" startIcon={<Mail size={20} />} className="py-2.5 bg-white text-black hover:bg-gray-100 border border-gray-300 shadow-sm font-bold" onClick={() => login('test@google.com')} disabled={isLoading}>
              Google
            </Button>
          </div>

          <Typography variant="body2" className="text-center mt-8 text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Sign up
            </Link>
          </Typography>
        </Paper>
      </Container>
    </div>
  );
}
