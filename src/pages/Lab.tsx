import { useEffect, useRef } from 'react';
import { AnimatedCopy } from '@/components/AnimatedCopy';
import { Skiper88 } from '@/components/ui/skiper88';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const technologies = [
  { name: 'Python', category: 'AI/ML & Backend' },
  { name: 'TensorFlow & PyTorch', category: 'Deep Learning' },
  { name: 'scikit-learn & XGBoost', category: 'Machine Learning' },
  { name: 'CNN, ResNet & YOLO', category: 'Computer Vision' },
  { name: 'LangChain & CrewAI', category: 'LLM Orchestration' },
  { name: 'Vercel AI SDK', category: 'Multi-LLM Failover' },
  { name: 'RAG Pipelines', category: 'Embeddings & Retrieval' },
  { name: 'Qiskit', category: 'Quantum ML' },
  { name: 'React.js & Next.js', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'FastAPI & Node.js', category: 'Backend' },
  { name: 'Supabase & PostgreSQL', category: 'Data & Auth' },
  { name: 'Tailwind CSS', category: 'Styling & UI' },
  { name: 'WebSockets', category: 'Real-time Systems' },
  { name: 'GCP & Vertex AI', category: 'Cloud & ML Ops' },
  { name: 'Docker & Kubernetes', category: 'Containerization' },
  { name: 'GitHub Actions', category: 'CI/CD' },
  { name: 'Git & Vercel', category: 'Version Control & Deploy' },
];

const experience = [
  { role: 'Data Science Virtual Intern', org: 'Altair & EduSkills, AICTE', date: 'Jul — Sep 2025' },
  { role: 'AI/ML Intern', org: 'Edunet Foundation', date: 'Jun — Aug 2025' },
  { role: 'AI Intern', org: 'Mirai School of Technology', date: 'Jun — Jul 2025' },
  { role: 'Frontend Developer Intern', org: 'AICTE', date: 'Jan — Mar 2025' },
  { role: 'Cloud Computing Intern', org: 'Google Cloud Skills Boost', date: 'Jul — Dec 2024' },
];

