import { useEffect, useRef } from 'react'

const PLAYBACK_RATE = 0.6

export default function BackgroundVideo() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const applyRate = () => {
      video.playbackRate = PLAYBACK_RATE
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) video.pause()

    applyRate()
    video.addEventListener('play', applyRate)
    video.addEventListener('seeked', applyRate)
    return () => {
      video.removeEventListener('play', applyRate)
      video.removeEventListener('seeked', applyRate)
    }
  }, [])

  return (
    <div className="bg-video" aria-hidden="true">
      <video
        ref={videoRef}
        className="bg-video__el"
        src={`${import.meta.env.BASE_URL}video/kotenovci.mp4`}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="bg-video__grid" />
      <div className="bg-video__sun" />
      <div className="bg-video__scrim" />
    </div>
  )
}
