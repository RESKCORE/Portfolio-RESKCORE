import { AnimatedCopy } from '@/components/AnimatedCopy';
import { FluidSimulation } from '@/components/FluidSimulation';

export function Home() {
  return (
    <main className="relative w-full h-[100vh] overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
      {/* Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply"
      >
        <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
      </video>

      {/* Fluid Simulation Masks */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-white opacity-[0.03] blur-[100px] rounded-full mix-blend-overlay pointer-events-none z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-black opacity-[0.05] blur-[80px] rounded-full mix-blend-multiply pointer-events-none z-10" />

      {/* Subtle Vignette */}
      <div className="absolute inset-0 pointer-events-none z-20" style={{ boxShadow: 'inset 0 0 150px rgba(0,0,0,0.1)' }} />

      {/* Hero Typography */}
      <div className="relative z-20 container h-full flex flex-col justify-center items-center text-center">
        <div className="relative">
          <AnimatedCopy variant="diffuse" onScroll={false} delay={0.1} as="h1" className="type-var-1 select-none text-[clamp(4rem,calc(8vw+2.5rem),10.5rem)]">
            RESK
          </AnimatedCopy>
          {/* Blurred Diffusion Effect Simulation */}
          <div className="absolute inset-0 blur-[40px] opacity-20 bg-black pointer-events-none -z-10" />
        </div>
        
        <AnimatedCopy variant="slide" type="words" onScroll={false} delay={0.75} as="p" className="mt-6 sm:mt-8 text-base sm:text-xl md:text-2xl lg:text-3xl font-serif italic text-[var(--fg)] opacity-90 select-none max-w-xl md:max-w-3xl leading-snug">
          Full Stack Developer & AI/ML Engineer
        </AnimatedCopy>
      </div>

      {/* Bottom Status Info: sits above the dome on small screens, beside it from md up */}
      <div className="absolute bottom-[5.25rem] sm:bottom-[6.75rem] md:bottom-12 w-full z-20 pointer-events-none">
        <div className="container flex justify-between items-end">
          <div className="flex flex-col gap-1 text-left opacity-75">
            <AnimatedCopy variant="flicker" onScroll={false} delay={1} as="p" className="type-mono text-[10px] sm:text-[11px] whitespace-nowrap">
              Reddy Santosh Kumar
            </AnimatedCopy>
            <AnimatedCopy variant="flicker" onScroll={false} delay={1} as="p" className="type-mono text-[10px] sm:text-[11px] whitespace-nowrap">
              [ Portfolio — 2026 ]
            </AnimatedCopy>
          </div>
          <div className="flex flex-col gap-1 items-end text-right opacity-75">
            <AnimatedCopy variant="flicker" onScroll={false} delay={1} as="p" className="type-mono text-[10px] sm:text-[11px] whitespace-nowrap">
              Available for work
            </AnimatedCopy>
            <AnimatedCopy variant="flicker" onScroll={false} delay={1} as="p" className="type-mono text-[10px] sm:text-[11px] opacity-70 whitespace-nowrap">
              Building AI systems
            </AnimatedCopy>
          </div>
        </div>
      </div>
      
      {/* Interactive Three.js Fluid Simulation with mix-blend-mode: exclusion */}
      <FluidSimulation 
        className="z-25"
        dyeColor={[1.0, 1.0, 1.0]}
        intensity={1.2}
        radius={0.0035}
        curl={32.0}
        dissipation={0.982}
      />

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-30" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.04) 2px)'
      }} />
    </main>
  );
}