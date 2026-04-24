'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const marqueeItems = [
  'Graphic Design', '✦', 'Video Editing', '✦', 'Motion Graphics', '✦',
  'Posters', '✦', 'Flyers', '✦', 'Brand Identity', '✦', 'Creative Direction', '✦',
  'Graphic Design', '✦', 'Video Editing', '✦', 'Motion Graphics', '✦',
  'Posters', '✦', 'Flyers', '✦', 'Brand Identity', '✦', 'Creative Direction', '✦',
];

const categories = [
  {
    href: '/posters',
    label: 'Posters & Flyers',
    desc: 'Print design that commands attention. Bold layouts, refined typography.',
    num: '01',
    accent: '#c9a84c',
    img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
  },
  {
    href: '/video-editing',
    label: 'Video Editing',
    desc: 'Cinematic narratives crafted frame by frame. Color, rhythm, emotion.',
    num: '02',
    accent: '#2ab3a3',
    img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
  },
  {
    href: '/motion-graphics',
    label: 'Motion Graphics',
    desc: 'Kinetic design in motion. Logos, promos, and animated identities.',
    num: '03',
    accent: '#c0392b',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parallax on hero
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX / w - 0.5) * 30;
      const y = (e.clientY / h - 0.5) * 20;
      const layers = heroRef.current.querySelectorAll<HTMLElement>('[data-parallax]');
      layers.forEach((el) => {
        const factor = parseFloat(el.dataset.parallax || '1');
        el.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--ink)] text-[var(--paper)] overflow-hidden">
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
      >
        {/* Background orbs */}
        <div
          data-parallax="0.4"
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-[80px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)' }}
        />
        <div
          data-parallax="0.6"
          className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-15 blur-[60px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #2ab3a3 0%, transparent 70%)' }}
        />
        <div
          data-parallax="0.2"
          className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full opacity-10 blur-[50px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #c0392b 0%, transparent 70%)' }}
        />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,240,232,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Main hero text */}
        <div className="relative z-10 text-center max-w-5xl">
          <div
            className={`font-mono text-xs tracking-[0.4em] uppercase text-[var(--gold)] mb-8 transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Graphic Design Portfolio
          </div>

          <h1
            className={`font-display text-6xl md:text-8xl lg:text-[9rem] font-black leading-[0.9] tracking-tight mb-6 transition-all duration-1000 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="block shimmer-gold">Design</span>
            <span className="block text-[var(--paper)] italic">in</span>
            <span className="block shimmer-gold">Motion</span>
          </h1>

          <p
            className={`text-[rgba(245,240,232,0.55)] text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-16 transition-all duration-1000 delay-400 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            A curated collection of graphic design, video editing, and motion graphics — where every pixel tells a story.
          </p>

          <div
            className={`flex flex-wrap gap-4 justify-center transition-all duration-1000 delay-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link
              href="/posters"
              className="px-8 py-3.5 bg-[var(--gold)] text-[var(--ink)] font-mono text-sm tracking-widest uppercase font-medium rounded-full hover:bg-[var(--gold-light)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              View Work
            </Link>
            <Link
              href="/motion-graphics"
              className="px-8 py-3.5 border border-[rgba(201,168,76,0.4)] text-[var(--gold)] font-mono text-sm tracking-widest uppercase rounded-full hover:border-[var(--gold)] hover:bg-[rgba(201,168,76,0.08)] transition-all duration-300"
            >
              Watch Reels
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-mono text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[var(--gold)] to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="py-5 border-y border-[rgba(201,168,76,0.15)] overflow-hidden bg-[rgba(201,168,76,0.03)] mt-10">
        <div className="marquee-track">
          {marqueeItems.map((item, i) => (
            <span
              key={i}
              className={`px-6 font-mono text-sm tracking-widest uppercase whitespace-nowrap ${
                item === '✦' ? 'text-[var(--gold)] text-xs' : 'text-[rgba(245,240,232,0.35)]'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="mb-16 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--gold)] mb-3">Explore</p>
            <h2 className="font-display text-5xl md:text-6xl font-bold">
              Craft & <em>Vision</em>
            </h2>
          </div>
          <p className="text-[rgba(245,240,232,0.45)] max-w-xs text-sm leading-relaxed">
            Three disciplines. One cohesive voice. Explore each dimension of the creative process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(({ href, label, desc, num, accent, img }, i) => (
            <Link
              key={href}
              href={href}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] card-hover block"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* BG Image */}
              <img
                src={img}
                alt={label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,15,0.95)] via-[rgba(10,10,15,0.5)] to-transparent" />

              {/* Number */}
              <div
                className="absolute top-6 right-6 font-display text-7xl font-black opacity-10 leading-none select-none"
                style={{ color: accent }}
              >
                {num}
              </div>

              {/* Accent line */}
              <div
                className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: accent }}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-7">
                <p className="font-mono text-[10px] tracking-widest uppercase mb-3 opacity-60" style={{ color: accent }}>
                  {num}
                </p>
                <h3 className="font-display text-2xl font-bold mb-2 leading-tight">{label}</h3>
                <p className="text-sm text-[rgba(245,240,232,0.55)] leading-relaxed max-w-[220px] translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                  {desc}
                </p>
                <div className="mt-4 flex items-center gap-2 font-mono text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-400 delay-100" style={{ color: accent }}>
                  Explore <span className="text-base">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
