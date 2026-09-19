import { useTranslation } from 'react-i18next';

const size = 56

export default function Logo() {
  const { t } = useTranslation()

  return <>
    <img
      src="./couch-editor-purple-128x128.png"
      alt={t('logoAlt')}
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px`, margin: '-10px -4px'}}
      fetchPriority="high"
    />
  </>
}
