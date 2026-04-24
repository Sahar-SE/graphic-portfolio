'use client';

import { useEffect, useRef, useState } from 'react';

const skills = [
  { name: 'Photoshop', color: '#31A8FF', icon: '🎨' },
  { name: 'Illustrator', color: '#FF9A00', icon: '✏️' },
  { name: 'After Effects', color: '#9999FF', icon: '🎬' },
  { name: 'Premiere Pro', color: '#EA77FF', icon: '🎞️' },
  { name: 'Audition', color: '#00EDD1', icon: '🔊' },
  { name: 'InDesign', color: '#FF3366', icon: '📄' },
  { name: 'Figma', color: '#A259FF', icon: '◻️' },
  { name: 'Canva', color: '#00D9FF', icon: '✨' },
];

export default function SkillsSection() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      const items = containerRef.current.querySelectorAll<HTMLElement>('[data-skill]');
      items.forEach((el, i) => {
        el.style.transform = `translateY(${Math.max(0, (1 - scrollProgress) * 30)}px)`;
        el.style.opacity = String(Math.max(0.5, scrollProgress));
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-transparent via-[rgba(201,168,76,0.04)] to-transparent"
    >
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.08] blur-[100px] pointer-events-none" style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 rounded-full opacity-[0.06] blur-[80px] pointer-events-none" style={{ background: 'radial-gradient(circle, #2ab3a3 0%, transparent 70%)' }} />

      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(245,240,232,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,0.5) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className={`mb-20 text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-mono text-xs tracking-[0.4em] uppercase text-[var(--gold)] mb-4">Professional Toolkit</p>
          <h2 className="font-display text-5xl md:text-6xl font-black mb-6 leading-tight">
            Tools &<br/><em className="shimmer-gold">Expertise</em>
          </h2>
          <p className="text-[rgba(245,240,232,0.5)] text-lg max-w-2xl mx-auto leading-relaxed">
            Mastering industry-standard software to bring creative visions to life with precision and artistry.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills.map((skill, i) => (
            <div
              key={skill.name}
              data-skill
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative overflow-hidden rounded-2xl p-8 backdrop-blur-sm border border-[rgba(201,168,76,0.1)] card-hover cursor-pointer transition-all duration-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: `${i * 50}ms`,
                background: hoveredIndex === i ? `rgba(${parseInt(skill.color.slice(1, 3), 16)}, ${parseInt(skill.color.slice(3, 5), 16)}, ${parseInt(skill.color.slice(5, 7), 16)}, 0.08)` : 'rgba(10, 10, 15, 0.4)',
                borderColor: hoveredIndex === i ? `${skill.color}40` : 'rgba(201, 168, 76, 0.1)',
              }}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${skill.color}15, transparent 70%)` }} />

              {/* Animated border */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `conic-gradient(from 0deg, ${skill.color}, transparent)`,
                  borderRadius: 'inherit',
                }}
              >
                <div className="absolute inset-1 bg-[rgba(10,10,15,0.4)] rounded-2xl" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`text-4xl mb-4 transition-all duration-500 transform ${hoveredIndex === i ? 'scale-110 translate-y-0' : 'scale-100'}`}>
                  {skill.icon}
                </div>

                {/* Name */}
                <h3 className="font-display text-2xl font-bold mb-3 relative">
                  <span className="relative inline-block">
                    {skill.name}
                    <span
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r rounded-full transition-all duration-500"
                      style={{
                        background: `linear-gradient(90deg, ${skill.color}, ${skill.color}66)`,
                        width: hoveredIndex === i ? '100%' : '0%',
                      }}
                    />
                  </span>
                </h3>

                {/* Skill level bar */}
                <div className="relative h-1.5 bg-[rgba(201,168,76,0.1)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      background: `linear-gradient(90deg, ${skill.color}, ${skill.color}66)`,
                      width: mounted && hoveredIndex === i ? '100%' : (mounted ? '85%' : '0%'),
                      boxShadow: hoveredIndex === i ? `0 0 12px ${skill.color}` : 'none',
                    }}
                  />
                </div>

                {/* Expert badge */}
                <div className="mt-4 inline-block">
                  <span className="px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase border transition-all duration-500" style={{
                    color: skill.color,
                    borderColor: hoveredIndex === i ? skill.color : `${skill.color}40`,
                    backgroundColor: hoveredIndex === i ? `${skill.color}15` : 'transparent',
                  }}>
                    Expert
                  </span>
                </div>
              </div>

              {/* Hover glow effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${skill.color}10, transparent 70%)`,
                  filter: 'blur(20px)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Footer text */}
        <div className={`mt-20 text-center transition-all duration-1000 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-[rgba(245,240,232,0.4)] font-mono text-sm tracking-widest uppercase">
            Continuously evolving with the latest creative technologies
          </p>
        </div>
      </div>
    </section>
  );
}
