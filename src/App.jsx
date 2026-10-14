import { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackgroundVideo from './components/BackgroundVideo'
import Home from './pages/Home'
import { VILLAGE } from './data/village'

const AboutVillage = lazy(() => import('./pages/AboutVillage'))
const Attractions = lazy(() => import('./pages/Attractions'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contacts = lazy(() => import('./pages/Contacts'))

function AnimatedRoutes() {
  const location = useLocation()
  const { t } = useTranslation()
  const village = t('common.villageName', { defaultValue: VILLAGE.name })

  useEffect(() => {
    const pageTitles = {
      '/': `${village} — ${t('home.titleSuffix')}`,
      '/za-seloto': `${t('nav.about')} — ${village}`,
      '/zabelezhitelnosti': `${t('nav.attractions')} — ${village}`,
      '/galeriya': `${t('nav.gallery')} — ${village}`,
      '/kontakti': `${t('nav.contacts')} — ${village}`,
    }
    const title = pageTitles[location.pathname] || pageTitles['/']
    document.title = title
    window.scrollTo(0, 0)

    const description = t('meta.description')
    const setMeta = (selector, value) =>
      document.head.querySelector(selector)?.setAttribute('content', value)
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
  }, [location.pathname, village, t])

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Home />
              </motion.div>
            }
          />
          <Route
            path="/za-seloto"
            element={<PageWrap><AboutVillage /></PageWrap>}
          />
          <Route
            path="/zabelezhitelnosti"
            element={<PageWrap><Attractions /></PageWrap>}
          />
          <Route path="/galeriya" element={<PageWrap><Gallery /></PageWrap>} />
          <Route path="/kontakti" element={<PageWrap><Contacts /></PageWrap>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

function PageWrap({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  return (
    <div className="app">
      <BackgroundVideo />
      <Navbar />
      <main className="app__main">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  )
}

export default App