export function Lab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const clientsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Particle Canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2
    }));

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let raf: number;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255, 248, 231, 0.35)';
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(render);
    };
    render();

    // 3. Stats translate interaction
    if (statsContainerRef.current) {
      const stats = statsContainerRef.current.querySelectorAll('.stat-item');
      stats.forEach((stat) => {
        gsap.fromTo(stat, 
          { x: 250 },
          { 
            x: 0, 
            ease: 'none',
            scrollTrigger: {
              trigger: stat,
              start: 'top bottom',
              end: 'center center',
              scrub: 1.2,
            }
          }
        );
      });
    }

    // 4. Tech stack list
    if (clientsRef.current) {
      const rows = clientsRef.current.querySelectorAll('.client-row');
      rows.forEach((row) => {
        const gap = row.querySelector('.client-gap');
        gsap.fromTo(gap, 
          { width: '25%' },
          {
            width: '0%',
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 1.2,
            }
          }
        );
        gsap.fromTo(row,
          { opacity: 0 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: row,
              start: 'top 95%',
              end: 'top 75%',
              scrub: true,
            }
          }
        );
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className="bg-[var(--bg)] text-[var(--fg)] min-h-screen">
      {/* 1. About Hero */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        <AnimatedCopy variant="diffuse" onScroll={false} as="h1" className="type-var-1 z-10 text-[var(--fg)] text-[clamp(3.5rem,11vw,9.5rem)]">
          About
        </AnimatedCopy>
        <AnimatedCopy variant="slide" onScroll={false} delay={0.5} as="p" className="z-10 mt-4 text-[var(--fg)] type-var-2 italic text-lg sm:text-xl md:text-2xl text-center max-w-xl">
          AI/ML & Full Stack Engineering
        </AnimatedCopy>
      </section>

      {/* 2. About Bio */}
      <section className="container py-12 sm:py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 md:gap-16 text-[var(--fg)]">
        <AnimatedCopy variant="slide" type="lines" onScroll={true} as="h3" className="type-var-2 text-lg sm:text-2xl md:text-3xl lg:text-4xl leading-[1.4] sm:leading-[1.3] tracking-tight">
          I'm an AI/ML engineer and full stack developer with 1+ year of experience building production-grade ML systems, LLM-powered apps and real-time dashboards.
        </AnimatedCopy>
        <AnimatedCopy variant="slide" type="lines" onScroll={true} delay={0.2} as="h3" className="type-var-2 text-lg sm:text-2xl md:text-3xl lg:text-4xl leading-[1.4] sm:leading-[1.3] tracking-tight">
          I've shipped 8+ end-to-end projects, from decision intelligence to quantum-classical hybrid models and computer vision, reaching 94–98% accuracy and 40% gains in operational efficiency.
        </AnimatedCopy>
      </section>

      {/* 3. Skiper88: 3D Rolling Text on Scroll Animation */}
      <section className="relative w-full bg-[var(--bg)] border-y border-[var(--fg)]/15">
        <Skiper88 
          subheading="Engineering Principles"
          phrases={[
            "Full Stack Architect",
            "Multi-Agent Systems",
            "Autonomous AI Workflows",
            "FastAPI & Modern Python",
            "React & Interactive WebGL",
            "Vector Search & RAG",
            "Quantum-Classical Hybrids",
            "Real-Time Protocols",
            "Precision Systems",
            "Zero Fluff. Pure Code.",
            "Building Things That Think",
            "Engineered for Scale",
          ]}
        />
      </section>

      {/* 4. Stats */}
      <section className="container py-14 sm:py-20 md:py-28 flex flex-col md:flex-row relative gap-6 md:gap-0">
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <div className="md:sticky md:top-32 text-[var(--fg)]">
            <h2 className="type-var-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">At a Glance</h2>
            <p className="type-mono mt-1.5 sm:mt-3 text-[10px] sm:text-[11px] opacity-60">Numbers</p>
          </div>
        </div>
        <div ref={statsContainerRef} className="w-full md:w-2/3 flex flex-col gap-8 sm:gap-12 md:gap-16">
          {[
            { label: 'Years of experience', val: '1+' },
            { label: 'AI/ML projects shipped', val: '8+' },
            { label: 'Internships', val: '5' },
            { label: 'Certifications', val: '9' },
          ].map((stat, i) => (
            <div key={i} className="stat-item flex items-baseline gap-4 sm:gap-8 border-b border-[var(--fg)]/20 pb-3 sm:pb-5">
              <span className="type-var-1 text-[clamp(2.75rem,8vw,6.5rem)] text-[var(--fg)] leading-none">{stat.val}</span>
              <span className="type-var-2 text-lg sm:text-2xl md:text-3xl text-[var(--fg)] opacity-70">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4b. Experience & Education */}
      <section className="container py-14 sm:py-20 md:py-28 border-t border-[var(--fg)]/15">
        <h2 className="type-var-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-8 sm:mb-14">Experience</h2>
        <div className="flex flex-col max-w-5xl">
          {experience.map((e, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-6 border-b border-[var(--fg)]/20 py-4 sm:py-5">
              <div>
                <p className="type-var-2 text-xl sm:text-2xl md:text-3xl">{e.role}</p>
                <p className="type-mono opacity-60 mt-1 text-[10px] sm:text-[11px]">{e.org}</p>
              </div>
              <p className="type-mono opacity-60 text-[10px] sm:text-[11px] flex-shrink-0">{e.date}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 sm:mt-14 max-w-5xl">
          <p className="type-mono opacity-60 mb-2 text-[10px] sm:text-[11px]">Education</p>
          <p className="type-var-2 text-xl sm:text-2xl md:text-3xl">B.Tech, Computer Science Engineering — SRK Institute of Technology</p>
          <p className="type-mono opacity-60 mt-2 text-[10px] sm:text-[11px]">Vijayawada, India · Expected Aug 2027 · GPA 8.6/10</p>
        </div>
      </section>

      {/* 5. Tech Stack */}
      <section className="container py-14 sm:py-20 md:py-28 mb-12 sm:mb-20">
        <h2 className="type-var-1 text-center mb-8 sm:mb-14 md:mb-18 text-[var(--fg)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Tech Stack</h2>
        <div ref={clientsRef} className="flex flex-col gap-2 sm:gap-3 max-w-5xl mx-auto">
          {technologies.map((tech, i) => (
            <div key={i} className="client-row flex items-center text-xs sm:text-base md:text-xl lg:text-2xl opacity-0 py-1 sm:py-1.5">
              <span className="type-mono text-[var(--fg)] opacity-50 w-7 sm:w-10 text-[9px] sm:text-[11px] flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="type-var-2 text-[var(--fg)] flex-shrink-0 text-sm sm:text-base md:text-xl lg:text-2xl">{tech.name}</span>
              <div className="client-gap border-b border-[var(--fg)]/20 flex-grow mx-2 sm:mx-6 md:mx-8" style={{ width: '25%' }} />
              <span className="type-var-2 text-[var(--fg)] opacity-70 flex-shrink-0 text-[11px] sm:text-sm md:text-base lg:text-xl">{tech.category}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}