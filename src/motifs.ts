/**
 * Geometry for the two background motifs, computed at build time. Both are seeded, so every
 * build draws the same picture; change a SEED to get a different one.
 *
 * Both share one 1600×600 canvas. The SVG uses `preserveAspectRatio="xMidYMid slice"`, so
 * the hero shows most of it and the thin band on inner pages shows a strip through the middle.
 */

export const VIEW = { w: 1600, h: 600 };
export const viewBox = `0 0 ${VIEW.w} ${VIEW.h}`;

/** mulberry32: a tiny seeded PRNG, so the motif is stable across builds. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/* ------------------------------------------------------------------
   Flow: a left-to-right process diagram — nodes on a loose grid, joined by
   right-angle connectors with arrowheads. `d` is the column, which staggers the intro.
   ------------------------------------------------------------------ */

type Shape = 'rect' | 'diamond';
interface FlowNode { x: number; y: number; shape: Shape; key: boolean; d: number; }
interface FlowEdge { path: string; arrow: string; d: number; }

const FLOW_SEED = 20260930;
const COLS = 10;
const ROWS = 6;
const COL_W = VIEW.w / COLS;  // 160
const ROW_H = VIEW.h / ROWS;  // 100
const RECT = { w: 72, h: 40, r: 6 };
const DIAMOND = 26;           // half-diagonal
const ARROW = 7;
const CORNER = 8;

function halfWidth(n: FlowNode) {
  return n.shape === 'rect' ? RECT.w / 2 : DIAMOND;
}

function buildFlow() {
  const rand = rng(FLOW_SEED);

  const columns: FlowNode[][] = [];
  for (let c = 0; c < COLS; c++) {
    const count = 1 + Math.floor(rand() * 3); // 1–3 nodes per column
    const rows = new Set<number>();
    while (rows.size < count) rows.add(Math.floor(rand() * ROWS));
    columns.push(
      [...rows].sort((a, b) => a - b).map((row) => ({
        x: COL_W * (c + 0.5),
        y: ROW_H * (row + 0.5),
        shape: rand() < 0.18 ? 'diamond' : 'rect',
        key: rand() < 0.2,
        d: c,
      })),
    );
  }

  const edges: FlowEdge[] = [];
  const seen = new Set<string>();

  function connect(a: FlowNode, b: FlowNode) {
    const id = `${a.x},${a.y}>${b.x},${b.y}`;
    if (seen.has(id)) return;
    seen.add(id);

    const x0 = a.x + halfWidth(a);
    const x1 = b.x - halfWidth(b) - ARROW;
    const mid = (x0 + x1) / 2;
    let path: string;
    if (a.y === b.y) {
      path = `M${x0},${a.y}H${x1}`;
    } else {
      // Horizontal, rounded corner, vertical, rounded corner, horizontal.
      const s = Math.sign(b.y - a.y);
      path =
        `M${x0},${a.y}H${mid - CORNER}Q${mid},${a.y} ${mid},${a.y + s * CORNER}` +
        `V${b.y - s * CORNER}Q${mid},${b.y} ${mid + CORNER},${b.y}H${x1}`;
    }
    const tip = x1 + ARROW;
    const arrow = `M${tip},${b.y}L${x1},${b.y - ARROW / 1.6}L${x1},${b.y + ARROW / 1.6}Z`;
    edges.push({ path, arrow, d: a.d });
  }

  const nearest = (list: FlowNode[], y: number) =>
    list.reduce((best, n) => (Math.abs(n.y - y) < Math.abs(best.y - y) ? n : best));

  for (let c = 0; c < COLS - 1; c++) {
    const from = columns[c];
    const to = columns[c + 1];
    // Every node has an input (except the first column) and an output (except the last).
    for (const b of to) connect(nearest(from, b.y), b);
    for (const a of from) connect(a, nearest(to, a.y));
    // And the odd extra branch.
    for (const a of from) for (const b of to) if (rand() < 0.12) connect(a, b);
  }

  const nodes = columns.flat().map((n) => ({
    ...n,
    path:
      n.shape === 'rect'
        ? null
        : `M${n.x},${n.y - DIAMOND}L${n.x + DIAMOND},${n.y}L${n.x},${n.y + DIAMOND}L${n.x - DIAMOND},${n.y}Z`,
  }));

  return { nodes, edges, rect: RECT };
}

/* ------------------------------------------------------------------
   Contours: marching squares over a smooth, seeded height field, with segments joined
   into polylines. `d` is the level, which staggers the intro; every fifth is an index line.
   ------------------------------------------------------------------ */

const CONTOUR_SEED = 4121;
const STEP = 12.5;
const LEVELS = 16;

