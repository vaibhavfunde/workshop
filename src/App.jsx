import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Scene from './scene/Scene'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Chapter from './components/Chapter'
import Services from './components/Services'
import About from './components/About'
import Contact from './components/Contact'
import { useLang } from './i18n'
import { store, clamp } from './store'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [running, setRunning] = useState(true)
  const { c, lang } = useLang()
  const machines = c.machines

  // text length changes when the language changes, so re-measure the page
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [lang])

  useEffect(() => {
    const chapters = [...document.querySelectorAll('[data-chapter]')]
    let tops = []
    let lastRunning = true

    const measure = () => {
      tops = chapters.map((el) => ({ top: el.getBoundingClientRect().top + window.scrollY, h: el.offsetHeight }))
    }

    // One place turns the scroll position into "which machine, how far through it".
    const update = () => {
      if (!tops.length) return
      const y = window.scrollY
      const vh = window.innerHeight
      const anchor = y + vh * 0.5
      const end = tops[tops.length - 1].top + tops[tops.length - 1].h

      let mode = 'hero'
      let active = 0
      let progress = 0
      if (anchor >= tops[0].top) {
        mode = 'chapter'
        tops.forEach((c, i) => {
          if (anchor >= c.top) {
            active = i
            progress = clamp((y - c.top) / Math.max(1, c.h - vh))
          }
        })
      }
      if (y > end - vh * 0.15) {
        mode = 'off'
        active = -1
      }

      store.mode = mode
      store.active = active
      store.progress = progress

      const on = mode !== 'off'
      if (on !== lastRunning) {
        lastRunning = on
        setRunning(on)
      }
    }

    measure()
    update()
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update })
    const onRefresh = () => {
      measure()
      update()
    }
    ScrollTrigger.addEventListener('refresh', onRefresh)
    window.addEventListener('resize', onRefresh)

    // reveal-on-scroll for light sections
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduce) return
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        })
      })
    })

    // fonts change layout height, so re-measure once they land
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => {
      st.kill()
      ctx.revert()
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      window.removeEventListener('resize', onRefresh)
    }
  }, [])

  return (
    <>
      <div className="stage" aria-hidden="true">
        <Scene running={running} />
        <div className="stage__vignette" />
      </div>
      <Nav />
      <main>
        <Hero />
        {machines.map((m, i) => (
          <Chapter key={m.id} machine={m} index={i} total={machines.length} />
        ))}
        <Services />
        <About />
        <Contact />
      </main>
    </>
  )
}
