import { useLang } from '../i18n'
import Team from './Team'

export default function About() {
  const { c, lang } = useLang()
  const { about } = c
  const t = c.ui.about
  return (
    <section className="light about" id="about">
      <div className="wrap">
        <p className="mono eyebrow" data-reveal>{t.eyebrow}{lang === 'en' ? ` ${c.company.name}` : ''}</p>
        <div className="about__grid">
          <div>
            <h2 className="display" data-reveal>{about.headline}</h2>
            {about.paras.map((p) => (
              <p className="lede" key={p} data-reveal>{p}</p>
            ))}
          </div>

          <aside className="about__stats" data-reveal>
            {about.stats.map((s) => (
              <div key={s.label}>
                <b>{s.n}</b>
                <span className="mono">{s.label}</span>
              </div>
            ))}
          </aside>
        </div>

        <blockquote className="quote" data-reveal>
          <svg className="quote__mark" viewBox="0 0 48 36" aria-hidden="true">
            <path d="M0 36V20C0 8 7 1 19 0v7c-6 1-9 5-9 11h9v18zm27 0V20C27 8 34 1 46 0v7c-6 1-9 5-9 11h9v18z" />
          </svg>
          <p>{about.quote.text}</p>
          <footer className="mono">{about.quote.by}</footer>
        </blockquote>

        <Team />

        <div className="about__values">
          {about.values.map((v, i) => (
            <article key={v.t} data-reveal>
              <span className="mono">0{i + 1}</span>
              <h3>{v.t}</h3>
              <p>{v.d}</p>
            </article>
          ))}
        </div>

        <h3 className="about__steps-title mono" data-reveal>{t.how}</h3>
        <ol className="about__steps">
          {about.steps.map((s, i) => (
            <li key={s.t} data-reveal>
              <span className="mono">0{i + 1}</span>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
