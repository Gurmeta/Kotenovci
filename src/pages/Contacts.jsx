import { useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useTranslation } from 'react-i18next'
import Reveal from '../components/Reveal'
import MapResizeFix from '../components/MapResizeFix'
import { VILLAGE, SANCTUARY } from '../data/village'

const villageIcon = L.divIcon({
  className: 'village-marker',
  html: '<span></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const sanctuaryIcon = L.divIcon({
  className: 'sanctuary-marker',
  html: '<span></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

export default function Contacts() {
  const mapRef = useRef(null)
  const { t } = useTranslation()
  const village = t('common.villageName', { defaultValue: VILLAGE.name })
  const municipality = t('common.municipality', {
    defaultValue: VILLAGE.municipality,
  })
  const province = t('common.province', { defaultValue: VILLAGE.province })
  const sanctuaryName = t('common.sanctuaryName', {
    defaultValue: SANCTUARY.name,
  })

  return (
    <section className="section page-section">
      <div className="container">
        <Reveal>
          <h1 className="page-title">{t('contacts.title')}</h1>
          <p className="section__lead">{t('contacts.lead')}</p>
        </Reveal>

        <div className="contacts-grid">
          <Reveal className="prose">
            <h2>{t('contacts.infoTitle')}</h2>
            <p>
              {t('contacts.addressVillage', { village })}
              <br />
              {t('contacts.addressMunicipality', { municipality })}
              <br />
              {t('contacts.addressProvince', { province })}
              <br />
              {t('contacts.addressPostal', { postalCode: VILLAGE.postalCode })}
            </p>
            <p>{t('contacts.note', { municipality })}</p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="contacts-map"
            onAnimationComplete={() => mapRef.current?.invalidateSize()}
          >
            <MapContainer
              ref={mapRef}
              center={[VILLAGE.lat, VILLAGE.lng]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%', minHeight: 320 }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <MapResizeFix />
              <Marker position={[VILLAGE.lat, VILLAGE.lng]} icon={villageIcon}>
                <Popup>{village}</Popup>
              </Marker>
              <Marker
                position={[SANCTUARY.lat, SANCTUARY.lng]}
                icon={sanctuaryIcon}
              >
                <Popup>{sanctuaryName}</Popup>
              </Marker>
            </MapContainer>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="prose useful-links">
          <h2>{t('contacts.linksTitle')}</h2>
          <ul>
            <li>
              <a
                href="https://www.berkovitsa.bg/"
                target="_blank"
                rel="noreferrer"
              >
                {t('contacts.linkMunicipality')}
              </a>
            </li>
            <li>
              <a
                href={t('contacts.linkWikipediaUrl')}
                target="_blank"
                rel="noreferrer"
              >
                {t('contacts.linkWikipedia')}
              </a>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
