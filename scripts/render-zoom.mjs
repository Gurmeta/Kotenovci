// Renders a scroll-scrubbable zoom-in animation (Bulgaria -> Kotenovci) as a
// sequence of PNG frames, using headless MapLibre GL. Run:
//   node scripts/render-zoom.mjs
// then stitch the frames with ffmpeg (command in the README, "Regenerating the zoom video").
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const START = { center: [25.4858, 42.7339], zoom: 7 } // [lng, lat] — Bulgaria
const END = { center: [23.07184, 43.28719], zoom: 14 } // Kotenovci
const FPS = 30
const DURATION_SECONDS = 12
const FRAME_COUNT = FPS * DURATION_SECONDS
const OUT_DIR = path.resolve('scripts/frames')
const VIEWPORT = { width: 1920, height: 1080 }

mkdirSync(OUT_DIR, { recursive: true })

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

const html = `<!doctype html>
<html><head>
<meta charset="utf-8">
<script src="https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.js"></script>
<link href="https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.css" rel="stylesheet">
<style>html,body,#map{margin:0;padding:0;width:100%;height:100%}</style>
</head><body>
<div id="map"></div>
<script>
  window.map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: ${JSON.stringify(START.center)},
    zoom: ${START.zoom},
    interactive: false,
    attributionControl: false,
  })
  window.mapReady = new Promise((resolve) => window.map.on('load', resolve))
</script>
</body></html>`

const htmlPath = path.resolve('scripts/_render.html')
writeFileSync(htmlPath, html)

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out waiting for: ${label}`)), ms)
    ),
  ])
}

const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--use-gl=swiftshader', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: VIEWPORT })
page.on('console', (msg) => console.log('PAGE:', msg.type(), msg.text()))
page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message))
page.on('requestfailed', (req) =>
  console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText)
)

console.log('Loading page...')
await page.goto('file://' + htmlPath)
console.log('Waiting for map load event...')
await withTimeout(page.evaluate(() => window.mapReady), 30000, 'map load event')
console.log('Map loaded, starting frame capture.')

for (let i = 0; i < FRAME_COUNT; i++) {
  const t = easeInOutCubic(i / (FRAME_COUNT - 1))
  const center = [
    lerp(START.center[0], END.center[0], t),
    lerp(START.center[1], END.center[1], t),
  ]
  const zoom = lerp(START.zoom, END.zoom, t)

  await page.evaluate(
    ({ center, zoom }) => {
      window.map.jumpTo({ center, zoom })
    },
    { center, zoom }
  )
  try {
    await withTimeout(
      page.evaluate(() => new Promise((resolve) => window.map.once('idle', resolve))),
      5000,
      `idle on frame ${i}`
    )
  } catch (err) {
    console.log(err.message, '- capturing anyway')
  }

  const frameName = `frame_${String(i).padStart(4, '0')}.png`
  await page.screenshot({ path: path.join(OUT_DIR, frameName) })
  if (i % 30 === 0) console.log(`frame ${i}/${FRAME_COUNT}`)
}

await browser.close()
console.log('Done. Frames in scripts/frames/')
console.log(
  'Stitch with: ffmpeg -framerate 30 -i scripts/frames/frame_%04d.png -vf scale=1280:720 -c:v libx264 -preset slow -crf 23 -g 5 -pix_fmt yuv420p -movflags +faststart -an public/video/kotenovci-zoom.mp4'
)
