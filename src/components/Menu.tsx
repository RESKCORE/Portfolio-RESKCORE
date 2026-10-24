import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Box, Laptop, Zap, Send, X } from 'lucide-react';
import gsap from 'gsap';

// ---- Config ----
const SCROLL_ENTRANCE = true; // set false to disable the scroll entrance
const ROUTE_SEQUENCE: Record<string, string> = {
  '/': '/lab',
  '/lab': '/work',
  '/work': '/project',
  '/project': '/contact',
  '/contact': '/',
};

const NOISE =
  'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.08%22/%3E%3C/svg%3E")';

// Defined outside the component so it never changes between renders
const MENU_ITEMS = [
  { label: 'Home', icon: Compass, to: '/', angle: -90 },
  { label: 'About', icon: Box, to: '/lab', angle: -18 },
  { label: 'Work', icon: Laptop, to: '/work', angle: 54 },
  { label: 'Featured Project', icon: Zap, to: '/project', angle: 126 },
  { label: 'Contact', icon: Send, to: '/contact', angle: 198 },
];

export function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ diameter: 500, radius: 190 });
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const entranceRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const navigatingRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const compact = dimensions.diameter < 340;
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));

  // Responsive radial menu size
  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setIsMobile(vw < 768);
      // Ring + chips must fit between the overlay header and footer (~180px of chrome)
      const fitHeight = Math.max(260, vh - 180);
      const maxAllowed = Math.min(vw * 0.86, vh * 0.62, fitHeight, 520);
      const diameter = Math.max(260, Math.round(maxAllowed));
      // Calibrated radius at the midpoint of the annulus (between r=0.13*D inner hub and r=0.50*D outer ring)
      const radius = Math.round(diameter * 0.315);
      setDimensions({ diameter, radius });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const allTargets = () => [
    overlayRef.current,
    menuRef.current,
    centerRef.current,
    headerRef.current,
    footerRef.current,
    ...itemsRef.current,
  ];

  // Menu entrance choreography (cinematic, silky smooth across all breakpoints)
  const playEntranceAnimation = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    isAnimatingRef.current = true;
    document.body.style.overflow = 'hidden';

    gsap.killTweensOf(allTargets());

    const mobile = window.innerWidth < 768;
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    // Circular lens bloom: power3.out for natural, effortless deceleration
    tl.fromTo(
      overlay,
      { autoAlpha: 0, clipPath: 'circle(0% at 50% 100%)' },
      { 
        autoAlpha: 1, 
        clipPath: mobile ? 'circle(150% at 50% 100%)' : 'circle(160% at 50% 100%)', 
        duration: mobile ? 0.4 : 0.52, 
        ease: 'power3.out' 
      }
    );

    // Radial Menu container: expands smoothly with elegant easing
    if (menuRef.current) {
      tl.fromTo(
        menuRef.current,
        { scale: mobile ? 0.78 : 0.68, opacity: 0, rotation: mobile ? 0 : -8 },
        { scale: 1, opacity: 1, rotation: 0, duration: mobile ? 0.42 : 0.56, ease: 'power3.out' },
        '-=' + (mobile ? '0.32' : '0.44')
      );
    }

    // Center badge
    if (centerRef.current) {
      tl.fromTo(
        centerRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.38, ease: 'power2.out' },
        '-=' + (mobile ? '0.28' : '0.38')
      );
    }

    // Individual menu chips: cascade gently from center
    const validItems = itemsRef.current.filter(Boolean);
    if (validItems.length > 0) {
      tl.fromTo(
        validItems,
        {
          scale: 0.55,
          opacity: 0,
          y: (i) => Math.round(Math.sin(((MENU_ITEMS[i]?.angle ?? 0) * Math.PI) / 180) * (mobile ? 12 : 20)),
          x: (i) => Math.round(Math.cos(((MENU_ITEMS[i]?.angle ?? 0) * Math.PI) / 180) * (mobile ? 12 : 20)),
        },
        { 
          scale: 1, 
          opacity: 1, 
          x: 0, 
          y: 0, 
          duration: mobile ? 0.36 : 0.48, 
          stagger: mobile ? 0.018 : 0.03, 
          ease: 'power3.out' 
        },
        '-=' + (mobile ? '0.28' : '0.4')
      );
    }

    if (headerRef.current) {
      tl.fromTo(
        headerRef.current,
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.32, ease: 'power2.out' },
        '-=' + (mobile ? '0.22' : '0.32')
      );
    }
    if (footerRef.current) {
      tl.fromTo(
        footerRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.32, ease: 'power2.out' },
        '-=' + (mobile ? '0.22' : '0.32')
      );
    }
  }, []);

  // Menu exit choreography (smooth inward glide across all breakpoints)
  const playExitAnimation = useCallback((onCompleteCallback?: () => void) => {
    const overlay = overlayRef.current;
    if (!overlay) {
      setIsOpen(false);
      onCompleteCallback?.();
      return;
    }
    isAnimatingRef.current = true;
    gsap.killTweensOf(allTargets());

    const mobile = window.innerWidth < 768;
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        isAnimatingRef.current = false;
        setIsOpen(false);
        onCompleteCallback?.();
      },
    });

    const validItems = itemsRef.current.filter(Boolean);

    // Smooth inward decay
    if (validItems.length > 0) {
      tl.to(validItems, { 
        scale: 0.65, 
        opacity: 0, 
        duration: mobile ? 0.18 : 0.22, 
        stagger: mobile ? 0.01 : 0.016, 
        ease: 'power2.in' 
      });
    }
    if (menuRef.current) {
      tl.to(
        menuRef.current, 
        { scale: 0.8, opacity: 0, duration: mobile ? 0.2 : 0.24, ease: 'power2.in' }, 
        '-=0.12'
      );
    }
    tl.to(
      overlay,
      { clipPath: 'circle(0% at 50% 100%)', autoAlpha: 0, duration: mobile ? 0.26 : 0.32, ease: 'power3.inOut' },
      '-=0.1'
    );
  }, []);

  // Instantly hides the overlay (used while the pixel grid is covering the screen)
  const resetOverlay = () => {
    gsap.killTweensOf(allTargets());
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { autoAlpha: 0, clipPath: 'circle(0% at 50% 100%)' });
    }
    isAnimatingRef.current = false;
  };

  const openMenu = () => {
    if (isOpenRef.current) return;
    setIsOpen(true);
  };

  const closeMenu = () => {
    if (!isOpenRef.current) return;
    playExitAnimation();
  };

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      document.body.setAttribute('data-cursor-theme', 'blue');
      playEntranceAnimation();
    } else {
      document.body.removeAttribute('data-cursor-theme');
    }
  }, [isOpen, playEntranceAnimation]);

  // ESC closes menu
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenRef.current) playExitAnimation();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [playExitAnimation]);

  // ---- Section scroll entrance: a circle blooms from the dome and opens into the next section ----
  useEffect(() => {
    const layer = entranceRef.current;
    if (!layer) return;

    gsap.set(layer, { autoAlpha: 0, clipPath: 'circle(0% at 50% 100%)' });

    const currentPath = location.pathname.replace(/\/+$/, '') || '/';
    const nextRoute = ROUTE_SEQUENCE[currentPath];
    if (!SCROLL_ENTRANCE || !nextRoute) return;

    let target = 0;
    let current = 0;
    let rendered = -1;
    let busy = false;
    let idleTimer: number | undefined;
    let lastTouchY = 0;

    let cachedTotalHeight = 0;
    let lastHeightCheck = 0;
    const isAtBottom = () => {
      const now = performance.now();
      if (now - lastHeightCheck > 250 || !cachedTotalHeight) {
        cachedTotalHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        );
        lastHeightCheck = now;
      }
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const viewportHeight = window.innerHeight;
      if (cachedTotalHeight <= viewportHeight + 15) return true;
      return scrollY + viewportHeight >= cachedTotalHeight - 40;
    };

    const render = (p: number) => {
      gsap.set(layer, {
        autoAlpha: p > 0.002 ? 1 : 0,
        clipPath: `circle(${(4 + 156 * p).toFixed(2)}% at 50% 100%)`,
      });
    };

    const enter = () => {
      const grid = document.querySelector('.transition-grid');
      if (grid) {
        const blocks = Array.from(grid.children);
        gsap.killTweensOf(blocks);
        gsap.set(blocks, { opacity: 1 });
      }
      navigate(nextRoute);
    };

    const tick = () => {
      if (busy) return;
      if (isOpenRef.current || isAnimatingRef.current) target = 0;

      if (current !== target) {
        current += (target - current) * 0.14;
        if (Math.abs(target - current) < 0.0005) current = target;
      }
      if (current !== rendered) {
        render(current);
        rendered = current;
      }
      if (current >= 0.98 && target >= 1) {
        busy = true;
        enter();
      }
    };

    const push = (delta: number) => {
      if (busy || isOpenRef.current || isAnimatingRef.current || navigatingRef.current) return;
      target = Math.min(1, Math.max(0, target + delta));
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        if (!busy) {
          target = target >= 0.65 ? 1 : 0;
        }
      }, 260);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        if (isAtBottom()) {
          const delta = Math.min(0.2, Math.max(0.015, e.deltaY / 1200));
          push(delta);
        }
      } else if (e.deltaY < 0) {
        if (target > 0) {
          const delta = Math.max(-0.2, Math.min(-0.015, e.deltaY / 1200));
          push(delta);
        }
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const rawDelta = (lastTouchY - y) / Math.max(300, window.innerHeight);
      lastTouchY = y;
      if (rawDelta > 0) {
        if (isAtBottom()) {
          push(rawDelta * 1.8);
        }
      } else if (rawDelta < 0) {
        if (target > 0) {
          push(rawDelta * 1.8);
        }
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (isAtBottom()) push(0.5);
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (target > 0) push(-0.5);
      }
    };

    gsap.ticker.add(tick);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', onKey);

    return () => {
      gsap.ticker.remove(tick);
      window.clearTimeout(idleTimer);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
      gsap.set(layer, { autoAlpha: 0, clipPath: 'circle(0% at 50% 100%)' });
    };
  }, [location.pathname, navigate]);

  // Pixel-grid page transition (fast & smooth on all breakpoints)
  const handleNavigate = (to: string) => {
    if (navigatingRef.current) return;

    // Same page: just close the menu (otherwise the grid would never fade back out)
    if (to === location.pathname) {
      closeMenu();
      return;
    }

    navigatingRef.current = true;

    const finish = () => {
      resetOverlay(); // hide the menu while the grid still covers the screen
      document.body.style.overflow = '';
      setIsOpen(false);
      navigate(to);
      navigatingRef.current = false;
    };

    const mobile = window.innerWidth < 768;
    const grid = document.querySelector('.transition-grid');
    if (grid) {
      const blocks = Array.from(grid.children);
      gsap.killTweensOf(blocks);
      const shuffled = [...blocks].sort(() => 0.5 - Math.random());
      gsap.to(shuffled, {
        opacity: 1,
        duration: mobile ? 0.26 : 0.38,
        stagger: mobile ? 0.014 : 0.035,
        ease: 'power2.inOut',
        onComplete: finish,
      });
    } else {
      finish();
    }
  };

  const innerHubSize = Math.round(dimensions.diameter * 0.25);
  const innerRadiusRatio = 0.125; // half of 0.25

  return (
    <>
      {/* Menu Toggle Button (dome) */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center pointer-events-none z-40 overflow-hidden">
        <button
          onClick={openMenu}
          onMouseEnter={() => document.body.setAttribute('data-cursor-theme', 'blue')}
          onMouseLeave={() => !isOpenRef.current && document.body.removeAttribute('data-cursor-theme')}
          className="cursor-target pointer-events-auto translate-y-12 sm:translate-y-14 md:translate-y-16 hover:translate-y-9 sm:hover:translate-y-10 md:hover:translate-y-12 transition-transform duration-300 ease-out w-56 sm:w-72 md:w-80 h-28 sm:h-36 md:h-40 bg-[#FFF8E7] flex flex-col items-center pt-4 sm:pt-6 gap-2 cursor-pointer shadow-2xl"
          style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
          aria-label="Toggle navigation menu"
          data-cursor-label="Menu"
        >
          <div className="w-8 sm:w-10 h-0.5 sm:h-1 bg-[#0047FF]" />
          <div className="w-8 sm:w-10 h-0.5 sm:h-1 bg-[#0047FF]" />
          <span className="type-mono text-[9px] sm:text-[10px] text-[#0047FF]/75 tracking-widest uppercase mt-0.5">
            Menu
          </span>
        </button>
      </div>

      {/* Hero scroll entrance: circle blooms from the dome, revealing the next section */}
      <div
        ref={entranceRef}
        aria-hidden="true"
        className="fixed inset-0 bg-white text-black z-[45] pointer-events-none invisible opacity-0 flex items-center justify-center will-change-[clip-path]"
        style={{
          clipPath: 'circle(0% at 50% 100%)',
          backgroundImage: isMobile ? 'none' : NOISE,
          transform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-10 h-1 bg-[#0047FF]" />
          <div className="w-10 h-1 bg-[#0047FF]" />
        </div>
      </div>

      {/* Full-screen Overlay with clip-path dome entrance (GPU accelerated, no mobile blur stutter) */}
      <div
        ref={overlayRef}
        onClick={(e) => {
          if (e.target === overlayRef.current) closeMenu();
        }}
        className="fixed inset-0 bg-white/98 md:bg-white/95 md:backdrop-blur-md z-50 invisible opacity-0 flex flex-col justify-between p-4 sm:p-8 overflow-hidden will-change-[clip-path,opacity] text-black"
        style={{
          backgroundImage: isMobile ? 'none' : NOISE,
          transform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="flex justify-between items-center text-black px-2 sm:px-6 w-full max-w-6xl mx-auto"
        >
          <button
            onClick={closeMenu}
            className="cursor-target hover:text-[#0047FF] transition-colors p-2 cursor-pointer flex items-center gap-2 group text-black"
            aria-label="Close menu"
            data-cursor-label="Close"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8 group-hover:rotate-90 transition-transform duration-300" />
            <span className="type-mono text-[10px] sm:text-[11px] hidden sm:inline text-black group-hover:text-[#0047FF]">Close</span>
          </button>
          <div className="flex gap-4 sm:gap-6 items-center">
            <a
              href="https://github.com/RESKCORE"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target type-mono text-[10px] sm:text-[11px] text-black hover:text-[#0047FF] transition-colors"
              data-cursor-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/[username]"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target type-mono text-[10px] sm:text-[11px] text-black hover:text-[#0047FF] transition-colors"
              data-cursor-label="LinkedIn"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Circular Menu Stage */}
        <div className="flex-1 flex items-center justify-center relative w-full h-full min-h-0 py-4">
          <div
            ref={menuRef}
            className="relative shrink-0 aspect-square rounded-full border border-black/15 flex items-center justify-center shadow-2xl will-change-transform bg-white/40"
            style={{ width: `${dimensions.diameter}px`, height: `${dimensions.diameter}px` }}
          >
            {/* Radial Sector Dividers (5 equal 72° pie slices between inner hub and outer ring) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 200 200"
              aria-hidden="true"
            >
              {MENU_ITEMS.map((item) => {
                // Boundary spoke sits halfway (36°) between adjacent menu items
                const boundaryRad = ((item.angle - 36) * Math.PI) / 180;
                const rInner = innerRadiusRatio * 200;
                const rOuter = 100;
                const x1 = 100 + Math.cos(boundaryRad) * rInner;
                const y1 = 100 + Math.sin(boundaryRad) * rInner;
                const x2 = 100 + Math.cos(boundaryRad) * rOuter;
                const y2 = 100 + Math.sin(boundaryRad) * rOuter;
                return (
                  <line
                    key={item.label}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(0, 0, 0, 0.12)"
                    strokeWidth="0.6"
                  />
                );
              })}
            </svg>

            {/* Center Hub Ring */}
            <div
              ref={centerRef}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none will-change-transform"
            >
              <div
                className="rounded-full border border-black/15 bg-white shadow-md flex items-center justify-center"
                style={{ width: `${innerHubSize}px`, height: `${innerHubSize}px` }}
              >
                <span className="type-var-1 text-[10px] sm:text-xs tracking-widest text-black/70">
                  RESK
                </span>
              </div>
            </div>

            {MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const rad = (item.angle * Math.PI) / 180;
              const x = Math.round(Math.cos(rad) * dimensions.radius);
              const y = Math.round(Math.sin(rad) * dimensions.radius);
              const isActive = location.pathname === item.to;

              return (
                <div
                  key={item.label}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <button
                    ref={(el) => {
                      itemsRef.current[index] = el;
                    }}
                    onClick={() => handleNavigate(item.to)}
                    className={`cursor-target group flex flex-col items-center justify-center text-center p-1.5 sm:p-2 transition-colors duration-300 cursor-pointer will-change-transform select-none ${
                      isActive ? 'text-[#0047FF]' : 'text-black hover:text-[#0047FF]'
                    }`}
                    data-cursor-label={item.label}
                  >
                    <div
                      className={`${
                        compact ? 'p-1.5' : 'p-2 sm:p-2.5'
                      } rounded-full bg-white border ${
                        isActive ? 'border-[#0047FF] shadow-[0_0_15px_rgba(0,71,255,0.25)]' : 'border-black/15 group-hover:border-[#0047FF]'
                      } group-hover:scale-110 transition-all duration-300 mb-1.5 shadow-md`}
                    >
                      <Icon
                        className={`${
                          compact ? 'w-3.5 h-3.5' : 'w-4 h-4 sm:w-5 sm:h-5'
                        } ${
                          isActive ? 'text-[#0047FF]' : 'text-black group-hover:text-[#0047FF]'
                        } transition-colors`}
                      />
                    </div>
                    <span
                      className={`type-var-2 ${
                        compact ? 'text-xs' : 'text-sm sm:text-base md:text-lg'
                      } leading-none whitespace-nowrap`}
                    >
                      {item.label}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          ref={footerRef}
          className="flex justify-between items-center text-black/60 px-2 sm:px-6 w-full max-w-6xl mx-auto pb-2"
        >
          <button
            onClick={() => handleNavigate('/lab')}
            className="cursor-target type-mono text-[10px] sm:text-[11px] text-black/70 hover:text-[#0047FF] transition-colors cursor-pointer"
            data-cursor-label="About"
          >
            About
          </button>
          <button
            onClick={() => handleNavigate('/contact')}
            className="cursor-target type-mono text-[10px] sm:text-[11px] text-black/70 hover:text-[#0047FF] transition-colors cursor-pointer"
            data-cursor-label="Say Hello"
          >
            Say Hello
          </button>
        </div>
      </div>
    </>
  );
}