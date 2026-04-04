import {
  Layout,
  Play,
  ShieldCheck,
  Ticket,
  Zap,
  ChevronRight
} from 'lucide-react';

export function Features() {
  return (
    <section className="py-20" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-accentxl md:text-4xl font-bold mb-4">One QR Code. A Full Post-Purchase Experience.</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            With QRBold, your QR code becomes a mobile-first engagement page that drives loyalty and sales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[
            { title: "Teaches Usage", desc: "Teaches customers how to use your product correctly", icon: Layout },
            { title: "Video Tutorials", desc: "Shows a short video tutorial to reduce support tickets", icon: Play },
            { title: "Builds Trust", desc: "Builds trust with certifications and reviews", icon: ShieldCheck },
            { title: "Exclusive Offers", desc: "Offers a discount on their next order", icon: Ticket },
            { title: "Instant Reorder", desc: "Links directly to your store for instant reorder", icon: Zap }
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-primary/5 rounded-2xl p-8 md:p-12 border border-primary/10">
          <h3 className="text-primaryxl font-bold text-center mb-10">The flow is simple:</h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
            {[
              "You create your product (5 min)",
              "We generate your QR code",
              "Customer scans the QR on packaging",
              "They see usage guide + video + offer",
              "They reorder with a discount code"
            ].map((step, i, arr) => (
              <div key={i} className="flex flex-col items-center text-center flex-1 relative">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4 z-10">
                  {i + 1}
                </div>
                <p className="text-sm font-medium">{step}</p>
                {i < arr.length - 1 && (
                  <ChevronRight className="hidden md:block absolute -right-4 top-3 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
