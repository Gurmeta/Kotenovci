import { useTranslation } from 'react-i18next'
import Reveal from '../components/Reveal'
import { VILLAGE } from '../data/village'

export default function Attractions() {
  const { t } = useTranslation()
  const village = t('common.villageName', { defaultValue: VILLAGE.name })
  const items = t('attractions.items', { returnObjects: true })

  return (
    <section className="section page-section">
      <div className="container">
        <Reveal>
          <h1 className="page-title">{t('attractions.title')}</h1>
          <p className="section__lead">
            {t('attractions.lead', { village })}
          </p>
        </Reveal>

        <div className="grid grid--2">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} className="card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              {item.citation && (
                <a
                  className="card__source"
                  href={item.citationUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('attractions.sourceLabel')}: {item.citation}
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
