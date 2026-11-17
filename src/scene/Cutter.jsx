import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cyl, Sph, Tube, Gauge, Wrap, Layer, Sparks, RX, RZ } from './parts'
import { store, damp } from '../store'

export const meta = {
  scale: 0.8,
  bottom: 0,
  center: [0.7, 0, 0.3],
  cam: { d0: 12.5, d1: 16.5, y0: 3.2, y1: 4.8, ty: 1.9 },
  layers: [
    { ex: [0, 0, 0], c: [0, 1.4, 0] }, // cylinders & trolley
    { ex: [0, 1.6, 0], c: [0, 3.6, 0] }, // regulators & gauges
    { ex: [-1.3, 0.8, 2.6], c: [0, 2.0, 0.9] }, // hoses & arrestors
    { ex: [-0.2, 0.9, 2.0], c: [0.4, 0.55, 0.62] }, // torch
    { ex: [2.4, 0.7, 1.2], c: [1.9, 0.4, 0.62] }, // tip, flame & plate
  ],
}

const hoseO2 = [
  [-0.95, 3.65, 0],
  [-1.3, 3.4, 0.3],
  [-1.35, 2.1, 0.7],
  [-1.05, 0.95, 0.95],
  [-0.75, 0.62, 0.8],
  [-0.46, 0.57, 0.58],
]
const hoseAc = [
  [0.95, 3.65, 0],
  [1.0, 3.45, 0.5],
  [0.3, 3.1, 1.05],
  [-0.2, 2.0, 1.2],
  [-0.5, 1.0, 1.05],
  [-0.46, 0.55, 0.7],
]

