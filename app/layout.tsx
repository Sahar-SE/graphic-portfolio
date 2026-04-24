import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CursorAndGrain from '@/components/CursorAndGrain';

export const metadata: Metadata = {
  title: 'Portfolio — Graphic Design & Motion',
  description: 'Creative portfolio showcasing graphic design, video editing, and motion graphics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✦</text></svg>" />
      </head>
      <body>
        <CursorAndGrain />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
