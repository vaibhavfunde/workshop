import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { store, damp } from '../store'

// Fine brushed-metal grain: drives roughness + a tiny bump so highlights break up like real castings.
function makeGrain() {
  const N = 256
  const c = document.createElement('canvas')
  c.width = c.height = N
  const g = c.getContext('2d')
  const img = g.createImageData(N, N)
  const row = new Float32Array(N).map(() => Math.random())
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const v = 175 + row[y] * 30 + Math.random() * 50
      const i = (y * N + x) * 4
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 255
    }
  }
  g.putImageData(img, 0, 0)
  // fine scratches and tool marks
  for (let k = 0; k < 160; k++) {
    g.strokeStyle = `rgba(255,255,255,${0.15 + Math.random() * 0.3})`
    g.lineWidth = 0.5 + Math.random() * 0.8
    const x = Math.random() * N
    const y = Math.random() * N
    const a = Math.random() < 0.7 ? 0 : Math.random() * Math.PI
    const len = 8 + Math.random() * 60
    g.beginPath()
    g.moveTo(x, y)
    g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len)
    g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 8
  return t
}
export const GRAIN = makeGrain()

// Dirt / grime: soft dark blotches + streaks multiplied over the paint colour, so surfaces
// are never a perfectly flat colour (the other big giveaway of CG).
function makeDirt() {
  const N = 512
  const c = document.createElement('canvas')
  c.width = c.height = N
  const g = c.getContext('2d')
  g.fillStyle = '#ffffff'
  g.fillRect(0, 0, N, N)
  g.imageSmoothingEnabled = true
  g.imageSmoothingQuality = 'high'
  for (const [cells, alpha] of [[4, 0.09], [12, 0.07], [36, 0.06], [120, 0.035]]) {
    const s = document.createElement('canvas')
    s.width = s.height = cells
    const sg = s.getContext('2d')
    const im = sg.createImageData(cells, cells)
    for (let i = 0; i < cells * cells; i++) im.data[i * 4 + 3] = Math.random() * 255 * alpha
    sg.putImageData(im, 0, 0)
    g.drawImage(s, 0, 0, N, N)
  }
  for (let k = 0; k < 46; k++) {
    const x = Math.random() * N
    const y = Math.random() * N
    const grd = g.createLinearGradient(x, y, x, y + 40 + Math.random() * 140)
    grd.addColorStop(0, 'rgba(20,14,8,0.09)')
    grd.addColorStop(1, 'rgba(20,14,8,0)')
    g.fillStyle = grd
    g.fillRect(x, y, 1 + Math.random() * 3, 180)
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}
export const DIRT = makeDirt()

// Text on a canvas → texture (name plates, gas-cylinder stencils)
function textTex({ w = 512, h = 128, text, bg, fg = '#ffffff', size = 54, border }) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  if (bg) {
    g.fillStyle = bg
    g.fillRect(0, 0, w, h)
    if (border) {
      g.strokeStyle = border
      g.lineWidth = 5
      g.strokeRect(7, 7, w - 14, h - 14)
    }
  }
  g.fillStyle = fg
  g.font = `700 ${size}px "Barlow Condensed", "Arial Narrow", Arial, sans-serif`
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(text, w / 2, h / 2 + 2, w - 40)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

// Boxes get softly rounded edges (cached per size) — sharp CG corners are the #1 giveaway.
const boxCache = new Map()
const bevelBox = (s) => {
  const key = s.join('|')
  let g = boxCache.get(key)
  if (!g) {
    g = new RoundedBoxGeometry(s[0], s[1], s[2], 2, Math.max(0.002, Math.min(0.032, Math.min(...s) * 0.3)))
    boxCache.set(key, g)
  }
  return g
}

const Mat = ({ m }) => (
  <meshPhysicalMaterial {...MAT[m]} map={DIRT} roughnessMap={GRAIN} bumpMap={GRAIN} bumpScale={0.35} envMapIntensity={1.2} />
)

// Riveted brass name plate, facing +Z by default
export const Plate = ({ p, s = [0.5, 0.13], text, rot = [0, 0, 0], size = 50 }) => {
  const tex = useMemo(() => textTex({ w: 512, h: Math.round(512 * (s[1] / s[0])), text, bg: '#b8923f', fg: '#1b1408', size, border: '#6e5520' }), [text])
  return (
    <mesh position={p} rotation={rot}>
      <planeGeometry args={s} />
      <meshStandardMaterial map={tex} metalness={0.7} roughness={0.38} envMapIntensity={1.1} polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  )
}

// Stencilled text wrapped around a cylinder (gas bottles). Centre of the text faces +Z.
export const Wrap = ({ r, h, p, text, arc = 1.5, fg = '#ffffff', size = 78 }) => {
  const tex = useMemo(() => textTex({ w: 512, h: Math.round((512 * h) / (r * arc)), text, fg, size }), [text])
  return (
    <mesh position={p}>
      <cylinderGeometry args={[r + 0.003, r + 0.003, h, 40, 1, true, -arc / 2, arc]} />
      <meshStandardMaterial map={tex} transparent metalness={0.1} roughness={0.6} polygonOffset polygonOffsetFactor={-2} depthWrite={false} />
    </mesh>
  )
}

// ── Materials ────────────────────────────────────────────────
export const MAT = {
  cast: { color: '#6b819b', metalness: 0.7, roughness: 0.42 },
  castDark: { color: '#3d4856', metalness: 0.8, roughness: 0.5 },
  steel: { color: '#c7cfd6', metalness: 1, roughness: 0.2 },
  steelDull: { color: '#8c97a2', metalness: 0.9, roughness: 0.38 },
  orange: { color: '#e4561b', metalness: 0.45, roughness: 0.42 },
  yellow: { color: '#e3a620', metalness: 0.4, roughness: 0.45 },
  black: { color: '#15181c', metalness: 0.5, roughness: 0.55 },
  copper: { color: '#c47a3c', metalness: 1, roughness: 0.3 },
  rubber: { color: '#1c1e21', metalness: 0, roughness: 0.9 },
  red: { color: '#b3232b', metalness: 0.4, roughness: 0.45 },
  maroon: { color: '#6b1721', metalness: 0.45, roughness: 0.42 },
  white: { color: '#f1f0ea', metalness: 0, roughness: 0.55 },
  brass: { color: '#b8923f', metalness: 1, roughness: 0.3 },
  green: { color: '#2e9d57', metalness: 0.3, roughness: 0.5 },
}

export const RX = [0, 0, Math.PI / 2] // cylinder axis along X
export const RZ = [Math.PI / 2, 0, 0] // cylinder axis along Z

const ACCENT = new THREE.Color('#ff6a1a')

// painted surfaces get a glossy clear coat on top of the paint
for (const k of ['cast', 'castDark', 'orange', 'yellow', 'red', 'maroon']) Object.assign(MAT[k], { clearcoat: 0.45, clearcoatRoughness: 0.32 })

// ── Primitive helpers ───────────────────────────────────────
export const Box = ({ s = [1, 1, 1], p = [0, 0, 0], r = [0, 0, 0], m = 'cast', ...rest }) => (
  <mesh position={p} rotation={r} geometry={bevelBox(s)} castShadow receiveShadow {...rest}>
    <Mat m={m} />
  </mesh>
)

// Hex bolt head — rot decides which way it faces (default: out of the +Z face)
export const Bolt = ({ p, r = 0.04, rot = [Math.PI / 2, 0, 0] }) => (
  <group position={p} rotation={rot}>
    <mesh castShadow>
      <cylinderGeometry args={[r, r, r * 0.9, 6]} />
      <Mat m="steelDull" />
    </mesh>
    <mesh position={[0, r * 0.5, 0]}>
      <cylinderGeometry args={[r * 0.55, r * 0.55, r * 0.15, 12]} />
      <Mat m="black" />
    </mesh>
  </group>
)

// r = top radius, rb = bottom radius (defaults to r)
export const Cyl = ({ r = 0.5, rb, h = 1, p = [0, 0, 0], rot = [0, 0, 0], m = 'steel', seg = 40, ...rest }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow {...rest}>
    <cylinderGeometry args={[r, rb ?? r, h, seg]} />
    <Mat m={m} />
  </mesh>
)

export const Tor = ({ r = 1, t = 0.05, p = [0, 0, 0], rot = [0, 0, 0], m = 'steel', arc = Math.PI * 2, ...rest }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow {...rest}>
    <torusGeometry args={[r, t, 14, 56, arc]} />
    <Mat m={m} />
  </mesh>
)

export const Sph = ({ r = 0.5, p = [0, 0, 0], m = 'steel', dome = false, ...rest }) => (
  <mesh position={p} castShadow receiveShadow {...rest}>
    {dome ? <sphereGeometry args={[r, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2]} /> : <sphereGeometry args={[r, 32, 20]} />}
    <Mat m={m} />
  </mesh>
)

export function Tube({ pts, radius = 0.05, m = 'rubber', seg = 80 }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q)))
    return new THREE.TubeGeometry(curve, seg, radius, 10, false)
  }, [pts, radius, seg])
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <Mat m={m} />
    </mesh>
  )
}

