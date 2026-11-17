import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cyl, Tor, Sph, Tube, Bolt, Plate, Layer, Sparks, RX, RZ } from './parts'
import { store, damp } from '../store'

export const meta = {
  scale: 1.2,
  bottom: -0.38,
  center: [0.7, 0, 0],
  cam: { d0: 11, d1: 18, y0: 2.4, y1: 4.4, ty: 1.0 },
  layers: [
    { ex: [0, 0, 0], c: [0, 0, 0] }, // chassis & wheels
    { ex: [0, 1.1, 0], c: [0, 0.6, 0] }, // transformer
    { ex: [-1.9, 1.5, 1.0], c: [0, 0.6, -0.5] }, // fan
    { ex: [0, 2.7, 0], c: [0, 0.8, 0] }, // casing & panel
    { ex: [2.1, 0.5, 1.4], c: [1.7, -0.2, 0.9] }, // leads
  ],
}

const cableA = [
  [0.5, 0.3, 0.88],
  [0.55, 0.0, 1.3],
  [1.1, -0.28, 1.35],
  [1.5, -0.25, 1.0],
  [1.75, -0.12, 0.62],
]
const cableB = [
  [-0.5, 0.3, 0.88],
  [-0.6, -0.1, 1.4],
  [0.4, -0.3, 1.7],
  [1.7, -0.3, 1.5],
  [2.5, -0.22, 1.0],
]

