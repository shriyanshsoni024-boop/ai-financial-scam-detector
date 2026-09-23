import Link from 'next/link';
import { ShieldAlert, PhoneCall, ExternalLink, ArrowRight } from 'lucide-react';
import Hero from '@/components/Hero';
import Analyzer from '@/components/Analyzer';

export default function HomePage() {
  const scamTypes = [
    { title: 'Fake KYC Alerts', desc: 'Threatens immediate account block unless unverified KYC link is opened.' },
    { title: 'UPI PIN Inversion', desc: 'Deceptive QR codes or requests that debit funds instead of receiving money.' },
    { title: 'Bank Impersonation', desc: 'Spoofed notices mimicking SBI, HDFC, ICICI, or RBI official alerts.' },
    { title: 'Credential Phishing', desc: 'Cloned banking portals harvesting net-banking passwords and card CVVs.' },
    { title: 'High-Yield Investment', desc: 'Guaranteed 5x–10x daily returns and crypto VIP signal groups.' },
    { title: 'Task & Job Scams', desc: 'Part-time video liking or rating tasks demanding upfront deposits.' }
  ];

  const safetyDirectives = [
    {
      num: '01',
      title: 'Never Share OTP or PIN',
      desc: 'Banks and UPI apps never require an OTP or PIN to receive or claim money.'
    },
    {
      num: '02',
      title: 'Verify via Official Apps',
      desc: 'Never click embedded links. Always log into your official banking app directly.'
    },
    {
      num: '03',
      title: 'Reject Artificial Panic',
      desc: 'Urgent account suspension threats are classic social engineering tactics.'
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. HERO */}
      <Hero />

      {/* 2. LIVE SCANNER TERMINAL */}
      <section id="terminal" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b6ff00]" />
            <span className="text-xs font-semibold text-[#f2f2f2] uppercase tracking-wider">
              Diagnostic Scanner
            </span>
          </div>
          <span className="text-xs text-[#666666]">In-Memory Threat Analysis</span>
        </div>

        <Analyzer />
      </section>

      {/* 3. RECOGNIZED FRAUD PATTERNS */}
      <section id="threat-vectors" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#b6ff00] uppercase tracking-wider">
              Threat Vectors
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f2f2f2] tracking-tight">
              Recognized Fraud Signatures
            </h2>
          </div>
          <Link
            href="/threat-vectors"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#888888] hover:text-[#b6ff00] transition-colors"
          >
            <span>All Threat Vectors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scamTypes.map((st, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-[#0e0e0e] border border-white/5 space-y-2 hover:border-white/10 transition-colors"
            >
              <h3 className="text-sm font-bold text-[#f2f2f2] tracking-tight">
                {st.title}
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CORE SAFETY DIRECTIVES */}
      <section id="awareness" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#b6ff00] uppercase tracking-wider">
              Best Practices
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f2f2f2] tracking-tight">
              Core Security Directives
            </h2>
          </div>
          <Link
            href="/awareness"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#888888] hover:text-[#b6ff00] transition-colors"
          >
            <span>All Directives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {safetyDirectives.map((rule) => (
            <div key={rule.num} className="p-6 rounded-xl bg-[#0e0e0e] border border-white/5 space-y-3">
              <span className="text-xs font-mono font-bold text-[#b6ff00]">{rule.num}</span>
              <h3 className="text-sm font-bold text-[#f2f2f2] tracking-tight">
                {rule.title}
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HELPLINE & REPORTING */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-[#0e0e0e] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Suspect Financial Fraud?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#f2f2f2] tracking-tight">
              Report Immediately to National Authorities
            </h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              If money has been deducted or credentials were submitted, call the National Cyber Crime Helpline or lodge a complaint on the official government portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="tel:1930"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs font-bold rounded-full transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Dial 1930</span>
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#161616] hover:bg-[#222222] text-[#f2f2f2] text-xs font-semibold rounded-full border border-white/10 transition-colors"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#888888]" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
