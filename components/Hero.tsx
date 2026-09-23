import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-20 pb-16 sm:pt-28 sm:pb-20 border-b border-[#292929]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Small label */}
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-[#b6ff00]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#888888]">
            DIGITAL FINANCIAL SECURITY
          </span>
        </div>

        {/* Huge bold headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#f2f2f2] uppercase tracking-tight leading-[0.92] max-w-5xl">
          CHECK BEFORE<br />
          YOU CLICK.
        </h1>

        {/* Short one-line description */}
        <p className="text-sm sm:text-base text-[#888888] max-w-xl font-mono leading-relaxed">
          Pre-transaction threat intelligence for suspicious SMS, fake KYC, UPI requests, and phishing links.
        </p>

        {/* CTA Button */}
        <div className="pt-2">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-colors"
          >
            <span>ANALYZE MESSAGE</span>
            <ArrowRight className="w-4 h-4 text-[#050505]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
