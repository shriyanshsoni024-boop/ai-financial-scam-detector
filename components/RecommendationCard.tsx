import { PhoneCall, ExternalLink, ShieldCheck, AlertOctagon } from 'lucide-react';

interface RecommendationCardProps {
  recommendedActions: string[];
  avoidActions: string[];
  showEmergencyHelpline?: boolean;
}

export default function RecommendationCard({
  recommendedActions,
  avoidActions,
  showEmergencyHelpline = true
}: RecommendationCardProps) {
  // Show top 2 critical actions each for clean scannability
  const topRecommended = recommendedActions.slice(0, 2);
  const topAvoid = avoidActions.slice(0, 2);

  return (
    <div className="space-y-4">
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Actions */}
        <div className="p-5 rounded-xl bg-[#0e0e0e] border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-[#b6ff00]">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f2f2]">
              Recommended Steps
            </h4>
          </div>

          <ul className="space-y-2 text-xs text-[#a3a3a3]">
            {topRecommended.map((action, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-[#b6ff00] font-bold text-sm leading-none shrink-0 mt-0.5">✓</span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prohibited Actions */}
        <div className="p-5 rounded-xl bg-[#0e0e0e] border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <AlertOctagon className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f2f2]">
              Prohibited Actions
            </h4>
          </div>

          <ul className="space-y-2 text-xs text-[#a3a3a3]">
            {topAvoid.map((avoid, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold text-sm leading-none shrink-0 mt-0.5">✕</span>
                <span className="leading-relaxed">{avoid}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Emergency Helpline Bar */}
      {showEmergencyHelpline && (
        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-[#b6ff00] shrink-0" />
            <span className="text-xs text-[#888888]">
              Emergency Reporting: <strong className="text-[#f2f2f2] font-semibold">National Cyber Helpline 1930</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <a
              href="tel:1930"
              className="inline-flex items-center justify-center px-3.5 py-1.5 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs font-bold rounded-full transition-colors"
            >
              Dial 1930
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#141414] hover:bg-[#1f1f1f] text-[#f2f2f2] text-xs font-medium rounded-full border border-white/10 transition-colors"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3 text-[#888888]" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
