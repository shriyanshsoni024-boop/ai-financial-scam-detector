import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-white/10 text-xs text-[#888888]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b6ff00]" />
          <span className="font-medium text-[#d1d1d1]">Financial Fraud Prevention</span>
        </div>

        {/* Editorial headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#f2f2f2] tracking-tight leading-[1.05] max-w-4xl">
          Check before <br />
          you click.
        </h1>

        {/* 1-line description */}
        <p className="text-base sm:text-lg text-[#888888] max-w-xl font-normal leading-relaxed">
          Instant threat intelligence for suspicious payment requests, fake KYC notices, and phishing links before credentials or OTPs are compromised.
        </p>

        {/* CTA Button */}
        <div className="pt-2 flex flex-wrap items-center gap-4">
          <Link
            href="#terminal"
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-sm font-semibold rounded-full transition-all hover:scale-[1.02]"
          >
            <span>Start Free Scan</span>
            <ArrowRight className="w-4 h-4 text-[#050505]" />
          </Link>

          <div className="flex items-center gap-2 text-xs text-[#666666]">
            <ShieldCheck className="w-4 h-4 text-[#b6ff00]" />
            <span>In-memory evaluation · Zero credential storage</span>
          </div>
        </div>
      </div>
    </section>
  );
}
