import Analyzer from '@/components/Analyzer';
import SafetyWarning from '@/components/SafetyWarning';

export const metadata = {
  title: 'Message Threat Analyzer | SentinelShield',
  description: 'Evaluate suspicious SMS, email, or UPI payment alerts for heuristic fraud risk indicators.'
};

export default function AnalyzePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#b6ff00]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b6ff00]" />
          <span>Diagnostic Scanner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f2f2f2] tracking-tight">
          Analyze Suspicious Content
        </h1>
        <p className="text-sm text-[#888888] max-w-xl leading-relaxed">
          Scan unverified SMS alerts, payment links, or screenshot notices to identify fraud signatures before taking action.
        </p>
      </div>

      {/* Safety Notice */}
      <SafetyWarning variant="card" />

      {/* Interactive Analyzer */}
      <div className="pt-1">
        <Analyzer />
      </div>
    </div>
  );
}
