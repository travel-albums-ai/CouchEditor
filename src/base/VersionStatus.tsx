import SolidChip from '@/components/SolidChip';
import { useTranslation } from 'react-i18next';
import packageJson from '../../package.json';

export default function VersionStatus() {
  const { t } = useTranslation();

  const version = packageJson.version;

  return (
    <SolidChip
      count={version}
      label={t('versionPrefix')}
      variant="header"
      minWidth={80}
      fontSize={14}
      height={30}
      borderless
      tooltip={t('versionTooltip', { version })}
    />
  )
}
