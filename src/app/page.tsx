import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { Hero } from '@/src/components/Hero';
import { Features } from '@/src/components/Features';
import { Pricing } from '@/src/components/Pricing';
import { LiveExample } from '@/src/components/LiveExample';
import Link from 'next/link';
import { 
  CheckCircle2, 
  QrCode, 
  Layout, 
  Link2, 
  Ticket, 
  BarChart3 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <Hero />

        {/* Section 2 — The Problem */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Most Product QR Codes Are a Wasted Opportunity</h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Every product you ship has a QR code. Most of them link to a homepage your customer closes in 3 seconds.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                {[
                  "No usage guide",
                  "No video",
                  "No reason to come back",
                  "No reorder path"
                ].map((item, i) => (
                  <div key={i} className="flex items-center p-4 bg-card rounded-lg border shadow-sm">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      <span className="text-lg font-bold">×</span>
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-12 text-xl font-semibold">
                You spent money acquiring that customer. The QR code should bring them back.
              </p>
            </div>
          </div>
        </section>

        <Features />
        
        <LiveExample />

        {/* Section 5 — Features List */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Everything You Need. Nothing You Don't.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "QR Code Generator", desc: "Instant QR for every product (PNG + SVG download)", icon: QrCode },
                { title: "Engagement Page", desc: "Mobile-first page with guide, video, and trust badges", icon: Layout },
                { title: "Reorder Links", desc: "Direct link to your Shopify, Amazon, or any store URL", icon: Link2 },
                { title: "Discount Codes", desc: "Auto-show discount on scan to drive repeat purchase", icon: Ticket },
                { title: "Scan Analytics", desc: "See total scans, top countries, and device breakdown", icon: BarChart3 }
              ].map((feature, i) => (
                <div key={i} className="flex items-start p-6 bg-card rounded-xl border shadow-sm">
                  <div className="mr-4 p-3 bg-primary/10 rounded-lg text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6 — Who Is This For? */}
        <section className="py-20 bg-zinc-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Built for Product Brands Who Ship Physical Goods</h2>
              <p className="text-lg text-zinc-400 mb-12">
                If your product has packaging, you can put a ScanRepeat QR on it.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  "💊 Supplements",
                  "🧴 Skincare",
                  "🫙 Food & Bev",
                  "🧹 Home Care",
                  "🐾 Pet Care",
                  "📦 E-commerce"
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 font-medium">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Pricing />

        {/* Section 8 — FAQ */}
        <section className="py-20 bg-secondary/30" id="faq">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Questions We Get Asked</h2>
            <div className="space-y-6">
              {[
                { q: "Do I need to reprint my packaging?", a: "No. If you already have a QR code on packaging, you can point it to your ScanRepeat page. For new runs, just print our generated QR." },
                { q: "Does it work with Shopify?", a: "Yes. Paste your Shopify product URL as the reorder link — it works with any store URL." },
                { q: "How long does setup take?", a: "Under 5 minutes. Create product → fill in details → download QR → done." },
                { q: "Can I track who scanned?", a: "Yes. Your dashboard shows total scans, location, and device data for every QR code." },
                { q: "What if I have more than one product?", a: "Each product gets its own QR code and its own engagement page. Manage all from one dashboard." }
              ].map((faq, i) => (
                <div key={i} className="p-6 bg-card rounded-xl border shadow-sm">
                  <h4 className="font-bold mb-2">{faq.q}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Your Next Sale Is One Scan Away</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Stop sending customers to a homepage they ignore. Start sending them to an experience that makes them come back.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-bold text-primary shadow-xl transition-transform hover:scale-105"
            >
              Create Your First Product QR — Free for 14 Days
            </Link>
            <p className="mt-6 text-sm opacity-80">No credit card required. Cancel anytime.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
