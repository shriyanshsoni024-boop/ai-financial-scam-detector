import Analyzer from '@/components/Analyzer';
import SafetyWarning from '@/components/SafetyWarning';

export const metadata = {
  title: 'Message Threat Analyzer | SentinelShield',
  description: 'Evaluate suspicious SMS, email, or UPI payment alerts for heuristic fraud risk indicators.'
};

export default function AnalyzePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      {/* Header */}
      <div className="space-y-3 border-b border-[#292929] pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-[#b6ff00]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#888888] font-bold">
            DIAGNOSTIC TERMINAL
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#f2f2f2]">
          FINANCIAL THREAT ANALYZER
        </h1>
        <p className="text-xs sm:text-sm text-[#888888] font-mono max-w-2xl leading-relaxed">
          Paste unverified SMS notifications, payment links, or communication excerpts to detect indicators of coercion, fake KYC traps, and credential harvesting.
        </p>
      </div>

      {/* Safety Notice */}
      <SafetyWarning variant="card" />

      {/* Interactive Analyzer */}
      <div className="pt-2">
        <Analyzer />
      </div>
    </div>
  );
}
