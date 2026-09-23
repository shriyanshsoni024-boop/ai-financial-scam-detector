import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface SafetyWarningProps {
  variant?: 'banner' | 'card' | 'inline';
}

export default function SafetyWarning({ variant = 'card' }: SafetyWarningProps) {
  if (variant === 'banner') {
    return (
      <div className="w-full bg-[#0d0d0d] border-b border-white/5 py-2 px-4 text-center">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-xs text-[#888888]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#b6ff00] shrink-0" />
          <span>
            <strong className="text-[#f2f2f2] font-semibold">Safety Directive:</strong> Never enter active OTPs, UPI PINs, or banking passwords.
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#080808] border border-white/5 text-xs text-[#888888]">
        <AlertTriangle className="w-3.5 h-3.5 text-[#b6ff00] shrink-0" />
        <div>
          <span className="text-[#f2f2f2] font-semibold">Privacy Notice:</span> Never paste active OTPs, PINs, or card CVVs.
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl bg-[#0e0e0e] border border-white/5 space-y-1">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#f2f2f2]">
        <ShieldAlert className="w-4 h-4 text-[#b6ff00]" />
        <span>Privacy & Local Processing</span>
      </div>
      <p className="text-xs text-[#888888] leading-relaxed">
        Evaluation executes locally in memory. Zero credentials or personal data are stored or transmitted.
      </p>
    </div>
  );
}
