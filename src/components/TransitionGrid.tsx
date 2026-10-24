import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export function TransitionGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (!gridRef.current) return;
    const blocks = Array.from(gridRef.current.children);
    const mobile = typeof window !== 'undefined' && window.innerWidth < 768;

    gsap.killTweensOf(blocks);

    // Whenever entering any new section, ensure the pixel blocks cover the screen
    gsap.set(blocks, { opacity: 1 });
    gsap.set(gridRef.current, { pointerEvents: 'auto', display: 'grid' });
    document.body.setAttribute('data-cursor-theme', 'blue');

    // Shuffle array for scattered digital pixel reveal
    const shuffled = [...blocks].sort(() => 0.5 - Math.random());

    // Dissolve pixel blocks after a brief frame delay so the new section renders cleanly beneath
    const timer = setTimeout(() => {
      gsap.to(shuffled, {
        opacity: 0,
        duration: mobile ? 0.32 : 0.45,
        stagger: mobile ? 0.016 : 0.03,
        ease: 'power2.out',
        onComplete: () => {
          if (gridRef.current) {
            gsap.set(gridRef.current, { pointerEvents: 'none' });
          }
          document.body.removeAttribute('data-cursor-theme');
        },
      });
    }, 40);

    return () => {
      clearTimeout(timer);
      document.body.removeAttribute('data-cursor-theme');
    };
  }, [location.pathname]);

  return (
    <div
      ref={gridRef}
      className="transition-grid z-[100000] pointer-events-none fixed inset-0 grid grid-cols-4 grid-rows-4 w-screen h-screen"
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="transition-block bg-white w-full h-full opacity-100 will-change-opacity"
        />
      ))}
    </div>
  );
}
