'use client';

import * as React from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Tab,
  Tabs,
  Chip
} from '@mui/material';
import { User, Bell, CreditCard, Shield, Globe, Save } from 'lucide-react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="space-y-8">
      <div>
        <Typography variant="h4" className="font-bold">Settings</Typography>
        <Typography variant="body2" className="text-muted-foreground">
          Manage your account, team, and billing preferences.
        </Typography>
      </div>

      <Paper className="border shadow-sm rounded-xl overflow-hidden">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs value={value} onChange={handleChange} aria-label="settings tabs">
            <Tab icon={<User size={18} />} iconPosition="start" label="Profile" className="min-h-[64px]" />
            <Tab icon={<Bell size={18} />} iconPosition="start" label="Notifications" className="min-h-[64px]" />
            <Tab icon={<CreditCard size={18} />} iconPosition="start" label="Billing" className="min-h-[64px]" />
            <Tab icon={<Shield size={18} />} iconPosition="start" label="Security" className="min-h-[64px]" />
          </Tabs>
        </Box>

        <div className="px-8">
          <CustomTabPanel value={value} index={0}>
            <div className="max-w-2xl space-y-8">
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24 bg-primary/20 text-primary text-2xl font-bold">AF</Avatar>
                <div>
                  <Button variant="outlined" size="small" className="mb-2">Change Avatar</Button>
                  <Typography variant="caption" className="block text-muted-foreground">
                    JPG, GIF or PNG. Max size of 800K
                  </Typography>
                </div>
              </div>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="First Name" defaultValue="Ali" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Last Name" defaultValue="Faizan" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Email Address" defaultValue="ali@example.com" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Company Name" defaultValue="ScanRepeat Inc." variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Bio"
                    multiline
                    rows={4}
                    defaultValue="Helping brands connect with their customers through smart packaging."
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <div className="flex justify-end">
                <Button variant="contained" startIcon={<Save size={18} />} className="bg-primary px-8">
                  Save Changes
                </Button>
              </div>
            </div>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <div className="max-w-2xl space-y-6">
              <Typography variant="h6" className="font-bold">Email Notifications</Typography>
              <div className="space-y-4">
                {[
                  { title: 'Weekly Analytics Report', desc: 'Get a summary of your product performance every Monday.' },
                  { title: 'Scan Threshold Alerts', desc: 'Notify me when a product reaches 1,000 scans.' },
                  { title: 'New Customer Insights', desc: 'Alert me when we detect a new high-value customer segment.' },
                  { title: 'Billing & Invoices', desc: 'Receive invoices and billing related updates.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Typography variant="body1" className="font-medium">{item.title}</Typography>
                      <Typography variant="caption" className="text-muted-foreground">{item.desc}</Typography>
                    </div>
                    <Switch defaultChecked color="primary" />
                  </div>
                ))}
              </div>
            </div>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={2}>
            <div className="max-w-2xl space-y-8">
              <Paper className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Typography variant="caption" className="text-primary font-bold uppercase tracking-wider">Current Plan</Typography>
                    <Typography variant="h5" className="font-bold">Growth Plan</Typography>
                  </div>
                  <Chip label="Active" color="success" size="small" className="font-bold" />
                </div>
                <Typography variant="body2" className="text-muted-foreground mb-6">
                  Your next billing date is April 14, 2026 for $29.00.
                </Typography>
                <div className="flex space-x-3">
                  <Button variant="contained" className="bg-primary">Upgrade Plan</Button>
                  <Button variant="outlined">Cancel Subscription</Button>
                </div>
              </Paper>

              <Typography variant="h6" className="font-bold">Payment Methods</Typography>
              <div className="p-4 border rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-8 bg-secondary rounded flex items-center justify-center font-bold text-xs italic">VISA</div>
                  <div>
                    <Typography variant="body2" className="font-bold">Visa ending in 4242</Typography>
                    <Typography variant="caption" className="text-muted-foreground">Expires 12/26</Typography>
                  </div>
                </div>
                <Button size="small">Edit</Button>
              </div>
            </div>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={3}>
            <div className="max-w-2xl space-y-8">
              <Typography variant="h6" className="font-bold">Password</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth type="password" label="Current Password" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth type="password" label="New Password" variant="outlined" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth type="password" label="Confirm New Password" variant="outlined" />
                </Grid>
              </Grid>
              <Button variant="contained" className="bg-primary">Update Password</Button>

              <Divider />

              <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-xl">
                <Typography variant="h6" className="font-bold text-destructive mb-2">Delete Account</Typography>
                <Typography variant="body2" className="text-muted-foreground mb-6">
                  Once you delete your account, there is no going back. Please be certain.
                </Typography>
                <Button variant="contained" className="bg-destructive hover:bg-destructive/90">
                  Delete Account
                </Button>
              </div>
            </div>
          </CustomTabPanel>
        </div>
      </Paper>
    </div>
  );
}
