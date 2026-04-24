'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  fetchAllProjects, createProject, editProject,
  removeProject, compressAndEncodeImage,
} from '@/lib/firestore';
import { checkAdminPassword, setAdminPassword, Project, Category } from '@/lib/store';

type Tab = 'posters' | 'video-editing' | 'motion-graphics';

const TABS: { id: Tab; label: string; color: string }[] = [
  { id: 'posters',         label: 'Posters & Flyers', color: '#c9a84c' },
  { id: 'video-editing',   label: 'Video Editing',     color: '#2ab3a3' },
  { id: 'motion-graphics', label: 'Motion Graphics',   color: '#c0392b' },
];

interface FormState {
  title: string;
  description: string;
  tags: string;
  imageUrl: string;
  driveLink: string;
  thumbnailUrl: string;
}

function emptyForm(): FormState {
  return { title: '', description: '', tags: '', imageUrl: '', driveLink: '', thumbnailUrl: '' };
}

export default function AdminPage() {
  const [authed,        setAuthed]       = useState(false);
  const [password,      setPassword]     = useState('');
  const [pwError,       setPwError]      = useState('');
  const [tab,           setTab]          = useState<Tab>('posters');
  const [projects,      setProjects]     = useState<Project[]>([]);
  const [showForm,      setShowForm]     = useState(false);
  const [editId,        setEditId]       = useState<string | null>(null);
  const [form,          setForm]         = useState<FormState>(emptyForm());
  const [imgFile,       setImgFile]      = useState<File | null>(null);
  const [thumbFile,     setThumbFile]    = useState<File | null>(null);
  const [imgPreview,    setImgPreview]   = useState('');
  const [thumbPreview,  setThumbPreview] = useState('');
  const [saving,        setSaving]       = useState(false);
  const [loading,       setLoading]      = useState(false);
  const [toast,         setToast]        = useState('');
  const [changePwMode,  setChangePwMode] = useState(false);
  const [newPw,         setNewPw]        = useState('');
  const imgRef   = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      setProjects(await fetchAllProjects());
    } catch {
      showToast('Error loading. Check Firebase config.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (authed) loadProjects(); }, [authed, loadProjects]);

  // ── AUTH ─────────────────────────────────────────────────────────────────
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (checkAdminPassword(password)) { setAuthed(true); setPwError(''); }
    else setPwError('Wrong password.');
  }

  // ── FILE PICK ────────────────────────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'thumb') {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (type === 'image') {
      setImgFile(file);
      setImgPreview(preview);
    } else {
      setThumbFile(file);
      setThumbPreview(preview);
    }
    // Reset the corresponding URL field so the file takes priority
    if (type === 'image') setForm(f => ({ ...f, imageUrl: '' }));
    else setForm(f => ({ ...f, thumbnailUrl: '' }));
    // Reset input so same file can be re-selected
    e.target.value = '';
  }

  // ── FORM OPEN ────────────────────────────────────────────────────────────
  function openAdd() {
    setForm(emptyForm());
    setImgFile(null); setThumbFile(null);
    setImgPreview(''); setThumbPreview('');
    setEditId(null); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openEdit(p: Project) {
    setForm({
      title:       p.title,
      description: p.description,
      tags:        (p.tags || []).join(', '),
      imageUrl:    p.imageUrl    || '',
      driveLink:   p.driveLink   || '',
      thumbnailUrl: p.thumbnailUrl || '',
    });
    setImgFile(null); setThumbFile(null);
    setImgPreview(p.imageUrl || '');
    setThumbPreview(p.thumbnailUrl || '');
    setEditId(p.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── SAVE ─────────────────────────────────────────────────────────────────
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { showToast('Title is required.'); return; }
    setSaving(true);
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);

      // Resolve image URLs — file upload takes priority over URL field
      let imageUrl     = imgFile  ? undefined : (form.imageUrl    || undefined);
      let thumbnailUrl = thumbFile ? undefined : (form.thumbnailUrl || undefined);

      if (imgFile)   imageUrl     = await compressAndEncodeImage(imgFile,  1200, 1200, 0.82);
      if (thumbFile) thumbnailUrl = await compressAndEncodeImage(thumbFile, 800,  600, 0.80);

      const payload = {
        category:    tab as Category,
        title:       form.title.trim(),
        description: form.description.trim(),
        tags,
        ...(imageUrl     !== undefined && { imageUrl }),
        ...(form.driveLink.trim()   && { driveLink:    form.driveLink.trim() }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
      };

      if (editId) {
        await editProject(editId, payload);
        showToast('✓ Project updated!');
      } else {
        await createProject(payload);
        showToast('✓ Project added!');
      }
      await loadProjects();
      setShowForm(false);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('permission') || msg.includes('Missing or insufficient')) {
        showToast('Permission denied — check your Firestore rules & ADMIN_SECRET.');
      } else if (msg.includes('quota')) {
        showToast('Firestore quota exceeded. Try again later.');
      } else {
        showToast('Error saving: ' + msg.slice(0, 80));
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: Project) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try {
      await removeProject(p.id);
      showToast('Deleted.');
      await loadProjects();
    } catch (err: unknown) {
      showToast('Delete failed: ' + (err instanceof Error ? err.message : String(err)).slice(0, 80));
    }
  }

  function handleChangePw(e: React.FormEvent) {
    e.preventDefault();
    if (newPw.length < 4) { alert('Min 4 characters.'); return; }
    setAdminPassword(newPw);
    setNewPw(''); setChangePwMode(false);
    showToast('✓ Password updated!');
  }

  const tabProjects = projects.filter(p => p.category === tab);
  const cur = TABS.find(t => t.id === tab)!;

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-4 text-center">Admin Access</p>
        <h1 className="font-display text-4xl font-bold text-center mb-8">Sign In</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input className="admin-input" type="password"
            placeholder="Enter admin password"
            value={password} onChange={e => setPassword(e.target.value)} autoFocus />
          {pwError && <p className="text-[#e74c3c] text-xs font-mono">{pwError}</p>}
          <button type="submit"
            className="px-6 py-3 bg-[var(--gold)] text-[var(--ink)] font-mono text-sm tracking-widest uppercase rounded-full hover:bg-[var(--gold-light)] transition-all duration-200 font-medium">
            Enter
          </button>
        </form>
      </div>
    </div>
  );

  // ── ADMIN PANEL ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-20 pb-24 px-4 md:px-6 max-w-6xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--gold)] text-[var(--ink)] px-5 py-3 rounded-full font-mono text-sm shadow-xl" style={{ animation: 'fadeUp 0.3s ease' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pt-4">
        <div>
          <p className="font-mono text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-2">Admin Panel</p>
          <h1 className="font-display text-4xl font-bold">Manage Projects</h1>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => setChangePwMode(v => !v)}
            className="px-4 py-2 text-xs font-mono tracking-widest uppercase border border-[rgba(201,168,76,0.25)] text-[rgba(245,240,232,0.45)] hover:border-[var(--gold)] hover:text-[var(--gold)] rounded-full transition-all">
            Change Password
          </button>
          <button onClick={() => { setAuthed(false); setPassword(''); }}
            className="px-4 py-2 text-xs font-mono tracking-widest uppercase border border-[rgba(231,76,60,0.25)] text-[rgba(231,76,60,0.5)] hover:border-[#e74c3c] hover:text-[#e74c3c] rounded-full transition-all">
            Sign Out
          </button>
        </div>
      </div>

      {/* Change password */}
      {changePwMode && (
        <form onSubmit={handleChangePw}
          className="mb-8 p-5 rounded-xl border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.03)] flex gap-3 items-center flex-wrap">
          <input className="admin-input flex-1 min-w-[200px]" type="password"
            placeholder="New password (min 4 chars)" value={newPw} onChange={e => setNewPw(e.target.value)} />
          <button type="submit"
            className="px-5 py-2.5 bg-[var(--gold)] text-[var(--ink)] font-mono text-xs tracking-widest uppercase rounded-full hover:bg-[var(--gold-light)] transition-all font-medium">
            Save
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(({ id, label, color }) => (
          <button key={id} onClick={() => { setTab(id); setShowForm(false); }}
            className="px-5 py-2 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-200 border"
            style={tab === id
              ? { background: color, color: '#0a0a0f', borderColor: color }
              : { borderColor: `${color}40`, color: 'rgba(245,240,232,0.5)' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Add button */}
      {!showForm && (
        <button onClick={openAdd}
          className="mb-8 flex items-center gap-2 px-6 py-3 rounded-full font-mono text-sm tracking-widest uppercase font-medium transition-all hover:scale-105 active:scale-95"
          style={{ background: cur.color, color: '#0a0a0f' }}>
          <span className="text-xl leading-none">+</span> Add Project
        </button>
      )}

      {/* ── FORM ── */}
      {showForm && (
        <form onSubmit={handleSave}
          className="mb-10 p-6 md:p-8 rounded-2xl border border-[rgba(201,168,76,0.15)] bg-[rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">{editId ? 'Edit' : 'New'} Project</h2>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
              className="text-[rgba(245,240,232,0.3)] hover:text-[var(--paper)] text-2xl transition-colors">✕</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="admin-label">Title *</label>
              <input className="admin-input" placeholder="Project title" required
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="admin-label">Description</label>
              <textarea className="admin-input resize-none" rows={3} placeholder="Brief description…"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <label className="admin-label">Tags <span className="opacity-50">(comma separated)</span></label>
              <input className="admin-input" placeholder="e.g. Print, Typography, Event"
                value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>

            {/* ── POSTER FIELDS ── */}
            {tab === 'posters' && (<>
              <div className="md:col-span-2">
                <label className="admin-label">Poster Image — Upload File</label>
                <div className="border-2 border-dashed border-[rgba(201,168,76,0.2)] rounded-xl p-5 text-center cursor-pointer hover:border-[var(--gold)] transition-colors"
                  onClick={() => imgRef.current?.click()}>
                  {imgPreview ? (
                    <>
                      <img src={imgPreview} alt="Preview"
                        className="max-h-52 mx-auto rounded-lg object-contain mb-2" />
                      <p className="text-[var(--gold)] text-xs font-mono opacity-60">Click to change image</p>
                    </>
                  ) : (
                    <div className="py-6">
                      <div className="text-4xl mb-3 opacity-20">🖼️</div>
                      <p className="text-[rgba(245,240,232,0.4)] text-sm font-mono">Click to upload poster image</p>
                      <p className="text-[rgba(245,240,232,0.2)] text-xs mt-1">JPG, PNG, WebP · auto-compressed</p>
                    </div>
                  )}
                  <input ref={imgRef} type="file" accept="image/*" className="hidden"
                    onChange={e => handleFileChange(e, 'image')} />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">— or paste an image URL instead</label>
                <input className="admin-input" placeholder="https://example.com/image.jpg"
                  value={form.imageUrl}
                  onChange={e => {
                    setForm(f => ({ ...f, imageUrl: e.target.value }));
                    if (e.target.value) { setImgFile(null); setImgPreview(e.target.value); }
                    else setImgPreview('');
                  }} />
              </div>
            </>)}

            {/* ── VIDEO FIELDS ── */}
            {(tab === 'video-editing' || tab === 'motion-graphics') && (<>
              <div className="md:col-span-2">
                <label className="admin-label" style={{ color: cur.color }}>Google Drive Video Link</label>
                <input className="admin-input" placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
                  value={form.driveLink} onChange={e => setForm(f => ({ ...f, driveLink: e.target.value }))} />
                <p className="text-[rgba(245,240,232,0.25)] text-xs font-mono mt-1.5">
                  In Drive: right-click video → Share → "Anyone with the link" → Copy link
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="admin-label">Thumbnail — Upload File</label>
                <div className="border-2 border-dashed border-[rgba(201,168,76,0.15)] rounded-xl p-5 text-center cursor-pointer hover:border-[var(--gold)] transition-colors"
                  onClick={() => thumbRef.current?.click()}>
                  {thumbPreview ? (
                    <>
                      <img src={thumbPreview} alt="Thumb"
                        className="max-h-36 mx-auto rounded-lg object-contain mb-2" />
                      <p className="text-[var(--gold)] text-xs font-mono opacity-60">Click to change</p>
                    </>
                  ) : (
                    <div className="py-4">
                      <p className="text-[rgba(245,240,232,0.4)] text-sm font-mono">Click to upload thumbnail</p>
                      <p className="text-[rgba(245,240,232,0.2)] text-xs mt-1">Shown as card preview</p>
                    </div>
                  )}
                  <input ref={thumbRef} type="file" accept="image/*" className="hidden"
                    onChange={e => handleFileChange(e, 'thumb')} />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">— or paste a thumbnail URL instead</label>
                <input className="admin-input" placeholder="https://example.com/thumb.jpg"
                  value={form.thumbnailUrl}
                  onChange={e => {
                    setForm(f => ({ ...f, thumbnailUrl: e.target.value }));
                    if (e.target.value) { setThumbFile(null); setThumbPreview(e.target.value); }
                    else setThumbPreview('');
                  }} />
              </div>
            </>)}
          </div>

          {/* Submit */}
          <div className="flex gap-3 mt-7">
            <button type="submit" disabled={saving}
              className="px-7 py-3 rounded-full font-mono text-sm tracking-widest uppercase font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
              style={{ background: cur.color, color: '#0a0a0f' }}>
              {saving && <span className="w-4 h-4 rounded-full border-2 border-[#0a0a0f] border-t-transparent animate-spin" />}
              {saving ? 'Saving…' : editId ? 'Update Project' : 'Add Project'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
              className="px-6 py-3 rounded-full font-mono text-sm tracking-widest uppercase border border-[rgba(245,240,232,0.1)] text-[rgba(245,240,232,0.4)] hover:border-[rgba(245,240,232,0.3)] hover:text-[var(--paper)] transition-all">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── PROJECT LIST ── */}
      <div>
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-[rgba(245,240,232,0.3)] mb-5">
          {loading ? 'Loading…' : `${tabProjects.length} project${tabProjects.length !== 1 ? 's' : ''}`}
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: `${cur.color} transparent transparent transparent` }} />
          </div>
        ) : tabProjects.length === 0 ? (
          <div className="text-center py-20 text-[rgba(245,240,232,0.2)]">
            <p className="font-display text-3xl italic mb-2">No projects yet</p>
            <p className="font-mono text-sm">Click "Add Project" above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tabProjects.map(p => {
              const thumb = p.imageUrl || p.thumbnailUrl || '';
              return (
                <div key={p.id}
                  className="group rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(201,168,76,0.2)] transition-all duration-300">
                  <div className="aspect-video bg-[#0d0d16] overflow-hidden relative">
                    {thumb
                      ? <img src={thumb} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      : <div className="w-full h-full flex items-center justify-center text-[rgba(245,240,232,0.06)] text-5xl">
                          {tab === 'posters' ? '🖼' : '▶'}
                        </div>
                    }
                    {p.driveLink && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-[rgba(10,10,15,0.85)] font-mono text-[9px] tracking-widest uppercase"
                        style={{ color: cur.color }}>
                        Drive ✓
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base font-bold mb-1 line-clamp-1">{p.title}</h3>
                    <p className="text-[rgba(245,240,232,0.4)] text-xs line-clamp-2 mb-3">{p.description}</p>
                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {p.tags.slice(0, 3).map(t => <span key={t} className="tag-pill">{t}</span>)}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)}
                        className="flex-1 py-1.5 text-xs font-mono tracking-widest uppercase border border-[rgba(201,168,76,0.2)] text-[rgba(201,168,76,0.6)] hover:border-[var(--gold)] hover:text-[var(--gold)] rounded-full transition-all">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p)}
                        className="flex-1 py-1.5 text-xs font-mono tracking-widest uppercase border border-[rgba(231,76,60,0.2)] text-[rgba(231,76,60,0.5)] hover:border-[#e74c3c] hover:text-[#e74c3c] rounded-full transition-all">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
