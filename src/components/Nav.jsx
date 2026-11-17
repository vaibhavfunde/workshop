import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useLang } from '../i18n'

export default function Nav() {
  const bar = useRef()
  const { lang, setLang, c } = useLang()
  const { nav } = c.ui

  useEffect(() => {
    const set = gsap.quickSetter(bar.current, 'scaleX')
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      set(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="nav">
      <a className="nav__brand" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
        <span className="nav__mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="26" height="26">
            <path d="M16 2l12 7v14l-12 7L4 23V9z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M10 21V11h10M10 16h7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
          </svg>
        </span>
        <span className="nav__name">{c.company.name}</span>
      </a>
      <nav className="nav__links">
        <a href="#machines" onClick={go('lathe')}>{nav.machines}</a>
        <a href="#services" onClick={go('services')}>{nav.services}</a>
        <a href="#about" onClick={go('about')}>{nav.about}</a>
        <button
          type="button"
          className="nav__lang"
          lang={lang === 'en' ? 'mr' : 'en'}
          aria-label={nav.switchLabel}
          onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}
        >
          {nav.switchTo}
        </button>
        <a className="nav__cta" href="#contact" onClick={go('contact')}>{nav.quote}</a>
      </nav>
      <div className="nav__progress"><i ref={bar} /></div>
    </header>
  )
}
