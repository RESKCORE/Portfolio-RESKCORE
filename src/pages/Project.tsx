import { Link } from 'react-router-dom';
import { AnimatedCopy } from '@/components/AnimatedCopy';
import { ArrowLeft, ArrowUpRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export function Project() {
  return (
    <main className="bg-[var(--bg)] text-[var(--fg)] min-h-screen pt-24 sm:pt-32 pb-32 sm:pb-48">
      {/* 1. Project Hero Header */}
      <section className="container mb-8 sm:mb-12">
        <div className="flex items-center justify-between border-b border-[var(--fg)]/20 pb-4 mb-6 sm:mb-8">
          <Link
            to="/work"
            className="cursor-target inline-flex items-center gap-2 type-mono text-[10px] sm:text-[11px] opacity-70 hover:opacity-100 transition-opacity"
            data-cursor-label="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Selected Works
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="type-mono text-[10px] sm:text-[11px] opacity-70 uppercase tracking-widest">
              [ 05 // Featured System ]
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <AnimatedCopy
            variant="diffuse"
            onScroll={false}
            as="h1"
            className="type-var-1 text-[var(--fg)] text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.9] tracking-tight"
          >
            AgentPal
          </AnimatedCopy>

          <p className="type-var-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl max-w-4xl opacity-90 leading-snug font-serif italic mt-2">
            Autonomous bilateral AI negotiation platform with a deterministic settlement kernel and automated PayPal invoicing.
          </p>
        </div>

        {/* Project Meta Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[var(--fg)]/20">
          <div>
            <p className="type-mono text-[var(--fg)] opacity-50 mb-1 text-[10px] sm:text-[11px]">System Type</p>
            <p className="type-var-2 text-lg sm:text-xl text-[var(--fg)]">Featured System</p>
          </div>
          <div>
            <p className="type-mono text-[var(--fg)] opacity-50 mb-1 text-[10px] sm:text-[11px]">Timeline</p>
            <p className="type-var-2 text-lg sm:text-xl text-[var(--fg)]">October 2026</p>
          </div>
          <div>
            <p className="type-mono text-[var(--fg)] opacity-50 mb-1 text-[10px] sm:text-[11px]">Discipline</p>
            <p className="type-var-2 text-lg sm:text-xl text-[var(--fg)]">AI Agents / FinTech</p>
          </div>
          <div>
            <p className="type-mono text-[var(--fg)] opacity-50 mb-1 text-[10px] sm:text-[11px]">Deployment</p>
            <a
              href="https://agentpal-three.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="type-var-2 text-lg sm:text-xl text-[var(--fg)] hover:opacity-75 transition-opacity underline underline-offset-4 inline-flex items-center gap-1 cursor-pointer"
            >
              Live on Vercel <ArrowUpRight className="w-4 h-4 inline" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Hero Thumbnail - Visible directly at the start of the page */}
      <section className="container mb-16 sm:mb-24">
        <div className="w-full relative group">
          <div className="w-full aspect-[16/10] bg-black/40 overflow-hidden rounded-sm border border-[var(--fg)]/25 shadow-2xl relative">
            <img
              src="/AgentPal AI Negotiation Dashboard.png"
              alt="AgentPal Primary Dashboard Thumbnail"
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              loading="eager"
            />
            {/* Top Badge Overlay */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center gap-2">
              <span className="type-mono text-[9px] sm:text-[10px] uppercase tracking-wider bg-black/80 text-white/95 px-2.5 py-1 rounded-xs backdrop-blur-md border border-white/15 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Primary Terminal // Active Production
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--fg)]/20 pb-4">
            <div>
              <p className="type-mono text-[var(--fg)] opacity-90 text-[11px] sm:text-xs tracking-wider">
                Fig. 01 — Bilateral AI Negotiation Protocol & Agent Strategy Dashboard
              </p>
              <p className="mt-2 text-base sm:text-lg opacity-85 max-w-3xl leading-relaxed">
                Autonomous buyer and seller AI agents negotiate pricing boundaries, milestone deliveries, and scope parameters through stateful multi-parameter strategy arbitration under strict user guardrails.
              </p>
            </div>
            <p className="type-mono text-[var(--fg)] opacity-50 text-[10px] sm:text-[11px] flex-shrink-0">
              [ 01 / 02 ]
            </p>
          </div>
        </div>
      </section>

      {/* 3. Architecture & System Overview */}
      <section className="container py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 border-t border-[var(--fg)]/20">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <p className="type-mono text-[var(--fg)] opacity-50 text-[10px] sm:text-[11px] uppercase tracking-wider">
            Architecture & Deep Dive
          </p>
          <p className="type-var-2 text-2xl sm:text-3xl md:text-4xl leading-relaxed opacity-95">
            AgentPal is an autonomous bilateral AI negotiation protocol where buyer and seller AI agents negotiate complex multi-parameter transactions — budget boundaries, delivery milestones, and scope specifications — under strict user-defined rules. A deterministic mathematical settlement kernel validates equilibrium without hallucination, produces a cryptographically sealed SHA-256 contract hash, and triggers automated PayPal Sandbox invoicing upon agreement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-[var(--fg)]/15">
            <div className="p-4 sm:p-5 rounded-xs border border-[var(--fg)]/15 bg-black/10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[var(--fg)] opacity-80" />
                <h4 className="type-mono text-xs sm:text-sm font-semibold tracking-wide">Bilateral Strategy Engine</h4>
              </div>
              <p className="text-sm sm:text-base opacity-75 leading-relaxed">
                Autonomous agents explore complex trade-off surfaces dynamically while respecting non-negotiable thresholds.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-xs border border-[var(--fg)]/15 bg-black/10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--fg)] opacity-80" />
                <h4 className="type-mono text-xs sm:text-sm font-semibold tracking-wide">Deterministic Settlement</h4>
              </div>
              <p className="text-sm sm:text-base opacity-75 leading-relaxed">
                Zero-hallucination kernel validates mathematical consensus, eliminating risk of invalid terms or fabricated agreements.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8 lg:border-l lg:border-[var(--fg)]/15 lg:pl-10">
          <div>
            <h4 className="type-mono text-[var(--fg)] opacity-60 mb-1 text-[10px] sm:text-[11px]">Role</h4>
            <p className="type-var-2 text-xl sm:text-2xl text-[var(--fg)]">Architecture & Protocol Engineering</p>
          </div>
          <div>
            <h4 className="type-mono text-[var(--fg)] opacity-60 mb-1 text-[10px] sm:text-[11px]">AI / ML Architecture</h4>
            <p className="type-var-2 text-lg sm:text-xl text-[var(--fg)] opacity-90">
              Bilateral agent negotiation protocols, stateful strategy arbitration, deterministic settlement validator
            </p>
          </div>
          <div>
            <h4 className="type-mono text-[var(--fg)] opacity-60 mb-1 text-[10px] sm:text-[11px]">Stack</h4>
            <p className="type-var-2 text-lg sm:text-xl text-[var(--fg)] opacity-90">
              React, Vite, TypeScript, Tailwind CSS, AI Agent Protocol, PayPal REST API, SHA-256 Cryptography
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--fg)]/15">
            <h4 className="type-mono text-[var(--fg)] opacity-60 mb-1 text-[10px] sm:text-[11px]">Source Code</h4>
            <a
              href="https://github.com/RESKCORE/AgentPal"
              target="_blank"
              rel="noopener noreferrer"
              className="type-mono text-xs sm:text-sm text-[var(--fg)] hover:opacity-75 transition-opacity underline underline-offset-4 inline-flex items-center gap-1 cursor-pointer"
            >
              github.com/RESKCORE/AgentPal <ArrowUpRight className="w-3.5 h-3.5 inline" />
            </a>
          </div>
        </div>
      </section>

      {/* 4. Second Showcase - Settlement & Invoicing */}
      <section className="container py-8 sm:py-16">
        <div className="w-full relative group">
          <div className="w-full aspect-[16/10] bg-black/40 overflow-hidden rounded-sm border border-[var(--fg)]/25 shadow-2xl relative">
            <img
              src="/AgentPal AI Negotiation Result.png"
              alt="AgentPal Settlement Kernel & PayPal Invoicing"
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              loading="lazy"
            />
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center gap-2">
              <span className="type-mono text-[9px] sm:text-[10px] uppercase tracking-wider bg-black/80 text-white/95 px-2.5 py-1 rounded-xs backdrop-blur-md border border-white/15 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Consensus Equilibrium & Invoicing
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--fg)]/20 pb-4">
            <div>
              <p className="type-mono text-[var(--fg)] opacity-90 text-[11px] sm:text-xs tracking-wider">
                Fig. 02 — Deterministic Settlement Kernel, SHA-256 Proof & PayPal Invoicing
              </p>
              <p className="mt-2 text-base sm:text-lg opacity-85 max-w-3xl leading-relaxed">
                Deterministic mathematical settlement engine calculates equilibrium without hallucination, validates converging consensus, seals terms with an immutable SHA-256 hash, and generates official PayPal Sandbox invoices.
              </p>
            </div>
            <p className="type-mono text-[var(--fg)] opacity-50 text-[10px] sm:text-[11px] flex-shrink-0">
              [ 02 / 02 ]
            </p>
          </div>
        </div>
      </section>

      {/* 5. Observation & Foundational Philosophy */}
      <section className="container py-16 sm:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 border-t border-[var(--fg)]/20">
        <div>
          <h2 className="type-var-1 text-3xl sm:text-4xl md:text-5xl text-[var(--fg)] mb-6 sm:mb-8">Observation</h2>
          <p className="type-var-2 text-xl sm:text-2xl md:text-3xl leading-relaxed opacity-90">
            Built on the foundational philosophy: <span className="underline decoration-[var(--fg)]/40">"Agents negotiate. Code decides what settles."</span> While autonomous LLMs excel at exploring trade-off spaces and drafting concessions, financial transactions require mathematical guarantees. AgentPal prevents hallucinated concessions by routing every round through a deterministic arbitration state machine. When terms converge, a SHA-256 proof-of-settlement is generated and an official PayPal invoice is dispatched instantly.
          </p>
        </div>
        <div className="flex flex-col gap-6 sm:gap-8 justify-center">
          <div className="border-t border-[var(--fg)]/20 pt-4 sm:pt-6">
            <p className="type-mono text-[var(--fg)] opacity-50 mb-1 text-[10px] sm:text-[11px]">Repository</p>
            <a
              href="https://github.com/RESKCORE/AgentPal"
              target="_blank"
              rel="noopener noreferrer"
              className="type-var-2 text-xl sm:text-2xl hover:opacity-75 transition-opacity underline underline-offset-4 inline-flex items-center gap-1 cursor-pointer"
            >
              RESKCORE / AgentPal <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          <div className="border-t border-[var(--fg)]/20 pt-4 sm:pt-6">
            <p className="type-mono text-[var(--fg)] opacity-50 mb-1 text-[10px] sm:text-[11px]">Live Protocol URL</p>
            <a
              href="https://agentpal-three.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="type-var-2 text-xl sm:text-2xl hover:opacity-75 transition-opacity underline underline-offset-4 inline-flex items-center gap-1 cursor-pointer"
            >
              agentpal-three.vercel.app <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          <div className="border-t border-[var(--fg)]/20 pt-4 sm:pt-6">
            <p className="type-mono text-[var(--fg)] opacity-50 mb-1 text-[10px] sm:text-[11px]">Status</p>
            <p className="type-var-2 text-xl sm:text-2xl">Production — Live on Vercel</p>
          </div>
        </div>
      </section>

      {/* 6. Bottom Navigation CTA */}
      <section className="container pt-8 pb-4 border-t border-[var(--fg)]/20">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            to="/work"
            className="cursor-target inline-flex items-center gap-2 type-mono text-xs sm:text-sm hover:opacity-70 transition-opacity"
            data-cursor-label="All Works"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Selected Works
          </Link>
          <a
            href="https://agentpal-three.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target type-mono text-xs sm:text-sm px-6 py-3 border border-[var(--fg)]/30 rounded-full hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors inline-flex items-center gap-2"
            data-cursor-label="Open App"
          >
            Launch AgentPal Live <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </main>
  );
}