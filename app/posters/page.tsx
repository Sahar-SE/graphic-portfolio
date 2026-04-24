'use client';

import { useState, useEffect } from 'react';
import { fetchProjectsByCategory } from '@/lib/firestore';
import { Project } from '@/lib/store';
import PosterModal from '@/components/PosterModal';

export default function PostersPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState('All');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectsByCategory('posters')
      .then(setProjects)
      .finally(() => { setLoading(false); setMounted(true); });
  }, []);

  const allTags = ['All', ...Array.from(new Set(projects.flatMap((p) => p.tags || [])))];
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.tags?.includes(filter));

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className={`mb-14 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="font-mono text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-4">01 —</p>
        <h1 className="font-display text-6xl md:text-7xl font-black mb-5 leading-tight">
          Posters &<br /><em className="shimmer-gold">Flyers</em>
        </h1>
        <p className="text-[rgba(245,240,232,0.5)] text-lg max-w-xl leading-relaxed">
          Print designs that speak before a word is read. Click any project to explore it.
        </p>
      </div>

      {allTags.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {allTags.map((tag) => (
            <button key={tag} onClick={() => setFilter(tag)}
              className={`px-4 py-1.5 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-200 border ${
                filter === tag
                  ? 'bg-[var(--gold)] text-[var(--ink)] border-[var(--gold)]'
                  : 'border-[rgba(201,168,76,0.25)] text-[rgba(245,240,232,0.5)] hover:border-[var(--gold)] hover:text-[var(--gold)]'
              }`}>{tag}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-40">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-[var(--gold)] border-t-transparent animate-spin" />
            <p className="font-mono text-xs tracking-widest uppercase text-[rgba(245,240,232,0.3)]">Loading…</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-32 text-[rgba(245,240,232,0.3)]">
          <p className="font-display text-4xl italic mb-4">No projects yet</p>
          <p className="font-mono text-sm">Add your first poster in the Admin panel</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <button key={project.id} onClick={() => setSelected(project)}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] card-hover text-left block w-full"
              style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s` }}
              data-hover>
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a25] to-[#0d0d16] flex items-center justify-center">
                  <span className="text-[rgba(245,240,232,0.1)] text-6xl">✦</span>
                </div>
              )}
              <div className="img-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,15,0.9)] via-transparent to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--gold)] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex flex-wrap gap-1.5 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  {project.tags?.slice(0, 2).map((tag) => <span key={tag} className="tag-pill text-[9px]">{tag}</span>)}
                </div>
                <h3 className="font-display text-xl font-bold leading-tight">{project.title}</h3>
                <p className="text-[rgba(245,240,232,0.5)] text-xs mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{project.description}</p>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[rgba(201,168,76,0.9)] text-[var(--ink)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      <PosterModal project={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
