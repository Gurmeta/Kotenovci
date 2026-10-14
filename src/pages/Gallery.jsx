import { useTranslation } from 'react-i18next'
import Reveal from '../components/Reveal'
import { VILLAGE } from '../data/village'
import { GALLERY } from '../data/gallery'

export default function Gallery() {
  const { t } = useTranslation()
  const village = t('common.villageName', { defaultValue: VILLAGE.name })
  const photos = t('gallery.photos', { returnObjects: true })
  const hasPlaceholders = GALLERY.some((item) => !item.file)

  return (
    <section className="section page-section">
      <div className="container">
        <Reveal>
          <h1 className="page-title">{t('gallery.title')}</h1>
          <p className="section__lead">
            {t('gallery.lead', { village })}
            {hasPlaceholders && ` ${t('gallery.placeholderNote')}`}
          </p>
        </Reveal>

        <div className="gallery-grid">
          {photos.map((caption, i) => {
            const file = GALLERY[i]?.file
            return (
              <Reveal
                key={caption}
                delay={i * 0.06}
                className={`gallery-item gallery-item--${i + 1}`}
              >
                {file && (
                  <img
                    src={`${import.meta.env.BASE_URL}gallery/${file}`}
                    alt={caption}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <span>{caption}</span>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