export default function Cutter() {
  const flame = useRef()
  const inner = useRef()
  const k = useRef(0)
  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const want = store.layerIndex === 4 && store.e > 0.5 ? 1 : 0
    k.current = damp(k.current, want, 6, dt)
    const f = 0.9 + Math.random() * 0.25
    flame.current.scale.set(k.current + 0.0001, k.current * f + 0.0001, k.current + 0.0001)
    inner.current.scale.set(k.current + 0.0001, k.current * (0.85 + Math.random() * 0.3) + 0.0001, k.current + 0.0001)
  })

  return (
    <group>
      {/* 0 · Cylinders & trolley */}
      <Layer index={0} ex={meta.layers[0].ex}>
        <Box s={[2.4, 0.12, 1.7]} p={[0, 0.35, 0]} m="castDark" />
        <Cyl r={0.32} h={0.14} rot={RX} p={[-1.27, 0.32, -0.6]} m="rubber" seg={48} />
        <Cyl r={0.32} h={0.14} rot={RX} p={[1.27, 0.32, -0.6]} m="rubber" seg={48} />
        <Cyl r={0.14} h={0.1} rot={RX} p={[-1.0, 0.14, 0.7]} m="rubber" />
        <Cyl r={0.14} h={0.1} rot={RX} p={[1.0, 0.14, 0.7]} m="rubber" />
        <Cyl r={0.05} h={2.6} rot={RX} p={[0, 0.32, -0.6]} m="steelDull" />
        {[-0.95, 0.95].map((x) => (
          <Box key={x} s={[0.09, 2.3, 0.09]} p={[x, 1.55, -0.62]} m="orange" />
        ))}
        <Box s={[2.0, 0.09, 0.09]} p={[0, 2.65, -0.62]} m="orange" />
        <Box s={[1.9, 0.06, 0.04]} p={[0, 1.75, -0.37]} m="steelDull" />
        <Cyl r={0.04} h={1.0} rot={RX} p={[0, 1.05, -1.02]} m="black" />
        {[-0.45, 0.45].map((x) => (
          <Box key={x} s={[0.06, 0.06, 0.45]} p={[x, 1.05, -0.8]} r={[0.5, 0, 0]} m="steelDull" />
        ))}
        {/* oxygen */}
        <Cyl r={0.33} h={2.5} p={[-0.42, 1.66, 0]} m="black" seg={48} />
        <Sph r={0.33} dome p={[-0.42, 2.91, 0]} m="white" />
        <Cyl r={0.1} h={0.2} p={[-0.42, 3.34, 0]} m="brass" />
        <Cyl r={0.34} h={0.3} p={[-0.42, 1.0, 0]} m="steelDull" seg={48} />
        <Wrap r={0.33} h={0.28} p={[-0.42, 1.95, 0]} text="OXYGEN" />
        {/* acetylene */}
        <Cyl r={0.28} h={2.3} p={[0.45, 1.56, 0]} m="maroon" seg={48} />
        <Sph r={0.28} dome p={[0.45, 2.71, 0]} m="maroon" />
        <Wrap r={0.28} h={0.26} p={[0.45, 1.85, 0]} text="ACETYLENE" size={64} />
        <Cyl r={0.1} h={0.2} p={[0.45, 3.14, 0]} m="brass" />
      </Layer>

      {/* 1 · Regulators & gauges */}
      <Layer index={1} ex={meta.layers[1].ex}>
        <Box s={[0.32, 0.34, 0.3]} p={[-0.42, 3.7, 0]} m="brass" />
        <Cyl r={0.12} h={0.14} p={[-0.42, 3.94, 0]} m="black" />
        <Cyl r={0.03} h={0.3} rot={RX} p={[-0.42, 4.02, 0]} m="black" />
        <Gauge p={[-0.64, 3.68, 0.2]} />
        <Gauge p={[-0.2, 3.68, 0.2]} />
        <Cyl r={0.05} h={0.3} rot={RX} p={[-0.64, 3.65, 0]} m="steel" />
        <Cyl r={0.05} h={0.22} rot={RX} p={[-0.76, 3.65, 0]} m="steel" />

        <Box s={[0.32, 0.34, 0.3]} p={[0.45, 3.5, 0]} m="brass" />
        <Cyl r={0.12} h={0.14} p={[0.45, 3.74, 0]} m="black" />
        <Cyl r={0.03} h={0.3} rot={RX} p={[0.45, 3.82, 0]} m="black" />
        <Gauge p={[0.24, 3.48, 0.2]} />
        <Gauge p={[0.66, 3.48, 0.2]} />
        <Cyl r={0.05} h={0.3} rot={RX} p={[0.7, 3.45, 0]} m="steel" />
        <Cyl r={0.05} h={0.22} rot={RX} p={[0.82, 3.45, 0]} m="steel" />
      </Layer>

      {/* 2 · Hoses & flashback arrestors */}
      <Layer index={2} ex={meta.layers[2].ex}>
        <Tube pts={hoseO2} radius={0.055} m="black" seg={90} />
        <Tube pts={hoseAc} radius={0.055} m="red" seg={90} />
        <Cyl r={0.075} h={0.26} rot={RX} p={[-0.95, 3.65, 0]} m="steel" />
        <Cyl r={0.085} h={0.08} rot={RX} p={[-0.95, 3.65, 0]} m="brass" />
        <Cyl r={0.075} h={0.26} rot={RX} p={[0.95, 3.45, 0]} m="steel" />
        <Cyl r={0.085} h={0.08} rot={RX} p={[0.95, 3.45, 0]} m="brass" />
        <Cyl r={0.07} h={0.2} rot={RX} p={[-0.52, 0.57, 0.58]} m="steel" />
        <Cyl r={0.07} h={0.2} rot={RX} p={[-0.52, 0.55, 0.7]} m="steel" />
      </Layer>

      {/* 3 · Cutting torch */}
      <Layer index={3} ex={meta.layers[3].ex}>
        <Cyl r={0.07} h={0.7} rot={RX} p={[0.0, 0.55, 0.62]} m="brass" />
        <Cyl r={0.05} h={0.12} rot={RX} p={[-0.4, 0.57, 0.58]} m="steel" />
        <Cyl r={0.05} h={0.12} rot={RX} p={[-0.4, 0.55, 0.7]} m="steel" />
        <Cyl r={0.1} h={0.08} p={[-0.2, 0.67, 0.62]} m="black" />
        <Cyl r={0.1} h={0.08} p={[0.05, 0.67, 0.62]} m="black" />
        <Cyl r={0.025} h={0.1} p={[-0.2, 0.62, 0.62]} m="steel" />
        <Cyl r={0.025} h={0.1} p={[0.05, 0.62, 0.62]} m="steel" />
        <Box s={[0.34, 0.2, 0.2]} p={[0.5, 0.55, 0.62]} m="brass" />
        <Box s={[0.5, 0.04, 0.1]} p={[0.55, 0.74, 0.62]} r={[0, 0, -0.18]} m="orange" />
        <Cyl r={0.032} h={0.8} rot={RX} p={[0.95, 0.6, 0.62]} m="steel" />
        <Cyl r={0.032} h={0.8} rot={RX} p={[0.95, 0.5, 0.62]} m="steel" />
        <Cyl r={0.09} h={0.2} rot={RX} p={[1.38, 0.55, 0.62]} m="brass" />
      </Layer>

      {/* 4 · Cutting tip, flame & plate */}
      <Layer index={4} ex={meta.layers[4].ex}>
        <group position={[1.5, 0.58, 0.62]} rotation={[0, 0, -2.2]}>
          <Cyl r={0.04} rb={0.085} h={0.38} p={[0, 0.19, 0]} m="brass" />
          <Cyl r={0.03} rb={0.03} h={0.06} p={[0, 0.4, 0]} m="copper" />
          <mesh ref={flame} position={[0, 0.7, 0]} userData={{ keep: true }}>
            <coneGeometry args={[0.07, 0.62, 20]} />
            <meshBasicMaterial transparent opacity={0.85} toneMapped={false}>
              <color attach="color" args={[0.35, 1.3, 3.2]} />
            </meshBasicMaterial>
          </mesh>
          <mesh ref={inner} position={[0, 0.63, 0]} userData={{ keep: true }}>
            <coneGeometry args={[0.032, 0.42, 16]} />
            <meshBasicMaterial toneMapped={false}>
              <color attach="color" args={[3.5, 3.8, 4.2]} />
            </meshBasicMaterial>
          </mesh>
        </group>
        <Box s={[1.3, 0.14, 1.1]} p={[2.45, 0.07, 0.62]} m="steelDull" />
        <Box s={[0.05, 0.015, 0.9]} p={[2.1, 0.145, 0.62]} m="orange" userData={{ keep: true }} />
        <Sparks p={[2.1, 0.2, 0.62]} dir={[0.6, 1, 0]} count={160} speed={2.8} spread={1.3} gravity={6.5} size={0.045} color="#ffb347" layer={4} />
      </Layer>
    </group>
  )
}
