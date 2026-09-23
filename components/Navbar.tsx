'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#292929] bg-[#050505]/95 backdrop-blur-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-2.5 h-2.5 bg-[#b6ff00] shrink-0" />
          <span className="font-mono font-black text-base sm:text-lg tracking-wider text-[#f2f2f2] group-hover:text-white transition-colors">
            SENTINELSHIELD
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-[#888888]">
          <Link href="/analyze" className="hover:text-[#f2f2f2] transition-colors">
            Analyze
          </Link>
          <Link href="/#awareness" className="hover:text-[#f2f2f2] transition-colors">
            Awareness
          </Link>
          <Link href="/#threat-vectors" className="hover:text-[#f2f2f2] transition-colors">
            Threat Vectors
          </Link>
          <Link href="/#about" className="hover:text-[#f2f2f2] transition-colors">
            About
          </Link>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-4">
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#b6ff00] text-[#050505] hover:bg-[#c9ff33] text-xs font-mono font-bold uppercase tracking-wider transition-colors"
          >
            [ RUN SCAN ]
          </Link>
        </div>
      </div>
    </header>
  );
}
