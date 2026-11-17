import { Box, Cyl, Tor, Tube, Gauge, Plate, Layer, RX, RZ } from './parts'

export const meta = {
  scale: 0.72,
  bottom: 0,
  center: [0.9, 0, 0],
  cam: { d0: 12.5, d1: 20, y0: 3.0, y1: 5.2, ty: 1.2 },
  layers: [
    { ex: [0, 0, 0], c: [0, 0.5, 0] }, // base, bolster & die
    { ex: [0, 1.0, -2.4], c: [0, 2.0, 0] }, // frame columns & crown
    { ex: [0, 3.0, 0], c: [0, 4.2, 0] }, // cylinder & ram
    { ex: [0, 1.3, 2.4], c: [0, 1.9, 0] }, // moving platen & punch
    { ex: [2.4, 0.7, 0], c: [2.7, 0.9, 0] }, // power pack
  ],
}

const hose = [
  [2.0, 1.62, 0.1],
  [1.95, 2.25, 0.2],
  [1.7, 2.7, 0.3],
  [1.3, 2.75, 0.3],
]

export default function Press() {
  return (
    <group>
      {/* 0 · Base, bolster & die */}
      <Layer index={0} ex={meta.layers[0].ex}>
        <Box s={[3.0, 0.3, 1.8]} p={[0, 0.15, 0]} m="castDark" />
        <Box s={[2.0, 0.2, 1.2]} p={[0, 0.4, 0]} m="steelDull" />
        <Box s={[1.0, 0.4, 0.8]} p={[0, 0.7, 0]} m="cast" />
        <Box s={[0.7, 0.07, 0.55]} p={[0, 0.935, 0]} m="steel" />
        {[[-1.3, -0.75], [1.3, -0.75], [-1.3, 0.75], [1.3, 0.75]].map(([x, z], i) => (
          <Cyl key={i} r={0.1} h={0.1} p={[x, 0.35, z]} m="steel" seg={6} />
        ))}
      </Layer>

      {/* 1 · Frame columns & crown */}
      <Layer index={1} ex={meta.layers[1].ex}>
        {[-1.05, 1.05].map((x) => (
          <group key={x}>
            <Box s={[0.36, 3.2, 0.9]} p={[x, 1.9, 0]} m="orange" />
            <Box s={[0.04, 2.6, 0.3]} p={[x * 0.8, 1.9, 0]} m="steel" />
          </group>
        ))}
        <Box s={[2.9, 0.55, 1.1]} p={[0, 3.77, 0]} m="orange" />
        <Box s={[2.9, 0.08, 1.14]} p={[0, 4.07, 0]} m="castDark" />
        <Plate p={[0, 3.76, 0.553]} s={[1.0, 0.24]} text="HYDRAULIC PRESS" size={60} />
        <Cyl r={0.4} h={0.1} p={[0, 4.12, 0]} m="steelDull" />
      </Layer>

      {/* 2 · Cylinder & ram */}
      <Layer index={2} ex={meta.layers[2].ex}>
        <Cyl r={0.75} h={0.12} p={[0, 4.2, 0]} m="steel" />
        <Cyl r={0.55} h={1.3} p={[0, 4.85, 0]} m="cast" />
        <Cyl r={0.62} h={0.18} p={[0, 5.58, 0]} m="castDark" />
        {[0.2, 0.55, 0.9, 1.25].map((y) => (
          <Cyl key={y} r={0.57} h={0.04} p={[0, 4.28 + y * 0.8, 0]} m="steelDull" />
        ))}
        <Cyl r={0.27} h={1.9} p={[0, 3.4, 0]} m="steel" />
        <Cyl r={0.38} h={0.15} p={[0, 2.4, 0]} m="steelDull" />
        <Gauge p={[0, 5.05, 0.58]} />
        <Cyl r={0.08} h={0.35} rot={RX} p={[0.7, 5.2, 0]} m="steelDull" />
        <Cyl r={0.08} h={0.35} rot={RX} p={[-0.7, 4.5, 0]} m="steelDull" />
      </Layer>

      {/* 3 · Moving platen & punch */}
      <Layer index={3} ex={meta.layers[3].ex}>
        <Box s={[1.7, 0.32, 1.0]} p={[0, 2.1, 0]} m="cast" />
        {[-0.82, 0.82].map((x) => (
          <Box key={x} s={[0.12, 0.4, 0.6]} p={[x, 2.1, 0]} m="steel" />
        ))}
        <Box s={[0.5, 0.55, 0.5]} p={[0, 1.7, 0]} m="steel" />
        <Box s={[0.34, 0.12, 0.34]} p={[0, 1.36, 0]} m="steelDull" />
        <Box s={[0.9, 0.05, 0.05]} p={[0, 2.1, 0.52]} m="orange" />
      </Layer>

      {/* 4 · Power pack */}
      <Layer index={4} ex={meta.layers[4].ex}>
        <Box s={[1.3, 0.9, 0.9]} p={[2.7, 0.6, 0]} m="cast" />
        <Box s={[1.36, 0.06, 0.96]} p={[2.7, 1.08, 0]} m="castDark" />
        <Box s={[0.05, 0.42, 0.2]} p={[3.37, 0.65, 0]} m="yellow" />
        <Cyl r={0.09} h={0.16} p={[2.3, 1.19, 0.25]} m="black" />
        <Cyl r={0.3} h={0.9} rot={RX} p={[2.85, 1.5, 0]} m="cast" />
        {[-0.3, -0.1, 0.1, 0.3].map((dx) => (
          <Tor key={dx} r={0.31} t={0.03} rot={[0, Math.PI / 2, 0]} p={[2.85 + dx, 1.5, 0]} m="castDark" />
        ))}
        <Cyl r={0.26} h={0.12} rot={RX} p={[3.34, 1.5, 0]} m="black" />
        <Cyl r={0.22} h={0.5} rot={RX} p={[2.1, 1.5, 0]} m="steel" />
        <Cyl r={0.12} h={0.14} rot={RX} p={[2.38, 1.5, 0]} m="brass" />
        <Box s={[0.4, 0.5, 0.3]} p={[2.6, 0.55, 0.62]} m="black" />
        <Cyl r={0.055} h={0.06} rot={RZ} p={[2.5, 0.68, 0.79]} m="green" />
        <Cyl r={0.055} h={0.06} rot={RZ} p={[2.7, 0.68, 0.79]} m="red" />
        <Gauge p={[2.1, 0.88, 0.48]} r={0.15} />
        <Tube pts={hose} radius={0.06} m="rubber" />
      </Layer>
    </group>
  )
}
