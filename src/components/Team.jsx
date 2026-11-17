import { useState } from 'react'
import { useLang } from '../i18n'

// Shows the photo if the file exists, otherwise a clean silhouette placeholder.
function Portrait({ src, name }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="member__photo">
      {!failed && <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />}
      {failed && (
        <svg viewBox="0 0 200 250" aria-hidden="true" className="member__ph">
          <rect width="200" height="250" fill="none" />
          <circle cx="100" cy="92" r="40" />
          <path d="M20 250c0-56 36-92 80-92s80 36 80 92z" />
        </svg>
      )}
      <i className="member__corner member__corner--tl" />
      <i className="member__corner member__corner--br" />
    </div>
  )
}

export default function Team() {
  const { c } = useLang()
  const { team } = c
  return (
    <div className="team">
      <p className="mono eyebrow" data-reveal>{team.eyebrow}</p>
      <h3 className="team__title display" data-reveal>{team.title}</h3>
      <div className="team__grid">
        {team.members.map((m) => (
          <article className="member" key={m.photo} data-reveal>
            <Portrait src={m.photo} name={m.name} />
            <div className="member__info">
              <span className="member__role mono">{m.role}</span>
              <h4 className="member__name">{m.name}</h4>
              <p className="member__bio">{m.bio}</p>
              <dl className="member__facts">
                {m.facts.map((f) => (
                  <div key={f.k}>
                    <dt className="mono">{f.k}</dt>
                    <dd>{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
