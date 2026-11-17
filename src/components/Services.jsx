import { useLang } from '../i18n'

export default function Services() {
  const { c } = useLang()
  const { machines, services } = c
  const t = c.ui.services
  return (
    <section className="light services" id="services">
      <div className="wrap">
        <p className="mono eyebrow" data-reveal>{t.eyebrow}</p>
        <h2 className="display" data-reveal>
          {t.title} <span className="accent">{t.accent}</span>
        </h2>
        <p className="lede" data-reveal>
          {t.lede}
        </p>

        <div className="matrix" role="table" aria-label="Services and the machines that deliver them">
          <div className="matrix__row matrix__head" role="row">
            <div role="columnheader" className="mono">{t.col}</div>
            {machines.map((m, i) => (
              <div role="columnheader" className="matrix__col" key={m.id}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                {m.name}
              </div>
            ))}
          </div>

          {services.map((s) => (
            <div className="matrix__row" role="row" key={s.name} data-reveal>
              <div role="cell" className="matrix__service">
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </div>
              {machines.map((m) => {
                const v = s.map[m.id]
                return (
                  <div role="cell" key={m.id} className={`matrix__cell v${v}`}>
                    <span className="matrix__mname">{m.name}</span>
                    <i aria-label={v === 2 ? t.main : v === 1 ? t.support : '–'} />
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <p className="legend mono" data-reveal>
          <span><i className="lg lg--2" /> {t.main}</span>
          <span><i className="lg lg--1" /> {t.support}</span>
        </p>
      </div>
    </section>
  )
}
