import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cyl, Tor, Tube, Bolt, Plate, Layer, Sparks, RX, RZ } from './parts'
import { store } from '../store'

// ex = how far each layer slides when exploded · c = its assembled centre (camera focus)
export const meta = {
  scale: 0.95,
  bottom: -1.3, // lowest local y (sits on the floor)
  center: [0.35, 0, 0],
  cam: { d0: 11.5, d1: 19, y0: 2.6, y1: 5.0, ty: 0.3 },
  layers: [
    { ex: [0, 0, 0], c: [0, -0.6, 0] }, // bed & cabinet
    { ex: [0, 1.3, 1.9], c: [0, 0, 0.6] }, // lead screw & feed rod
    { ex: [-1.3, 1.9, 0], c: [-1.2, 0.7, 0] }, // headstock
    { ex: [0, 3.4, 0], c: [0.3, 0.45, 0.2] }, // carriage
    { ex: [1.3, 1.9, 0], c: [1.7, 0.6, 0] }, // tailstock
  ],
}

const thread = (() => {
  const pts = []
  const N = 520
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const a = t * Math.PI * 2 * 46
    pts.push([-1.9 + t * 3.8, 0.058 * Math.cos(a), 0.058 * Math.sin(a)])
  }
  return pts
})()

export default function Lathe() {
  const spin = useRef()
  const speed = useRef(0)
  useFrame((_, dt) => {
    const on = store.layerIndex === 2 && store.e > 0.5 ? 1 : 0
    speed.current += (on * 9 - speed.current) * 0.06
    spin.current.rotation.x += speed.current * Math.min(dt, 0.05)
  })

  return (
    <group>
      {/* 0 · Bed & cabinet */}
      <Layer index={0} ex={meta.layers[0].ex}>
        <Box s={[4.5, 0.3, 0.95]} p={[0, 0, 0]} m="cast" />
        <Box s={[4.5, 0.08, 0.2]} p={[0, 0.19, -0.27]} m="steel" />
        <Box s={[4.5, 0.08, 0.2]} p={[0, 0.19, 0.27]} m="steel" />
        <Box s={[0.9, 1.15, 0.95]} p={[-1.7, -0.72, 0]} m="castDark" />
        <Box s={[0.9, 1.15, 0.95]} p={[1.7, -0.72, 0]} m="castDark" />
        <Box s={[2.6, 0.1, 0.85]} p={[0, -1.24, 0]} m="cast" />
        <Box s={[0.7, 0.18, 0.03]} p={[-1.7, -0.45, 0.49]} m="orange" />
        {[-1.7, 1.7].map((x) => (
          <Box key={x} s={[1.0, 0.08, 1.05]} p={[x, -1.3, 0]} m="black" />
        ))}
      </Layer>

      {/* 1 · Lead screw & feed rod */}
      <Layer index={1} ex={meta.layers[1].ex}>
        <group position={[0, 0.02, 0.62]}>
          <Cyl r={0.045} h={3.9} rot={RX} m="steelDull" />
          <Tube pts={thread} radius={0.013} m="steel" seg={560} />
        </group>
        <Cyl r={0.04} h={3.9} rot={RX} p={[0, -0.2, 0.62]} m="steel" />
        <Box s={[0.16, 0.5, 0.16]} p={[-1.95, -0.08, 0.62]} m="castDark" />
        <Box s={[0.16, 0.5, 0.16]} p={[1.95, -0.08, 0.62]} m="castDark" />
        <Cyl r={0.09} h={0.1} rot={RX} p={[-2.05, 0.02, 0.62]} m="orange" />
      </Layer>

      {/* 2 · Headstock, spindle & chuck */}
      <Layer index={2} ex={meta.layers[2].ex}>
        <Box s={[1.25, 1.0, 0.95]} p={[-1.55, 0.65, 0]} m="cast" />
        <Box s={[1.3, 0.08, 1.0]} p={[-1.55, 1.19, 0]} m="castDark" />
        <Box s={[0.55, 0.14, 0.03]} p={[-1.55, 1.0, 0.49]} m="orange" />
        <Plate p={[-1.55, 0.36, 0.478]} s={[0.62, 0.14]} text="FUNDE ENGINEERING" size={46} />
        {[[-2.08, 1.08], [-1.02, 1.08], [-2.08, 0.22], [-1.02, 0.22]].map(([x, y]) => (
          <Bolt key={`${x}${y}`} p={[x, y, 0.49]} />
        ))}
        <Cyl r={0.1} h={0.1} rot={RZ} p={[-1.85, 0.78, 0.5]} m="black" />
        <Cyl r={0.1} h={0.1} rot={RZ} p={[-1.55, 0.58, 0.5]} m="black" />
        <Cyl r={0.1} h={0.1} rot={RZ} p={[-1.25, 0.78, 0.5]} m="black" />
        <Box s={[0.05, 0.3, 0.05]} p={[-0.95, 0.5, 0.52]} m="red" />
        <Cyl r={0.2} h={0.3} rot={RX} p={[-0.82, 0.72, 0]} m="steel" />
        <group ref={spin} position={[-0.62, 0.72, 0]}>
          <Cyl r={0.46} h={0.32} rot={RX} p={[0.1, 0, 0]} m="castDark" />
          <Cyl r={0.34} h={0.04} rot={RX} p={[0.27, 0, 0]} m="steel" />
          {[0, 1, 2].map((i) => {
            const a = (i * Math.PI * 2) / 3 + Math.PI / 2
            return <Box key={i} s={[0.3, 0.2, 0.16]} p={[0.3, 0.3 * Math.cos(a), 0.3 * Math.sin(a)]} r={[a - Math.PI / 2, 0, 0]} m="steelDull" />
          })}
          <Cyl r={0.17} h={1.46} rot={RX} p={[1.03, 0, 0]} m="steel" />
          {[0, 1, 2].map((i) => (
            <Box key={i} s={[0.02, 0.06, 0.02]} p={[0.8 + i * 0.3, 0.17, 0]} m="black" />
          ))}
        </group>
      </Layer>

      {/* 3 · Carriage, cross slide & tool post */}
      <Layer index={3} ex={meta.layers[3].ex}>
        <Box s={[1.05, 0.2, 1.1]} p={[0.3, 0.33, 0.05]} m="cast" />
        <Box s={[1.05, 0.55, 0.1]} p={[0.3, 0.02, 0.6]} m="castDark" />
        <Box s={[0.85, 0.1, 0.9]} p={[0.3, 0.48, 0.12]} m="orange" />
        <Box s={[0.5, 0.1, 0.5]} p={[0.3, 0.58, 0.4]} m="castDark" />
        <Cyl r={0.13} h={0.34} p={[0.3, 0.77, 0.4]} m="steel" />
        <Box s={[0.08, 0.08, 0.55]} p={[0.3, 0.73, 0.45]} m="steelDull" />
        <Box s={[0.03, 0.03, 0.06]} p={[0.3, 0.73, 0.16]} m="black" />
        <Cyl r={0.23} h={0.06} rot={RZ} p={[0.05, -0.02, 0.69]} m="steel" />
        <Cyl r={0.03} h={0.2} rot={RZ} p={[0.22, 0.06, 0.78]} m="black" />
        <Cyl r={0.15} h={0.05} rot={RZ} p={[0.3, 0.5, 0.62]} m="steelDull" />
        <Sparks p={[0.3, 0.74, 0.17]} dir={[0, 0.8, 0.6]} count={70} speed={1.5} spread={1.2} gravity={4} size={0.04} color="#ffd9a0" layer={3} />
      </Layer>

      {/* 4 · Tailstock */}
      <Layer index={4} ex={meta.layers[4].ex}>
        <Box s={[0.95, 0.1, 0.8]} p={[1.75, 0.28, 0]} m="castDark" />
        <Box s={[0.8, 0.62, 0.7]} p={[1.75, 0.62, 0]} m="cast" />
        <Cyl r={0.1} h={0.4} rot={RX} p={[1.3, 0.72, 0]} m="steel" />
        <Cyl r={0.0} rb={0.09} h={0.18} rot={RX} p={[1.09, 0.72, 0]} m="steelDull" />
        <Cyl r={0.24} h={0.07} rot={RX} p={[2.2, 0.72, 0]} m="castDark" />
        <Cyl r={0.03} h={0.2} p={[2.2, 0.9, 0.12]} m="orange" />
        <Cyl r={0.045} h={0.4} rot={RZ} p={[1.95, 0.4, 0.5]} m="orange" />
        {[1.45, 2.05].map((x) => (
          <Bolt key={x} p={[x, 0.86, 0.36]} r={0.035} />
        ))}
      </Layer>
    </group>
  )
}
