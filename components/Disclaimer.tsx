import { AlertCircle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="p-5 rounded-xl bg-[#0e0e0e] border border-white/5 text-xs text-[#888888] space-y-1">
      <div className="flex items-center gap-2 text-[#f2f2f2] font-semibold">
        <AlertCircle className="w-4 h-4 text-[#b6ff00] shrink-0" />
        <span>Advisory</span>
      </div>
      <p className="leading-relaxed text-[#888888]">
        Risk indicators are heuristic pattern estimates. Always independently verify communications through official banking applications.
      </p>
    </div>
  );
}
