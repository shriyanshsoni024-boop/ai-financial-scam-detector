import { AnalysisResult } from '@/types/scam';
import RiskBadge from './RiskBadge';
import { Clock } from 'lucide-react';

interface RiskSummaryProps {
  result: AnalysisResult;
}

export default function RiskSummary({ result }: RiskSummaryProps) {
  const getRiskBorderColor = () => {
    switch (result.riskLevel) {
      case 'HIGH_RISK':
        return 'border-red-500/50';
      case 'NEEDS_CAUTION':
        return 'border-amber-500/50';
      case 'LOW_CONCERN':
        return 'border-[#b6ff00]/50';
    }
  };

  const getScoreBarColor = () => {
    switch (result.riskLevel) {
      case 'HIGH_RISK':
        return 'bg-red-500';
      case 'NEEDS_CAUTION':
        return 'bg-amber-400';
      case 'LOW_CONCERN':
        return 'bg-[#b6ff00]';
    }
  };

  // Limit explanation to top 2 critical takeaways for clean editorial layout
  const visibleExplanation = result.explanation.slice(0, 2);

  return (
    <div className={`p-6 sm:p-7 bg-[#111111] border ${getRiskBorderColor()} space-y-5 font-mono`}>
      {/* Assessment Header */}
      <div className="space-y-3 border-b border-[#292929] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#b6ff00]" />
            <span className="text-xs uppercase tracking-widest text-[#888888] font-bold">
              SECURITY ASSESSMENT
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#666666] text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(result.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <RiskBadge level={result.riskLevel} size="lg" />
          <span className="text-[#3d3d3d]">/</span>
          <span className="text-base sm:text-lg font-bold text-[#f2f2f2] uppercase tracking-wide">
            {result.category}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Risk Indicator Score Bar */}
      <div className="p-4 bg-[#0a0a0a] border border-[#292929] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#f2f2f2] font-bold uppercase tracking-wider">Risk indicator score</span>
          <span className="text-[#f2f2f2] font-black">{result.riskScore} / 100</span>
        </div>

        <div className="w-full h-1.5 bg-[#1b1b1b] overflow-hidden">
          <div
            className={`h-full ${getScoreBarColor()} transition-all duration-300`}
            style={{ width: `${Math.max(5, result.riskScore)}%` }}
          />
        </div>

        <p className="text-[10px] text-[#666666] leading-normal">
          Score reflects detected threat indicators and is not a formal legal guarantee.
        </p>
      </div>

      {/* Diagnostic Findings */}
      {visibleExplanation.length > 0 && (
        <div className="space-y-2 pt-0.5">
          <h4 className="text-xs uppercase tracking-widest text-[#888888] font-bold">
            Key Findings
          </h4>
          <div className="space-y-1.5">
            {visibleExplanation.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#d1d1d1]">
                <span className="text-[#b6ff00] font-bold">→</span>
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
