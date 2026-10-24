import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[var(--bg)] text-[var(--fg)] pt-20 sm:pt-28 md:pt-32 pb-28">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-16 sm:mb-24 md:mb-32 gap-10 md:gap-0">
          <div className="mb-4 md:mb-0">
            <h2 className="type-var-1 text-[clamp(3.5rem,12vw,9.5rem)] leading-none tracking-tighter">RESK</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
            <div className="flex flex-col gap-2">
              <Link to="/" className="type-var-2 text-2xl sm:text-3xl hover:opacity-70 transition-opacity">Home</Link>
              <Link to="/lab" className="type-var-2 text-2xl sm:text-3xl hover:opacity-70 transition-opacity">About</Link>
              <Link to="/work" className="type-var-2 text-2xl sm:text-3xl hover:opacity-70 transition-opacity">Work</Link>
              <Link to="/project" className="type-var-2 text-2xl sm:text-3xl hover:opacity-70 transition-opacity">Featured Project</Link>
              <Link to="/contact" className="type-var-2 text-2xl sm:text-3xl hover:opacity-70 transition-opacity">Contact</Link>
            </div>
            <div className="flex flex-col gap-3">
              <a href="https://github.com/RESKCORE" target="_blank" rel="noopener noreferrer" className="type-mono hover:opacity-70 transition-opacity text-[10px] sm:text-[11px]">GitHub</a>
              <a href="https://linkedin.com/in/[username]" target="_blank" rel="noopener noreferrer" className="type-mono hover:opacity-70 transition-opacity text-[10px] sm:text-[11px]">LinkedIn</a>
              <a href="https://instagram.com/[username]" target="_blank" rel="noopener noreferrer" className="type-mono hover:opacity-70 transition-opacity text-[10px] sm:text-[11px]">Instagram</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-0 border-t border-[var(--fg)]/15 pt-6 sm:pt-8">
          <p className="type-mono text-[var(--fg)] opacity-50 text-[10px] sm:text-[11px]">Full Stack & AI/ML</p>
          <p className="type-mono text-[var(--fg)] opacity-50 text-[10px] sm:text-[11px]">[ RESK — 2026 ]</p>
        </div>
      </div>
    </footer>
  );
}
