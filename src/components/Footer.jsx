import { useTranslation } from 'react-i18next'
import { VILLAGE } from '../data/village'
import LanguageSwitcher from './LanguageSwitcher'
import logo from '../assets/logo.png'

export default function Footer() {
  const { t } = useTranslation()
  const village = t('common.villageName', { defaultValue: VILLAGE.name })
  const municipality = t('common.municipality', {
    defaultValue: VILLAGE.municipality,
  })
  const province = t('common.province', { defaultValue: VILLAGE.province })

  return (
    <footer className="footer">
      <div className="footer__inner">
        <img
          src={logo}
          alt={t('navbar.brandAlt', { village })}
          className="footer__logo"
        />
        <p>
          {t('footer.copyright', {
            year: new Date().getFullYear(),
            village,
            municipality,
            province,
          })}
        </p>
        <p className="footer__muted">
          {t('footer.meta', {
            elevation: VILLAGE.elevation,
            postalCode: VILLAGE.postalCode,
          })}
        </p>
        <LanguageSwitcher className="footer__lang" />
      </div>
    </footer>
  )
}
