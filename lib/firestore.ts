import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, Timestamp,
} from 'firebase/firestore';
import { db, ADMIN_SECRET } from './firebase';
import type { Project, Category } from './store';

const COL = 'projects';

// ── READ ──────────────────────────────────────────────────────────────────────

export async function fetchAllProjects(): Promise<Project[]> {
  try {
    const q    = query(collection(db, COL), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    console.log(`[DEBUG] Fetched ${snap.docs.length} projects from Firestore`);
    const projects = snap.docs.map((d) => {
      const data = d.data();
      console.log(`[DEBUG] Project: ${data.title} (id: ${d.id}, category: ${data.category})`);
      return {
        id:           d.id,
        category:     data.category     ?? 'posters',
        title:        data.title        ?? '',
        description:  data.description  ?? '',
        tags:         data.tags         ?? [],
        createdAt:    data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : (data.createdAt ?? new Date().toISOString()),
        imageUrl:     data.imageUrl     || undefined,
        driveLink:    data.driveLink    || undefined,
        thumbnailUrl: data.thumbnailUrl || undefined,
      } as Project;
    });
    return projects;
  } catch (err) {
    console.error('[ERROR] fetchAllProjects failed:', err);
    return [];
  }
}

export async function fetchProjectsByCategory(category: Category): Promise<Project[]> {
  const all = await fetchAllProjects();
  return all.filter((p) => p.category === category);
}

// ── CREATE ────────────────────────────────────────────────────────────────────

export async function createProject(
  project: Omit<Project, 'id' | 'createdAt'>,
): Promise<Project> {
  // Strip undefined fields — Firestore doesn't accept undefined
  const clean: Record<string, unknown> = { adminSecret: ADMIN_SECRET, createdAt: Timestamp.now() };
  for (const [k, v] of Object.entries(project)) {
    if (v !== undefined) clean[k] = v;
  }
  const ref = await addDoc(collection(db, COL), clean);
  return { ...project, id: ref.id, createdAt: new Date().toISOString() };
}

// ── UPDATE ────────────────────────────────────────────────────────────────────

export async function editProject(
  id: string,
  updates: Partial<Omit<Project, 'id' | 'createdAt'>>,
): Promise<void> {
  const clean: Record<string, unknown> = { adminSecret: ADMIN_SECRET };
  for (const [k, v] of Object.entries(updates)) {
    // Use null to clear a field in Firestore (undefined is not allowed)
    clean[k] = v ?? null;
  }
  await updateDoc(doc(db, COL, id), clean);
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function removeProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

// ── IMAGE COMPRESSION → BASE64 ────────────────────────────────────────────────
// Runs entirely in the browser. Keeps images well under Firestore's 1 MB limit.

export function compressAndEncodeImage(
  file: File,
  maxWidth  = 1200,
  maxHeight = 1200,
  quality   = 0.82,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img    = new Image();
    const objUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objUrl);
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width  = Math.round(width  * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);

      const mime   = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const base64 = canvas.toDataURL(mime, quality);

      // Safety check: Firestore doc limit is ~1 MB
      if (base64.length > 900_000) {
        // Re-compress at lower quality
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      } else {
        resolve(base64);
      }
    };

    img.onerror = () => { URL.revokeObjectURL(objUrl); reject(new Error('Image load failed')); };
    img.src = objUrl;
  });
}
