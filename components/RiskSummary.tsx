import { AnalysisResult } from '@/types/scam';
import RiskBadge from './RiskBadge';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface RiskSummaryProps {
  result: AnalysisResult;
}

export default function RiskSummary({ result }: RiskSummaryProps) {
  const getRiskBorderColor = () => {
    switch (result.riskLevel) {
      case 'HIGH_RISK':
        return 'border-red-500/30';
      case 'NEEDS_CAUTION':
        return 'border-amber-500/30';
      case 'LOW_CONCERN':
        return 'border-[#b6ff00]/30';
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

  const isAiAssisted = result.aiAnalysis?.enabled;

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-[#0e0e0e] border ${getRiskBorderColor()} space-y-5`}>
      {/* Assessment Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <RiskBadge level={result.riskLevel} size="md" />

            {/* Subtle AI / Heuristic indicator */}
            {isAiAssisted ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141414] border border-[#b6ff00]/30 text-[11px] font-mono text-[#b6ff00]">
                <Sparkles className="w-3 h-3 text-[#b6ff00]" />
                <span>AI-assisted assessment ({result.aiAnalysis?.confidence}% confidence)</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141414] border border-white/5 text-[11px] font-mono text-[#888888]">
                <ShieldCheck className="w-3 h-3 text-[#888888]" />
                <span>Heuristic evaluation</span>
              </div>
            )}
          </div>

          <span className="text-xs font-mono text-[#666666]">
            Score: <strong className="text-[#f2f2f2]">{result.riskScore}/100</strong>
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#f2f2f2] tracking-tight">
          {result.category}
        </h3>

        <p className="text-sm text-[#a3a3a3] leading-relaxed max-w-2xl font-normal">
          {result.summary}
        </p>
      </div>

      {/* Slim Score Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="w-full h-1.5 rounded-full bg-[#1c1c1c] overflow-hidden">
          <div
            className={`h-full rounded-full ${getScoreBarColor()} transition-all duration-500`}
            style={{ width: `${Math.max(5, result.riskScore)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
