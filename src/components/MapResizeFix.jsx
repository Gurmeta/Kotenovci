import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export default function MapResizeFix() {
  const map = useMap()

  useEffect(() => {
    const fix = () => map.invalidateSize()
    const timers = [
      setTimeout(fix, 0),
      setTimeout(fix, 200),
      setTimeout(fix, 600),
    ]
    window.addEventListener('resize', fix)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('resize', fix)
    }
  }, [map])

  return null
}