function buildContours() {
  const rand = rng(CONTOUR_SEED);

  const bumps = Array.from({ length: 7 }, () => ({
    x: rand() * VIEW.w,
    y: rand() * VIEW.h,
    s: 140 + rand() * 260,
    a: (rand() < 0.25 ? -1 : 1) * (0.6 + rand() * 0.8),
  }));
  const waves = Array.from({ length: 3 }, () => ({
    fx: (0.5 + rand() * 1.5) / VIEW.w,
    fy: (0.5 + rand() * 1.5) / VIEW.h,
    p: rand() * Math.PI * 2,
    a: 0.15 + rand() * 0.15,
  }));

  const field = (x: number, y: number) => {
    let v = 0;
    for (const b of bumps) v += b.a * Math.exp(-((x - b.x) ** 2 + (y - b.y) ** 2) / (2 * b.s * b.s));
    for (const w of waves) v += w.a * Math.sin(2 * Math.PI * (x * w.fx + y * w.fy) + w.p);
    return v;
  };

  const nx = Math.round(VIEW.w / STEP) + 1;
  const ny = Math.round(VIEW.h / STEP) + 1;
  const grid: number[][] = [];
  let min = Infinity;
  let max = -Infinity;
  for (let j = 0; j < ny; j++) {
    const row: number[] = [];
    for (let i = 0; i < nx; i++) {
      const v = field(i * STEP, j * STEP);
      row.push(v);
      if (v < min) min = v;
      if (v > max) max = v;
    }
    grid.push(row);
  }

  const lines: { d: string; level: number; index: boolean }[] = [];

  for (let l = 1; l <= LEVELS; l++) {
    const t = min + ((max - min) * l) / (LEVELS + 1);

    // Each crossing is identified by the grid edge it sits on, so segments that share a
    // crossing join up exactly.
    const point = new Map<string, [number, number]>();
    const crossing = (i0: number, j0: number, i1: number, j1: number) => {
      const key = `${i0},${j0},${i1},${j1}`;
      if (!point.has(key)) {
        const a = grid[j0][i0];
        const b = grid[j1][i1];
        const f = (t - a) / (b - a);
        point.set(key, [r1((i0 + (i1 - i0) * f) * STEP), r1((j0 + (j1 - j0) * f) * STEP)]);
      }
      return key;
    };

    const adj = new Map<string, string[]>();
    const link = (a: string, b: string) => {
      (adj.get(a) ?? adj.set(a, []).get(a)!).push(b);
      (adj.get(b) ?? adj.set(b, []).get(b)!).push(a);
    };

    for (let j = 0; j < ny - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        const tl = grid[j][i] > t ? 8 : 0;
        const tr = grid[j][i + 1] > t ? 4 : 0;
        const br = grid[j + 1][i + 1] > t ? 2 : 0;
        const bl = grid[j + 1][i] > t ? 1 : 0;
        const c = tl | tr | br | bl;
        if (c === 0 || c === 15) continue;
        const top = () => crossing(i, j, i + 1, j);
        const right = () => crossing(i + 1, j, i + 1, j + 1);
        const bottom = () => crossing(i, j + 1, i + 1, j + 1);
        const left = () => crossing(i, j, i, j + 1);
        switch (c) {
          case 1: case 14: link(left(), bottom()); break;
          case 2: case 13: link(bottom(), right()); break;
          case 3: case 12: link(left(), right()); break;
          case 4: case 11: link(top(), right()); break;
          case 6: case 9: link(top(), bottom()); break;
          case 7: case 8: link(left(), top()); break;
          case 5: link(left(), top()); link(bottom(), right()); break;
          case 10: link(top(), right()); link(left(), bottom()); break;
        }
      }
    }

    // Walk chains, starting from open ends first so lines that leave the canvas stay whole.
    const used = new Set<string>();
    const edgeId = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
    const starts = [...adj.keys()].sort((a, b) => adj.get(a)!.length - adj.get(b)!.length);
    for (const start of starts) {
      for (const first of adj.get(start)!) {
        if (used.has(edgeId(start, first))) continue;
        const chain = [start];
        let prev = start;
        let cur = first;
        used.add(edgeId(prev, cur));
        while (true) {
          chain.push(cur);
          const next = adj.get(cur)!.find((n) => !used.has(edgeId(cur, n)));
          if (!next) break;
          used.add(edgeId(cur, next));
          prev = cur;
          cur = next;
        }
        if (chain.length < 4) continue; // drop specks
        const pts = chain.map((k) => point.get(k)!);
        const d = 'M' + pts.map(([x, y]) => `${x},${y}`).join('L');
        lines.push({ d, level: l, index: l % 5 === 0 });
      }
    }
  }

  return lines;
}

export const flow = buildFlow();
export const contours = buildContours();
