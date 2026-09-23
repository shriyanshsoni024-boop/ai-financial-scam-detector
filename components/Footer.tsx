import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="about" className="w-full border-t border-[#292929] bg-[#050505] text-[#888888] text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand & Financial Security */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-[#b6ff00] shrink-0" />
              <span className="font-black text-lg tracking-wider text-[#f2f2f2]">
                SENTINELSHIELD
              </span>
            </div>
            <p className="text-sm font-bold text-[#f2f2f2] uppercase tracking-widest">
              Financial Security
            </p>
            <p className="text-xs text-[#888888] max-w-md leading-relaxed">
              Deterministic heuristic threat engine designed to detect financial coercion, fake KYC traps, and payment fraud before credentials or OTPs are compromised.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#f2f2f2] text-xs uppercase tracking-widest">
              Navigation
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#f2f2f2] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-[#f2f2f2] transition-colors">
                  Analyze
                </Link>
              </li>
              <li>
                <Link href="/#awareness" className="hover:text-[#f2f2f2] transition-colors">
                  Awareness
                </Link>
              </li>
              <li>
                <Link href="/#threat-vectors" className="hover:text-[#f2f2f2] transition-colors">
                  Threat Vectors
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Emergency Helpline 1930 / cybercrime.gov.in */}
          <div className="space-y-4">
            <h5 className="font-bold text-[#f2f2f2] text-xs uppercase tracking-widest">
              Official Helpline
            </h5>
            <div className="space-y-3">
              <div className="p-4 bg-[#111111] border border-[#292929] space-y-1">
                <div className="text-[10px] text-[#888888] uppercase tracking-wider">National Helpline</div>
                <a href="tel:1930" className="text-lg font-black text-[#b6ff00] hover:text-[#c9ff33] transition-colors block">
                  1930
                </a>
              </div>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-[#111111] border border-[#292929] hover:border-[#b6ff00] text-[#f2f2f2] transition-colors group"
              >
                <span className="font-bold text-xs uppercase tracking-wider">cybercrime.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#888888] group-hover:text-[#b6ff00]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 border-t border-[#292929] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#666666] text-xs">
          <p>© {new Date().getFullYear()} SENTINELSHIELD. Financial Security.</p>
          <div className="flex items-center gap-3">
            <span>In-memory processing</span>
            <span>/</span>
            <span>Zero credential storage</span>
            <span>/</span>
            <span>Independent verification required</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
