'use client';

import * as React from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Button, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel 
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Calendar, Download, Filter } from 'lucide-react';

const scanData = [
  { name: 'Jan', scans: 4000 },
  { name: 'Feb', scans: 3000 },
  { name: 'Mar', scans: 2000 },
  { name: 'Apr', scans: 2780 },
  { name: 'May', scans: 1890 },
  { name: 'Jun', scans: 2390 },
  { name: 'Jul', scans: 3490 },
];

const deviceData = [
  { name: 'iPhone', value: 65 },
  { name: 'Android', value: 30 },
  { name: 'Desktop', value: 5 },
];

const locationData = [
  { name: 'USA', scans: 5400 },
  { name: 'UK', scans: 2100 },
  { name: 'Canada', scans: 1800 },
  { name: 'Germany', scans: 1200 },
  { name: 'Australia', scans: 900 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState('30');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Typography variant="h4" className="font-bold">Analytics</Typography>
          <Typography variant="body2" className="text-muted-foreground">
            Deep dive into your customer engagement and scan patterns.
          </Typography>
        </div>
        <div className="flex items-center space-x-3">
          <FormControl size="small" className="min-w-[150px]">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7">Last 7 Days</MenuItem>
              <MenuItem value="30">Last 30 Days</MenuItem>
              <MenuItem value="90">Last 90 Days</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Download size={18} />}>
            Export
          </Button>
        </div>
      </div>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper className="p-6 border shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h6" className="font-bold">Scan Trends</Typography>
              <div className="flex items-center space-x-2 text-success">
                <Typography variant="caption" className="font-bold">+14.2%</Typography>
                <Typography variant="caption" className="text-muted-foreground">vs prev. period</Typography>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scanData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper className="p-6 border shadow-sm rounded-xl h-full">
            <Typography variant="h6" className="font-bold mb-6">Device Breakdown</Typography>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {deviceData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[i] }} />
                    <Typography variant="body2">{item.name}</Typography>
                  </div>
                  <Typography variant="body2" className="font-bold">{item.value}%</Typography>
                </div>
              ))}
            </div>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper className="p-6 border shadow-sm rounded-xl">
            <Typography variant="h6" className="font-bold mb-6">Top Locations</Typography>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="scans" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper className="p-6 border shadow-sm rounded-xl">
            <Typography variant="h6" className="font-bold mb-6">Engagement Metrics</Typography>
            <div className="space-y-6">
              {[
                { label: 'Avg. Time on Page', value: '1m 24s', trend: '+12s' },
                { label: 'Bounce Rate', value: '32.4%', trend: '-4.1%' },
                { label: 'CTA Click Rate', value: '18.2%', trend: '+2.5%' },
                { label: 'Reorder Rate', value: '8.4%', trend: '+1.1%' },
              ].map((metric, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <Typography variant="caption" className="text-muted-foreground block">{metric.label}</Typography>
                    <Typography variant="h6" className="font-bold">{metric.value}</Typography>
                  </div>
                  <div className={metric.trend.startsWith('+') ? 'text-success' : 'text-destructive'}>
                    <Typography variant="caption" className="font-bold">{metric.trend}</Typography>
                  </div>
                </div>
              ))}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
