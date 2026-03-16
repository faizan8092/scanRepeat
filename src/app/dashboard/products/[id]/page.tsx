'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  TextField, 
  Box, 
  IconButton, 
  Breadcrumbs,
  Divider,
  Switch,
  FormControlLabel,
  Card,
  CardContent
} from '@mui/material';
import { 
  ArrowLeft, 
  Save, 
  QrCode as QrIcon, 
  ExternalLink, 
  Eye, 
  Copy,
  Download,
  Trash2,
  Video,
  Layout,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function ProductEditPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = React.useState({
    name: 'Whey Protein 1kg',
    category: 'Supplements',
    reorderUrl: 'https://mystore.com/products/whey-protein-1kg',
    videoUrl: 'https://youtube.com/watch?v=example',
    discountCode: 'REORDER20',
    instructions: 'Mix 1 scoop with 250ml of cold water. Shake well for 20 seconds. Best consumed post-workout.',
    isActive: true
  });

  const publicUrl = `https://scanrepeat.com/p/${params.id}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/dashboard/products" className="text-muted-foreground hover:text-primary flex items-center">
            <ArrowLeft size={14} className="mr-1" /> Products
          </Link>
          <Typography color="text.primary" className="font-medium">{product.name}</Typography>
        </Breadcrumbs>
        
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h4" className="font-bold">{product.name}</Typography>
            <Typography variant="body2" className="text-muted-foreground">
              Editing product ID: PRD-{params.id}
            </Typography>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outlined" startIcon={<Trash2 size={18} />} color="error">
              Delete
            </Button>
            <Button variant="contained" startIcon={<Save size={18} />} className="bg-primary">
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <div className="space-y-6">
            <Paper className="p-6 border shadow-sm rounded-xl">
              <Typography variant="h6" className="font-bold mb-6 flex items-center">
                <Layout size={20} className="mr-2 text-primary" /> General Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Product Name" 
                    value={product.name} 
                    onChange={(e) => setProduct({...product, name: e.target.value})} 
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Category" 
                    value={product.category} 
                    onChange={(e) => setProduct({...product, category: e.target.value})} 
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField 
                    fullWidth 
                    label="Reorder URL" 
                    value={product.reorderUrl} 
                    onChange={(e) => setProduct({...product, reorderUrl: e.target.value})} 
                    placeholder="https://..."
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper className="p-6 border shadow-sm rounded-xl">
              <Typography variant="h6" className="font-bold mb-6 flex items-center">
                <Video size={20} className="mr-2 text-primary" /> Content & Engagement
              </Typography>
              <div className="space-y-6">
                <TextField 
                  fullWidth 
                  label="Video Tutorial URL" 
                  value={product.videoUrl} 
                  onChange={(e) => setProduct({...product, videoUrl: e.target.value})} 
                  placeholder="YouTube or Vimeo link"
                />
                <TextField 
                  fullWidth 
                  label="Discount Code" 
                  value={product.discountCode} 
                  onChange={(e) => setProduct({...product, discountCode: e.target.value})} 
                />
                <TextField 
                  fullWidth 
                  label="Usage Instructions" 
                  multiline 
                  rows={4} 
                  value={product.instructions} 
                  onChange={(e) => setProduct({...product, instructions: e.target.value})} 
                />
              </div>
            </Paper>

            <Paper className="p-6 border shadow-sm rounded-xl">
              <Typography variant="h6" className="font-bold mb-6 flex items-center">
                <MessageSquare size={20} className="mr-2 text-primary" /> Advanced Settings
              </Typography>
              <div className="space-y-4">
                <FormControlLabel
                  control={<Switch checked={product.isActive} onChange={(e) => setProduct({...product, isActive: e.target.checked})} color="primary" />}
                  label={
                    <div>
                      <Typography variant="body1" className="font-medium">Active Status</Typography>
                      <Typography variant="caption" className="text-muted-foreground">When disabled, the QR code will show a "Coming Soon" page.</Typography>
                    </div>
                  }
                />
                <Divider />
                <FormControlLabel
                  control={<Switch defaultChecked color="primary" />}
                  label={
                    <div>
                      <Typography variant="body1" className="font-medium">Enable Analytics</Typography>
                      <Typography variant="caption" className="text-muted-foreground">Track scans, locations, and device types.</Typography>
                    </div>
                  }
                />
              </div>
            </Paper>
          </div>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <div className="sticky top-24 space-y-6">
            <Card className="border shadow-sm rounded-xl overflow-hidden">
              <div className="bg-primary/10 p-4 flex items-center justify-between border-b">
                <Typography variant="subtitle2" className="font-bold flex items-center">
                  <QrIcon size={16} className="mr-2" /> QR Code
                </Typography>
                <div className="flex space-x-1">
                  <IconButton size="small"><Download size={14} /></IconButton>
                  <IconButton size="small"><Copy size={14} /></IconButton>
                </div>
              </div>
              <CardContent className="flex flex-col items-center p-8">
                <div className="p-4 bg-white rounded-2xl shadow-inner border mb-6">
                  <QRCodeSVG value={publicUrl} size={180} />
                </div>
                <Typography variant="caption" className="text-muted-foreground text-center mb-4">
                  Scan this code to preview the customer experience.
                </Typography>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<ExternalLink size={16} />}
                  component={Link}
                  href={`/p/${params.id}`}
                  target="_blank"
                >
                  Live Preview
                </Button>
              </CardContent>
            </Card>

            <Paper className="p-6 border shadow-sm rounded-xl bg-secondary/30">
              <Typography variant="subtitle2" className="font-bold mb-4">Quick Tips</Typography>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle2 size={14} className="mr-2 mt-1 text-success" />
                  Use high-contrast QR codes for better scanning.
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={14} className="mr-2 mt-1 text-success" />
                  Keep instructions concise for mobile reading.
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={14} className="mr-2 mt-1 text-success" />
                  A 20% discount is the sweet spot for reorders.
                </li>
              </ul>
            </Paper>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
