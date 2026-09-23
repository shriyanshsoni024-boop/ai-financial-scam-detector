'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, AlertOctagon } from 'lucide-react';
import Hero from '@/components/Hero';
import Analyzer from '@/components/Analyzer';
import RiskBadge from '@/components/RiskBadge';

export default function HomePage() {
  const scamTypes = [
    { num: '01', title: 'FAKE KYC', desc: 'Account suspension threats demanding urgent external KYC verification.' },
    { num: '02', title: 'BANK IMPERSONATION', desc: 'Spoofed communications mimicking SBI, HDFC, ICICI, or RBI.' },
    { num: '03', title: 'UPI / PAYMENT SCAM', desc: 'Deceptive QR codes or collect requests that debit instead of credit.' },
    { num: '04', title: 'PHISHING', desc: 'Cloned web portals harvesting net-banking credentials and CVV codes.' },
    { num: '05', title: 'FAKE CUSTOMER SUPPORT', desc: 'Fraudulent helpline ads instructing remote access tool installation.' },
    { num: '06', title: 'INVESTMENT SCAM', desc: 'Guaranteed 5x–10x multipliers and Telegram VIP crypto trading groups.' },
    { num: '07', title: 'JOB / TASK SCAM', desc: 'Part-time video liking or review tasks demanding registration deposits.' },
    { num: '08', title: 'LOAN SCAM', desc: 'Instant low-interest loan apps demanding upfront processing fees.' }
  ];

  const safetyDirectives = [
    {
      num: '01',
      title: 'NEVER SHARE OTP',
      desc: 'Banks and UPI services never request OTPs or PINs to receive money.'
    },
    {
      num: '02',
      title: 'USE OFFICIAL APPS',
      desc: 'Verify claims exclusively inside your official mobile banking application.'
    },
    {
      num: '03',
      title: 'REJECT URGENCY',
      desc: 'Artificial block deadlines and panic coercion are direct signatures of fraud.'
    }
  ];

  return (
    <div className="space-y-28 sm:space-y-36 pb-28 font-mono">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. LIVE DIAGNOSTIC TERMINAL */}
      <section id="terminal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#292929] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[#b6ff00]" />
            <span className="text-xs uppercase tracking-widest text-[#888888] font-bold">
              DIAGNOSTIC TERMINAL
            </span>
          </div>
          <span className="text-xs text-[#666666]">SENTINELSHIELD / V1.0</span>
        </div>

        <Analyzer />
      </section>

      {/* 3. TRUST STRIP */}
      <section className="w-full border-y border-[#292929] bg-[#0a0a0a] py-6 sm:py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-8 text-xs font-bold tracking-widest uppercase text-[#888888]">
            <span className="text-[#f2f2f2] hover:text-[#b6ff00] transition-colors">TEXT ANALYSIS</span>
            <span className="text-[#292929]">/</span>
            <span className="text-[#f2f2f2] hover:text-[#b6ff00] transition-colors">SCREENSHOT OCR</span>
            <span className="text-[#292929]">/</span>
            <span className="text-[#f2f2f2] hover:text-[#b6ff00] transition-colors">URL DETECTION</span>
            <span className="text-[#292929]">/</span>
            <span className="text-[#f2f2f2] hover:text-[#b6ff00] transition-colors">EXPLAINABLE RISK</span>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex items-center gap-2.5 border-b border-[#292929] pb-4">
          <div className="w-2 h-2 bg-[#b6ff00]" />
          <span className="text-xs uppercase tracking-widest text-[#888888] font-bold">
            HOW IT WORKS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-[#111111] border border-[#292929] space-y-3">
            <span className="text-3xl font-black text-[#b6ff00]">01</span>
            <h3 className="text-sm font-bold text-[#f2f2f2] uppercase tracking-wider">
              SUBMIT
            </h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Paste message text or upload suspicious screenshot.
            </p>
          </div>

          <div className="p-6 bg-[#111111] border border-[#292929] space-y-3">
            <span className="text-3xl font-black text-[#b6ff00]">02</span>
            <h3 className="text-sm font-bold text-[#f2f2f2] uppercase tracking-wider">
              ANALYZE
            </h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Heuristic engine evaluates coercion and credentials in memory.
            </p>
          </div>

          <div className="p-6 bg-[#111111] border border-[#292929] space-y-3">
            <span className="text-3xl font-black text-[#b6ff00]">03</span>
            <h3 className="text-sm font-bold text-[#f2f2f2] uppercase tracking-wider">
              DIAGNOSE
            </h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Inspect transparent risk scores and numbered red flags.
            </p>
          </div>

          <div className="p-6 bg-[#111111] border border-[#292929] space-y-3">
            <span className="text-3xl font-black text-[#b6ff00]">04</span>
            <h3 className="text-sm font-bold text-[#f2f2f2] uppercase tracking-wider">
              CONTAIN
            </h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Follow recommended containment steps and avoid trap actions.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1.5 border-b border-[#292929] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[#b6ff00]" />
            <span className="text-xs uppercase tracking-widest text-[#888888] font-bold">
              PRODUCT DEMONSTRATION
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#f2f2f2]">
            SECURITY ASSESSMENT UI
          </h2>
        </div>

        {/* Realistic Assessment Preview Box */}
        <div className="p-6 sm:p-8 bg-[#111111] border border-red-500/50 space-y-6">
          {/* Header */}
          <div className="space-y-3 border-b border-[#292929] pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#888888] font-bold">
                EVALUATION OUTPUT
              </span>
              <span className="text-xs text-[#666666]">SAMPLE RESULT</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <RiskBadge level="HIGH_RISK" size="lg" />
              <span className="text-[#3d3d3d]">/</span>
              <span className="text-base sm:text-xl font-bold text-[#f2f2f2] uppercase tracking-wide">
                UPI / PAYMENT SCAM
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
              Payment inversion trap. Requests UPI PIN entry or QR scan under the pretext of receiving money.
            </p>
          </div>

          {/* Risk Score */}
          <div className="p-4 bg-[#0a0a0a] border border-[#292929] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#f2f2f2] font-bold uppercase tracking-wider">Risk indicator score</span>
              <span className="text-red-400 font-black">92 / 100</span>
            </div>
            <div className="w-full h-1.5 bg-[#1b1b1b] overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: '92%' }} />
            </div>
          </div>

          {/* Top 3 Red Flags */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-[#888888] font-bold border-b border-[#292929] pb-2">
              TOP THREAT INDICATORS (03)
            </div>

            <div className="divide-y divide-[#292929]">
              <div className="py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#f2f2f2]">
                    <strong className="text-[#b6ff00] mr-2">01</strong>UPI PIN INVERSION TRAP
                  </span>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 border text-red-400 border-red-500/50 bg-[#0a0a0a]">
                    HIGH
                  </span>
                </div>
                <p className="text-xs text-[#888888] pl-6">
                  Entering a UPI PIN authorizes outgoing debits, never incoming credits.
                </p>
              </div>

              <div className="py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#f2f2f2]">
                    <strong className="text-[#b6ff00] mr-2">02</strong>UNVERIFIED PAYMENT LINK
                  </span>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 border text-red-400 border-red-500/50 bg-[#0a0a0a]">
                    HIGH
                  </span>
                </div>
                <p className="text-xs text-[#888888] pl-6">
                  Routes through unverified third-party domains mimicking gateway endpoints.
                </p>
              </div>

              <div className="py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#f2f2f2]">
                    <strong className="text-[#b6ff00] mr-2">03</strong>ARTIFICIAL URGENCY COERCION
                  </span>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 border text-amber-400 border-amber-500/50 bg-[#0a0a0a]">
                    MEDIUM
                  </span>
                </div>
                <p className="text-xs text-[#888888] pl-6">
                  Imposes artificial 15-minute deadline to force unverified payment approval.
                </p>
              </div>
            </div>
          </div>

          {/* Action Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-[#0a0a0a] border border-[#292929] space-y-2.5">
              <div className="flex items-center gap-2 border-b border-[#292929] pb-2">
                <ShieldCheck className="w-4 h-4 text-[#b6ff00]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f2f2]">
                  Recommended Actions
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-[#d1d1d1]">
                <li className="flex items-start gap-2">
                  <span className="text-[#b6ff00] font-bold">✓</span>
                  <span>Decline any pending UPI collect requests.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#b6ff00] font-bold">✓</span>
                  <span>Block and report the sender number immediately.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-[#0a0a0a] border border-[#292929] space-y-2.5">
              <div className="flex items-center gap-2 border-b border-[#292929] pb-2">
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f2f2]">
                  Prohibited Actions
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-[#d1d1d1]">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Never enter your UPI PIN to claim money.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Do not approve unexpected GPay or PhonePe collects.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SCAM TYPES (Compact editorial rows) */}
      <section id="threat-vectors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1.5 border-b border-[#292929] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[#b6ff00]" />
            <span className="text-xs uppercase tracking-widest text-[#888888] font-bold">
              THREAT VECTORS
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#f2f2f2]">
            RECOGNIZED FRAUD PATTERNS
          </h2>
        </div>

        {/* Compact Table/Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scamTypes.map((st) => (
            <Link
              key={st.num}
              href="/analyze"
              className="p-4 bg-[#111111] hover:bg-[#191919] border border-[#292929] hover:border-[#b6ff00] transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3 truncate pr-2">
                <span className="text-xs text-[#b6ff00] font-bold shrink-0">{st.num}</span>
                <span className="text-xs sm:text-sm font-bold text-[#f2f2f2] uppercase tracking-wider group-hover:text-[#b6ff00] transition-colors truncate">
                  {st.title}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#666666] group-hover:text-[#b6ff00] shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* 7. SAFETY PRINCIPLES */}
      <section id="awareness" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1.5 border-b border-[#292929] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[#b6ff00]" />
            <span className="text-xs uppercase tracking-widest text-[#888888] font-bold">
              SAFETY PRINCIPLES
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#f2f2f2]">
            CORE DIRECTIVES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {safetyDirectives.map((rule) => (
            <div key={rule.num} className="p-6 sm:p-8 bg-[#111111] border border-[#292929] space-y-3">
              <span className="text-3xl font-black text-[#b6ff00]">{rule.num}</span>
              <h3 className="text-sm sm:text-base font-black text-[#f2f2f2] uppercase tracking-wider">
                {rule.title}
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-16 bg-[#111111] border border-[#292929] text-center space-y-6">
          <div className="inline-flex items-center gap-2">
            <div className="w-2 h-2 bg-[#b6ff00]" />
            <span className="text-xs uppercase tracking-widest text-[#888888] font-bold">
              PRE-TRANSACTION DEFENSE
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#f2f2f2] max-w-3xl mx-auto leading-tight">
            CHECK BEFORE YOU CLICK.
          </h2>

          <div className="pt-2">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors"
            >
              <span>RUN A SECURITY CHECK</span>
              <ArrowRight className="w-4 h-4 text-[#050505]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
