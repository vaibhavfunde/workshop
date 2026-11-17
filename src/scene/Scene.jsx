import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ToneMapping, N8AO, SMAA } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { GRAIN, DIRT } from './parts'
import { store, damp, lerp, smooth, layerFromProgress } from '../store'
import Lathe, { meta as latheMeta } from './Lathe'
import Press, { meta as pressMeta } from './Press'
import Welder, { meta as welderMeta } from './Welder'
import Cutter, { meta as cutterMeta } from './Cutter'

const FLOOR = -2.4
const MACHINES = [
  { C: Lathe, meta: latheMeta },
  { C: Press, meta: pressMeta },
  { C: Welder, meta: welderMeta },
  { C: Cutter, meta: cutterMeta },
]

// Where each machine's local origin lands in the world, and the world position of each layer's focus.
const slotPos = (m) => {
  const s = m.scale
  return [-m.center[0] * s, FLOOR - m.bottom * s, -m.center[2] * s]
}
const FOCUS = MACHINES.map(({ meta: m }) => {
  const [px, py, pz] = slotPos(m)
  return m.layers.map((l) => [
    px + (l.c[0] + l.ex[0]) * m.scale,
    py + (l.c[1] + l.ex[1]) * m.scale,
    pz + (l.c[2] + l.ex[2]) * m.scale,
  ])
})

function MachineSlot({ idx, C, meta }) {
  const g = useRef()
  const k = useRef(idx === 0 ? 1 : 0)
  const pos = slotPos(meta)
  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const on = store.active === idx ? 1 : 0
    k.current = damp(k.current, on, on ? 5 : 11, dt)
    const s = k.current
    g.current.visible = s > 0.01
    g.current.scale.setScalar(Math.max(s, 0.0001) * meta.scale)
    g.current.rotation.y = (1 - s) * (on ? -1.4 : 1.4)
  })
  return (
    <group ref={g} position={pos}>
      <C />
    </group>
  )
}

function Rig() {
  const { camera, size } = useThree()
  const tgt = useRef(new THREE.Vector3(0, 0, 0))
  const cam = useRef(new THREE.Vector3(6, 3, 10))
  const wanted = useMemo(() => new THREE.Vector3(), [])
  const shiftY = useRef(0.2)

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const t = state.clock.elapsedTime
    const inChapter = store.mode === 'chapter'
    const p = inChapter ? store.progress : 0

    store.layerIndex = inChapter ? layerFromProgress(p, 5) : -1
    store.e = damp(store.e, inChapter ? smooth(0.04, 0.22, p) : 0, 3.2, dt)

    const idx = Math.max(store.active, 0)
    const m = MACHINES[idx].meta
    const e = store.e

    // look-at target: machine centre, drifting toward the layer being described
    const baseY = m.cam.ty
    let tx = 0
    let ty = baseY
    let tz = 0
    if (store.layerIndex >= 0) {
      const f = FOCUS[idx][store.layerIndex]
      tx = lerp(0, f[0], 0.38 * e)
      ty = lerp(baseY, f[1], 0.38 * e)
      tz = lerp(0, f[2], 0.38 * e)
    }
    tgt.current.x = damp(tgt.current.x, tx, 2.6, dt)
    tgt.current.y = damp(tgt.current.y, ty, 2.6, dt)
    tgt.current.z = damp(tgt.current.z, tz, 2.6, dt)

    // orbit slowly through the chapter, plus a tiny idle sway
    const az = 0.62 - p * 1.15 + Math.sin(t * 0.3) * 0.05
    // portrait screens are narrow: pull the camera back so the whole machine still fits
    const aspect = size.width / size.height
    const fit = Math.min(2, Math.max(1, 0.88 / aspect))
    const d = lerp(m.cam.d0, m.cam.d1, e) * fit
    const h = lerp(m.cam.y0, m.cam.y1, e) * (1 + (fit - 1) * 0.7)
    wanted.set(tgt.current.x + Math.sin(az) * d, h, tgt.current.z + Math.cos(az) * d)
    cam.current.x = damp(cam.current.x, wanted.x, 3, dt)
    cam.current.y = damp(cam.current.y, wanted.y, 3, dt)
    cam.current.z = damp(cam.current.z, wanted.z, 3, dt)
    camera.position.copy(cam.current)
    camera.lookAt(tgt.current)

    // keep the machine on the right of the screen when text sits on the left
    const w = size.width
    const hgt = size.height
    const wide = w > 900
    const upTarget = wide ? 0 : store.mode === 'hero' ? 0.2 : 0.045
    shiftY.current = damp(shiftY.current, upTarget, 4, dt)
    camera.setViewOffset(w, hgt, wide ? -w * 0.14 : 0, hgt * shiftY.current, w, hgt)
  })
  return null
}