export default function Welder() {
  const fan = useRef()
  const arc = useRef()
  const glow = useRef()
  const fanSpeed = useRef(0)
  const arcK = useRef(0)

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const run = store.e > 0.3 ? 1 : 0.4
    const boost = store.layerIndex === 2 ? 12 : 3
    fanSpeed.current = damp(fanSpeed.current, run * boost, 3, dt)
    fan.current.rotation.z -= fanSpeed.current * dt

    const want = store.layerIndex === 4 && store.e > 0.5 ? 1 : 0
    arcK.current = damp(arcK.current, want, 8, dt)
    const flick = 0.6 + Math.random() * 0.8
    arc.current.intensity = arcK.current * flick * 5
    glow.current.scale.setScalar(arcK.current * (0.7 + Math.random() * 0.6) + 0.0001)
  })

  return (
    <group>
      {/* 0 · Chassis & wheels */}
      <Layer index={0} ex={meta.layers[0].ex}>
        <Box s={[2.2, 0.1, 1.4]} p={[0, 0, 0]} m="castDark" />
        <Box s={[2.2, 0.08, 0.12]} p={[0, -0.08, 0.55]} m="steelDull" />
        <Box s={[2.2, 0.08, 0.12]} p={[0, -0.08, -0.55]} m="steelDull" />
        <Cyl r={0.05} h={1.8} rot={RZ} p={[-0.75, 0, 0]} m="steel" />
        {[-0.82, 0.82].map((z) => (
          <group key={z}>
            <Cyl r={0.38} h={0.16} rot={RZ} p={[-0.75, 0, z]} m="rubber" seg={48} />
            <Cyl r={0.2} h={0.18} rot={RZ} p={[-0.75, 0, z]} m="steel" />
            <Cyl r={0.07} h={0.2} rot={RZ} p={[-0.75, 0, z]} m="orange" />
          </group>
        ))}
        <Cyl r={0.2} h={0.12} rot={RZ} p={[0.85, -0.17, 0]} m="rubber" />
        <Box s={[0.08, 0.28, 0.2]} p={[0.85, -0.06, 0]} m="steelDull" />
        {[-0.5, 0.5].map((z) => (
          <Cyl key={z} r={0.04} h={0.65} p={[-1.25, 0.37, z]} m="steel" />
        ))}
        <Cyl r={0.045} h={1.0} rot={RZ} p={[-1.25, 0.7, 0]} m="black" />
      </Layer>

      {/* 1 · Transformer core & windings */}
      <Layer index={1} ex={meta.layers[1].ex}>
        <Box s={[1.8, 0.14, 1.0]} p={[0, 0.13, 0]} m="steelDull" />
        <Box s={[1.8, 0.14, 1.0]} p={[0, 0.99, 0]} m="steelDull" />
        <Box s={[0.4, 0.8, 0.9]} p={[0, 0.56, 0]} m="steelDull" />
        {[-0.8, 0.8].map((x) => (
          <Box key={x} s={[0.2, 0.8, 0.9]} p={[x, 0.56, 0]} m="steelDull" />
        ))}
        <Cyl r={0.52} h={0.62} p={[0, 0.56, 0]} m="copper" />
        <Cyl r={0.56} h={0.28} p={[0, 0.56, 0]} m="red" />
        {[0.3, 0.82].map((y) => (
          <Tor key={y} r={0.525} t={0.025} rot={[Math.PI / 2, 0, 0]} p={[0, y, 0]} m="black" />
        ))}
        <Box s={[0.5, 0.04, 0.35]} p={[0.55, 0.22, 0.52]} m="castDark" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Box key={i} s={[0.5, 0.24, 0.02]} p={[0.55, 0.36, 0.38 + i * 0.062]} m="steel" />
        ))}
      </Layer>

      {/* 2 · Cooling fan */}
      <Layer index={2} ex={meta.layers[2].ex}>
        <Tor r={0.52} t={0.06} p={[0, 0.58, -0.5]} m="castDark" />
        <Cyl r={0.17} h={0.3} rot={RZ} p={[0, 0.58, -0.66]} m="black" />
        {[-0.45, 0.45].map((x) => (
          <Box key={x} s={[0.04, 0.04, 0.2]} p={[x * 0.55, 0.58 + x * 0.55, -0.58]} m="steelDull" />
        ))}
        <group ref={fan} position={[0, 0.58, -0.5]}>
          <Cyl r={0.12} h={0.12} rot={RZ} m="steel" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <group key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
              <Box s={[0.17, 0.38, 0.02]} p={[0, 0.3, 0]} r={[0.45, 0, 0]} m="orange" />
            </group>
          ))}
        </group>
      </Layer>

      {/* 3 · Casing & control panel */}
      <Layer index={3} ex={meta.layers[3].ex}>
        <Box s={[2.2, 0.06, 1.4]} p={[0, 1.4, 0]} m="yellow" />
        {[-1.1, 1.1].map((x) => (
          <group key={x}>
            <Box s={[0.06, 1.3, 1.4]} p={[x, 0.75, 0]} m="yellow" />
            {[0, 1, 2, 3, 4].map((i) => (
              <Box key={i} s={[0.02, 0.05, 0.8]} p={[x * 1.03, 0.45 + i * 0.13, 0]} m="black" />
            ))}
          </group>
        ))}
        <Box s={[2.2, 1.3, 0.06]} p={[0, 0.75, -0.7]} m="yellow" />
        <Cyl r={0.56} h={0.02} rot={RZ} p={[0, 0.75, -0.735]} m="black" />
        {[0.2, 0.36, 0.52].map((r) => (
          <Tor key={r} r={r} t={0.012} p={[0, 0.75, -0.75]} m="steelDull" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <Box key={i} s={[1.1, 0.014, 0.014]} p={[0, 0.75, -0.75]} r={[0, 0, (i * Math.PI) / 4]} m="steelDull" />
        ))}
        <Box s={[2.2, 1.3, 0.06]} p={[0, 0.75, 0.7]} m="black" />
        <Box s={[2.0, 0.04, 0.02]} p={[0, 1.3, 0.74]} m="orange" />
        <Plate p={[0.72, 0.62, 0.735]} s={[0.5, 0.15]} text="ARC WELDER" size={52} />
        {[[-1.02, 0.14], [1.02, 0.14], [-1.02, 1.33], [1.02, 1.33]].map(([x, y]) => (
          <Bolt key={`${x}${y}`} p={[x, y, 0.745]} r={0.035} />
        ))}
        <Cyl r={0.28} h={0.12} rot={RZ} p={[0, 0.7, 0.78]} m="black" />
        <Cyl r={0.2} h={0.04} rot={RZ} p={[0, 0.7, 0.85]} m="steel" />
        <Box s={[0.03, 0.18, 0.02]} p={[0, 0.78, 0.875]} m="orange" />
        <Tor r={0.4} t={0.012} arc={Math.PI * 1.5} rot={[0, 0, Math.PI * 0.75]} p={[0, 0.7, 0.76]} m="white" />
        <Cyl r={0.22} h={0.06} rot={RZ} p={[-0.62, 1.0, 0.76]} m="steel" />
        <Cyl r={0.18} h={0.02} rot={RZ} p={[-0.62, 1.0, 0.79]} m="white" />
        <Box s={[0.014, 0.12, 0.006]} p={[-0.62, 1.03, 0.805]} r={[0, 0, -0.5]} m="red" />
        <Box s={[0.16, 0.22, 0.1]} p={[0.62, 1.02, 0.78]} m="red" />
        <Sph r={0.045} p={[0.2, 1.05, 0.78]} m="green" userData={{ keep: true }} />
        {[[-0.5, 'red'], [0.5, 'black']].map(([x, m]) => (
          <group key={x}>
            <Cyl r={0.15} h={0.14} rot={RZ} p={[x, 0.3, 0.79]} m="steel" />
            <Cyl r={0.1} h={0.16} rot={RZ} p={[x, 0.3, 0.8]} m={m} />
          </group>
        ))}
        {[-0.6, 0.6].map((x) => (
          <Cyl key={x} r={0.04} h={0.26} p={[x, 1.56, 0]} m="steel" />
        ))}
        <Cyl r={0.045} h={1.3} rot={RX} p={[0, 1.7, 0]} m="black" />
      </Layer>

      {/* 4 · Leads, electrode holder & earth clamp */}
      <Layer index={4} ex={meta.layers[4].ex}>
        <Box s={[1.5, 0.12, 1.1]} p={[1.9, -0.32, 0.6]} m="steelDull" />
        <Tube pts={cableA} radius={0.045} m="rubber" seg={80} />
        <Tube pts={cableB} radius={0.045} m="rubber" seg={80} />
        <group position={[1.75, -0.12, 0.62]} rotation={[0, 0, -0.55]}>
          <Cyl r={0.07} h={0.75} rot={RX} p={[-0.1, 0.03, 0]} m="black" />
          <Box s={[0.26, 0.1, 0.08]} p={[0.3, 0, 0]} m="steel" />
          <Cyl r={0.022} h={0.9} rot={RX} p={[0.78, 0, 0]} m="copper" />
        </group>
        <group position={[2.55, -0.2, 1.0]}>
          <Box s={[0.28, 0.06, 0.16]} p={[0, 0.0, 0]} m="steel" />
          <Box s={[0.28, 0.06, 0.16]} p={[0, -0.1, 0]} m="steel" />
          <Box s={[0.06, 0.2, 0.16]} p={[-0.13, -0.05, 0]} m="steelDull" />
        </group>
        <mesh ref={glow} position={[2.18, -0.3, 0.62]} userData={{ keep: true }}>
          <sphereGeometry args={[0.07, 16, 12]} />
          <meshBasicMaterial toneMapped={false}>
            <color attach="color" args={[3.2, 3.6, 4.4]} />
          </meshBasicMaterial>
        </mesh>
        <pointLight ref={arc} position={[2.18, -0.2, 0.62]} color="#9fd0ff" intensity={0} distance={5} decay={2} />
        <Sparks p={[2.18, -0.3, 0.62]} dir={[0.4, 1, 0.2]} count={150} speed={2.6} spread={1.6} gravity={6} size={0.045} color="#ffb347" layer={4} />
      </Layer>
    </group>
  )
}
