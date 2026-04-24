'use client';

import { useEffect } from 'react';

export default function CursorAndGrain() {
  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    window.addEventListener('mousemove', move);

    // Hover detection — re-run on route changes via MutationObserver
    function attachHoverListeners() {
      const els = document.querySelectorAll('a, button, [data-hover]');
      els.forEach((el) => {
        el.addEventListener('mouseenter', () => cursor!.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor!.classList.remove('hovering'));
      });
    }
    attachHoverListeners();

    const observer = new MutationObserver(attachHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', move);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div id="custom-cursor" />
    </>
  );
}
