'use client';

import { useState, useEffect } from 'react';
import { fetchProjectsByCategory } from '@/lib/firestore';
import { Project, Category } from '@/lib/store';
import VideoModal from '@/components/VideoModal';

interface Props {
  category: Category;
  title: string;
  subtitle: string;
  number: string;
  accentColor: string;
}

export default function VideoGalleryPage({ category, title, subtitle, number, accentColor }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState('All');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectsByCategory(category)
      .then(setProjects)
      .finally(() => { setLoading(false); setMounted(true); });
  }, [category]);

  const allTags = ['All', ...Array.from(new Set(projects.flatMap((p) => p.tags || [])))];
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.tags?.includes(filter));

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className={`mb-14 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <p className="font-mono text-xs tracking-[0.35em] uppercase mb-4" style={{ color: accentColor }}>{number} —</p>
        <h1 className="font-display text-6xl md:text-7xl font-black mb-5 leading-tight">
          {title.split(' ').map((word, i, arr) =>
            i === arr.length - 1
              ? <em key={i} style={{ WebkitTextFillColor: 'transparent', background: `linear-gradient(90deg, ${accentColor}, ${accentColor}99)`, WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>{word}</em>
              : <span key={i}>{word} </span>
          )}
        </h1>
        <p className="text-[rgba(245,240,232,0.5)] text-lg max-w-xl leading-relaxed">{subtitle}</p>
      </div>

      {allTags.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {allTags.map((tag) => (
            <button key={tag} onClick={() => setFilter(tag)}
              className="px-4 py-1.5 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-200 border"
              style={filter === tag
                ? { background: accentColor, color: '#0a0a0f', borderColor: accentColor }
                : { borderColor: `${accentColor}44`, color: 'rgba(245,240,232,0.5)' }}>
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-40">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${accentColor} transparent transparent transparent` }} />
            <p className="font-mono text-xs tracking-widest uppercase text-[rgba(245,240,232,0.3)]">Loading…</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-32 text-[rgba(245,240,232,0.3)]">
          <p className="font-display text-4xl italic mb-4">No projects yet</p>
          <p className="font-mono text-sm">Add your first project in the Admin panel</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <button key={project.id} onClick={() => setSelected(project)}
              className="group relative overflow-hidden rounded-xl card-hover text-left block w-full"
              style={{ aspectRatio: '16/10', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s` }}
              data-hover>
              {project.thumbnailUrl ? (
                <img src={project.thumbnailUrl} alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1a1a25 0%, #0d0d16 100%)' }}>
                  <span className="text-[rgba(245,240,232,0.06)] text-8xl">▶</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,15,0.9)] via-[rgba(10,10,15,0.2)] to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(10,10,15,0.7)', border: `2px solid ${accentColor}88`, backdropFilter: 'blur(8px)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={accentColor} style={{ marginLeft: '2px' }}>
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              </div>
              <div className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" style={{ background: accentColor }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex flex-wrap gap-1.5 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="tag-pill text-[9px]" style={{ borderColor: `${accentColor}55`, color: accentColor }}>{tag}</span>
                  ))}
                </div>
                <h3 className="font-display text-xl font-bold leading-tight">{project.title}</h3>
                <p className="text-[rgba(245,240,232,0.45)] text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2">{project.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <VideoModal project={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
