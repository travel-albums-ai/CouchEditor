import { useTranslation } from 'react-i18next';

export default function Logo() {
  const { t } = useTranslation()

  return <>
    <img
      src="./couchLogoMini.png"
      alt={t('logoAlt')}
      width={45}
      height={30}
      style={{ width: 45, height: 30, filter: 'hue-rotate(250deg)' }}
      fetchPriority="high"
    />
  </>
}
