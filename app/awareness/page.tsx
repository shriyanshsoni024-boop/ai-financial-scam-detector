import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  PhoneCall,
  ExternalLink,
  ArrowRight,
  KeyRound,
  Building2,
  ClockAlert,
  Globe2,
  Smartphone,
  AlertOctagon
} from 'lucide-react';

export const metadata = {
  title: 'Security Awareness Directives | SCAMSHIELD',
  description: 'Essential security rules to protect your financial accounts, OTPs, and UPI credentials from fraud.'
};

export default function AwarenessPage() {
  const directives = [
    {
      num: '01',
      title: 'Never Share OTP or PIN',
      desc: 'One-time passwords and UPI PINs authorize fund deductions and account takeovers. Banks, payment gateways, and government agencies will never ask for your secret PIN or OTP.',
      keynote: 'UPI PIN is exclusively for sending money — never for receiving.',
      icon: KeyRound
    },
    {
      num: '02',
      title: 'Verify via Official Channels',
      desc: 'Never call phone numbers or tap links delivered in unexpected SMS alerts. Open your official banking mobile app directly or call the toll-free number printed on the back of your debit card.',
      keynote: 'Independent verification neutralizes impersonation attempts.',
      icon: Building2
    },
    {
      num: '03',
      title: 'Reject Artificial Panic & Urgency',
      desc: 'Threats of immediate power cutoffs, SIM deactivation, or account suspension within 2 hours are deliberate psychological coercion tactics designed to prevent calm reasoning.',
      keynote: 'Genuine banking processes always provide formal written grace periods.',
      icon: ClockAlert
    },
    {
      num: '04',
      title: 'Inspect Links Before Opening',
      desc: 'Carefully scrutinize domain names for misspelled brand names (e.g. sbi-kyc.xyz instead of onlinesbi.sbi), weird extensions, and insecure HTTP protocols before tapping.',
      keynote: 'When in doubt, copy the web address into the ScamShield URL scanner.',
      icon: Globe2
    },
    {
      num: '05',
      title: 'Never Install Unverified Apps or APKs',
      desc: 'Never install remote desktop apps (AnyDesk, QuickSupport, TeamViewer) or download third-party APK packages upon caller instructions. They grant attackers full screen visibility and OTP interception.',
      keynote: 'Banks will never ask you to install third-party screen sharing tools.',
      icon: Smartphone
    },
    {
      num: '06',
      title: 'Report Fraud Immediately (Golden Hour)',
      desc: 'If unauthorized transactions occur or credentials are submitted, reporting within the first 60 minutes maximizes the chance that law enforcement can freeze beneficiary wallets before withdrawal.',
      keynote: 'Dial 1930 immediately to register an emergency financial cyber incident.',
      icon: AlertOctagon
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Top Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#111111] border border-white/10 text-[10px] font-mono uppercase tracking-wider text-[#b6ff00]">
          <Shield className="w-3 h-3" />
          <span>Security Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#f2f2f2] tracking-tight leading-tight">
          Core Awareness Directives
        </h1>
        <p className="text-sm sm:text-base text-[#888888] max-w-2xl leading-relaxed">
          Fundamental ground rules to safeguard your bank accounts, digital wallets, and personal authentication credentials against social engineering.
        </p>
      </div>

      {/* Directives List */}
      <div className="space-y-4">
        {directives.map((rule) => {
          const IconComp = rule.icon;
          return (
            <div
              key={rule.num}
              className="p-6 sm:p-8 rounded-2xl bg-[#0e0e0e] border border-white/5 hover:border-white/10 transition-colors space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#b6ff00] bg-[#141414] px-2.5 py-1 rounded-md border border-white/5">
                    {rule.num}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-[#f2f2f2] tracking-tight">
                    {rule.title}
                  </h2>
                </div>
                <div className="w-7 h-7 rounded-lg bg-[#141414] border border-white/5 flex items-center justify-center text-[#888888]">
                  <IconComp className="w-3.5 h-3.5 text-[#b6ff00]" />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#a3a3a3] leading-relaxed">
                {rule.desc}
              </p>

              <div className="inline-flex items-center gap-2 p-2.5 rounded-lg bg-[#080808] border border-white/5 text-[11px] sm:text-xs text-[#d1d1d1]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#b6ff00] shrink-0" />
                <span><strong className="text-white">Directive:</strong> {rule.keynote}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Helpline Strip */}
      <div className="p-8 rounded-2xl bg-[#0e0e0e] border border-white/5 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#b6ff00] uppercase tracking-wider block">
            National Cyber Crime Reporting
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#f2f2f2] tracking-tight">
            Incident Response & Support
          </h3>
          <p className="text-xs text-[#888888] max-w-xl leading-relaxed">
            If you have been targeted by a financial scam or transferred funds under coercion, report the incident immediately.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            href="tel:1930"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs font-bold rounded-full transition-all hover:scale-[1.02]"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 1930 (Toll-Free)</span>
          </a>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#161616] hover:bg-[#202020] text-[#f2f2f2] text-xs font-semibold rounded-full border border-white/10 transition-colors"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#888888]" />
          </a>

          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121212] hover:bg-[#1a1a1a] text-[#c4c4c4] hover:text-white text-xs font-semibold rounded-full border border-white/5 transition-colors"
          >
            <span>Analyze a Message</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
