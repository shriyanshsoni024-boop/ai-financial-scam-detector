import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface SafetyWarningProps {
  variant?: 'banner' | 'card' | 'inline';
}

export default function SafetyWarning({ variant = 'card' }: SafetyWarningProps) {
  if (variant === 'banner') {
    return (
      <div className="w-full bg-[#111111] border-b border-[#292929] py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs font-mono text-[#888888]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#b6ff00] shrink-0" />
          <span>
            <strong className="text-[#f2f2f2]">SAFETY DIRECTIVE:</strong> Never enter active OTPs, UPI PINs, or passwords.
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2.5 p-2.5 bg-[#0a0a0a] border border-[#292929] text-xs font-mono text-[#888888]">
        <AlertTriangle className="w-3.5 h-3.5 text-[#b6ff00] shrink-0" />
        <div>
          <span className="text-[#f2f2f2] font-bold">SAFETY PROTOCOL:</span> Do not paste active OTPs, PINs, or confidential card credentials.
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-[#111111] border border-[#292929] space-y-1.5 font-mono">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f2f2f2]">
        <ShieldAlert className="w-4 h-4 text-[#b6ff00]" />
        <span>Privacy & Zero Retention</span>
      </div>
      <p className="text-xs text-[#888888] leading-relaxed">
        Evaluation runs locally in memory. Never submit active OTPs, UPI PINs, or confidential banking passwords.
      </p>
    </div>
  );
}
