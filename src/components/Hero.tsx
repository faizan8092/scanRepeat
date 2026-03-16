import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-tektur text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
          Turn Your Product Packaging Into a <span className="text-primary">Repeat Purchase Funnel</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Add a QR code to your product. Customers scan it, learn how to use your product, and reorder — all in one tap.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-[#16A34A] px-8 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            <ArrowRight className="mr-2 h-5 w-5" /> Create Your First Product QR — It's Free
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-success" /> No coding needed</span>
          <span className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-success" /> Setup in 5 minutes</span>
          <span className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-success" /> Works on any product</span>
        </div>
      </div>
    </section>
  );
}
