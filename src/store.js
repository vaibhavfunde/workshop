// Shared, mutable scroll state. The DOM (GSAP ScrollTrigger) writes it,
// the 3D scene (React Three Fiber useFrame) reads it every frame.
// Kept outside React state so scrolling never triggers re-renders.

export const store = {
  mode: 'hero', // 'hero' | 'chapter' | 'off'
  active: 0, // index of the machine on stage (-1 = none)
  progress: 0, // 0..1 progress through the active chapter
  layerIndex: -1, // which layer is being described (-1 = overview)
  e: 0, // smoothed explosion amount 0..1
}

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const lerp = (a, b, t) => a + (b - a) * t
export const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
export const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt))

// First slice of every chapter is the assembled overview; the rest is split evenly across layers.
export const OVERVIEW_END = 0.14
export function layerFromProgress(p, n) {
  if (p < OVERVIEW_END) return -1
  return Math.min(n - 1, Math.floor(((p - OVERVIEW_END) / (1 - OVERVIEW_END)) * n))
}
