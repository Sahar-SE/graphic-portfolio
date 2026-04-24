'use client';

import { useEffect } from 'react';
import { Project, getDriveEmbedUrl, getDriveOpenUrl } from '@/lib/store';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function VideoModal({ project, onClose }: Props) {
  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [project, onClose]);

  if (!project) return null;

  const embedUrl    = project.driveLink ? getDriveEmbedUrl(project.driveLink) : '';
  const openUrl     = project.driveLink ? getDriveOpenUrl(project.driveLink)  : '';
  const thumbSrc    = project.thumbnailUrl || '';
  const hasRealLink = !!project.driveLink && project.driveLink.includes('drive.google.com');

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 modal-backdrop bg-[rgba(10,10,15,0.92)]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#111118] rounded-2xl overflow-hidden shadow-2xl border border-[rgba(201,168,76,0.12)] animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[rgba(10,10,15,0.85)] border border-[rgba(201,168,76,0.2)] text-[var(--paper)] hover:bg-[var(--gold)] hover:text-[var(--ink)] transition-all duration-200 flex items-center justify-center text-lg"
          aria-label="Close">✕</button>

        {/* Video area */}
        <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
          {hasRealLink ? (
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={project.title}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0a0f]">
              {thumbSrc && <img src={thumbSrc} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
              <div className="relative z-10 text-center px-6">
                <p className="font-mono text-xs tracking-widest uppercase text-[var(--gold)] mb-2">No video link</p>
                <p className="text-[rgba(245,240,232,0.45)] text-sm">Add a Google Drive link in the Admin panel</p>
              </div>
            </div>
          )}
        </div>

        {/* Info bar */}
        <div className="px-7 py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--gold)] opacity-60 mb-1">
              {project.category === 'video-editing' ? 'Video Editing' : 'Motion Graphics'}
            </p>
            <h2 className="font-display text-xl font-bold">{project.title}</h2>
            {project.description && (
              <p className="text-sm text-[rgba(245,240,232,0.45)] mt-1 max-w-lg">{project.description}</p>
            )}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {project.tags.map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}
              </div>
            )}
          </div>
          {hasRealLink && (
            <a href={openUrl} target="_blank" rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[var(--gold)] text-[var(--ink)] font-mono text-xs tracking-widest uppercase rounded-full hover:bg-[var(--gold-light)] transition-all duration-200 font-medium">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Open in Drive
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
