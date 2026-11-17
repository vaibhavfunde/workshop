import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { layerFromProgress } from '../store'
import { useLang } from '../i18n'

const pad = (n) => String(n).padStart(2, '0')

export default function Chapter({ machine, index, total }) {
  const root = useRef()
  const card = useRef()
  const [layer, setLayer] = useState(-1)
  const n = machine.layers.length
  const { c } = useLang()
  const t = c.ui.chapter

  // scroll → which layer is being described, plus a CSS progress variable for the rail
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        root.current.style.setProperty('--p', self.progress.toFixed(4))
        const i = layerFromProgress(self.progress, n)
        setLayer((prev) => (prev === i ? prev : i))
      },
    })
    return () => st.kill()
  }, [n])

  // the card slides in again each time the layer changes
  useEffect(() => {
    if (!card.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(
      card.current.children,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out', overwrite: true }
    )
  }, [layer])

  // chapter title slides in as the chapter arrives
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.chapter__head > *', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 55%', toggleActions: 'play none none reverse' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const L = layer >= 0 ? machine.layers[layer] : null

  return (
    <section
      className="chapter"
      id={machine.id}
      data-chapter
      ref={root}
      style={{ '--n': n, '--p': 0 }}
    >
      <div className="chapter__sticky">
        <div className="chapter__head">
          <p className="mono chapter__count">
            {t.machine} {pad(index + 1)} / {pad(total)}
          </p>
          <h2 className="chapter__name">{machine.name}</h2>
          <p className="chapter__tag mono">{machine.tag}</p>
          <div className="chapter__services">
            <span className="mono">{t.servicesLabel}</span>
            <ul>
              {machine.services.map((s) => (
                <li key={s}>
                  <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                    <path d="M3 8.5l3.2 3L13 4.8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="chapter__card" ref={card} key={`${machine.id}-${layer}`}>
          {L ? (
            <>
              <p className="mono card__label">
                {t.layer} {pad(layer + 1)} / {pad(n)}
              </p>
              <h3 className="card__title">{L.title}</h3>
              <p className="card__service">{L.service}</p>
              <p className="card__body">{L.body}</p>
              <p className="card__note">
                <span className="mono">{t.workshop}</span>
                {L.note}
              </p>
            </>
          ) : (
            <>
              <p className="mono card__label">{t.overview}</p>
              <h3 className="card__title">{t.assembled}</h3>
              <p className="card__body">{machine.intro}</p>
              <p className="card__note card__note--hint">
                <span className="mono">{t.keep}</span>
                {t.hint}
              </p>
            </>
          )}
        </div>

        <ol className="chapter__rail" aria-hidden="true">
          <li className="rail__bar"><i /></li>
          {machine.layers.map((l, i) => (
            <li key={l.title} className={i === layer ? 'is-on' : i < layer ? 'is-done' : ''}>
              <span className="mono">{pad(i + 1)}</span>
              <em>{l.title}</em>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
