import { AlertCircle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="p-5 bg-[#111111] border border-[#292929] text-xs font-mono text-[#888888] space-y-1.5">
      <div className="flex items-center gap-2 text-[#f2f2f2] font-bold uppercase tracking-wider">
        <AlertCircle className="w-4 h-4 text-[#b6ff00] shrink-0" />
        <span>Advisory & Limits</span>
      </div>
      <p className="leading-relaxed text-[#888888]">
        Risk indicators are heuristic pattern estimates. Always independently verify communications through official banking applications.
      </p>
    </div>
  );
}
