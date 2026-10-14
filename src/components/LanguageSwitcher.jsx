import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, setLanguage } from '../i18n'

export default function LanguageSwitcher({ className = '' }) {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0]

  useEffect(() => {
    function onClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  function choose(code) {
    setLanguage(code)
    setOpen(false)
  }

  return (
    <div className={`lang-switch ${className}`} ref={rootRef}>
      <button
        type="button"
        className="lang-switch__toggle"
        aria-label={t('languageSwitcher.label')}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <img src={current.flag} alt="" className="lang-switch__flag" />
      </button>

      {open && (
        <ul className="lang-switch__menu">
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                className={`lang-switch__option ${
                  lang.code === current.code ? 'is-active' : ''
                }`}
                aria-current={lang.code === current.code || undefined}
                onClick={() => choose(lang.code)}
              >
                <img src={lang.flag} alt="" className="lang-switch__flag" />
                <span>{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
