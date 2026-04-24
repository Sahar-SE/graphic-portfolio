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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='logoGrad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23c9a84c;stop-opacity:1'/><stop offset='100%' style='stop-color:%23d4af37;stop-opacity:0.7'/></linearGradient></defs><polygon points='32,4 58,16 58,48 32,60 6,48 6,16' fill='none' stroke='url(%23logoGrad)' stroke-width='2.5' opacity='0.8'/><polygon points='32,12 54,22 54,42 32,52 10,42 10,22' fill='none' stroke='url(%23logoGrad)' stroke-width='1.5' opacity='0.5'/><circle cx='32' cy='32' r='3' fill='%23c9a84c' opacity='0.9'/></svg>" />
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
