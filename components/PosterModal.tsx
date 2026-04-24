'use client';

import { useEffect } from 'react';
import { Project } from '@/lib/store';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function PosterModal({ project, onClose }: Props) {
  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [project, onClose]);

  if (!project) return null;
  const imgSrc = project.imageUrl || '';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 modal-backdrop bg-[rgba(10,10,15,0.88)]"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-[#111118] rounded-2xl overflow-hidden shadow-2xl border border-[rgba(201,168,76,0.15)] animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[rgba(10,10,15,0.8)] border border-[rgba(201,168,76,0.2)] text-[var(--paper)] hover:bg-[var(--gold)] hover:text-[var(--ink)] transition-all duration-200 flex items-center justify-center text-lg"
          aria-label="Close">✕</button>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-3/5 bg-[#0d0d12] flex items-center justify-center min-h-[300px]">
            {imgSrc ? (
              <img src={imgSrc} alt={project.title} className="w-full h-full object-contain max-h-[70vh]" />
            ) : (
              <div className="flex items-center justify-center w-full h-64 text-[rgba(245,240,232,0.1)] text-6xl">🖼</div>
            )}
          </div>
          <div className="md:w-2/5 p-8 flex flex-col justify-center">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--gold)] mb-4 opacity-70">Poster & Flyer</p>
            <h2 className="font-display text-3xl font-bold mb-4 leading-tight">{project.title}</h2>
            {project.description && (
              <p className="text-[rgba(245,240,232,0.6)] text-sm leading-relaxed mb-6">{project.description}</p>
            )}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}
              </div>
            )}
            <p className="mt-6 font-mono text-xs text-[rgba(245,240,232,0.25)]">
              {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
