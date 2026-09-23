'use client';

import { useState } from 'react';
import { RedFlag } from '@/types/scam';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface RedFlagCardProps {
  redFlags: RedFlag[];
}

export default function RedFlagCard({ redFlags }: RedFlagCardProps) {
  const [showFullAssessment, setShowFullAssessment] = useState(false);

  if (redFlags.length === 0) {
    return (
      <div className="p-5 rounded-xl bg-[#0f1f0a] border border-[#b6ff00]/20 space-y-1">
        <div className="flex items-center gap-2 text-[#b6ff00] text-sm font-semibold">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>No Threat Indicators Detected</span>
        </div>
        <p className="text-xs text-[#888888]">
          The analyzed content does not trigger known coercion or fraud heuristics.
        </p>
      </div>
    );
  }

  // Display top 3 red flags by default
  const displayedFlags = showFullAssessment ? redFlags : redFlags.slice(0, 3);
  const hasMoreFlags = redFlags.length > 3 || redFlags.some((f) => f.evidence && f.evidence.length > 0);

  return (
    <div className="p-6 rounded-xl bg-[#0e0e0e] border border-white/5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#f2f2f2] tracking-tight">
            Key Threat Signals
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#1a1a1a] text-[#888888]">
            {redFlags.length}
          </span>
        </div>

        {hasMoreFlags && (
          <button
            type="button"
            onClick={() => setShowFullAssessment(!showFullAssessment)}
            className="inline-flex items-center gap-1.5 text-xs text-[#b6ff00] hover:text-[#c9ff33] font-medium transition-colors cursor-pointer"
          >
            <span>{showFullAssessment ? 'Hide Details' : 'View Full Assessment'}</span>
            {showFullAssessment ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Clean Numbered Signals */}
      <div className="space-y-3.5">
        {displayedFlags.map((flag, idx) => {
          const indexNum = String(idx + 1).padStart(2, '0');

          return (
            <div
              key={flag.id}
              className="p-3.5 rounded-lg bg-[#080808] border border-white/5 space-y-2 transition-colors hover:border-white/10"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#b6ff00]">{indexNum}</span>
                  <span className="text-sm font-semibold text-[#f2f2f2]">
                    {flag.title}
                  </span>
                </div>
                <span
                  className={`text-[10px] uppercase font-medium px-2 py-0.5 rounded-full border ${
                    flag.severity === 'high'
                      ? 'text-red-400 border-red-500/30 bg-red-950/20'
                      : flag.severity === 'medium'
                      ? 'text-amber-400 border-amber-500/30 bg-amber-950/20'
                      : 'text-[#b6ff00] border-[#b6ff00]/30 bg-[#0f1f0a]'
                  }`}
                >
                  {flag.severity}
                </span>
              </div>

              <p className="text-xs text-[#888888] leading-relaxed pl-7">
                {flag.description}
              </p>

              {/* Deep Evidence Snippets (Visible in Full Assessment Mode) */}
              {showFullAssessment && flag.evidence && flag.evidence.length > 0 && (
                <div className="pl-7 pt-1 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[10px] text-[#666666] font-mono">Matched:</span>
                  {flag.evidence.map((snippet, i) => (
                    <code
                      key={i}
                      className="px-2 py-0.5 rounded bg-[#141414] border border-white/5 text-[#d1d1d1] text-[11px] font-mono"
                    >
                      &ldquo;{snippet}&rdquo;
                    </code>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Subtle button at bottom if collapsed */}
      {!showFullAssessment && hasMoreFlags && (
        <button
          type="button"
          onClick={() => setShowFullAssessment(true)}
          className="w-full py-2 text-center text-xs text-[#888888] hover:text-[#f2f2f2] font-medium border-t border-white/5 transition-colors cursor-pointer"
        >
          View all {redFlags.length} signals & matched evidence →
        </button>
      )}
    </div>
  );
}
