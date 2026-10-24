'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

export interface Skiper88Props {
  phrases?: string[];
  className?: string;
  subheading?: string;
}

const DEFAULT_PHRASES = [
  'Full Stack Architect',
  'Multi-Agent Systems',
  'Autonomous AI Workflows',
  'FastAPI & Modern Python',
  'React & Interactive WebGL',
  'Vector Search & RAG',
  'Distributed Architecture',
  'Real-Time Protocols',
  'Precision Systems',
  'Zero Fluff. Pure Code.',
  'Building Things That Think',
  'Engineered for Scale',
];

// Degrees between two neighbouring lines on the drum
const ANGLE_STEP = 22;
// Scroll distance (in vh) spent on each phrase, so the roll never feels rushed
const VH_PER_PHRASE = 16;

interface RollingItemProps {
  phrase: string;
  index: number;
  radius: number;
  perspective: number;
  availableWidth: number;
  rotateX: MotionValue<number>;
}

function RollingItem({
  phrase,
  index,
  radius,
  perspective,
  availableWidth,
  rotateX,
}: RollingItemProps) {
  const angle = -index * ANGLE_STEP;
  const textRef = useRef<HTMLSpanElement>(null);
  const [fit, setFit] = useState(1);

  // Shrink a phrase just enough to stay inside the screen (perspective enlarges the front line)
  useLayoutEffect(() => {
    const measure = () => {
      const el = textRef.current;
      if (!el || !availableWidth) return;
      const natural = el.offsetWidth;
      if (!natural) return;
      const magnification = perspective / Math.max(1, perspective - radius);
      setFit(Math.min(1, (availableWidth * 0.9) / (natural * magnification)));
    };
    measure();
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(measure).catch(() => {});
    }
  }, [phrase, availableWidth, radius, perspective]);

  // This item's angle once the whole drum has rotated
  const relativeAngle = useTransform(rotateX, (current) => current + angle);

  // Front line = fully visible, neighbours fade out, far lines vanish
  const opacity = useTransform(relativeAngle, [-55, -22, 0, 22, 55], [0, 0.3, 1, 0.3, 0]);
  const scale = useTransform(relativeAngle, (a) => {
    const t = Math.min(Math.abs(a), 35) / 35;
    return (1 - t * 0.1) * fit;
  });

  return (
    // The <li> only places the line on the drum (static rotation, no motion values here)
    <li
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      style={{
        transform: `rotateX(${angle}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* The text is pushed out along Z. Opacity/scale live on this inner element
          because opacity on a preserve-3d parent would flatten the whole drum. */}
      <motion.span
        ref={textRef}
        className="type-var-1 text-[clamp(1rem,4vw,3rem)] text-[var(--fg)] leading-tight whitespace-nowrap text-center"
        style={{
          z: radius,
          opacity,
          scale,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        {phrase}
      </motion.span>
    </li>
  );
}

export const Skiper88 = ({
  phrases = DEFAULT_PHRASES,
  className = '',
  subheading = 'Engineering Principles',
}: Skiper88Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(100);
  const [perspective, setPerspective] = useState(700);
  const [availableWidth, setAvailableWidth] = useState(0);

  // Drum size per breakpoint + the width every line has to fit into
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setRadius(100);
        setPerspective(700);
      } else if (w < 1024) {
        setRadius(140);
        setPerspective(800);
      } else {
        setRadius(210);
        setPerspective(950);
      }
      setAvailableWidth(w);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Soft spring smoothing so wheel notches, touch swipes, and trackpad gestures roll fluidly
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.0005,
  });

  const totalRotation = (phrases.length - 1) * ANGLE_STEP;
  const rotateX = useTransform(smoothProgress, [0, 1], [0, totalRotation]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height: `${100 + phrases.length * VH_PER_PHRASE}vh` }}
    >
      {/* Pinned full-screen stage: the drum stays centred while the page scrolls */}
      <div
        className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ height: '100svh' }}
      >
        {/* Hint at the top, never pushes the drum */}
        <div className="absolute top-20 sm:top-24 z-20 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="type-mono text-[10px] sm:text-[11px] tracking-widest text-[var(--fg)] opacity-60">
            {subheading}
          </span>
          <div className="w-px h-5 sm:h-7 bg-gradient-to-b from-[var(--fg)]/40 to-transparent mt-1.5" />
        </div>

        {/* 3D stage */}
        <div
          className="relative w-full h-48 sm:h-60 md:h-80 flex items-center justify-center"
          style={{
            perspective: `${perspective}px`,
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
          }}
        >
          <motion.ul
            className="relative w-full h-full list-none m-0 p-0"
            style={{ transformStyle: 'preserve-3d', rotateX }}
          >
            {phrases.map((phrase, index) => (
              <RollingItem
                key={`${phrase}-${index}`}
                phrase={phrase}
                index={index}
                radius={radius}
                perspective={perspective}
                availableWidth={availableWidth}
                rotateX={rotateX}
              />
            ))}
          </motion.ul>
        </div>
      </div>
    </div>
  );
};

export default Skiper88;
