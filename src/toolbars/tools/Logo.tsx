import { useTranslation } from 'react-i18next';
import logoSrc from '../../assets/couch-editor-purple-128x128';

const size = 56

export default function Logo() {
  const { t } = useTranslation()

  return <>
    <img
      src={logoSrc}
      alt={t('logoAlt')}
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px`, margin: '-10px -4px'}}
      fetchPriority="high"
    />
  </>
}
