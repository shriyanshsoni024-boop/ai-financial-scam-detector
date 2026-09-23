import Link from 'next/link';
import {
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  Fingerprint,
  Building,
  CreditCard,
  Globe,
  Headphones,
  TrendingUp,
  Briefcase,
  BadgePercent
} from 'lucide-react';

export const metadata = {
  title: 'Threat Vectors & Fraud Signatures | SCAMSHIELD',
  description: 'Editorial taxonomy of prevalent financial scam vectors and their critical warning signals.'
};

export default function ThreatVectorsPage() {
  const vectors = [
    {
      id: 'fake-kyc',
      name: 'FAKE KYC',
      category: 'Identity & Account Freeze Phishing',
      desc: 'Urgent threats claiming bank account, NetBanking, or SIM suspension unless identity documentation is updated via an external link.',
      warningSignal: 'SMS containing links like sbi-kyc.xyz or demands for OTP / PAN verification.',
      icon: Fingerprint
    },
    {
      id: 'bank-impersonation',
      name: 'BANK IMPERSONATION',
      category: 'Social Engineering & Spoofing',
      desc: 'Attackers posing as bank security or compliance officers reporting fake unauthorized charges to induce panic.',
      warningSignal: 'Caller instructs you to transfer money to a "safe RBI account" or share debit card CVV.',
      icon: Building
    },
    {
      id: 'upi-payment',
      name: 'UPI / PAYMENT SCAM',
      category: 'Authorization & PIN Inversion',
      desc: 'Deceptive collect requests or cashback QR codes tricking victims into entering their UPI PIN under the pretense of receiving money.',
      warningSignal: 'Demanding UPI PIN entry to receive cashback, refunds, or payment for OLX items.',
      icon: CreditCard
    },
    {
      id: 'phishing',
      name: 'PHISHING',
      category: 'Credential Harvesting Portals',
      desc: 'Rogue clone websites designed to mirror legitimate banking or tax portals to steal login credentials and security questions.',
      warningSignal: 'Unsecured HTTP protocols, misspelled domain names, and suspicious TLD extensions (.top, .xyz, .cc).',
      icon: Globe
    },
    {
      id: 'fake-support',
      name: 'FAKE CUSTOMER SUPPORT',
      category: 'Search Engine & Social Spoofing',
      desc: 'Fraudulent helpline numbers seeded on search engine ads, maps, and social channels masquerading as bank helpdesks.',
      warningSignal: 'Agent requests installation of remote-desktop apps (AnyDesk, QuickSupport, TeamViewer).',
      icon: Headphones
    },
    {
      id: 'investment-scam',
      name: 'INVESTMENT SCAM',
      category: 'High-Yield Ponzi & Crypto Signals',
      desc: 'Private Telegram and WhatsApp groups promising 5x–10x guaranteed returns and insider crypto signals with zero downside risk.',
      warningSignal: 'Guaranteed high returns, fabricated profit screenshots, and payment demands in cryptocurrency or personal UPI.',
      icon: TrendingUp
    },
    {
      id: 'job-task-scam',
      name: 'JOB / TASK SCAM',
      category: 'Pre-paid Task Exploitation',
      desc: 'Remote work offers promising high daily payouts for liking YouTube videos or rating hotels, requiring advance deposits to unlock payouts.',
      warningSignal: 'Requirement to deposit "prepaid security money" or registration fees before withdrawal.',
      icon: Briefcase
    },
    {
      id: 'loan-scam',
      name: 'LOAN SCAM',
      category: 'Advance Fee & Extortion Traps',
      desc: 'Instant, paperwork-free personal loans advertised via SMS that demand advance processing, GST, or insurance fees before disbursal.',
      warningSignal: 'Upfront processing fee demands or requests for full phone contact book permissions.',
      icon: BadgePercent
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Top Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#111111] border border-white/10 text-[10px] font-mono uppercase tracking-wider text-[#b6ff00]">
          <ShieldAlert className="w-3 h-3" />
          <span>Threat Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#f2f2f2] tracking-tight leading-tight">
          Recognized Threat Vectors
        </h1>
        <p className="text-sm sm:text-base text-[#888888] max-w-2xl leading-relaxed">
          Editorial breakdown of prevalent digital fraud patterns and their definitive warning signatures.
        </p>
      </div>

      {/* Editorial Vectors List */}
      <div className="space-y-4">
        {vectors.map((vector) => {
          const IconComp = vector.icon;
          return (
            <div
              key={vector.id}
              className="p-6 sm:p-7 rounded-2xl bg-[#0e0e0e] border border-white/5 hover:border-white/10 transition-colors space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#141414] border border-white/5 flex items-center justify-center text-[#b6ff00]">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-[#f2f2f2] tracking-tight">
                      {vector.name}
                    </h2>
                    <span className="text-[11px] text-[#666666] font-mono block">
                      {vector.category}
                    </span>
                  </div>
                </div>

                <Link
                  href="/analyze"
                  className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161616] hover:bg-[#b6ff00] text-[#c4c4c4] hover:text-[#050505] text-[11px] font-semibold border border-white/10 hover:border-[#b6ff00] transition-all"
                >
                  <span>Test Pattern</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-[#a3a3a3] leading-relaxed">
                {vector.desc}
              </p>

              <div className="flex items-start sm:items-center gap-2 p-2.5 rounded-lg bg-[#080808] border border-white/5 text-[11px] sm:text-xs text-[#d1d1d1]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                <span>
                  <strong className="text-amber-400 font-semibold">Warning Signal:</strong> {vector.warningSignal}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Card */}
      <div className="p-8 rounded-2xl bg-[#0e0e0e] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1 max-w-md">
          <h3 className="text-lg font-bold text-[#f2f2f2] tracking-tight">
            Encountered one of these vectors?
          </h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Paste the suspicious message, upload a screenshot, or inspect the URL in the ScamShield engine.
          </p>
        </div>

        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs font-bold rounded-full transition-all hover:scale-[1.02] shrink-0"
        >
          <span>Open Threat Scanner</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
