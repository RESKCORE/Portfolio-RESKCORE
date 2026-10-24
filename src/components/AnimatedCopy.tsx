import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SplitText } from '@/lib/splitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface AnimatedCopyProps {
  variant?: 'diffuse' | 'slide' | 'flicker';
  type?: 'words' | 'lines' | 'chars';
  delay?: number;
  duration?: number;
  stagger?: number;
  onScroll?: boolean;
  scrollStart?: string;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function AnimatedCopy({
  variant = 'slide',
  type = 'words',
  delay = 0,
  duration,
  stagger,
  onScroll = false,
  scrollStart = 'top 85%',
  children,
  className = '',
  as: Component = 'div',
}: AnimatedCopyProps) {
  const Comp = Component as any;
  const containerRef = useRef<HTMLElement>(null);
  const textWrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textWrapperRef.current || containerRef.current;
    if (!el) return;

    let split: SplitText | null = null;
    let tl: gsap.core.Timeline | null = null;
    let scrollTriggerInstance: ScrollTrigger | null = null;

    const ctx = gsap.context(() => {
      // 1. Flicker Variant (Terminal / Status Indicator)
      if (variant === 'flicker') {
        gsap.set(el, { opacity: 0 });
        const flickerTl = gsap.timeline({
          delay,
          paused: onScroll,
        });

        flickerTl
          .to(el, { opacity: 0.8, duration: 0.05, ease: 'none' })
          .to(el, { opacity: 0.1, duration: 0.04, ease: 'none' })
          .to(el, { opacity: 1, duration: 0.08, ease: 'none' })
          .to(el, { opacity: 0.3, duration: 0.05, ease: 'none' })
          .to(el, { opacity: 0.9, duration: 0.06, ease: 'none' })
          .to(el, { opacity: 0.4, duration: 0.03, ease: 'none' })
          .to(el, { opacity: 1, duration: 0.1, ease: 'none' });

        if (onScroll) {
          scrollTriggerInstance = ScrollTrigger.create({
            trigger: el,
            start: scrollStart,
            onEnter: () => flickerTl.play(),
            once: true,
          });
        }
        return;
      }

      // 2. SplitText Initialization for Diffuse and Slide
      // For diffuse, splitting by chars produces the smoothest visual blur dispersion.
      // If type was explicitly set to words or lines, respect it.
      const splitType = variant === 'diffuse' 
        ? (type === 'lines' ? 'lines' : 'chars') 
        : (type === 'lines' ? 'lines' : 'words');

      try {
               // 'words,chars' keeps every character inside a non-breaking word wrapper,
        // so wrapping only ever happens between words (never mid-word).
        split = new SplitText(el, {
          type: (splitType === 'chars' ? 'words,chars' : splitType) as any,
          mask: variant === 'slide',
        });
      } catch (err) {
        console.warn('SplitText initialization error:', err);
        return;
      }

      const targets = 
        splitType === 'chars' && split.chars.length > 0
          ? split.chars
          : splitType === 'lines' && split.lines.length > 0
          ? split.lines
          : split.words;

      if (targets.length === 0) return;

      tl = gsap.timeline({
        delay,
        paused: onScroll,
      });

      if (variant === 'diffuse') {
        // High-end diffuse optical blur effect
        gsap.set(targets, {
          opacity: 0,
          filter: 'blur(35px)',
          y: 12,
          scale: 1.05,
          transformOrigin: 'center center',
          willChange: 'filter, opacity, transform',
        });

        tl.to(targets, {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          scale: 1,
          duration: duration || (splitType === 'chars' ? 1.2 : 1.4),
          stagger: stagger !== undefined ? stagger : (splitType === 'chars' ? 0.02 : 0.06),
          ease: 'power3.out',
          clearProps: 'filter,willChange',
        });
      } else if (variant === 'slide') {
        // Premium masking slide-in effect
        gsap.set(targets, {
          yPercent: 115,
          opacity: 0,
          rotateZ: 0.01, // subpixel anti-aliasing fix
          willChange: 'transform, opacity',
        });

        tl.to(targets, {
          yPercent: 0,
          opacity: 1,
          duration: duration || (splitType === 'lines' ? 1.2 : 0.95),
          stagger: stagger !== undefined ? stagger : (splitType === 'lines' ? 0.08 : 0.035),
          ease: 'power4.out',
          clearProps: 'willChange',
        });
      }

      if (onScroll) {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: el,
          start: scrollStart,
          animation: tl,
          toggleActions: 'play none none none',
          once: true,
        });
        // If already within or past the trigger threshold on mount, play immediately
        if (scrollTriggerInstance && scrollTriggerInstance.progress > 0) {
          tl.play();
        }
      }
    }, containerRef);

    // Debounced Resize handler to re-calculate lines if responsive layout shifts
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (split && type === 'lines') {
          ScrollTrigger.refresh();
        }
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
      if (tl) tl.kill();
      if (split) split.revert();
      ctx.revert();
    };
  }, [variant, type, delay, duration, stagger, onScroll, scrollStart]);

  // If children contains elements or strings, wrap text content in a target span
  const isPureString = typeof children === 'string';

  return (
    <Comp
      ref={containerRef}
      className={`animated-copy-root ${className}`}
      data-animate-variant={variant}
    >
      {isPureString ? (
        <span ref={textWrapperRef} className="animated-copy-text inline-block">
          {children}
        </span>
      ) : (
        // Supports nested children (e.g. background glow divs or badges)
        <span ref={textWrapperRef} className="animated-copy-content inline-block">
          {children}
        </span>
      )}
    </Comp>
  );
}
