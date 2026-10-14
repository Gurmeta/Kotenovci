import { useTranslation } from 'react-i18next'
import Reveal from '../components/Reveal'
import { VILLAGE } from '../data/village'

export default function AboutVillage() {
  const { t } = useTranslation()
  const village = t('common.villageName', { defaultValue: VILLAGE.name })
  const municipality = t('common.municipality', {
    defaultValue: VILLAGE.municipality,
  })
  const province = t('common.province', { defaultValue: VILLAGE.province })
  const interpolation = {
    village,
    municipality,
    province,
    distanceBerkovitsa: VILLAGE.distanceToBerkovitsa,
    distanceMontana: VILLAGE.distanceToMontana,
    distanceSofia: VILLAGE.distanceToSofia,
    elevation: VILLAGE.elevation,
  }
  const sections = t('about.sections', {
    returnObjects: true,
    ...interpolation,
  })

  return (
    <section className="section page-section">
      <div className="container container--narrow">
        <Reveal>
          <h1 className="page-title">{t('about.title')}</h1>
          <p className="section__lead">{t('about.lead', { village })}</p>
        </Reveal>

        {sections.map((section, i) => (
          <Reveal
            key={section.heading}
            delay={0.1 + i * 0.05}
            className="prose"
          >
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
