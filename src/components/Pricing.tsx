import { CheckCircle2 } from 'lucide-react';

export function Pricing() {
  return (
    <section className="py-20" id="pricing">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing. No Surprises.</h2>
        <p className="text-center text-muted-foreground mb-16">All plans include a 14-day free trial. No credit card required.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Starter", price: "9", qrs: "10", video: false, branding: false },
            { name: "Growth", price: "29", qrs: "100", video: true, branding: false, popular: true },
            { name: "Business", price: "79", qrs: "Unlimited", video: true, branding: true }
          ].map((plan, i) => (
            <div key={i} className={`relative p-8 rounded-2xl border ${plan.popular ? 'border-primary shadow-xl scale-105 z-10 bg-card' : 'bg-card shadow-sm'}`}>
              {plan.popular && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-success mr-2" /> <strong>{plan.qrs}</strong> QR Codes</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-success mr-2" /> Scan Analytics</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-success mr-2" /> Discount Codes</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-success mr-2" /> Reorder Links</li>
                <li className={`flex items-center ${!plan.video ? 'text-muted-foreground/50' : ''}`}>
                  {plan.video ? <CheckCircle2 className="h-4 w-4 text-success mr-2" /> : <span className="mr-6"></span>} Video Embed
                </li>
                <li className={`flex items-center ${!plan.branding ? 'text-muted-foreground/50' : ''}`}>
                  {plan.branding ? <CheckCircle2 className="h-4 w-4 text-success mr-2" /> : <span className="mr-6"></span>} Custom Branding
                </li>
              </ul>
              <button className={`w-full py-3 rounded-lg font-bold transition-colors ${plan.popular ? 'bg-primary text-white hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                Start Free
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
