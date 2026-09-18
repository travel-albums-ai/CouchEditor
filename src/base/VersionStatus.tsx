import NewChip from '@/components/NewChip';
import { useTranslation } from 'react-i18next';
import packageJson from '../../package.json';

export default function VersionStatus() {
  const { t } = useTranslation();

  const version = packageJson.version;

  return (
    <NewChip
      count={version}
      label={t('versionPrefix')}
      variant="text"
      fontSize={14}
      borderless
      disabled={true}
      tooltip={t('versionTooltip', { version })}
    />
  )
}
