'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Download, Users, MousePointerClick, Globe2, ScanFace, FileSignature, MapPin, LayoutTemplate, Activity } from 'lucide-react';
import { ZeroDataView } from '@/src/components/dashboard/ZeroDataView';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { fetchDashboardAnalytics, DashboardAnalyticsResponse } from '@/src/lib/analytics-service';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Loader } from '@/src/components/ui/Loader';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Keep color constants
const DEVICE_COLORS: Record<string, string> = {
  'mobile': '#3b82f6',
  'desktop': '#10b981',
  'tablet': '#f59e0b',
  'other': '#94a3b8'
};

const BROWSER_COLORS: Record<string, string> = {
  'Chrome': '#10b981',
  'Safari': '#3b82f6',
  'Firefox': '#f59e0b',
  'Edge': '#8b5cf6',
  'Other': '#64748b'
};

const FUNNEL_COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--warning))', 'hsl(var(--success))'];

// --- Animation Variants ---
const containerVar = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVar = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState('30');
  const [isZeroData, setIsZeroData] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<DashboardAnalyticsResponse | null>(null);

  const dashboardRef = React.useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  const exportToPDF = async () => {
    if (!dashboardRef.current) return;
    try {
      setIsExporting(true);
      toast.loading('Capturing high-res dashboard snapshot...', { id: 'pdf-export' });

      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f8fafc',
        logging: false,
        onclone: (clonedDoc) => {
          // ─────────────────────────────────────────────────────────────────────────
          // THE REAL FIX:
          // html2canvas reads the raw text of every <style> tag in the cloned doc.
          // Tailwind 4 generates oklch() / oklab() / lab() color functions in those
          // stylesheets. html2canvas's CSS parser crashes on these.
          //
          // We must REWRITE the text content of every <style> tag using regex,
          // replacing all unsupported color functions with safe hex fallbacks
          // BEFORE html2canvas ever reads a single CSS declaration.
          // ─────────────────────────────────────────────────────────────────────────

          // Regex that matches: oklch(...), oklab(...), lab(...), color(display-p3 ...), lch(...)
          const modernColorRegex = /(?:oklch|oklab|lch|lab|color)\([^)]*\)/g;

          // A safe neutral fallback - dark slate for most text/borders
          const getFallback = (fullMatch: string): string => {
            // Heuristic: if value looks like it might be a background (very light),
            // return white; otherwise return a dark text-primaryriendly color
            return '#334155'; // slate-700 — safe for text, icons, borders
          };

          // Step 1: Sanitize all <style> tag text content (THE KEY FIX)
          const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
          styleTags.forEach((styleTag) => {
            if (styleTag.textContent && modernColorRegex.test(styleTag.textContent)) {
              styleTag.textContent = styleTag.textContent.replace(
                new RegExp(modernColorRegex.source, 'g'),
                getFallback
              );
            }
          });

          // Step 2: Sanitize inline style attributes on all elements
          const allElements = Array.from(clonedDoc.querySelectorAll('*')) as HTMLElement[];
          allElements.forEach((el) => {
            const inlineStyle = el.getAttribute('style');
            if (inlineStyle && new RegExp(modernColorRegex.source).test(inlineStyle)) {
              el.setAttribute('style', inlineStyle.replace(new RegExp(modernColorRegex.source, 'g'), getFallback));
            }

            // Step 3: Sanitize SVG presentation attributes (fill, stroke, etc.)
            const svgColorAttrs = ['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color'];
            svgColorAttrs.forEach((attr) => {
              const val = el.getAttribute(attr);
              if (val && new RegExp(modernColorRegex.source).test(val)) {
                if (attr === 'fill') el.setAttribute('fill', '#334155');
                else if (attr === 'stroke') el.setAttribute('stroke', '#334155');
                else el.removeAttribute(attr);
              }
            });
          });
        }

      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Calculate dimensions for A4 landscape
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`QRBold_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);

      toast.success('Successfully exported beautiful PDF!', { id: 'pdf-export' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF', { id: 'pdf-export' });
    } finally {
      setIsExporting(false);
    }
  };

  React.useEffect(() => {
    async function loadData() {
      if (isZeroData) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await fetchDashboardAnalytics(timeRange);
        setData(result);
      } catch (err: any) {
        toast.error("Failed to load analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [timeRange, isZeroData]);

  const metricsConfig = [
    { label: 'Total QR Scans', key: 'totalScans', icon: ScanFace, color: 'text-primary/90', bg: 'bg-primary/50/10' },
    { label: 'Unique Visitors', key: 'uniqueVisitors', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Forms Submitted', key: 'formSubmissions', icon: FileSignature, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Average Conversion', key: 'conversionRate', icon: MousePointerClick, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10" ref={dashboardRef}>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-accentxl font-black text-slate-800 tracking-tight">Analytics</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Real-time scanner intelligence and conversion tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => setIsZeroData(!isZeroData)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isZeroData ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            Zero State
          </button>
          <div className="w-px h-6 bg-slate-200" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 outline-none px-2 cursor-pointer hover:text-primary transition-colors"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <span className="w-4 h-4 rounded-full border-primary border-slate-700 border-t-transparent animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[60vh] flex flex-col items-center justify-center pt-10"
          >
            <Loader size={120} />
            <p className="text-xs font-black text-primary tracking-[0.2em] uppercase -mt-4 animate-pulse">Analyzing Scanner Data</p>
          </motion.div>
        ) : isZeroData || !data ? (
          <motion.div key="zero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ZeroDataView />
          </motion.div>
        ) : (
          <motion.div key="data" variants={containerVar as any} initial="hidden" animate="show" className="space-y-6">

            {/* METRICS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {metricsConfig.map((m, i) => {
                const Icon = m.icon;
                const metricData = (data.summary as any)[m.key];
                return (
                  <motion.div key={i} variants={itemVar as any} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/40 relative overflow-hidden group">
                    <div className={`absolute -right-6 -top-6 w-24 h-24 ${m.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className={`p-3 rounded-2xl ${m.bg} ${m.color}`}>
                        <Icon size={22} strokeWidth={2.5} />
                      </div>
                      <span className={`px-2.5 py-1 text-[11px] font-black rounded-full ${metricData.trend?.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {metricData.trend || '0%'}
                      </span>
                    </div>
                    <h3 className="text-slate-500 font-bold text-sm tracking-wide relative z-10">{m.label}</h3>
                    <div className="mt-1 flex items-baseline gap-2 relative z-10">
                      <span className="text-accentxl font-black text-slate-800 tracking-tight">{metricData.value}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CHARTS ROW 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Timeline Chart */}
              <motion.div variants={itemVar as any} className="lg:col-span-2 bg-white rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/40 p-6">
                <div className="flex justify-between mb-8">
                  <div>
                    <h2 className="text-lg font-black text-slate-800">Growth & Conversion Timeline</h2>
                    <p className="text-sm font-medium text-slate-400 mt-1">Scans vs Form Completions</p>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.charts.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', background: 'hsl(var(--card))' }}
                      />
                      <Area type="monotone" dataKey="scans" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorScans)" activeDot={{ r: 6, strokeWidth: 0 }} />
                      <Area type="monotone" dataKey="conversions" stroke="hsl(var(--success))" strokeWidth={4} fillOpacity={1} fill="url(#colorConv)" activeDot={{ r: 6, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Engagement Drop-off Funnel */}
              <motion.div variants={itemVar as any} className="bg-white rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/40 p-6 flex flex-col">
                <div className="mb-6">
                  <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><LayoutTemplate className="text-purple-500" size={20} /> Funnel Drop-off</h2>
                  <p className="text-sm font-medium text-slate-400 mt-1">User journey completion</p>
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.charts.funnel} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28}>
                        {data.charts.funnel.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

            </div>

            {/* CHARTS ROW 2: Maps and Geo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* REAL MAP - D3 Geo */}
              <motion.div variants={itemVar as any} className="lg:col-span-2 bg-[#f8fafc] rounded-[24px] border border-slate-200 shadow-lg shadow-slate-200/50 p-6 relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent h-32 pointer-events-none rounded-t-[24px]" />
                <div className="mb-2 relative z-10 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><Globe2 className="text-primary/90" size={22} /> Global Distribution Matrix</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Live topographic scan events</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex h-3 w-3 relative mt-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/70 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary/50"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live</span>
                  </div>
                </div>

                <div className="flex-1 w-full relative min-h-[350px]">
                  <ComposableMap projectionConfig={{ scale: 140 }} width={800} height={400} style={{ width: "100%", height: "100%" }}>
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#cbd5e1"
                            stroke="#f8fafc"
                            strokeWidth={0.5}
                            style={{ default: { outline: "none" }, hover: { fill: "#94a3b8", outline: "none" }, pressed: { outline: "none" } }}
                          />
                        ))
                      }
                    </Geographies>
                    {data.geography.map(({ name, coordinates, scans }) => (
                      <Marker key={name} coordinates={coordinates as [number, number]}>
                        <circle r={6} fill="hsl(var(--primary))" stroke="#fff" strokeWidth={2} />
                        <circle r={18} fill="hsl(var(--primary))" opacity={0.3} className="animate-pulse" />
                        <text textAnchor="middle" y={-14} style={{ fontFamily: "inherit", fontSize: "10px", fontWeight: "bold", fill: "#475569" }}>
                          {name}
                        </text>
                        <text textAnchor="middle" y={18} style={{ fontFamily: "inherit", fontSize: "8px", fontWeight: "bold", fill: "#3b82f6" }}>
                          {scans} scans
                        </text>
                      </Marker>
                    ))}
                  </ComposableMap>
                </div>
              </motion.div>

              {/* Leaderboard */}
              <motion.div variants={itemVar as any} className="bg-white rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/40 p-6 flex flex-col">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><MapPin className="text-emerald-500" size={20} /> Location Leaderboard</h2>
                    <p className="text-sm font-medium text-slate-400 mt-1">Ranking by scan volume</p>
                  </div>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto pr-2">
                  {data.geography.sort((a, b) => b.scans - a.scans).map((loc, i) => {
                    const max = data.geography.length > 0 ? Math.max(...data.geography.map(l => l.scans)) : 1;
                    const percent = (loc.scans / max) * 100;
                    return (
                      <div key={loc.name} className="relative group">
                        <div className="flex justify-between items-end mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xl w-6 drop-shadow-sm">{loc.flag}</span>
                            <span className="text-sm font-bold text-slate-700">{loc.name}</span>
                          </div>
                          <span className="text-sm font-black text-slate-800">{loc.scans.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                            className="h-full rounded-full bg-primary/50 relative overflow-hidden"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

            </div>

            {/* CHARTS ROW 3: Extra Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVar as any} className="bg-white rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/40 p-6 flex flex-col">
                <div className="mb-6">
                  <h2 className="text-lg font-black text-slate-800">Scanner Source</h2>
                  <p className="text-sm font-medium text-slate-400 mt-1">Where traffic originates (Apps)</p>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.distributions.devices} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" cornerRadius={6} stroke="none">
                        {data.distributions.devices.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={DEVICE_COLORS[entry.name as keyof typeof DEVICE_COLORS] || '#94a3b8'} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 px-2">
                  {data.distributions.devices.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DEVICE_COLORS[d.name as keyof typeof DEVICE_COLORS] || '#94a3b8' }} />
                      <span className="text-xs font-bold text-slate-600 capitalize">{d.name}</span>
                      <span className="text-[10px] font-black text-slate-400">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVar as any} className="bg-white rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/40 p-6 flex flex-col">
                <div className="mb-6">
                  <h2 className="text-lg font-black text-slate-800">Browser Environment</h2>
                  <p className="text-sm font-medium text-slate-400 mt-1">Context after scan</p>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.distributions.browsers} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" cornerRadius={6} stroke="none">
                        {data.distributions.browsers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={BROWSER_COLORS[entry.name as keyof typeof BROWSER_COLORS] || '#94a3b8'} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 px-2">
                  {data.distributions.browsers.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BROWSER_COLORS[d.name as keyof typeof BROWSER_COLORS] || '#94a3b8' }} />
                      <span className="text-xs font-bold text-slate-600">{d.name}</span>
                      <span className="text-[10px] font-black text-slate-400">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
