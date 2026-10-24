import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedCopy } from '@/components/AnimatedCopy';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface WorkImage {
  src: string;
  caption: string;
}

interface WorkItem {
  id: string;
  timeline: string;
  tag: string;
  title: string;
  desc: string;
  code: string;
  images: [WorkImage, WorkImage];
  to?: string; // internal route
  href?: string; // external link
}

const works: WorkItem[] = [
  {
    id: '01',
    timeline: 'January 2026',
    tag: 'Global Observatory // Developer Tools',
    title: 'Nexus',
    desc: 'Global open-source contribution and developer activity observatory providing real-time database-driven visualizations across worldwide repositories.',
    code: 'NEXT.JS 16 · TYPESCRIPT · SUPABASE · D3',
    images: [
      {
        src: '/Nexus Observatory_ Global Activity Dashboard.png',
        caption: '01 // Global Observatory Live Feed',
      },
      {
        src: '/Nexus Observatory_ Real-time Contribution Analytics.png',
        caption: '02 // Real-time Contribution Analytics',
      },
    ],
    href: 'https://nexus-one-eosin.vercel.app',
  },
  {
    id: '02',
    timeline: 'January/February 2026 through September 2026',
    tag: 'Decision Intelligence // Enterprise',
    title: 'KLAROS',
    desc: 'AI-powered decision intelligence platform combining deterministic MCDA ranking with LLM semantic reasoning and multi-provider failover.',
    code: 'REACT · SUPABASE · GROQ · VERCEL AI SDK',
    images: [
      {
        src: '/Klaros Retail Analytics Dashboard.png',
        caption: '01 // Analytics Matrix',
      },
      {
        src: '/Klaros Retail Analytics Results.png',
        caption: '02 // MCDA Decision Output',
      },
    ],
    href: 'https://klaros-ten.vercel.app/',
  },
  {
    id: '03',
    timeline: 'August 2026',
    tag: 'Interactive Learning // EdTech',
    title: 'KRIORA',
    desc: 'Next-generation AI-powered Learning Management System (LMS) with real-time course generation, interactive quizzes, and modern analytics.',
    code: 'REACT 19 · CONVEX CLOUD · TYPESCRIPT · TAILWIND',
    images: [
      {
        src: '/Kriora LMS_ Learn, Practice, Grow.png',
        caption: '01 // Curriculum Platform',
      },
      {
        src: '/Kriora LMS Coding Practice Hero.png',
        caption: '02 // Interactive Coding Arena',
      },
    ],
    href: 'https://kriora.vercel.app',
  },
  {
    id: '04',
    timeline: 'September 2026',
    tag: 'System Architecture // Case Studies',
    title: 'KRUZZ',
    desc: 'Interactive system architecture and distributed systems case studies arena with mental models, progressive Mermaid diagrams, and AI mentorship.',
    code: 'TYPESCRIPT · CONVEX · SYSTEM DESIGN · MERMAID',
    images: [
      {
        src: '/KRUZZ_ Learn by Doing.png',
        caption: '01 // Architecture Sandbox',
      },
      {
        src: '/KRUZZ Learn by Doing Dashboard.png',
        caption: '02 // Case Study Simulation',
      },
    ],
    href: 'https://kruzz.indevs.in',
  },
  {
    id: '05',
    timeline: 'October 2026',
    tag: 'Featured System // Multi-Agent FinTech',
    title: 'AgentPal',
    desc: 'Autonomous bilateral AI negotiation platform with a deterministic settlement kernel, SHA-256 contract hashing, and automated PayPal Sandbox invoicing.',
    code: 'REACT · TYPESCRIPT · AI AGENTS · PAYPAL REST API',
    images: [
      {
        src: '/AgentPal AI Negotiation Dashboard.png',
        caption: '01 // Negotiation Terminal',
      },
      {
        src: '/AgentPal AI Negotiation Result.png',
        caption: '02 // Settlement & Invoicing',
      },
    ],
    to: '/project',
    href: 'https://agentpal-three.vercel.app/',
  },
];

