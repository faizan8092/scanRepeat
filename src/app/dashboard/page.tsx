'use client';

import * as React from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Button, 
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton
} from '@mui/material';
import { 
  TrendingUp, 
  Users, 
  QrCode, 
  ArrowUpRight, 
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Mon', scans: 400 },
  { name: 'Tue', scans: 300 },
  { name: 'Wed', scans: 600 },
  { name: 'Thu', scans: 800 },
  { name: 'Fri', scans: 500 },
  { name: 'Sat', scans: 900 },
  { name: 'Sun', scans: 700 },
];

const products = [
  { id: 1, name: 'Whey Protein 1kg', scans: 1240, conversion: '12%', status: 'Active' },
  { id: 2, name: 'Pre-Workout Blast', scans: 850, conversion: '8%', status: 'Active' },
  { id: 3, name: 'Creatine Monohydrate', scans: 420, conversion: '15%', status: 'Draft' },
  { id: 4, name: 'BCAA Recovery', scans: 310, conversion: '5%', status: 'Active' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h4" className="font-bold">Dashboard</Typography>
          <Typography variant="body2" className="text-muted-foreground">
            Welcome back! Here's what's happening with your products today.
          </Typography>
        </div>
        <Button variant="contained" className="bg-primary hover:bg-primary/90 font-bold">
          Export Report
        </Button>
      </div>

      <Grid container spacing={4}>
        {[
          { label: 'Total Scans', value: '12,482', trend: '+12.5%', icon: QrCode, color: 'primary' },
          { label: 'Active Products', value: '24', trend: '+2', icon: TrendingUp, color: 'success' },
          { label: 'Total Customers', value: '8,241', trend: '+8.2%', icon: Users, color: 'info' },
          { label: 'Avg. Conversion', value: '10.4%', trend: '+1.2%', icon: ArrowUpRight, color: 'warning' },
        ].map((stat, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Paper className="p-6 border shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color}/10 text-${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <Typography variant="caption" className="text-success font-bold">{stat.trend}</Typography>
              </div>
              <Typography variant="h5" className="font-bold">{stat.value}</Typography>
              <Typography variant="caption" className="text-muted-foreground">{stat.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper className="p-6 border shadow-sm rounded-xl h-[400px]">
            <Typography variant="h6" className="font-bold mb-6">Scan Activity</Typography>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper className="p-6 border shadow-sm rounded-xl h-[400px] flex flex-col">
            <Typography variant="h6" className="font-bold mb-6">Usage Limits</Typography>
            <div className="space-y-6 flex-1">
              <div>
                <div className="flex justify-between mb-2">
                  <Typography variant="body2" className="font-medium">QR Codes</Typography>
                  <Typography variant="caption">24 / 100</Typography>
                </div>
                <LinearProgress variant="determinate" value={24} className="h-2 rounded-full" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Typography variant="body2" className="font-medium">Monthly Scans</Typography>
                  <Typography variant="caption">12,482 / 50,000</Typography>
                </div>
                <LinearProgress variant="determinate" value={25} className="h-2 rounded-full" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Typography variant="body2" className="font-medium">Storage</Typography>
                  <Typography variant="caption">1.2GB / 5GB</Typography>
                </div>
                <LinearProgress variant="determinate" value={24} className="h-2 rounded-full" />
              </div>
            </div>
            <Button variant="outlined" fullWidth className="mt-auto">Upgrade Plan</Button>
          </Paper>
        </Grid>
      </Grid>

      <Paper className="border shadow-sm rounded-xl overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <Typography variant="h6" className="font-bold">Recent Products</Typography>
          <Button size="small" endIcon={<ExternalLink size={14} />}>View All</Button>
        </div>
        <TableContainer>
          <Table>
            <TableHead className="bg-secondary/30">
              <TableRow>
                <TableCell className="font-bold">Product Name</TableCell>
                <TableCell className="font-bold">Total Scans</TableCell>
                <TableCell className="font-bold">Conversion</TableCell>
                <TableCell className="font-bold">Status</TableCell>
                <TableCell className="font-bold" align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.scans.toLocaleString()}</TableCell>
                  <TableCell>{product.conversion}</TableCell>
                  <TableCell>
                    <Chip 
                      label={product.status} 
                      size="small" 
                      className={product.status === 'Active' ? 'bg-success/10 text-success font-bold' : 'bg-warning/10 text-warning font-bold'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <MoreHorizontal size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
