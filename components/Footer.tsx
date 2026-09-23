import Link from 'next/link';
import { Shield, ExternalLink, PhoneCall } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="about" className="w-full border-t border-white/5 bg-[#050505] text-[#888888] text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Financial Security */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-[#111111] border border-white/10 flex items-center justify-center text-[#b6ff00]">
                <Shield className="w-3.5 h-3.5 fill-[#b6ff00]/20" />
              </div>
              <span className="font-bold text-sm tracking-tight text-[#f2f2f2]">
                SentinelShield
              </span>
            </div>
            <p className="text-xs text-[#888888] max-w-sm leading-relaxed">
              Heuristic threat engine designed to detect financial coercion, fake KYC traps, and payment fraud before credentials or funds are compromised.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h5 className="font-semibold text-[#f2f2f2] text-xs">
              Quick Links
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#f2f2f2] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-[#f2f2f2] transition-colors">
                  Scanner
                </Link>
              </li>
              <li>
                <Link href="/#threat-vectors" className="hover:text-[#f2f2f2] transition-colors">
                  Threat Vectors
                </Link>
              </li>
              <li>
                <Link href="/#awareness" className="hover:text-[#f2f2f2] transition-colors">
                  Directives
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Emergency Helpline 1930 */}
          <div className="space-y-3">
            <h5 className="font-semibold text-[#f2f2f2] text-xs">
              National Helpline
            </h5>
            <div className="space-y-2">
              <a
                href="tel:1930"
                className="flex items-center justify-between p-3 rounded-lg bg-[#0e0e0e] border border-white/5 hover:border-[#b6ff00]/40 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#b6ff00]" />
                  <span className="font-semibold text-xs text-[#f2f2f2]">Dial 1930</span>
                </div>
                <span className="text-[10px] text-[#666666]">Toll-Free</span>
              </a>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-[#0e0e0e] border border-white/5 hover:border-white/15 text-[#f2f2f2] transition-colors group"
              >
                <span className="text-xs font-medium">cybercrime.gov.in</span>
                <ExternalLink className="w-3 h-3 text-[#666666] group-hover:text-[#b6ff00]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#666666] text-[11px]">
          <p>© {new Date().getFullYear()} SentinelShield. Financial Security.</p>
          <div className="flex items-center gap-2">
            <span>In-memory evaluation</span>
            <span>·</span>
            <span>Zero credential storage</span>
            <span>·</span>
            <span>Local heuristics</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