function Floor() {
  const tex = useMemo(() => {
    const t = GRAIN.clone()
    t.repeat.set(7, 7)
    t.needsUpdate = true
    return t
  }, [])
  const dirt = useMemo(() => {
    const t = DIRT.clone()
    t.repeat.set(2.2, 2.2)
    t.needsUpdate = true
    return t
  }, [])
  return (
    <group position={[0, FLOOR - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh receiveShadow>
        <circleGeometry args={[7.5, 96]} />
        <meshStandardMaterial color="#575e68" map={dirt} metalness={0.15} roughness={0.82} roughnessMap={tex} bumpMap={tex} bumpScale={0.5} envMapIntensity={0.55} />
      </mesh>
      <mesh position={[0, 0, 0.005]}>
        <ringGeometry args={[7.3, 7.5, 128]} />
        <meshBasicMaterial color="#ff6a1a" transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <ringGeometry args={[4.6, 4.63, 128]} />
        <meshBasicMaterial color="#8d97a2" transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.003]}>
        <ringGeometry args={[2.2, 2.22, 128]} />
        <meshBasicMaterial color="#8d97a2" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

// Phones and low-core devices get a lighter render: smaller shadow map, no MSAA, lower pixel ratio.
const LITE = typeof window !== 'undefined' && (window.innerWidth < 900 || (navigator.hardwareConcurrency || 8) <= 4)

export default function Scene({ running }) {
  return (
    <Canvas
      shadows
      frameloop={running ? 'always' : 'never'}
      dpr={LITE ? [1, 1.25] : [1, 1.75]}
      camera={{ fov: 32, near: 0.1, far: 140, position: [6, 3, 10] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#0a0c0f']} />
      <fog attach="fog" args={['#0a0c0f', 34, 90]} />

      <ambientLight intensity={0.75} />
      <hemisphereLight args={["#bcd3ff", "#2a1d14", 0.6]} />
      <directionalLight
        position={[6, 10, 7]}
        intensity={2.8}
        color="#fff3e6"
        castShadow
        shadow-mapSize={LITE ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      <directionalLight position={[-7, 5, -4]} intensity={1.3} color="#8fb4ff" />
      <pointLight position={[-5, 3, -5]} intensity={55} color="#ff6a1a" distance={16} />
      <pointLight position={[6, 2, 4]} intensity={18} color="#6ea8ff" distance={14} />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3.2} position={[0, 7, 3]} scale={[12, 4, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.8} position={[-7, 2, 0]} scale={[6, 5, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.4} position={[7, 3, 2]} scale={[6, 5, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" color="#ff8a4a" intensity={1.6} position={[0, 2, -8]} scale={6} />
      </Environment>

      <Floor />
      <ContactShadows position={[0, FLOOR, 0]} opacity={0.4} scale={16} blur={2.6} far={9} resolution={512} color="#000000" />

      <Rig />
      {MACHINES.map(({ C, meta }, i) => (
        <MachineSlot key={i} idx={i} C={C} meta={meta} />
      ))}
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <N8AO aoRadius={0.55} distanceFalloff={1.1} intensity={LITE ? 2.2 : 3} quality={LITE ? 'low' : 'medium'} halfRes={LITE} color="black" />
        <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.7} radius={0.75} />
        <Vignette offset={0.25} darkness={0.55} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  )
}
