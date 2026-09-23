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
  // Show top 3 actions max to maintain concise visual balance
  const topRecommended = recommendedActions.slice(0, 3);
  const topAvoid = avoidActions.slice(0, 3);

  return (
    <div className="space-y-4 font-mono">
      {/* 2-Column Responsive Layout: Recommended vs Prohibited */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Actions */}
        <div className="p-5 bg-[#111111] border border-[#292929] space-y-3">
          <div className="flex items-center gap-2 border-b border-[#292929] pb-2.5">
            <ShieldCheck className="w-4 h-4 text-[#b6ff00]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f2f2]">
              Recommended Protocol
            </h4>
          </div>

          <ul className="space-y-2 text-xs text-[#d1d1d1]">
            {topRecommended.map((action, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#b6ff00] font-bold">✓</span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prohibited Actions */}
        <div className="p-5 bg-[#111111] border border-[#292929] space-y-3">
          <div className="flex items-center gap-2 border-b border-[#292929] pb-2.5">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f2f2f2]">
              Prohibited Actions
            </h4>
          </div>

          <ul className="space-y-2 text-xs text-[#d1d1d1]">
            {topAvoid.map((avoid, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span className="leading-relaxed">{avoid}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Emergency Cyber Reporting Helpline */}
      {showEmergencyHelpline && (
        <div className="p-4 bg-[#0d0d0d] border border-[#292929] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-[#b6ff00] shrink-0" />
            <span className="text-xs text-[#888888]">
              Emergency Reporting: <strong className="text-[#f2f2f2]">National Cyber Helpline 1930</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <a
              href="tel:1930"
              className="inline-flex items-center justify-center px-3 py-1.5 bg-[#b6ff00] hover:bg-[#c9ff33] text-[#050505] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              1930
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-[#111111] hover:bg-[#191919] text-[#f2f2f2] text-xs border border-[#292929] uppercase tracking-wider transition-colors"
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