// Round gauge dial that faces +Z
export function Gauge({ p, r = 0.19, needle = 0.6 }) {
  return (
    <group position={p}>
      <Cyl r={r} h={0.1} rot={RZ} m="steel" />
      <Cyl r={r * 0.82} h={0.02} rot={RZ} p={[0, 0, 0.055]} m="white" />
      <Box s={[0.012, r * 0.62, 0.008]} p={[0, r * 0.2, 0.07]} r={[0, 0, needle]} m="red" />
      <Sph r={0.02} p={[0, 0, 0.075]} m="black" />
    </group>
  )
}

// ── Exploding layer ─────────────────────────────────────────
// Slides along `ex` as the global explosion amount grows, and glows
// orange while it is the layer currently being described.
export function Layer({ index, ex, children }) {
  const g = useRef()
  const st = useRef({ ready: false, meshes: [], hl: 0, applied: -1 })

  useFrame(() => {
    const s = st.current
    if (!s.ready) {
      g.current.traverse((o) => {
        if (o.isMesh && !o.userData.keep) {
          o.material = o.material.clone()
          o.material.emissive.copy(ACCENT)
          o.material.emissiveIntensity = 0
          s.meshes.push(o)
        }
      })
      s.ready = true
    }
    const e = store.e
    g.current.position.set(ex[0] * e, ex[1] * e, ex[2] * e)

    const target = store.layerIndex === index ? 1 : 0
    s.hl += (target - s.hl) * 0.14
    if (Math.abs(s.hl - s.applied) > 0.003) {
      for (const m of s.meshes) m.material.emissiveIntensity = s.hl * 0.16
      s.applied = s.hl
    }
  })

  return <group ref={g}>{children}</group>
}

