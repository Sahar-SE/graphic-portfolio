export type Category = 'posters' | 'video-editing' | 'motion-graphics';

export interface Project {
  id: string;
  category: Category;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  imageUrl?: string;
  driveLink?: string;
  thumbnailUrl?: string;
}

export function getDriveEmbedUrl(driveLink: string): string {
  const m = driveLink.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  if (driveLink.includes('/preview')) return driveLink;
  return driveLink;
}

export function getDriveOpenUrl(driveLink: string): string {
  const m = driveLink.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/view`;
  return driveLink;
}

const ADMIN_PW_KEY = 'portfolio_admin_pw';
const DEFAULT_PW   = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

export function checkAdminPassword(pw: string): boolean {
  if (typeof window === 'undefined') return false;
  return pw === (localStorage.getItem(ADMIN_PW_KEY) || DEFAULT_PW);
}

export function setAdminPassword(pw: string) {
  if (typeof window !== 'undefined') localStorage.setItem(ADMIN_PW_KEY, pw);
}
