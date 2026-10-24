import { useMemo, useId } from 'react';

export type ArtVariant = 'network' | 'orbit' | 'pulse' | 'matrix' | 'radar' | 'scan';

interface GeneratedArtProps {
  variant: ArtVariant;
  seed?: number;
  label?: string;
  className?: string;
}

const ACCENT = '#0047FF';
const RED = ACCENT;
const CREAM = '#FFF8E7';
const INK = '#0a0a0a';
const W = 800;
const H = 800;

/** Small deterministic PRNG so every render of a given seed looks identical. */
function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function Network({ seed }: { seed: number }) {
  const { nodes, edges } = useMemo(() => {
    const r = rng(seed);
    const pts = Array.from({ length: 16 }, () => ({
      x: 90 + r() * (W - 180),
      y: 90 + r() * (H - 180),
      r: 4 + r() * 6,
    }));
    const links: [number, number][] = [];
    pts.forEach((p, i) => {
      const nearest = pts
        .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      nearest.forEach((n) => links.push([i, n.j]));
    });
    return { nodes: pts, edges: links };
  }, [seed]);

  return (
    <g>
      {[120, 220, 320].map((rad) => (
        <circle key={rad} cx={W / 2} cy={H / 2} r={rad} fill="none" stroke="#fff" strokeOpacity={0.06} />
      ))}
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke={i % 5 === 0 ? RED : '#fff'}
          strokeOpacity={i % 5 === 0 ? 0.9 : 0.22}
          strokeWidth={i % 5 === 0 ? 1.5 : 1}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r + 8} fill="none" stroke="#fff" strokeOpacity={0.2} />
          <circle cx={n.x} cy={n.y} r={n.r} fill={i % 4 === 0 ? RED : '#fff'} />
        </g>
      ))}
    </g>
  );
}

function Orbit({ seed }: { seed: number }) {
  const dots = useMemo(() => {
    const r = rng(seed);
    return [70, 130, 190, 250, 320].flatMap((rad, i) =>
      Array.from({ length: 2 + (i % 3) }, () => {
        const a = r() * Math.PI * 2;
        return { x: W / 2 + Math.cos(a) * rad, y: H / 2 + Math.sin(a) * rad, big: r() > 0.6 };
      }),
    );
  }, [seed]);

  return (
    <g>
      <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="#fff" strokeOpacity={0.12} />
      <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="#fff" strokeOpacity={0.12} />
      {[70, 130, 190, 250, 320].map((rad, i) => (
        <circle
          key={rad}
          cx={W / 2}
          cy={H / 2}
          r={rad}
          fill="none"
          stroke={i === 2 ? RED : '#fff'}
          strokeOpacity={i === 2 ? 0.85 : 0.25}
          strokeDasharray={i % 2 ? '4 8' : undefined}
        />
      ))}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.big ? 9 : 5} fill={d.big ? RED : '#fff'} />
      ))}
      <circle cx={W / 2} cy={H / 2} r={26} fill={RED} />
      <circle cx={W / 2} cy={H / 2} r={42} fill="none" stroke={RED} strokeOpacity={0.5} />
    </g>
  );
}

function Pulse({ seed }: { seed: number }) {
  const { line, area, bars } = useMemo(() => {
    const r = rng(seed);
    let v = 430;
    const pts = Array.from({ length: 41 }, (_, i) => {
      v += (r() - 0.5) * 70 - 4;
      v = Math.max(180, Math.min(560, v));
      return [i * (W / 40), v] as const;
    });
    const l = pts.map(([x, y]) => `${x},${y}`).join(' ');
    return {
      line: l,
      area: `0,${H} ${l} ${W},${H}`,
      bars: Array.from({ length: 40 }, () => 20 + r() * 90),
    };
  }, [seed]);

  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={i * 100} y1={0} x2={i * 100} y2={H} stroke="#fff" strokeOpacity={0.06} />
      ))}
      <polygon points={area} fill={RED} fillOpacity={0.22} />
      <polyline points={line} fill="none" stroke={RED} strokeWidth={3} />
      <polyline
        points={line.split(' ').map((p) => { const [x, y] = p.split(',').map(Number); return `${x},${y - 60}`; }).join(' ')}
        fill="none"
        stroke="#fff"
        strokeOpacity={0.3}
        strokeWidth={1}
      />
      {bars.map((h, i) => (
        <rect key={i} x={i * (W / 40) + 3} y={H - 40 - h} width={W / 40 - 6} height={h} fill="#fff" fillOpacity={i % 7 === 0 ? 0.55 : 0.14} />
      ))}
    </g>
  );
}

function Matrix({ seed }: { seed: number }) {
  const cells = useMemo(() => {
    const r = rng(seed);
    const out: { x: number; y: number; r: number; hot: boolean }[] = [];
    const n = 22;
    const step = (W - 120) / (n - 1);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const d = Math.hypot(i - n * 0.65, j - n * 0.4) / n;
        const v = Math.max(0, 1 - d * 1.4) * 0.7 + r() * 0.35;
        out.push({ x: 60 + i * step, y: 60 + j * step, r: 2 + v * 9, hot: v > 0.68 });
      }
    }
    return out;
  }, [seed]);

  return (
    <g>
      {cells.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={c.hot ? RED : '#fff'} fillOpacity={c.hot ? 1 : 0.28} />
      ))}
    </g>
  );
}