// ── Sparks / swarf particles ────────────────────────────────
export function Sparks({
  p = [0, 0, 0],
  dir = [0, 1, 0],
  count = 120,
  speed = 2.4,
  spread = 0.9,
  gravity = 5.5,
  size = 0.05,
  color = '#ffb347',
  layer,
}) {
  const pts = useRef()
  const mat = useRef()
  const k = useRef(0)
  const glow = useMemo(() => new THREE.Color(color).multiplyScalar(2.6), [color])
  const data = useMemo(() => {
    const life = new Float32Array(count)
    for (let i = 0; i < count; i++) life[i] = Math.random()
    return { pos: new Float32Array(count * 3), vel: new Float32Array(count * 3), life }
  }, [count])

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const want = store.layerIndex === layer && store.e > 0.5 ? 1 : 0
    k.current = damp(k.current, want, 7, dt)
    const a = k.current
    pts.current.visible = a > 0.02
    if (!pts.current.visible) return
    mat.current.opacity = a
    const { pos, vel, life } = data
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      life[i] -= dt * (0.85 + (i % 7) * 0.16)
      if (life[i] <= 0) {
        life[i] = 1
        pos[i3] = pos[i3 + 1] = pos[i3 + 2] = 0
        const v = speed * (0.45 + Math.random() * 0.9)
        vel[i3] = (dir[0] + (Math.random() - 0.5) * spread) * v
        vel[i3 + 1] = (dir[1] + (Math.random() - 0.5) * spread) * v
        vel[i3 + 2] = (dir[2] + (Math.random() - 0.5) * spread) * v
      } else {
        vel[i3 + 1] -= gravity * dt
        pos[i3] += vel[i3] * dt
        pos[i3 + 1] += vel[i3 + 1] * dt
        pos[i3 + 2] += vel[i3 + 2] * dt
      }
    }
    pts.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pts} position={p} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.pos} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        color={glow}
        toneMapped={false}
        size={size}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}
