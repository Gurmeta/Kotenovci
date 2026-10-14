import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VILLAGE } from '../data/village'

export default function ScrollZoomVideo() {
  const { t } = useTranslation()
  const village = t('common.villageName', { defaultValue: VILLAGE.name })
  const municipality = t('common.municipality', {
    defaultValue: VILLAGE.municipality,
  })
  const province = t('common.province', { defaultValue: VILLAGE.province })
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let ticking = false
    let seeking = false
    let lastSeekTime = 0
    // Mobile video decoders choke on a seek every rAF frame — throttle harder
    // than desktop, where the GPU keeps up fine at a tighter interval.
    const isMobile = window.matchMedia('(max-width: 700px)').matches
    const SEEK_INTERVAL = isMobile ? 90 : 55

    const video = videoRef.current
    const onSeeking = () => {
      seeking = true
    }
    const onSeeked = () => {
      seeking = false
    }
    video?.addEventListener('seeking', onSeeking)
    video?.addEventListener('seeked', onSeeked)

    function update(timestamp) {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0
      setProgress(p)

      if (
        video &&
        video.duration &&
        !seeking &&
        timestamp - lastSeekTime >= SEEK_INTERVAL
      ) {
        lastSeekTime = timestamp
        video.currentTime = p * video.duration
      }
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update(0)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      video?.removeEventListener('seeking', onSeeking)
      video?.removeEventListener('seeked', onSeeked)
    }
  }, [])

  return (
    <div ref={containerRef} className="scroll-map">
      <div className="scroll-map__sticky">
        <video
          ref={videoRef}
          className="scroll-map__video"
          src={`${import.meta.env.BASE_URL}video/kotenovci-zoom.mp4`}
          poster={`${import.meta.env.BASE_URL}video/kotenovci-zoom-poster.jpg`}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          onLoadedData={() => setReady(true)}
        />
        {!ready && <span className="scroll-map__loading" aria-hidden="true" />}

        <div className="scroll-map__overlay">
          <div
            className="scroll-map__text"
            style={{ opacity: 1 - progress * 1.4 }}
          >
            <h1>{t('home.hero.welcome', { village })}</h1>
            <span className="scroll-map__divider" aria-hidden="true" />
            <p>{t('home.hero.subtitle', { municipality, province })}</p>
          </div>

          <div
            className="scroll-map__scroll"
            style={{ opacity: 1 - progress * 1.4 }}
          >
            <span>{t('home.hero.hint')}</span>
            <span className="scroll-map__scroll-line" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}
