import { CheckCircle2, Package, Play, Smartphone } from 'lucide-react';

export function LiveExample() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 leading-tight">See What Your Customer Sees</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              This is the mobile-first experience your customers get when they scan your product. No apps to download, no friction.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-success mr-3 mt-0.5" />
                <span className="font-medium">Customizable usage guides</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-success mr-3 mt-0.5" />
                <span className="font-medium">Embedded video tutorials</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-success mr-3 mt-0.5" />
                <span className="font-medium">One-tap reorder buttons</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            {/* Phone Mockup */}
            <div className="relative w-[300px] h-[600px] bg-zinc-900 rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-20"></div>
              <div className="absolute inset-0 bg-white overflow-y-auto pt-10 px-4 pb-4">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="h-6 w-6 text-primary" />
                  <h4 className="font-bold text-lg text-black">Whey Protein — Usage Guide</h4>
                </div>
                
                <div className="space-y-3 mb-6 text-black">
                  <div className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 text-success mr-2" /> <strong>Best time:</strong> Post workout</div>
                  <div className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 text-success mr-2" /> <strong>Dosage:</strong> 1 scoop (30g)</div>
                  <div className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 text-success mr-2" /> <strong>Mix with:</strong> 250ml cold water</div>
                  <div className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 text-success mr-2" /> <strong>Tip:</strong> Shake for 20 seconds</div>
                </div>

                <div className="aspect-video bg-zinc-100 rounded-lg flex items-center justify-center mb-6 relative group cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg">
                    <Play className="h-6 w-6 fill-current" />
                  </div>
                  <span className="absolute bottom-2 right-2 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded">0:30</span>
                </div>

                <hr className="mb-6 border-zinc-200" />
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-[10px] bg-success/10 text-success px-2 py-1 rounded-full font-bold">✅ Lab Tested</span>
                  <span className="text-[10px] bg-success/10 text-success px-2 py-1 rounded-full font-bold">✅ GMP Certified</span>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-center mb-4">
                  <span className="text-xl mb-1 block">🎁</span>
                  <p className="text-xs font-bold mb-1 text-black">Get 20% Off Your Next Refill</p>
                  <p className="text-[10px] text-muted-foreground mb-3">Code auto-applied at checkout</p>
                  <button className="w-full bg-primary text-white text-xs py-2 rounded-lg font-bold">Claim My Discount</button>
                </div>

                <button className="w-full border-2 border-primary text-primary text-xs py-2 rounded-lg font-bold flex items-center justify-center">
                  <Smartphone className="h-3 w-3 mr-2" /> Buy Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
