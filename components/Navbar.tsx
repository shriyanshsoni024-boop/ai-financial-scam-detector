'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1a1a1a] bg-[#050505]/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-[#111111] border border-white/10 flex items-center justify-center text-[#b6ff00] group-hover:border-[#b6ff00]/40 transition-colors">
            <Shield className="w-4 h-4 fill-[#b6ff00]/20" />
          </div>
          <span className="font-bold text-base tracking-tight text-[#f2f2f2] group-hover:text-white transition-colors">
            SCAMSHIELD
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#888888]">
          <Link href="/analyze" className="hover:text-[#f2f2f2] transition-colors">
            Analyze
          </Link>
          <Link href="/dashboard" className="hover:text-[#f2f2f2] transition-colors">
            Dashboard
          </Link>
          <Link href="/threat-vectors" className="hover:text-[#f2f2f2] transition-colors">
            Threat Vectors
          </Link>
          <Link href="/awareness" className="hover:text-[#f2f2f2] transition-colors">
            Awareness
          </Link>
          <Link href="/#about" className="hover:text-[#f2f2f2] transition-colors">
            Helpline
          </Link>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#b6ff00] text-[#050505] hover:bg-[#c9ff33] text-xs font-semibold rounded-full transition-all hover:scale-[1.02]"
          >
            Scan Message
          </Link>
        </div>
      </div>
    </header>
  );
}