function WorkCard({ work, index }: { work: WorkItem; index: number }) {
  const className = 'cursor-target group w-full block cursor-pointer';

  const inner = (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Top Meta Line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--fg)]/15 pb-3 gap-2 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="type-mono text-[10px] sm:text-[11px] opacity-90 tracking-widest font-semibold">
            [ {work.id} // {work.title.toUpperCase()} ]
          </span>
          <span className="type-mono text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full border border-[var(--fg)]/25 bg-white/5 opacity-85">
            {work.timeline}
          </span>
          <span className="hidden md:inline type-mono text-[10px] opacity-50 tracking-wider">
            / {work.tag}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {work.to ? (
            <span className="type-mono text-[10px] sm:text-[11px] px-2.5 py-0.5 border border-[var(--fg)]/40 rounded-full opacity-90 inline-flex items-center gap-1 group-hover:bg-[var(--fg)] group-hover:text-[var(--bg)] transition-colors">
              Featured Case Study <ArrowUpRight className="w-3 h-3" />
            </span>
          ) : (
            <span className="type-mono text-[10px] sm:text-[11px] px-2.5 py-0.5 border border-[var(--fg)]/20 rounded-full opacity-70 inline-flex items-center gap-1 group-hover:border-[var(--fg)]/50 transition-colors">
              Live Production <ArrowUpRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>

      {/* Dual Image Presentation: exactly 2 images per project, full width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
        {work.images.map((img, idx) => (
          <div
            key={idx}
            className="w-full aspect-[16/10] overflow-hidden bg-black/40 relative rounded-sm border border-[var(--fg)]/20 group-hover:border-[var(--fg)]/50 transition-all duration-500 shadow-xl"
          >
            <img
              src={img.src}
              alt={`${work.title} - ${img.caption}`}
              className="work-item-img w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              loading={index < 2 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 z-10">
              <span className="type-mono text-[9px] sm:text-[10px] uppercase tracking-wider bg-black/85 text-white/95 px-2.5 py-1 rounded-xs backdrop-blur-md border border-white/10">
                {img.caption}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Information Row */}
      <div className="mt-1 flex flex-col md:flex-row justify-between items-start md:items-baseline gap-3 sm:gap-6 border-b border-[var(--fg)]/20 pb-6 sm:pb-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <h3 className="type-var-1 text-2xl sm:text-3xl md:text-4xl group-hover:opacity-80 transition-opacity leading-tight tracking-tight">
              {work.title}
            </h3>
            <span className="md:hidden type-mono text-[9px] opacity-60">
              {work.timeline}
            </span>
          </div>
          <p className="mt-2 text-base sm:text-lg opacity-85 leading-relaxed font-serif italic">
            {work.desc}
          </p>
        </div>
        <div className="flex flex-col md:items-end gap-1.5 flex-shrink-0 pt-1">
          <p className="type-mono text-[var(--fg)] opacity-60 text-[10px] sm:text-[11px] tracking-wider md:text-right">
            {work.code}
          </p>
        </div>
      </div>
    </div>
  );

  if (work.to) {
    return (
      <Link to={work.to} className={className} data-cursor-label="View Project">
        {inner}
      </Link>
    );
  }
  return (
    <a href={work.href} target="_blank" rel="noopener noreferrer" className={className} data-cursor-label="Open App">
      {inner}
    </a>
  );
}

export function Work() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('.work-item-img');

    const ctx = gsap.context(() => {
      items.forEach((item) => {
        gsap.to(item, {
          yPercent: -3,
          ease: 'none',
          scrollTrigger: {
            trigger: item.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, listRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-[var(--bg)] text-[var(--fg)] min-h-screen pt-24 sm:pt-32 pb-32 sm:pb-48">
      {/* Page Title Section */}
      <section className="container mb-12 sm:mb-20">
        <div className="flex flex-col items-center justify-center text-center py-8 sm:py-16">
          <AnimatedCopy
            variant="diffuse"
            onScroll={false}
            as="h1"
            className="type-var-1 text-center w-full text-[clamp(3.25rem,10vw,9.5rem)] leading-none tracking-tight"
          >
            Selected Works
          </AnimatedCopy>
          <p className="type-var-2 text-lg sm:text-2xl mt-4 max-w-xl opacity-80 font-serif italic">
            Production-grade AI systems, full-stack architectures & interactive platforms.
          </p>
        </div>

        <div className="w-full flex justify-between items-center pt-6 border-b border-[var(--fg)]/20 pb-4">
          <p className="type-mono text-[var(--fg)] opacity-70 text-[10px] sm:text-[11px] tracking-wider">
            [ 05 Systems Built & Shipped ]
          </p>
          <p className="type-mono text-[var(--fg)] opacity-70 text-[10px] sm:text-[11px] tracking-wider">
            / Chronological Archive (Jan — Oct 2026)
          </p>
        </div>
      </section>

      {/* Projects List: Chronological order Nexus -> KLAROS -> KRIORA -> KRUZZ -> AgentPal */}
      <section ref={listRef} className="container flex flex-col gap-16 sm:gap-24 md:gap-32">
        {works.map((work, index) => (
          <div key={work.id} className="w-full">
            <WorkCard work={work} index={index} />
          </div>
        ))}
      </section>
    </main>
  );
}