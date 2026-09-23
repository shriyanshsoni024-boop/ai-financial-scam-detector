'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1a1a1a] bg-[#050505]/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-[#111111] border border-white/10 flex items-center justify-center text-[#b6ff00] group-hover:border-[#b6ff00]/40 transition-colors">
            <Shield className="w-4 h-4 fill-[#b6ff00]/20" />
          </div>
          <span className="font-bold text-base tracking-tight text-[#f2f2f2] group-hover:text-white transition-colors">
            SCAMSHIELD
          </span>
        </Link>

        {/* Desktop Navigation links */}
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

        {/* Right Actions (Scan CTA + Mobile Menu Button) */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/analyze"
            onClick={closeMenu}
            className="inline-flex items-center justify-center px-4 py-2 bg-[#b6ff00] text-[#050505] hover:bg-[#c9ff33] text-xs font-semibold rounded-full transition-all hover:scale-[1.02]"
          >
            Scan Message
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg bg-[#111111] border border-white/10 text-[#888888] hover:text-[#f2f2f2] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0a0a0a] px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          <Link
            href="/analyze"
            onClick={closeMenu}
            className="block px-3 py-2.5 rounded-lg text-xs font-medium text-[#d1d1d1] hover:text-white hover:bg-[#141414] transition-colors"
          >
            Analyze
          </Link>
          <Link
            href="/dashboard"
            onClick={closeMenu}
            className="block px-3 py-2.5 rounded-lg text-xs font-medium text-[#d1d1d1] hover:text-white hover:bg-[#141414] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/threat-vectors"
            onClick={closeMenu}
            className="block px-3 py-2.5 rounded-lg text-xs font-medium text-[#d1d1d1] hover:text-white hover:bg-[#141414] transition-colors"
          >
            Threat Vectors
          </Link>
          <Link
            href="/awareness"
            onClick={closeMenu}
            className="block px-3 py-2.5 rounded-lg text-xs font-medium text-[#d1d1d1] hover:text-white hover:bg-[#141414] transition-colors"
          >
            Awareness Directives
          </Link>
          <Link
            href="/#about"
            onClick={closeMenu}
            className="block px-3 py-2.5 rounded-lg text-xs font-medium text-[#d1d1d1] hover:text-white hover:bg-[#141414] transition-colors"
          >
            Helpline
          </Link>
        </div>
      )}
    </header>
  );
}
