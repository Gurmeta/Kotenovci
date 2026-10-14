import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import bg from './locales/bg.json'
import en from './locales/en.json'
import he from './locales/he.json'
import it from './locales/it.json'
import flagBg from 'flag-icons/flags/4x3/bg.svg'
import flagGb from 'flag-icons/flags/4x3/gb.svg'
import flagIl from 'flag-icons/flags/4x3/il.svg'
import flagIt from 'flag-icons/flags/4x3/it.svg'

export const LANGUAGES = [
  { code: 'bg', label: 'Български', flag: flagBg, dir: 'ltr' },
  { code: 'en', label: 'English', flag: flagGb, dir: 'ltr' },
  { code: 'he', label: 'עברית', flag: flagIl, dir: 'rtl' },
  { code: 'it', label: 'Italiano', flag: flagIt, dir: 'ltr' },
]

const STORAGE_KEY = 'kotenovci_lang'

function isSupported(code) {
  return LANGUAGES.some((l) => l.code === code)
}

function readStoredLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function getInitialLanguage() {
  const stored = readStoredLanguage()
  if (stored && isSupported(stored)) return stored

  const preferred = (navigator.languages?.length ? navigator.languages : [navigator.language])
    .map((l) => l?.slice(0, 2).toLowerCase())
    .find(isSupported)
  return preferred || 'bg'
}

export function applyDocumentDirection(lang) {
  const meta = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]
  document.documentElement.lang = meta.code
  document.documentElement.dir = meta.dir
}

export function setLanguage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // storage unavailable (private mode, blocked) — language still switches for this session
  }
  i18n.changeLanguage(lang)
  applyDocumentDirection(lang)
}

const initialLanguage = getInitialLanguage()

i18n.use(initReactI18next).init({
  resources: {
    bg: { translation: bg },
    en: { translation: en },
    he: { translation: he },
    it: { translation: it },
  },
  lng: initialLanguage,
  fallbackLng: 'bg',
  interpolation: { escapeValue: false },
})

applyDocumentDirection(initialLanguage)

export default i18n