function Radar({ seed }: { seed: number }) {
  const { rings, data, axes } = useMemo(() => {
    const r = rng(seed);
    const n = 6;
    const cx = W / 2;
    const cy = H / 2;
    const pt = (i: number, rad: number) => {
      const a = (Math.PI * 2 * i) / n - Math.PI / 2;
      return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad] as const;
    };
    return {
      rings: [80, 160, 240, 320].map((rad) => Array.from({ length: n }, (_, i) => pt(i, rad).join(',')).join(' ')),
      data: Array.from({ length: n }, (_, i) => pt(i, 110 + r() * 200).join(',')).join(' '),
      axes: Array.from({ length: n }, (_, i) => pt(i, 320)),
    };
  }, [seed]);

  return (
    <g>
      {rings.map((p, i) => (
        <polygon key={i} points={p} fill="none" stroke="#fff" strokeOpacity={0.2} />
      ))}
      {axes.map(([x, y], i) => (
        <line key={i} x1={W / 2} y1={H / 2} x2={x} y2={y} stroke="#fff" strokeOpacity={0.2} />
      ))}
      <polygon points={data} fill={RED} fillOpacity={0.4} stroke={RED} strokeWidth={2.5} />
      {data.split(' ').map((p, i) => {
        const [x, y] = p.split(',').map(Number);
        return <circle key={i} cx={x} cy={y} r={7} fill="#fff" />;
      })}
    </g>
  );
}

function Scan({ seed }: { seed: number }) {
  const boxes = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: 5 }, (_, i) => ({
      x: 90 + r() * 420,
      y: 90 + r() * 480,
      w: 110 + r() * 130,
      h: 90 + r() * 130,
      score: (0.88 + r() * 0.1).toFixed(2),
      hot: i % 2 === 0,
    }));
  }, [seed]);

  return (
    <g>
      {Array.from({ length: 8 }, (_, i) =>
        Array.from({ length: 8 }, (_, j) => (
          <path
            key={`${i}-${j}`}
            d={`M${50 + i * 100} ${44 + j * 100}h12M${56 + i * 100} ${38 + j * 100}v12`}
            stroke="#fff"
            strokeOpacity={0.25}
          />
        )),
      )}
      {boxes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.hot ? RED : '#fff'} fillOpacity={0.08} stroke={b.hot ? RED : '#fff'} strokeWidth={2} />
          <rect x={b.x} y={b.y - 24} width={78} height={24} fill={b.hot ? RED : '#fff'} />
          <text x={b.x + 8} y={b.y - 8} fontSize={13} fontFamily="Inter, sans-serif" fontWeight={600} fill={b.hot ? '#fff' : INK}>
            {`CLS ${b.score}`}
          </text>
        </g>
      ))}
      <line x1={0} y1={640} x2={W} y2={640} stroke={RED} strokeWidth={2} />
      <rect x={0} y={640} width={W} height={60} fill={RED} fillOpacity={0.12} />
    </g>
  );
}

export function GeneratedArt({ variant, seed = 1, label, className = '' }: GeneratedArtProps) {
  const uid = useId().replace(/:/g, '');
  const glow = `glow-${uid}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={`w-full h-full block ${className}`}
      role="img"
      aria-label={label ?? `${variant} illustration`}
    >
      <defs>
        <radialGradient id={glow} cx="70%" cy="25%" r="75%">
          <stop offset="0%" stopColor={RED} stopOpacity={0.45} />
          <stop offset="100%" stopColor={RED} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={INK} />
      <rect width={W} height={H} fill={`url(#${glow})`} />
      {/* faint blueprint grid */}
      {Array.from({ length: 15 }, (_, i) => (
        <g key={i}>
          <line x1={i * 50} y1={0} x2={i * 50} y2={H} stroke="#fff" strokeOpacity={0.035} />
          <line x1={0} y1={i * 50} x2={W} y2={i * 50} stroke="#fff" strokeOpacity={0.035} />
        </g>
      ))}

      {variant === 'network' && <Network seed={seed} />}
      {variant === 'orbit' && <Orbit seed={seed} />}
      {variant === 'pulse' && <Pulse seed={seed} />}
      {variant === 'matrix' && <Matrix seed={seed} />}
      {variant === 'radar' && <Radar seed={seed} />}
      {variant === 'scan' && <Scan seed={seed} />}

      {label && (
        <text x={32} y={H - 28} fontSize={14} letterSpacing={3} fontFamily="Inter, sans-serif" fontWeight={500} fill="#fff" fillOpacity={0.6}>
          {label.toUpperCase()}
        </text>
      )}
      <text x={W - 32} y={44} textAnchor="end" fontSize={14} letterSpacing={3} fontFamily="Inter, sans-serif" fontWeight={500} fill={RED}>
        RESK
      </text>
    </svg>
  );
}
