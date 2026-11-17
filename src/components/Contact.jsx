import { useLang } from '../i18n'

export default function Contact() {
  const { c } = useLang()
  const { company, contact } = c
  const t = c.ui.contact
  const tel = contact.phone.replace(/[^+\d]/g, '')
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <p className="mono eyebrow" data-reveal>{t.eyebrow}</p>
        <h2 className="display display--xl" data-reveal>
          {t.title} <span className="accent">{t.accent}</span>
        </h2>
        <p className="lede lede--dark" data-reveal>
          {t.lede}
        </p>

        <div className="contact__grid">
          <a className="contact__card" href={`tel:${tel}`} data-reveal>
            <span className="mono">{t.call}</span>
            <b>{contact.phone}</b>
          </a>
          <a className="contact__card" href={`mailto:${contact.email}`} data-reveal>
            <span className="mono">{t.email}</span>
            <b>{contact.email}</b>
          </a>
          <div className="contact__card" data-reveal>
            <span className="mono">{t.visit}</span>
            <b>{contact.address}</b>
          </div>
          <div className="contact__card" data-reveal>
            <span className="mono">{t.hours}</span>
            <b>{contact.hours}</b>
          </div>
        </div>

        <footer className="foot">
          <span>© {new Date().getFullYear()} {company.name}</span>
          <span className="mono">{company.tagline}</span>
        </footer>
      </div>
    </section>
  )
}
