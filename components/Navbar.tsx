'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/posters', label: 'Posters & Flyers' },
  { href: '/video-editing', label: 'Video Editing' },
  { href: '/motion-graphics', label: 'Motion Graphics' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(10,10,15,0.92)] backdrop-blur-md border-b border-[rgba(201,168,76,0.15)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          {/* Animated Logo Icon */}
          <div className="relative w-8 h-8">
            <svg
              viewBox="0 0 64 64"
              className="w-full h-full animate-spin-slow"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(201, 168, 76, 0.4))',
              }}
            >
              {/* Rotating diamond/cube shape */}
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#c9a84c', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#d4af37', stopOpacity: 0.7 }} />
                </linearGradient>
              </defs>
              {/* Outer rotating polygon */}
              <polygon
                points="32,4 58,16 58,48 32,60 6,48 6,16"
                fill="none"
                stroke="url(#logoGrad)"
                strokeWidth="2.5"
                opacity="0.8"
              />
              {/* Inner rotating polygon */}
              <polygon
                points="32,12 54,22 54,42 32,52 10,42 10,22"
                fill="none"
                stroke="url(#logoGrad)"
                strokeWidth="1.5"
                opacity="0.5"
              />
              {/* Center dot */}
              <circle cx="32" cy="32" r="3" fill="#c9a84c" opacity="0.9" />
            </svg>
          </div>

          {/* Text Logo */}
          <div className="flex flex-col leading-tight">
            <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-[#c9a84c] to-[#d4af37] bg-clip-text text-transparent group-hover:from-[#d4af37] group-hover:to-[#e5c158] transition-all duration-300">
              SAHAR
            </span>
            <span className="font-mono text-xs tracking-widest text-[rgba(201,168,76,0.7)] group-hover:text-[#c9a84c] transition-colors duration-300">
              DESIGN
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => {
            const active = pathname === href || (href !== '/' && pathname?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-mono tracking-widest uppercase transition-all duration-300 relative group ${
                  active ? 'text-[var(--gold)]' : 'text-[rgba(245,240,232,0.6)] hover:text-[var(--paper)]'
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-[var(--gold)] transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
          <Link
            href="/admin"
            className="text-xs font-mono tracking-widest uppercase px-4 py-1.5 border border-[rgba(201,168,76,0.3)] text-[rgba(201,168,76,0.6)] hover:border-[var(--gold)] hover:text-[var(--gold)] rounded-full transition-all duration-300"
          >
            Admin
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-[var(--gold)] transition-all duration-300 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-[var(--gold)] transition-all duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-[var(--gold)] transition-all duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-[rgba(10,10,15,0.97)] border-t border-[rgba(201,168,76,0.1)]`}
      >
        <div className="px-6 py-6 flex flex-col gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-mono tracking-widest uppercase text-[rgba(245,240,232,0.7)] hover:text-[var(--gold)] transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-mono tracking-widest uppercase text-[rgba(201,168,76,0.6)] hover:text-[var(--gold)] transition-colors duration-200"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </nav>
  );
}
