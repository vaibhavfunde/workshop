import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useLang } from '../i18n'

export default function Hero() {
  const root = useRef()
  const { c } = useLang()
  const { hero } = c.ui

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.hero__eyebrow', { y: 18, opacity: 0, duration: 0.7, delay: 0.2 })
        .from('.hero__line > span', { yPercent: 110, duration: 1.1, stagger: 0.12 }, '-=0.4')
        .from('.hero__blurb', { y: 22, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero__chips li', { y: 14, opacity: 0, duration: 0.5, stagger: 0.07 }, '-=0.5')
        .from('.hero__cue', { opacity: 0, duration: 0.8 }, '-=0.2')
    }, root)
    return () => ctx.revert()
  }, [])

  const [l1, l2] = c.company.titleLines

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__copy">
        <p className="hero__eyebrow mono">{hero.eyebrow}</p>
        <h1 className="hero__title" aria-label={c.company.name}>
          <span className="hero__line"><span>{l1}</span></span>
          <span className="hero__line"><span className="accent">{l2}</span></span>
        </h1>
        <p className="hero__blurb">{c.company.blurb}</p>
        <ul className="hero__chips">
          {hero.chips.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <div className="hero__cue mono">
        <span className="hero__cue-line" />
        {hero.cue}
      </div>
    </section>
  )
}
