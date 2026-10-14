import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { VILLAGE } from '../data/village'
import LanguageSwitcher from './LanguageSwitcher'
import logo from '../assets/logo.png'

const LINKS = [
  { to: '/', key: 'home' },
  { to: '/za-seloto', key: 'about' },
  { to: '/zabelezhitelnosti', key: 'attractions' },
  { to: '/galeriya', key: 'gallery' },
  { to: '/kontakti', key: 'contacts' },
]

const HIDE_DELAY = 2200
const REVEAL_ZONE = 90
const SCROLLED_THRESHOLD = 40

export default function Navbar() {
  const { t } = useTranslation()
  const village = t('common.villageName', { defaultValue: VILLAGE.name })
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [open, setOpen] = useState(false)
  const hideTimer = useRef(null)
  const headerRef = useRef(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    function scheduleHide() {
      clearTimeout(hideTimer.current)
      // Never hide while the menu is open or a nav control has keyboard focus.
      const active = document.activeElement
      const hasFocus =
        headerRef.current?.contains(active) && active.matches(':focus-visible')
      if (window.scrollY > SCROLLED_THRESHOLD && !open && !hasFocus) {
        hideTimer.current = setTimeout(() => setVisible(false), HIDE_DELAY)
      }
    }

    function reveal() {
      setVisible(true)
      setScrolled(window.scrollY > SCROLLED_THRESHOLD)
      scheduleHide()
    }

    function onScroll() {
      reveal()
    }

    function onMouseMove(e) {
      if (e.clientY < REVEAL_ZONE) reveal()
    }

    reveal()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouseMove)
    const header = headerRef.current
    header?.addEventListener('focusin', reveal)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      header?.removeEventListener('focusin', reveal)
      clearTimeout(hideTimer.current)
    }
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header
      ref={headerRef}
      className={[
        'navbar',
        scrolled ? 'navbar--scrolled' : '',
        visible ? '' : 'navbar--hidden',
      ].join(' ')}
    >
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt={t('navbar.brandAlt', { village })}
            className="navbar__logo"
          />
          <span>{village}</span>
        </NavLink>

        <button
          ref={toggleRef}
          className={`navbar__toggle ${open ? 'is-open' : ''}`}
          aria-label={t('navbar.menuLabel')}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__links ${open ? 'is-open' : ''}`}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'is-active' : ''}`
              }
              onClick={() => setOpen(false)}
            >
              {t(`nav.${link.key}`)}
            </NavLink>
          ))}
          <LanguageSwitcher className="navbar__lang" />
        </nav>
      </div>
    </header>
  )
}
