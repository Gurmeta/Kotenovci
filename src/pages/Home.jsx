import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ScrollZoomVideo from '../components/ScrollZoomVideo'
import Reveal from '../components/Reveal'
import { VILLAGE } from '../data/village'

export default function Home() {
  const { t } = useTranslation()
  const village = t('common.villageName', { defaultValue: VILLAGE.name })
  const highlights = t('home.highlights', {
    returnObjects: true,
    village,
    elevation: VILLAGE.elevation,
  })

  return (
    <>
      <ScrollZoomVideo />

      <section className="section section--first">
        <div className="container">
          <Reveal>
            <h2 className="section__title">
              {t('home.whyVisit.title', { village })}
            </h2>
            <p className="section__lead">
              {t('home.whyVisit.lead', {
                distanceBerkovitsa: VILLAGE.distanceToBerkovitsa,
                distanceSofia: VILLAGE.distanceToSofia,
              })}
            </p>
          </Reveal>

          <div className="grid grid--3">
            {highlights.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1} className="card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="facts">
              <div className="fact">
                <span className="fact__value">{VILLAGE.population}</span>
                <span className="fact__label">{t('home.facts.population')}</span>
              </div>
              <div className="fact">
                <span className="fact__value">
                  {t('home.facts.metersValue', { value: VILLAGE.elevation })}
                </span>
                <span className="fact__label">{t('home.facts.elevation')}</span>
              </div>
              <div className="fact">
                <span className="fact__value">
                  {t('home.facts.kmValue', {
                    value: VILLAGE.distanceToBerkovitsa,
                  })}
                </span>
                <span className="fact__label">
                  {t('home.facts.toBerkovitsa')}
                </span>
              </div>
              <div className="fact">
                <span className="fact__value">
                  {t('home.facts.kmValue', { value: VILLAGE.distanceToSofia })}
                </span>
                <span className="fact__label">{t('home.facts.toSofia')}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container container--narrow">
          <Reveal>
            <h2 className="section__title">{t('home.more.title')}</h2>
            <p className="section__lead">{t('home.more.lead')}</p>
            <div className="button-row">
              <Link to="/za-seloto" className="button">
                {t('nav.about')}
              </Link>
              <Link to="/zabelezhitelnosti" className="button button--ghost">
                {t('nav.attractions')}
              </Link>
              <Link to="/galeriya" className="button button--ghost">
                {t('nav.gallery')}
              </Link>
              <Link to="/kontakti" className="button button--ghost">
                {t('nav.contacts')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
