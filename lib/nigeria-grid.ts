import { nigeriaStates } from "@/lib/nigeria-map";

/**
 * The borders of the Nigeria map as a network, for the homepage "power grid".
 *
 * Every state in lib/nigeria-map.ts is its own closed path, so each internal
 * border exists twice. That is harmless for a solid line, but a light pulse
 * running along it would run twice, out of step. This works out which side of
 * every border belongs to whom, so the animated current can run along each
 * border exactly once:
 *
 *  - `frontier`: the outer edge of each cluster of served states (including
 *    their stretch of the national border), chained into long clockwise
 *    loops so the current reads as one continuous, directional circuit.
 *  - `internal`: borders shared by two served states, once each.
 *  - `outline`: the national border where it runs past unserved states.
 *
 * The source simplification kept most shared borders vertex-identical; where
 * two neighbours drifted apart (always by less than a unit) the two sides are
 * matched by distance. The national border sits 4+ units from any other state.
 *
 * Pure and deterministic: runs once on the server when the page renders.
 */

type Pt = [number, number];
type Run = { s: string; nb: string | null; pts: Pt[] };

/** Closer than this to another state's border means "shared", not "national". */
const SLIVER = 2;
/** Loose ends closer than this are joined when chaining loops (where a
 *  junction's slivers leave a hair of a gap — a few px at most). */
const JOIN = 7;

const key = (p: Pt) => `${p[0]},${p[1]}`;
const edgeKey = (a: Pt, b: Pt) => {
  const ka = key(a);
  const kb = key(b);
  return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
};

function parseRing(d: string): Pt[] {
  const pts = [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(
    (m) => [Number(m[1]), Number(m[2])] as Pt,
  );
  if (pts.length > 1 && key(pts[0]) === key(pts[pts.length - 1])) pts.pop();
  // Clockwise on screen (y down) — so every served state's border, and so
  // every loop of current, turns the same way.
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    area += x1 * y2 - x2 * y1;
  }
  return area < 0 ? pts.reverse() : pts;
}

function length(pts: Pt[]) {
  let t = 0;
  for (let i = 1; i < pts.length; i++)
    t += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return t;
}

function distToSegment(p: Pt, a: Pt, b: Pt) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy || 1;
  const t = Math.max(
    0,
    Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2),
  );
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}

const toD = (pts: Pt[], closed: boolean) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("") +
  (closed ? "Z" : "");

/** Join runs end-to-start, both ways, into the longest polylines possible. */
function chain(runs: Pt[][]): { pts: Pt[]; closed: boolean }[] {
  const left = runs.map((r) => r.slice());
  const out: { pts: Pt[]; closed: boolean }[] = [];
  const near = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]) < JOIN;
  while (left.length) {
    let line = left.shift()!;
    let grown = true;
    const shut = () =>
      length(line) > 20 * JOIN && near(line[0], line[line.length - 1]);
    while (grown && !shut()) {
      grown = false;
      const end = line[line.length - 1];
      const i = left.findIndex((r) => near(r[0], end));
      if (i >= 0) {
        line.push(...left.splice(i, 1)[0].slice(1));
        grown = true;
        continue;
      }
      const j = left.findIndex((r) => near(r[r.length - 1], line[0]));
      if (j >= 0) {
        line = [...left.splice(j, 1)[0], ...line.slice(1)];
        grown = true;
      }
    }
    const closed = shut();
    if (closed) line.pop();
    out.push({ pts: line, closed });
  }
  return out;
}

export type GridLine = { d: string; length: number };

export function buildPowerGrid(served: readonly string[]) {
  const isServed = new Set(served);
  const rings = nigeriaStates.map((s) => ({ id: s.id, pts: parseRing(s.d) }));

  // Who owns each vertex-identical edge.
  const owners = new Map<string, string[]>();
  for (const { id, pts } of rings)
    for (let i = 0; i < pts.length; i++) {
      const k = edgeKey(pts[i], pts[(i + 1) % pts.length]);
      const o = owners.get(k);
      if (o) o.push(id);
      else owners.set(k, [id]);
    }

  // Every edge of every ring is either shared vertex-for-vertex with one
  // neighbour, or unshared. An unshared edge is the national border, or a
  // sliver where two neighbours' simplified lines drift apart — tell which by
  // distance, edge by edge (a sliver can run past a junction).
  const boxes = rings.map(({ id, pts }) => {
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return {
      id,
      pts,
      x0: Math.min(...xs) - SLIVER,
      x1: Math.max(...xs) + SLIVER,
      y0: Math.min(...ys) - SLIVER,
      y1: Math.max(...ys) + SLIVER,
    };
  });
  const nearest = (self: string, a: Pt, b: Pt) => {
    const m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    for (const box of boxes) {
      if (box.id === self) continue;
      if (m[0] < box.x0 || m[0] > box.x1 || m[1] < box.y0 || m[1] > box.y1)
        continue;
      const { pts } = box;
      for (let i = 0; i < pts.length; i++)
        if (distToSegment(m, pts[i], pts[(i + 1) % pts.length]) < SLIVER)
          return box.id;
    }
    return null;
  };

  // Walk each ring, cutting it into runs that face a single neighbour.
  const runs: Run[] = [];
  for (const { id, pts } of rings) {
    const n = pts.length;
    const label = pts.map((p, i) => {
      const q = pts[(i + 1) % n];
      const other = owners.get(edgeKey(p, q))!.find((o) => o !== id);
      return other ?? nearest(id, p, q);
    });
    let start = label.findIndex((l, i) => l !== label[(i - 1 + n) % n]);
    if (start < 0) start = 0;
    for (let k = 0; k < n; ) {
      const nb = label[(start + k) % n];
      const run: Pt[] = [pts[(start + k) % n]];
      while (k < n && label[(start + k) % n] === nb) {
        run.push(pts[(start + k + 1) % n]);
        k++;
      }
      runs.push({ s: id, nb, pts: run });
    }
  }

  const lines = (list: { pts: Pt[]; closed: boolean }[]): GridLine[] =>
    list.map((l) => ({
      d: toD(l.pts, l.closed),
      length: Math.round(length(l.closed ? [...l.pts, l.pts[0]] : l.pts)),
    }));

  const frontier = lines(
    chain(
      runs
        .filter((r) => isServed.has(r.s) && !(r.nb && isServed.has(r.nb)))
        .map((r) => r.pts),
    ),
  ).sort((a, b) => b.length - a.length);

  const internal = lines(
    chain(
      runs
        .filter(
          (r) =>
            isServed.has(r.s) && r.nb && isServed.has(r.nb) && r.s < r.nb,
        )
        .map((r) => r.pts),
    ),
  );

  const outline = chain(
    runs.filter((r) => r.nb === null && !isServed.has(r.s)).map((r) => r.pts),
  )
    .map((l) => toD(l.pts, l.closed))
    .join("");

  return { frontier, internal, outline };
}
