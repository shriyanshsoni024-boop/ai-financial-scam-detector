'use client';

import { useState } from 'react';
import { RedFlag } from '@/types/scam';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface RedFlagCardProps {
  redFlags: RedFlag[];
}

export default function RedFlagCard({ redFlags }: RedFlagCardProps) {
  const [showAll, setShowAll] = useState(false);

  if (redFlags.length === 0) {
    return (
      <div className="p-5 bg-[#111111] border border-[#b6ff00]/40 space-y-1.5 font-mono">
        <div className="flex items-center gap-2 text-[#b6ff00] text-xs font-bold uppercase tracking-wider">
          <CheckCircle className="w-4 h-4" />
          <span>NO THREAT INDICATORS DETECTED</span>
        </div>
        <p className="text-xs text-[#888888]">
          The analyzed text does not trigger known coercion or fraud heuristics.
        </p>
      </div>
    );
  }

  // Display top 3 red flags unless expanded
  const displayedFlags = showAll ? redFlags : redFlags.slice(0, 3);
  const hasHiddenFlags = redFlags.length > 3;

  return (
    <div className="p-6 bg-[#111111] border border-[#292929] space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-[#292929] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#b6ff00]" />
          <span className="text-xs uppercase tracking-widest text-[#888888] font-bold">
            RED FLAGS ({redFlags.length})
          </span>
        </div>
        {hasHiddenFlags && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1.5 text-xs text-[#b6ff00] hover:underline uppercase tracking-wider cursor-pointer"
          >
            <span>{showAll ? 'Show Top 3' : `View All (${redFlags.length})`}</span>
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      <div className="divide-y divide-[#292929]">
        {displayedFlags.map((flag, idx) => {
          const indexNum = String(idx + 1).padStart(2, '0');
          const typeLabel = flag.type.replace(/_/g, ' ');

          return (
            <div key={flag.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-xs font-black text-[#b6ff00]">{indexNum}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#f2f2f2]">
                    {typeLabel}
                  </span>
                </div>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.5 border ${
                    flag.severity === 'high'
                      ? 'text-red-400 border-red-500/50 bg-[#0a0a0a]'
                      : flag.severity === 'medium'
                      ? 'text-amber-400 border-amber-500/50 bg-[#0a0a0a]'
                      : 'text-[#b6ff00] border-[#b6ff00]/50 bg-[#0a0a0a]'
                  }`}
                >
                  {flag.severity}
                </span>
              </div>

              <p className="text-xs text-[#888888] leading-relaxed pl-6">
                {flag.description}
              </p>

              {flag.evidence && flag.evidence.length > 0 && (
                <div className="pl-6 pt-0.5 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[#666666] text-[10px]">Evidence:</span>
                  {flag.evidence.map((snippet, i) => (
                    <code
                      key={i}
                      className="px-1.5 py-0.5 bg-[#0a0a0a] border border-[#292929] text-[#d1d1d1] text-[10px]"
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
    </div>
  );
}
