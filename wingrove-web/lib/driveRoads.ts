/**
 * A simplified road network for the drive-times map: the main corridors families use, drawn from
 * approximate coordinates. It is a sketch for believable-looking routes, not a navigation map, and
 * the minutes shown on the site come from the Studio, not from this network.
 *
 * Crossings share exactly the same coordinates, which is how roads join up in the graph.
 */
type LL = [number, number] // [lat, lng]
export type Road = { name: string; kind: 'freeway' | 'major'; label?: { at: LL; text: string }; pts: LL[] }

export const ROADS: Road[] = [
  {
    name: 'I-95',
    kind: 'freeway',
    label: { at: [26.58, -80.0755], text: 'I-95' },
    pts: [[26.9, -80.087], [26.842, -80.082], [26.76, -80.075], [26.705, -80.066], [26.68, -80.068], [26.645, -80.071], [26.617, -80.073], [26.525, -80.078], [26.46, -80.084], [26.44, -80.086], [26.392, -80.094], [26.366, -80.098], [26.32, -80.105]],
  },
  {
    name: 'Turnpike',
    kind: 'freeway',
    label: { at: [26.575, -80.168], text: 'Turnpike' },
    pts: [[26.9, -80.145], [26.842, -80.14], [26.76, -80.152], [26.705, -80.163], [26.68, -80.166], [26.645, -80.167], [26.617, -80.167], [26.525, -80.169], [26.46, -80.171], [26.44, -80.172], [26.392, -80.174], [26.366, -80.174], [26.32, -80.175]],
  },
  {
    name: 'State Road 7',
    kind: 'major',
    label: { at: [26.56, -80.205], text: 'SR 7' },
    pts: [[26.705, -80.205], [26.68, -80.205], [26.645, -80.2045], [26.6368, -80.2043], [26.617, -80.2043], [26.525, -80.205], [26.46, -80.206], [26.392, -80.206], [26.366, -80.207], [26.32, -80.207]],
  },
  {
    name: 'Military Trail',
    kind: 'major',
    pts: [[26.842, -80.115], [26.76, -80.117], [26.705, -80.118], [26.68, -80.118], [26.645, -80.119], [26.617, -80.119], [26.525, -80.12], [26.46, -80.12], [26.44, -80.12], [26.392, -80.121], [26.366, -80.121]],
  },
  { name: 'South Shore Blvd', kind: 'major', pts: [[26.68, -80.258], [26.645, -80.258], [26.617, -80.258], [26.602, -80.258]] },
  { name: 'PGA Blvd', kind: 'major', pts: [[26.842, -80.14], [26.842, -80.115], [26.842, -80.082]] },
  { name: 'Okeechobee Blvd', kind: 'major', pts: [[26.705, -80.205], [26.705, -80.163], [26.705, -80.118], [26.705, -80.066], [26.7135, -80.053]] },
  { name: 'Southern Blvd', kind: 'major', pts: [[26.68, -80.258], [26.68, -80.205], [26.68, -80.166], [26.68, -80.118], [26.68, -80.068]] },
  { name: 'Forest Hill Blvd', kind: 'major', pts: [[26.645, -80.258], [26.645, -80.2045], [26.645, -80.167], [26.645, -80.119], [26.645, -80.071]] },
  { name: 'Lake Worth Rd', kind: 'major', pts: [[26.617, -80.258], [26.617, -80.2043], [26.617, -80.167], [26.617, -80.119], [26.617, -80.073]] },
  { name: 'Boynton Beach Blvd', kind: 'major', pts: [[26.525, -80.205], [26.525, -80.169], [26.525, -80.12], [26.525, -80.078]] },
  { name: 'Atlantic Ave', kind: 'major', pts: [[26.46, -80.206], [26.46, -80.171], [26.46, -80.12], [26.46, -80.084], [26.4615, -80.0728]] },
  { name: 'Linton Blvd', kind: 'major', pts: [[26.44, -80.172], [26.44, -80.12], [26.44, -80.086]] },
  { name: 'Clint Moore Rd', kind: 'major', pts: [[26.392, -80.206], [26.392, -80.174], [26.392, -80.121], [26.392, -80.094]] },
  { name: 'Glades Rd', kind: 'major', pts: [[26.366, -80.207], [26.366, -80.174], [26.366, -80.121], [26.366, -80.098], [26.364, -80.085]] },
]

type XY = { x: number; y: number }

/** Builds a router over ROADS in the map's own units. Freeways count as quicker, so routes prefer them. */
export function makeRouter(project: (lat: number, lng: number) => XY) {
  const key = (p: LL) => `${p[0]},${p[1]}`
  const nodes = new Map<string, XY>()
  const adj = new Map<string, { to: string; w: number }[]>()
  const segs: { a: string; b: string; f: number }[] = []
  const link = (a: string, b: string, f: number) => {
    const A = nodes.get(a)!
    const Bn = nodes.get(b)!
    const w = Math.hypot(A.x - Bn.x, A.y - Bn.y) * f
    ;(adj.get(a) || adj.set(a, []).get(a)!).push({ to: b, w })
    ;(adj.get(b) || adj.set(b, []).get(b)!).push({ to: a, w })
  }
  for (const r of ROADS) {
    const f = r.kind === 'freeway' ? 0.55 : 1
    r.pts.forEach((p) => nodes.set(key(p), project(p[0], p[1])))
    for (let i = 1; i < r.pts.length; i++) {
      link(key(r.pts[i - 1]), key(r.pts[i]), f)
      segs.push({ a: key(r.pts[i - 1]), b: key(r.pts[i]), f })
    }
  }

  // Attach a point to the network at the nearest spot on any road
  let extra = 0
  const attach = (p: XY) => {
    let best = { d: Infinity, s: segs[0], t: 0 }
    for (const s of segs) {
      const A = nodes.get(s.a)!
      const Bn = nodes.get(s.b)!
      const vx = Bn.x - A.x
      const vy = Bn.y - A.y
      const t = Math.max(0, Math.min(1, ((p.x - A.x) * vx + (p.y - A.y) * vy) / (vx * vx + vy * vy || 1)))
      const d = Math.hypot(A.x + vx * t - p.x, A.y + vy * t - p.y)
      if (d < best.d) best = { d, s, t }
    }
    const A = nodes.get(best.s.a)!
    const Bn = nodes.get(best.s.b)!
    const id = `x${extra++}`
    const at = `${id}j`
    nodes.set(id, p)
    nodes.set(at, { x: A.x + (Bn.x - A.x) * best.t, y: A.y + (Bn.y - A.y) * best.t })
    link(id, at, 1.2)
    link(at, best.s.a, best.s.f)
    link(at, best.s.b, best.s.f)
    return id
  }

  const route = (from: XY, to: XY): XY[] => {
    const s = attach(from)
    const t = attach(to)
    const dist = new Map<string, number>([[s, 0]])
    const prev = new Map<string, string>()
    const open = new Set([s])
    while (open.size) {
      let u = ''
      let du = Infinity
      for (const n of open) {
        const d = dist.get(n) ?? Infinity
        if (d < du) {
          du = d
          u = n
        }
      }
      open.delete(u)
      if (u === t) break
      for (const e of adj.get(u) || []) {
        const nd = du + e.w
        if (nd < (dist.get(e.to) ?? Infinity)) {
          dist.set(e.to, nd)
          prev.set(e.to, u)
          open.add(e.to)
        }
      }
    }
    const path: XY[] = []
    for (let n: string | undefined = t; n; n = prev.get(n)) path.unshift(nodes.get(n)!)
    return path
  }

  return { route }
}
