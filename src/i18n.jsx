import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as en from './content'
import { mr } from './content.mr'

// Builds the full content object for a language. Marathi only overrides text;
// ids, machine/service mapping, photos and contact numbers come from the English file.
function build(lang) {
  if (lang === 'mr') {
    return {
      company: { ...en.company, ...mr.company },
      contact: { ...en.contact, ...mr.contact },
      machines: en.machines.map((m, i) => ({ ...m, ...mr.machines[i] })),
      services: en.services.map((s, i) => ({ ...s, ...mr.services[i] })),
      about: { ...en.about, ...mr.about },
      team: { ...en.team, ...mr.team, members: en.team.members.map((m, i) => ({ ...m, ...mr.team.members[i] })) },
      ui: mr.ui,
    }
  }
  return { company: en.company, contact: en.contact, machines: en.machines, services: en.services, about: en.about, team: en.team, ui: en.ui }
}

const Ctx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const s = localStorage.getItem('funde-lang')
      if (s === 'mr' || s === 'en') return s
    } catch {}
    return 'en'
  })

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('funde-lang', lang)
    } catch {}
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, c: build(lang) }), [lang])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
